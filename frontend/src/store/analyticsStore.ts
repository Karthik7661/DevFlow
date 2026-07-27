import { create } from 'zustand';
import api from '@/lib/axios';

interface DashboardSummary {
  totalProjects: number;
  activeSprints: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  highPriorityTasks: number;
}

interface TeamProductivity {
  name: string;
  tasksCompleted: number;
}

interface AnalyticsState {
  summary: DashboardSummary | null;
  productivity: TeamProductivity[];
  loading: boolean;
  
  fetchSummary: (workspaceId: string) => Promise<void>;
  fetchProductivity: (workspaceId: string) => Promise<void>;
  exportReport: (workspaceId: string, type: string, id?: string) => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  summary: null,
  productivity: [],
  loading: false,

  fetchSummary: async (workspaceId: string) => {
    set({ loading: true });
    try {
      const res = await api.get(`/workspaces/${workspaceId}/analytics/summary`);
      set({ summary: res.data });
    } catch (error) {
      console.error('Failed to fetch analytics summary', error);
    } finally {
      set({ loading: false });
    }
  },

  fetchProductivity: async (workspaceId: string) => {
    set({ loading: true });
    try {
      const res = await api.get(`/workspaces/${workspaceId}/analytics/productivity`);
      set({ productivity: res.data });
    } catch (error) {
      console.error('Failed to fetch productivity', error);
    } finally {
      set({ loading: false });
    }
  },

  exportReport: async (workspaceId, type, id) => {
    try {
      const params = new URLSearchParams({ type });
      if (id && type === 'PROJECT') params.append('projectId', id);
      if (id && type === 'SPRINT') params.append('sprintId', id);

      const res = await api.get(`/workspaces/${workspaceId}/analytics/export?${params.toString()}`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      throw error;
    }
  }
}));
