'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/utils/context/authContext';
import { getSkaterByUid } from '@/api/skaterData';
import Image from 'next/image';
import { Dropdown, Button } from 'react-bootstrap';
import { signOut } from '../utils/auth';

function ProfileDropdown() {
  const { user } = useAuth();
  const [profilePicture, setProfilePicture] = useState(null);
  const [skaterId, setSkaterId] = useState(null);

  useEffect(() => {
    if (!user?.uid) return;

    getSkaterByUid(user.uid)
      .then((skater) => {
        setProfilePicture(skater?.profile_picture || user.photoURL || '/images/default.png');
        setSkaterId(skater?.skater_id); // 👈 Store skater_id
      })
      .catch((err) => {
        console.error('Error fetching skater profile:', err);
        setProfilePicture(user.photoURL || '/images/default.png');
      });
  }, [user]);

  return (
    <Dropdown align="end">
      <Dropdown.Toggle as="div" id="dropdown-custom-components" style={{ cursor: 'pointer', color: '#1e90ff' }}>
        <Image src={profilePicture || '/images/default.png'} alt="User Profile" width={40} height={40} className="rounded-circle" />
      </Dropdown.Toggle>

      <Dropdown.Menu className="text-center">
        {skaterId && <Dropdown.Item href={`/skater/${skaterId}`}>View Profile</Dropdown.Item>}
        <Dropdown.Divider />
        <Dropdown.Item href="/account">Account Settings</Dropdown.Item>
        <Dropdown.Divider />
        <Button variant="danger" onClick={signOut} className="m-2">
          Sign Out
        </Button>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default ProfileDropdown;
