'use client';

// any component that uses useAuth needs this because if a component directly imports useAuth, it needs to be a client component since useAuth uses React hooks.

import React from 'react';
import SearchBar from '../components/SearchBar';

function Home() {
  return (
    <div className="home-search">
      <SearchBar />
    </div>
  );
}

export default Home;
