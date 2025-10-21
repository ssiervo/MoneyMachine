import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { getFirebaseAuth, ensureFirebaseApp } from '../utils/firebase';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  useEffect(() => {
    ensureFirebaseApp();
    const auth = getFirebaseAuth();
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setInitializing(false);
    });
    return unsub;
  }, []);
  return { user, initializing };
};

export const signIn = (email: string, password: string) => {
  const auth = getFirebaseAuth();
  return signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = () => {
  const auth = getFirebaseAuth();
  return signOut(auth);
};
