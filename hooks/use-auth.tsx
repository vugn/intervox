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
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<{ confirmEmail: boolean }>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  signInWithGoogle: async () => { },
  signInWithEmail: async () => { },
  signUpWithEmail: async () => ({ confirmEmail: false }),
  resetPassword: async () => { },
  logout: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check URL search params for mockAuth or mockRole
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const mockRoleParam = params.get('mockRole');
      const isMockAuth = params.get('mockAuth') === '1' || Boolean(mockRoleParam);
      if (isMockAuth) {
        const role = mockRoleParam || 'administrator';
        const nameMap: Record<string, string> = {
          student: 'Budi Santoso (Mock Student)',
          lecturer: 'Dr. Ahmad Sutanto, M.Kom.',
          administrator: 'Administrator Intervox',
          dean: 'Prof. Dr. H. Hendra Kurniawan',
        };
        const mockUser = {
          id: 'mock-user-id-' + role,
          email: `${role}@intervox.id`,
          user_metadata: { full_name: nameMap[role] || 'Mock User' },
        } as any;
        setUser(mockUser);
        setUserData({
          uid: mockUser.id,
          email: mockUser.email,
          fullName: nameMap[role] || 'Mock User',
          role: role,
          accountStatus: 'approved',
        });
        setLoading(false);
        return;
      }
    }

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
        // Do not process auth state changes if mock auth is active
        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          const isMockAuth = params.get('mockAuth') === '1' || Boolean(params.get('mockRole'));
          if (isMockAuth) return;
        }

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
      // First verify the auth session is still valid
      const { data: { user: verifiedUser }, error: authError } = await supabase.auth.getUser();
      if (authError || !verifiedUser) {
        console.warn('Stale session detected, signing out...');
        await supabase.auth.signOut();
        setUser(null);
        setUserData(null);
        return;
      }

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
        try {
          await upsertUser(supaUser.id, newUserData);
        } catch (e) {
          console.warn('upsertUser failed, will use fallback data:', e);
        }
        // Always set user data so the app doesn't get stuck
        setUserData({
          ...newUserData,
          fullName: newUserData.displayName,
        });
      }
    } catch (error) {
      console.error('Failed to sync user data:', error);
      // Use fallback data instead of signing out
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

  const signUpWithEmail = async (email: string, password: string, displayName: string): Promise<{ confirmEmail: boolean }> => {
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

    // If email confirmation is required, session will be null
    if (data.user && !data.session) {
      return { confirmEmail: true };
    }

    // Create user record immediately (user is already authenticated)
    if (data.user && data.session) {
      try {
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
          accountStatus: 'pending', // Optimistically set status
        });

        // Trigger Resend email notifications
        const { notifyNewRegistration } = await import('@/app/actions/email');
        await notifyNewRegistration(displayName, email).catch(console.error);
      } catch (e) {
        // syncUserData will retry when onAuthStateChange fires
        console.warn('User record creation deferred to syncUserData:', e);
      }
    }

    return { confirmEmail: false };
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth?tab=reset`,
    });
    if (error) throw error;
  };

  const logout = async () => {
    // 1. Immediately update UI state so it responds instantly
    setUser(null);
    setUserData(null);
    setLoading(false);

    // 2. Clear supabase auth session with a timeout so it never hangs
    try {
      await Promise.race([
        supabase.auth.signOut(),
        new Promise((resolve) => setTimeout(resolve, 1500)),
      ]);
    } catch (e) {
      console.error('Error signing out', e);
    }

    // 3. Explicitly remove supabase tokens from localStorage
    if (typeof window !== 'undefined') {
      try {
        for (const key of Object.keys(localStorage)) {
          if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
            localStorage.removeItem(key);
          }
        }
      } catch (e) {
        console.error('Failed to clear local storage', e);
      }
      window.location.replace('/');
    }
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
