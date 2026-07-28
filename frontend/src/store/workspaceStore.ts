import { create } from 'zustand';
import api from '@/lib/axios';

export interface Workspace {
  id: string;
  name: string;
  description: string | null;
  logo: string | null;
  ownerId: string;
  _count?: {
    members: number;
    projects: number;
  };
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: 'ADMIN' | 'MANAGER' | 'DEVELOPER';
  user: {
    id: string;
    fullName: string;
    email: string;
    profilePicture: string | null;
  };
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  startDate: string | null;
  endDate: string | null;
  workspaceId: string;
}

export interface WorkspaceDetails extends Workspace {
  members: WorkspaceMember[];
  projects: Project[];
}

interface WorkspaceState {
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  activeWorkspaceDetails: WorkspaceDetails | null;
  loading: boolean;
  
  fetchWorkspaces: () => Promise<void>;
  setActiveWorkspace: (id: string) => Promise<void>;
  createWorkspace: (data: { name: string; description?: string }) => Promise<void>;
  createProject: (data: any) => Promise<void>;
  inviteMember: (email: string, role?: string) => Promise<void>;
  updateMemberRole: (memberId: string, role: string) => Promise<void>;
  removeMember: (memberId: string) => Promise<void>;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  workspaces: [],
  activeWorkspaceId: null,
  activeWorkspaceDetails: null,
  loading: false,

  fetchWorkspaces: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/workspaces');
      set({ workspaces: res.data });
      // If we have workspaces but no active one selected, pick the first
      if (res.data.length > 0 && !get().activeWorkspaceId) {
        await get().setActiveWorkspace(res.data[0].id);
      } else if (get().activeWorkspaceId) {
        // Refresh active workspace details
        await get().setActiveWorkspace(get().activeWorkspaceId as string);
      }
    } catch (error) {
      console.error('Failed to fetch workspaces', error);
    } finally {
      set({ loading: false });
    }
  },

  setActiveWorkspace: async (id: string) => {
    set({ activeWorkspaceId: id, loading: true });
    try {
      const res = await api.get(`/workspaces/${id}`);
      set({ activeWorkspaceDetails: res.data });
    } catch (error) {
      console.error('Failed to fetch workspace details', error);
    } finally {
      set({ loading: false });
    }
  },

  createWorkspace: async (data) => {
    set({ loading: true });
    try {
      const res = await api.post('/workspaces', data);
      await get().fetchWorkspaces(); // Refresh list
      await get().setActiveWorkspace(res.data.id); // Set as active
    } catch (error) {
      console.error('Failed to create workspace', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  createProject: async (data) => {
    const activeWorkspaceId = get().activeWorkspaceId;
    if (!activeWorkspaceId) return;
    
    set({ loading: true });
    try {
      await api.post(`/workspaces/${activeWorkspaceId}/projects`, data);
      await get().setActiveWorkspace(activeWorkspaceId); // Refresh details
    } catch (error) {
      console.error('Failed to create project', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  inviteMember: async (email, role) => {
    const activeWorkspaceId = get().activeWorkspaceId;
    if (!activeWorkspaceId) return;
    
    set({ loading: true });
    try {
      await api.post(`/workspaces/${activeWorkspaceId}/members`, { email, role });
      await get().setActiveWorkspace(activeWorkspaceId); // Refresh details
    } catch (error) {
      console.error('Failed to invite member', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateMemberRole: async (memberId, role) => {
    const activeWorkspaceId = get().activeWorkspaceId;
    if (!activeWorkspaceId) return;
    
    set({ loading: true });
    try {
      await api.put(`/workspaces/${activeWorkspaceId}/members/${memberId}`, { role });
      await get().setActiveWorkspace(activeWorkspaceId); // Refresh details
    } catch (error) {
      console.error('Failed to update member role', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  removeMember: async (memberId) => {
    const activeWorkspaceId = get().activeWorkspaceId;
    if (!activeWorkspaceId) return;
    
    set({ loading: true });
    try {
      await api.delete(`/workspaces/${activeWorkspaceId}/members/${memberId}`);
      await get().setActiveWorkspace(activeWorkspaceId); // Refresh details
    } catch (error) {
      console.error('Failed to remove member', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  }
}));
