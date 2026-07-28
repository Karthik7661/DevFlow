'use client';

import { useEffect, useState, useRef } from 'react';
import { useFileStore } from '@/store/fileStore';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { File, Download, Trash2, UploadCloud, FileText, Image as ImageIcon, FileCode, Archive, MoreVertical } from 'lucide-react';
import toast from 'react-hot-toast';

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith('image/')) return <ImageIcon className="h-8 w-8 text-blue-500" />;
  if (mimeType.includes('pdf') || mimeType.includes('document')) return <FileText className="h-8 w-8 text-orange-500" />;
  if (mimeType.includes('zip') || mimeType.includes('compressed')) return <Archive className="h-8 w-8 text-yellow-500" />;
  if (mimeType.includes('javascript') || mimeType.includes('json') || mimeType.includes('html')) return <FileCode className="h-8 w-8 text-green-500" />;
  return <File className="h-8 w-8 text-muted-foreground" />;
};

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function FilesPage() {
  const { activeWorkspaceId, activeWorkspaceDetails } = useWorkspaceStore();
  const { user } = useAuthStore();
  const { files, loading, uploading, fetchFiles, uploadFile, deleteFile } = useFileStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeWorkspaceId) {
      fetchFiles(activeWorkspaceId);
    }
  }, [activeWorkspaceId, fetchFiles]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !activeWorkspaceId) return;
    
    const file = e.target.files[0];
    
    // Validate size (e.g., 50MB max)
    if (file.size > 50 * 1024 * 1024) {
      toast.error('File size exceeds 50MB limit');
      return;
    }

    try {
      await uploadFile(activeWorkspaceId, file);
      toast.success('File uploaded successfully');
    } catch (err) {
      toast.error('Failed to upload file');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (fileId: string) => {
    if (!activeWorkspaceId) return;
    if (confirm('Are you sure you want to delete this file?')) {
      try {
        await deleteFile(activeWorkspaceId, fileId);
        toast.success('File deleted');
      } catch (err) {
        toast.error('Failed to delete file');
      }
    }
  };

  const currentMember = activeWorkspaceDetails?.members.find(m => m.userId === user?.uid);
  const isAdmin = currentMember?.role === 'ADMIN';

  if (!activeWorkspaceId) {
    return <div className="p-8 text-center text-muted-foreground">Loading workspace...</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-background/50 backdrop-blur-md p-6 rounded-xl border border-border">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Files</h2>
          <p className="text-muted-foreground mt-1 text-sm">Manage workspace files, documents, and assets.</p>
        </div>
        
        <div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileChange}
          />
          <Button 
            className="shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <UploadCloud className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload File'}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {[1,2,3,4].map(i => <Card key={i} className="h-32 glass animate-pulse" />)}
        </div>
      ) : files.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-xl bg-accent/10">
          <UploadCloud className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
          <h3 className="text-lg font-medium">No files yet</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">Upload your first file to share with the workspace.</p>
          <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            Select File
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {files.map((file) => (
            <Card key={file.id} className="overflow-hidden glass hover:bg-accent/20 transition-all duration-300 border-border/50 hover:border-primary/30 group">
              <CardContent className="p-0">
                <div className="p-6 flex flex-col items-center justify-center text-center bg-accent/5">
                  {getFileIcon(file.mimeType)}
                  <h4 className="mt-4 font-semibold text-sm truncate w-full" title={file.originalName}>
                    {file.originalName}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">{formatSize(file.size)}</p>
                </div>
                <div className="border-t border-border/50 p-3 flex items-center justify-between bg-background/50 backdrop-blur-sm">
                  <div className="text-[10px] text-muted-foreground flex flex-col gap-0.5">
                    <span className="truncate w-32">By {file.uploadedBy.fullName}</span>
                    <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => window.open(`https://backend-six-gamma-28.vercel.app${file.fileUrl}`, '_blank')}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    {(isAdmin || file.uploadedById === user?.uid) && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        onClick={() => handleDelete(file.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
