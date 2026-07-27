'use client'

import { useWorkspaceStore } from '@/store/workspaceStore';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Settings, FolderKanban, LogOut, Plus, LineChart, FileText } from 'lucide-react';
import { Button } from './ui/Button';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export function Sidebar() {
  const { workspaces, activeWorkspaceId, setActiveWorkspace, loading: workspaceLoading } = useWorkspaceStore();
  const { user } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/dashboard/projects', icon: FolderKanban },
    { name: 'Analytics', href: '/dashboard/analytics', icon: LineChart },
    { name: 'Reports', href: '/dashboard/reports', icon: FileText },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen w-64 flex-col border-r border-border bg-background/50 backdrop-blur-xl shrink-0">
      <div className="p-4 border-b border-border flex flex-col gap-4">
        <div className="flex items-center gap-2 px-2">
          <div className="h-6 w-6 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
            DF
          </div>
          <span className="font-semibold tracking-tight">DevFlow</span>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase px-2">Workspace</label>
          <div className="flex gap-2 items-center">
            <select 
              className="flex-1 h-9 bg-input border border-border rounded-md text-sm px-2 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 appearance-none"
              value={activeWorkspaceId || ''}
              onChange={(e) => setActiveWorkspace(e.target.value)}
              disabled={workspaceLoading || workspaces.length === 0}
            >
              {workspaces.length === 0 && <option value="">No workspaces</option>}
              {workspaces.map((ws) => (
                <option key={ws.id} value={ws.id}>
                  {ws.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive 
                  ? "bg-accent text-accent-foreground" 
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center shrink-0 text-xs font-bold uppercase">
              {user?.email?.[0]}
            </div>
            <div className="truncate text-sm text-muted-foreground">
              {user?.email}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
