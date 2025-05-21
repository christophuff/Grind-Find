'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { firebase } from '@/utils/client';
import { createSkaterIfNotExists, updateSkater } from '@/api/skaterData'; // Import functions

const AuthContext = createContext();
AuthContext.displayName = 'AuthContext';

function AuthProvider(props) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (fbUser) => {
      if (fbUser) {
        const skater = {
          uid: fbUser.uid, // Firebase UID remains unchanged
          name: fbUser.displayName,
          email: fbUser.email,
          profile_picture: fbUser.photoURL,
          username: '',
          location: '',
          followers: [],
        };

        console.log('🚀 Sending skater:', skater);

        // Step 1: Ensure the skater is created (if not exists)
        await createSkaterIfNotExists(skater).then((data) => {
          // Now we are sure the skater is created, and `data` contains the correct Firebase key
          const {firebaseKey} = data; // Get Firebase document key (auto-generated)

          const skaterKey = { ...skater, skater_id: firebaseKey }; // Set skater_id to Firebase key

          // Step 2: Update the skater document with the `skater_id` field
          updateSkater(firebaseKey, skaterKey);
        });

        // Step 3: Set the `user` context only after skater creation is complete
        setUser({ ...fbUser, skater_id: fbUser.uid }); // Store `skater_id` in context
      } else {
        setUser(false);
      }
    });

    return () => unsubscribe(); // Cleanup on component unmount
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
