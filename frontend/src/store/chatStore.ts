import { create } from 'zustand';
import api from '@/lib/axios';
import { useWorkspaceStore } from './workspaceStore';

export interface Message {
  id: string;
  content: string;
  workspaceId: string;
  senderId: string;
  createdAt: string;
  sender: {
    id: string;
    fullName: string;
    email: string;
    profilePicture: string | null;
  };
}

interface ChatState {
  messages: Message[];
  loading: boolean;
  
  fetchMessages: () => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  loading: false,

  fetchMessages: async () => {
    const activeWorkspaceId = useWorkspaceStore.getState().activeWorkspaceId;
    if (!activeWorkspaceId) return;

    set({ loading: true });
    try {
      const res = await api.get(`/workspaces/${activeWorkspaceId}/messages`);
      set({ messages: res.data });
    } catch (error) {
      console.error('Failed to fetch messages', error);
    } finally {
      set({ loading: false });
    }
  },

  sendMessage: async (content: string) => {
    const activeWorkspaceId = useWorkspaceStore.getState().activeWorkspaceId;
    if (!activeWorkspaceId) return;

    try {
      const res = await api.post(`/workspaces/${activeWorkspaceId}/messages`, { content });
      // Optimistically add message or refetch
      set((state) => ({
        messages: [...state.messages, res.data]
      }));
    } catch (error) {
      console.error('Failed to send message', error);
      throw error;
    }
  }
}));
