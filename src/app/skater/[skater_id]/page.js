'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Button, Image } from 'react-bootstrap';
import { auth } from '@/utils/client';
import { getSkaterById, getSkaterByUid, checkIfUserFollowsSkater, followSkater, unfollowSkater, getFollowersOfSkater, getSkatersFollowedByUser } from '@/api/skaterData';
import FollowersModal from '@/components/FollowersModal';
import FollowingModal from '@/components/FollowingModal';
import { logActivity, getActivitiesBySkaterId } from '@/api/activityData';
import { viewSkaterDetails } from '../../../api/mergedData';
import ActivityHelper from '../../../components/ActivityHelper';

function SkaterProfile() {
  // eslint-disable-next-line camelcase
  const { skater_id } = useParams();
  const [skater, setSkater] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentSkaterId, setCurrentSkaterId] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [showProfilePicModal, setShowProfilePicModal] = useState(false);
  const [activityFeed, setActivityFeed] = useState([]);

  const refreshFollowData = useCallback(() => {
    // eslint-disable-next-line camelcase
    if (!skater_id) return;

    getFollowersOfSkater(skater_id).then((follows) => {
      Promise.all(follows.map((follow) => viewSkaterDetails(null, follow, 'follower'))).then(setFollowers);
    });

    getSkatersFollowedByUser(skater_id).then((follows) => {
      Promise.all(follows.map((follow) => viewSkaterDetails(null, follow, 'followed'))).then(setFollowing);
    });
    // eslint-disable-next-line camelcase
  }, [skater_id]);

  useEffect(() => {
    document.title = 'GrindFind || Skater';
    const getCurrentUser = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const currentSkater = await getSkaterByUid(uid);
      if (currentSkater?.skater_id) {
        setCurrentSkaterId(currentSkater.skater_id);
      }
    };

    getCurrentUser();
  }, []);

  useEffect(() => {
    // eslint-disable-next-line camelcase
    if (skater_id && currentSkaterId !== null) {
      getSkaterById(skater_id).then((data) => {
        setSkater(data);
        checkIfUserFollowsSkater(currentSkaterId, skater_id).then(setIsFollowing);
        refreshFollowData();

        getActivitiesBySkaterId(skater_id)
          .then(setActivityFeed)
          .catch((err) => console.error('Failed to load activity feed', err));
      });
    }
    // eslint-disable-next-line camelcase
  }, [skater_id, currentSkaterId, refreshFollowData]);

  const handleFollowToggle = async () => {
    // eslint-disable-next-line camelcase
    if (currentSkaterId === skater_id) {
      alert("You can't follow yourself.");
      return;
    }

    const toggleFollow = isFollowing ? unfollowSkater : followSkater;

    try {
      const currentSkater = await getSkaterById(currentSkaterId);
      const followerName = currentSkater?.name || 'Unknown';
      const followedName = skater?.name || 'Unknown';

      await toggleFollow(currentSkaterId, skater_id, followerName, followedName);
      setIsFollowing((prev) => !prev);
      await refreshFollowData();
      if (!isFollowing) {
        const activity = {
          skater_id: currentSkaterId,
          type: 'follow',
          timestamp: new Date().toISOString(),
          metadata: {
            // eslint-disable-next-line camelcase
            followedId: skater_id,
            followedUsername: followedName,
          },
        };

        logActivity(activity)
          .then(() => console.log('Activity logged: follow'))
          .catch((err) => console.error('Failed to log follow activity', err));
      }
    } catch (err) {
      console.error('Follow toggle failed:', err);
    }
  };

  if (!skater) return <p>Loading skater profile...</p>;

  return (
    <>
      <div className="profile-container">
        <div className="profile-details">
          <div className="profile-pic-wrapper">
            <Image src={skater.profile_picture || '/images/default.png'} alt="Skater Avatar" width={150} height={150} roundedCircle style={{ objectFit: 'cover' }} onClick={() => setShowProfilePicModal(true)} />
          </div>
          <div>
            <h3>{skater.name}</h3>
            <p>
              <a href={`mailto:${skater?.email}`}>{skater?.email}</a>
            </p>
            <p className="text-muted fst-italic">{skater.bio || "This skater hasn't added a bio yet."}</p>
            <Button variant={isFollowing ? 'success' : 'primary'} onClick={handleFollowToggle}>
              {isFollowing ? 'Following' : 'Follow'}
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
          </div>
        </div>

        <div className="activity-feed">
          <h4 className="text-center">Recent Activity</h4>
          {activityFeed.length === 0 ? (
            <p className="text-muted fst-italic text-center">No recent activity yet.</p>
          ) : (
            <ul className="activity-list">
              {activityFeed.map((activity) => (
                <li key={activity.firebaseKey} className="activity-list-item">
                  <ActivityHelper activity={activity} skaterName={skater.name} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {showFollowersModal && <FollowersModal followers={followers} onClose={() => setShowFollowersModal(false)} />}
      {showFollowingModal && <FollowingModal following={following} onClose={() => setShowFollowingModal(false)} />}

      {showProfilePicModal && (
        <div
          className="picture-modal"
          role="button"
          tabIndex={0}
          onClick={() => setShowProfilePicModal(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === 'Escape') {
              setShowProfilePicModal(false);
            }
          }}
        >
          <button
            type="button"
            className="close-btn"
            tabIndex={0}
            onClick={() => setShowProfilePicModal(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === 'Escape') {
                setShowProfilePicModal(false);
              }
            }}
            aria-label="Close profile picture modal"
          >
            X
          </button>

          <div role="presentation" onClick={(e) => e.stopPropagation()}>
            <Image src={skater.profile_picture || '/images/default.png'} alt="Skater Profile Enlarged" width={500} height={500} className="profile-pic-large" style={{ objectFit: 'contain' }} />
          </div>
        </div>
      )}
    </>
  );
}

export default SkaterProfile;
