'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getUserByUid, upsertUser } from '@/lib/data-service';
import type { User, Session } from '@supabase/supabase-js';

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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await syncUserData(session.user);
      }
      setLoading(false);
    };

    initAuth();

    // Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          await syncUserData(currentUser);
        } else {
          setUserData(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const syncUserData = async (supaUser: User) => {
    try {
      const existingUser = await getUserByUid(supaUser.id);

      if (existingUser) {
        setUserData(existingUser);
      } else {
        // New user — create record
        const newUserData = {
          uid: supaUser.id,
          email: supaUser.email,
          displayName:
            supaUser.user_metadata?.full_name ??
            supaUser.user_metadata?.name ??
            supaUser.email?.split('@')[0] ??
            '',
          photoURL: supaUser.user_metadata?.avatar_url ?? null,
          role: 'student',
          createdAt: new Date().toISOString(),
        };
        await upsertUser(supaUser.id, newUserData);
        setUserData({
          ...newUserData,
          fullName: newUserData.displayName,
        });
      }
    } catch (error) {
      console.error('Failed to sync user data:', error);
      setUserData({
        uid: supaUser.id,
        email: supaUser.email,
        displayName:
          supaUser.user_metadata?.full_name ??
          supaUser.email?.split('@')[0] ??
          '',
        role: 'student',
      });
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) throw error;
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: displayName,
        },
      },
    });
    if (error) throw error;

    // Create user record immediately if signup doesn't require email confirmation
    if (data.user) {
      const newUserData = {
        uid: data.user.id,
        email: data.user.email,
        displayName,
        photoURL: null,
        role: 'student',
        createdAt: new Date().toISOString(),
      };
      await upsertUser(data.user.id, newUserData);
      setUserData({
        ...newUserData,
        fullName: displayName,
      });
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth?tab=reset`,
    });
    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error signing out', error);
    setUserData(null);
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
