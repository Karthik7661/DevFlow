import { create } from 'zustand';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import api from '@/lib/axios';

interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  profilePicture: string | null;
  role: string;
  createdAt: string;
  lastLogin: string;
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  fetchProfile: () => Promise<void>;
  initializeAuth: () => () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  fetchProfile: async () => {
    try {
      const response = await api.get('/auth/me');
      set({ profile: response.data });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      set({ profile: null });
    }
  },
  initializeAuth: () => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      set({ user: firebaseUser });
      if (firebaseUser) {
        await get().fetchProfile();
      } else {
        set({ profile: null });
      }
      set({ loading: false });
    });
    return unsubscribe;
  },
}));
