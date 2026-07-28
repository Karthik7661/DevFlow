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
  
  fetchMessages: (silent?: boolean) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  addMessage: (message: Message) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  loading: false,

  fetchMessages: async (silent = false) => {
    const activeWorkspaceId = useWorkspaceStore.getState().activeWorkspaceId;
    if (!activeWorkspaceId) return;

    if (!silent) set({ loading: true });
    try {
      const res = await api.get(`/workspaces/${activeWorkspaceId}/messages`);
      set({ messages: res.data });
    } catch (error) {
      console.error('Failed to fetch messages', error);
    } finally {
      if (!silent) set({ loading: false });
    }
  },

  sendMessage: async (content: string) => {
    const activeWorkspaceId = useWorkspaceStore.getState().activeWorkspaceId;
    if (!activeWorkspaceId) return;

    try {
      const res = await api.post(`/workspaces/${activeWorkspaceId}/messages`, { content });
      // We don't optimistically add here because the socket will broadcast it back to us, 
      // but if we do, we need to prevent duplicates.
      // We'll let the socket handle adding our own message to keep it simple, OR we add it and deduplicate.
      // Let's add it optimistically and deduplicate in addMessage.
      get().addMessage(res.data);
    } catch (error) {
      console.error('Failed to send message', error);
      throw error;
    }
  },

  addMessage: (message: Message) => {
    set((state) => {
      // Deduplicate
      if (state.messages.some(m => m.id === message.id)) {
        return state;
      }
      return { messages: [...state.messages, message] };
    });
  }
}));
