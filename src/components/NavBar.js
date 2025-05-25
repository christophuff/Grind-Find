import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProfileDropdown from './ProfileDropdown';

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false); // Close the menu
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      toggleMenu(); // Toggle the menu when the Enter or Space key is pressed
    }
  };

  return (
    <nav className="nav-container">
      <div className="navbar-links">
        <h1 className="logo">
          <Link passHref href="/" className="navbar-brand">
            <Image src="/images/grind-find.png" height="60" width="50" />
            <span className="logo-brand">GRINDFIND</span>
          </Link>
        </h1>
        <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <Link className="nav-link" href="nearby-parks" onClick={closeMenu}>
              Nearby Parks
            </Link>
          </li>
          <li>
            <Link className="nav-link" href="/my-uploads" onClick={closeMenu}>
              My Uploads
            </Link>
          </li>
          {/* ProfileDropdown aligned to the right */}
          <li className="profile-icon">
            <ProfileDropdown />
          </li>
        </ul>
      </div>

      {/* Hamburger Icon with role and keyboard support */}
      <div className="hamburger" onClick={toggleMenu} onKeyDown={handleKeyDown} role="button" tabIndex={0} aria-label="Toggle navigation menu">
        <div className={`line ${isMenuOpen ? 'open' : ''}`} />
        <div className={`line ${isMenuOpen ? 'open' : ''}`} />
        <div className={`line ${isMenuOpen ? 'open' : ''}`} />
      </div>
    </nav>
  );
}
