import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { authService } from '../lib/auth';
import { Profile } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: { email: string; password: string; fullName: string; phone?: string; role?: 'client' | 'owner' }) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();

    authService.onAuthStateChange((user) => {
      setUser(user);
      if (user) {
        loadProfile();
      } else {
        setProfile(null);
      }
    });
  }, []);

  async function loadUser() {
    try {
      const user = await authService.getCurrentUser();
      setUser(user);
      if (user) {
        await loadProfile();
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadProfile() {
    try {
      const profile = await authService.getCurrentProfile();
      setProfile(profile);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  }

  async function signIn(email: string, password: string) {
    await authService.signIn({ email, password });
  }

  async function signUp(data: { email: string; password: string; fullName: string; phone?: string; role?: 'client' | 'owner' }) {
    await authService.signUp(data);
  }

  async function signOut() {
    await authService.signOut();
    setUser(null);
    setProfile(null);
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
