import React from 'react';
import Image from 'next/image';
import { signIn } from '../utils/auth';

function Signin() {
  return (
    <div
      className="text-center d-flex flex-column justify-content-center align-content-center"
      style={{
        height: '90vh',
        padding: '30px',
        maxWidth: '400px',
        margin: '0 auto',
      }}
    >
      <Image
        src="/images/grind-find.png"
        className="m-auto"
        width={200}
        height={240}
        style={{
          margin: '-100px',
        }}
        alt="GrindFind Logo"
      />
      <h1
        style={{
          color: '#00ff00',
        }}
      >
        Welcome to GrindFind!
      </h1>
      <p
        style={{
          color: '#1e90ff',
        }}
      >
        Sign in to get started!
      </p>
      <button
        type="button"
        className="pink-btn"
        onClick={signIn}
        style={{
          width: '250px',
          padding: '10px 20px',
          margin: '0 auto',
        }}
      >
        Sign In
      </button>
    </div>
  );
}

export default Signin;
