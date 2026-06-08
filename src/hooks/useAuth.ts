import { useState } from 'react';
import { signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuthContext } from '../context/AuthContext';

export function useAuth() {
  const { user, loading } = useAuthContext();
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  async function signIn(email: string, password: string): Promise<boolean> {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential')) {
        setAuthError('Invalid email or password.');
      } else {
        setAuthError(msg);
      }
      return false;
    } finally {
      setAuthLoading(false);
    }
  }

  async function signOut(): Promise<void> {
    await firebaseSignOut(auth);
  }

  return { user, loading, authError, authLoading, signIn, signOut };
}
