'use client'

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { TopNav } from '@/components/TopNav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuthStore();
  const { fetchWorkspaces } = useWorkspaceStore();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchWorkspaces();
    }
  }, [user, fetchWorkspaces]);

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex bg-background overflow-hidden ambient-bg bg-grid-white">
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-background/95 z-20 relative">
        <TopNav />
        <main className="flex-1 min-h-0 overflow-hidden p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
