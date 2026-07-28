import { create } from 'zustand';
import api from '@/lib/axios';

export interface WorkspaceFile {
  id: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  fileUrl: string;
  workspaceId: string;
  uploadedById: string;
  createdAt: string;
  uploadedBy: {
    id: string;
    fullName: string;
    email: string;
  };
}

interface FileState {
  files: WorkspaceFile[];
  loading: boolean;
  uploading: boolean;

  fetchFiles: (workspaceId: string) => Promise<void>;
  uploadFile: (workspaceId: string, file: File) => Promise<void>;
  deleteFile: (workspaceId: string, fileId: string) => Promise<void>;
}

export const useFileStore = create<FileState>((set, get) => ({
  files: [],
  loading: false,
  uploading: false,

  fetchFiles: async (workspaceId: string) => {
    set({ loading: true });
    try {
      const res = await api.get(`/workspaces/${workspaceId}/files`);
      set({ files: res.data });
    } catch (error) {
      console.error('Failed to fetch files', error);
    } finally {
      set({ loading: false });
    }
  },

  uploadFile: async (workspaceId: string, file: File) => {
    set({ uploading: true });
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await api.post(`/workspaces/${workspaceId}/files`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      set((state) => ({ files: [res.data, ...state.files] }));
    } catch (error) {
      console.error('Failed to upload file', error);
      throw error;
    } finally {
      set({ uploading: false });
    }
  },

  deleteFile: async (workspaceId: string, fileId: string) => {
    try {
      await api.delete(`/workspaces/${workspaceId}/files/${fileId}`);
      set((state) => ({
        files: state.files.filter(f => f.id !== fileId)
      }));
    } catch (error) {
      console.error('Failed to delete file', error);
      throw error;
    }
  }
}));
