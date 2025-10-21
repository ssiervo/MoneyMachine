import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';
import { initFirebase } from '../lib/firestore';

initFirebase();

export interface AuthedRequest extends Request {
  user?: admin.auth.DecodedIdToken;
}

export const verifyFirebaseToken = async (
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Missing authorization header' });
  }

  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token', details: error });
  }
};
