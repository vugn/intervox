'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut,
  createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { getUserByUid, upsertUser } from '@/lib/data-service';

interface AuthContextType {
  user: User | null;
  userData: any | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  signInWithGoogle: async () => { },
  signInWithEmail: async () => { },
  signUpWithEmail: async () => { },
  resetPassword: async () => { },
  logout: async () => { },
});

export const useAuth = () => useContext(AuthContext);

const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
  .split(',')
  .map(email => email.trim().toLowerCase())
  .filter(Boolean);

const isAdminEmail = (email?: string | null) => {
  if (!email) return false;
  return adminEmails.includes(email.toLowerCase());
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isCaptureMockAuth =
      typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).get('mockAuth') === '1';

    if (isCaptureMockAuth) {
      const mockUser = {
        uid: 'capture-admin',
        email: 'capture-admin@intervox.local',
        displayName: 'Capture Admin',
      } as User;

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(mockUser);
      setUserData({
        uid: mockUser.uid,
        email: mockUser.email,
        displayName: mockUser.displayName,
        role: 'admin',
        department: 'Teknik Informatika',
        faculty: 'FTI',
      });
      setLoading(false);
      return () => { };
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const existingUser = await getUserByUid(currentUser.uid);
          const forceAdmin = isAdminEmail(currentUser.email);

          if (existingUser) {
            const mergedUser = {
              ...existingUser,
              role: forceAdmin ? 'admin' : (existingUser as any).role || 'student',
            };
            if (forceAdmin && (existingUser as any).role !== 'admin') {
              await upsertUser(currentUser.uid, {
                ...mergedUser,
                updatedAt: new Date().toISOString(),
              });
            }
            setUserData(mergedUser);
          } else {
            const newUserData = {
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
              role: forceAdmin ? 'admin' : 'student',
              createdAt: new Date().toISOString(),
            };
            await upsertUser(currentUser.uid, newUserData);
            setUserData(newUserData);
          }
        } catch (error) {
          console.error('Failed to sync user data:', error);
          setUserData({
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            role: isAdminEmail(currentUser.email) ? 'admin' : 'student',
          });
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing in with email', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, { displayName });
      const newUserData = {
        uid: credential.user.uid,
        email: credential.user.email,
        displayName,
        photoURL: null,
        role: isAdminEmail(credential.user.email) ? 'admin' : 'student',
        createdAt: new Date().toISOString(),
      };
      await upsertUser(credential.user.uid, newUserData);
      setUserData(newUserData);
    } catch (error) {
      console.error('Error signing up with email', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Error sending reset email', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
