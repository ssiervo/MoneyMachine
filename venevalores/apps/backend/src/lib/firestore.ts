import admin from 'firebase-admin';
import { logger } from './logger';

let app: admin.app.App | null = null;

export const initFirebase = () => {
  if (app) {
    return app;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (!projectId) {
    throw new Error('FIREBASE_PROJECT_ID is required');
  }

  app = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId,
  });

  logger.info('Firebase initialized');
  return app;
};

export const getFirestore = () => {
  if (!app) {
    initFirebase();
  }
  return admin.firestore();
};
