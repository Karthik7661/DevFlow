import { create } from 'zustand';
import api from '@/lib/axios';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'TESTING' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  sprintId: string | null;
  assigneeId: string | null;
  reporterId: string;
  dueDate: string | null;
  estimatedTime: number | null;
  assignee?: { id: string, fullName: string, email: string, profilePicture: string | null } | null;
}

export interface Sprint {
  id: string;
  name: string;
  goal: string | null;
  startDate: string | null;
  endDate: string | null;
  status: 'PLANNED' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  tasks?: Task[];
}

interface ProjectState {
  tasks: Task[];
  sprints: Sprint[];
  loading: boolean;
  activeProjectId: string | null;

  fetchSprints: (projectId: string) => Promise<void>;
  fetchTasks: (projectId: string) => Promise<void>;
  createTask: (projectId: string, data: any) => Promise<void>;
  updateTask: (projectId: string, taskId: string, data: any) => Promise<void>;
  createSprint: (projectId: string, data: any) => Promise<void>;
  updateSprint: (projectId: string, sprintId: string, data: any) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  tasks: [],
  sprints: [],
  loading: false,
  activeProjectId: null,

  fetchSprints: async (projectId: string) => {
    set({ loading: true, activeProjectId: projectId });
    try {
      const res = await api.get(`/projects/${projectId}/sprints`);
      set({ sprints: res.data });
    } catch (error) {
      console.error('Failed to fetch sprints', error);
    } finally {
      set({ loading: false });
    }
  },

  fetchTasks: async (projectId: string) => {
    set({ loading: true, activeProjectId: projectId });
    try {
      const res = await api.get(`/projects/${projectId}/tasks`);
      set({ tasks: res.data });
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    } finally {
      set({ loading: false });
    }
  },

  createTask: async (projectId, data) => {
    try {
      const res = await api.post(`/projects/${projectId}/tasks`, data);
      set((state) => ({ tasks: [...state.tasks, res.data] }));
    } catch (error) {
      throw error;
    }
  },

  updateTask: async (projectId, taskId, data) => {
    try {
      // Optimistic update
      set((state) => ({
        tasks: state.tasks.map(t => t.id === taskId ? { ...t, ...data } : t)
      }));
      const res = await api.put(`/projects/${projectId}/tasks/${taskId}`, data);
      // Actual update
      set((state) => ({
        tasks: state.tasks.map(t => t.id === taskId ? res.data : t)
      }));
    } catch (error) {
      // Revert optimism by refetching
      await get().fetchTasks(projectId);
      throw error;
    }
  },

  createSprint: async (projectId, data) => {
    try {
      const res = await api.post(`/projects/${projectId}/sprints`, data);
      set((state) => ({ sprints: [...state.sprints, res.data] }));
    } catch (error) {
      throw error;
    }
  },

  updateSprint: async (projectId, sprintId, data) => {
    try {
      const res = await api.put(`/projects/${projectId}/sprints/${sprintId}`, data);
      set((state) => ({
        sprints: state.sprints.map(s => s.id === sprintId ? res.data : s)
      }));
    } catch (error) {
      throw error;
    }
  },
}));
