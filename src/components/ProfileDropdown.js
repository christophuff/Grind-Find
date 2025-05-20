import { useAuth } from '@/utils/context/authContext';
import Image from 'next/image';
import { Dropdown, Button } from 'react-bootstrap';
import { signOut } from '../utils/auth';
// import DeleteAccount from './DeleteAccount';

function ProfileDropdown() {
  const { user } = useAuth();

  return (
    <Dropdown align="end">
      <Dropdown.Toggle as="div" id="dropdown-custom-components" style={{ cursor: 'pointer', color: '#1e90ff' }}>
        <Image src={user.photoURL} alt="User Profile" width={40} height={40} className="rounded-circle" />
      </Dropdown.Toggle>

      <Dropdown.Menu className="text-center">
        <Dropdown.Item href="/profile">View Profile</Dropdown.Item>
        <Dropdown.Divider />
        <Button variant="danger" onClick={signOut} className="m-2">
          Sign Out
        </Button>
        {/* <Dropdown.Divider />
        <DeleteAccount /> */}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default ProfileDropdown;
