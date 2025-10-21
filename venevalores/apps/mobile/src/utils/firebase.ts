import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
};

export const ensureFirebaseApp = () => {
  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }
};

export const getFirebaseAuth = () => {
  ensureFirebaseApp();
  return getAuth();
};
