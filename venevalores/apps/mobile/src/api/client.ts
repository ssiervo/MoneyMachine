import axios from 'axios';
import { getFirebaseAuth, ensureFirebaseApp } from '../utils/firebase';

const instance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BACKEND_BASE_URL || 'http://localhost:4000',
});

instance.interceptors.request.use(async (config) => {
  ensureFirebaseApp();
  const auth = getFirebaseAuth();
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
