// Context API Docs: https://beta.reactjs.org/learn/passing-data-deeply-with-context

'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { firebase } from '@/utils/client';
import { createSkaterIfNotExists } from '@/api/skaterData';

const AuthContext = createContext();
AuthContext.displayName = 'AuthContext';

function AuthProvider(props) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (fbUser) => {
      if (fbUser) {
        const nameParts = fbUser.displayName?.split(' ') || [];
        const firstName = nameParts[0] || fbUser.email?.split('@')[0] || 'User';
        const lastName = nameParts[1] || ''; // fallback if no last name

        const skater = {
          uid: fbUser.uid,
          firstName,
          lastName,
          email: fbUser.email,
          imageUrl: fbUser.photoURL,
        };

        console.log('🚀 Sending skater:', skater);
        await createSkaterIfNotExists(skater); // ✅ Await to avoid race conditions

        setUser(fbUser);
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
