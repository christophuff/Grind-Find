'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/utils/client';
import { createSkaterIfNotExists, updateSkater } from '@/api/skaterData';

const AuthContext = createContext();
AuthContext.displayName = 'AuthContext';

function AuthProvider(props) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const skater = {
          uid: fbUser.uid,
          name: fbUser.displayName,
          email: fbUser.email,
          profile_picture: fbUser.photoURL,
          username: '',
          location: '',
          followers: [],
        };

        await createSkaterIfNotExists(skater).then((existingData) => {
          let firebaseKey;

          if (existingData) {
            firebaseKey = existingData.firebaseKey || existingData.key;
          }

          if (!firebaseKey) {
            console.error('Error: No firebaseKey found');
            return;
          }

          const skaterKey = { ...skater, skater_id: firebaseKey };
          updateSkater(firebaseKey, skaterKey);
        });

        setUser({ ...fbUser, skater_id: fbUser.uid });
      } else {
        setUser(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const value = useMemo(
    () => ({
      user,
      userLoading: user === null,
    }),
    [user],
  );

  return <AuthContext.Provider value={value} {...props} />;
}

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
