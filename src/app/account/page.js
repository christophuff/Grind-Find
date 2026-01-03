'use client';

import firebase from 'firebase';
import 'firebase/auth';
import React, { useState, useEffect } from 'react';
import { Image, Button } from 'react-bootstrap';
import EditProfileForm from '@/components/forms/EditProfileForm';
import { getSkaterByUid, getSkaters, updateSkater, getFollowersOfSkater, getSkatersFollowedByUser } from '@/api/skaterData';
import { viewSkaterDetails } from '../../api/mergedData';
import FollowersModal from '../../components/FollowersModal';
import FollowingModal from '../../components/FollowingModal';

export const dynamic = 'force-dynamic';

function Profile() {
  const user = firebase.auth().currentUser;
  const [skater, setSkater] = useState(null);
  const [bio, setBio] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  useEffect(() => {
    document.title = 'GrindFind || Account';
    if (!user) return;

    getSkaterByUid(user.uid)
      .then((skaterData) => {
        if (skaterData) {
          setSkater(skaterData);
          setBio(skaterData.bio || '');
          setName(skaterData.name || '');
          setEmail(skaterData.email || '');

          // ✅ Move these inside the block
          getFollowersOfSkater(skaterData.skater_id).then((follows) => {
            Promise.all(follows.map((follow) => viewSkaterDetails(null, follow, 'follower'))).then(setFollowers);
          });

          getSkatersFollowedByUser(skaterData.skater_id).then((follows) => {
            Promise.all(follows.map((follow) => viewSkaterDetails(null, follow, 'followed'))).then(setFollowing);
          });
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading skater profile:', err);
        setLoading(false);
      });
  }, [user]);

  const handleSaveProfile = async ({ bio: newBio, name: newName, email: newEmail }) => {
    try {
      const allSkaters = await getSkaters();
      const nameExists = allSkaters.some((s) => s.name?.toLowerCase() === newName.toLowerCase() && s.skater_id !== skater.skater_id);

      if (nameExists) {
        alert('That name is already taken.');
        return;
      }

      await updateSkater(skater.skater_id, { name: newName, bio: newBio, email: newEmail });
      setBio(newBio);
      setName(newName);
      setEmail(newEmail);
      setSkater((prev) => ({ ...prev, name: newName, bio: newBio, email: newEmail }));
      setEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Could not update profile');
    }
  };

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !skater?.skater_id) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Please upload an image smaller than 2MB');
      return;
    }

    const storageRef = firebase.storage().ref();
    const filePath = `profilePictures/${skater.skater_id}-${Date.now()}-${file.name}`;
    const fileRef = storageRef.child(filePath);

    try {
      if (skater.profile_picture?.includes('firebase')) {
        const oldRef = firebase.storage().refFromURL(skater.profile_picture);
        await oldRef.delete().catch((err) => console.warn('Old profile picture not deleted:', err.message));
      }

      await fileRef.put(file);
      const downloadURL = await fileRef.getDownloadURL();

      await updateSkater(skater.skater_id, { profile_picture: downloadURL });
      setSkater((prev) => ({ ...prev, profile_picture: downloadURL }));
      alert('Profile picture updated!');
    } catch (err) {
      console.error('Error updating profile picture:', err);
      alert('Upload failed');
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="profile-container">
      <div className="account-details">
        <div className="profile-pic-wrapper">
          <Image src={skater?.profile_picture || '/images/default.png'} alt="User" width={150} height={150} roundedCircle className="profile-pic" />
          <div className="overlay">
            <span>Edit Profile Picture</span>
            <input type="file" accept="image/*" className="file-input" onChange={handleProfilePicUpload} />
          </div>
        </div>

        <div>
          <h3>{skater?.name || user.displayName}</h3>
          <p>
            <a href={`mailto:${skater?.email || user.email}`}>{skater?.email || user.email}</a>
          </p>

          {editing ? (
            <EditProfileForm currentBio={bio} currentName={name} currentEmail={email} onSave={handleSaveProfile} onCancel={() => setEditing(false)} className="edit-account-details" />
          ) : (
            <>
              {bio ? <p>{bio}</p> : <p className="text-muted fst-italic">No bio added yet.</p>}
              <Button size="sm" className="pink-btn" onClick={() => setEditing(true)}>
                {bio || name ? 'Edit Profile' : 'Add Bio & Name'}
              </Button>
              <div className="follow-section mt-3" style={{ cursor: 'pointer' }}>
                <p>
                  <span
                    className="scale"
                    role="button"
                    tabIndex={0}
                    onClick={() => setShowFollowersModal(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setShowFollowersModal(true);
                      }
                    }}
                  >
                    {followers.length} Followers
                  </span>{' '}
                  |{' '}
                  <span
                    className="scale"
                    role="button"
                    tabIndex={0}
                    onClick={() => setShowFollowingModal(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setShowFollowingModal(true);
                      }
                    }}
                  >
                    {following.length} Following
                  </span>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      {/* Followers Modal */}
      {showFollowersModal && <FollowersModal followers={followers} onClose={() => setShowFollowersModal(false)} />}

      {/* Following Modal */}
      {showFollowingModal && <FollowingModal following={following} onClose={() => setShowFollowingModal(false)} />}
    </div>
  );
}

export default Profile;
