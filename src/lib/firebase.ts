import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const {
  VITE_FIREBASE_API_KEY,
  VITE_FIREBASE_AUTH_DOMAIN,
  VITE_FIREBASE_PROJECT_ID,
  VITE_FIREBASE_STORAGE_BUCKET,
  VITE_FIREBASE_MESSAGING_SENDER_ID,
  VITE_FIREBASE_APP_ID,
} = import.meta.env;

const isConfigured =
  VITE_FIREBASE_API_KEY &&
  !VITE_FIREBASE_API_KEY.startsWith('placeholder') &&
  VITE_FIREBASE_PROJECT_ID &&
  !VITE_FIREBASE_PROJECT_ID.startsWith('placeholder');

if (!isConfigured && import.meta.env.DEV) {
  console.warn(
    '[CuratorCS] Firebase is not configured. Copy .env.example to .env and fill in your Firebase project credentials. See README.md for instructions.',
  );
}

const firebaseConfig = {
  apiKey: VITE_FIREBASE_API_KEY ?? '',
  authDomain: VITE_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: VITE_FIREBASE_PROJECT_ID ?? '',
  storageBucket: VITE_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: VITE_FIREBASE_APP_ID ?? '',
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export { isConfigured };
export default app;
