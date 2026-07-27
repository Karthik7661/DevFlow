'use client'

import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { Bell, Search, Sun, Moon, Plus, Command } from 'lucide-react';
import { Button } from './ui/Button';

export function TopNav() {
  const { theme, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();
  const { workspaces, activeWorkspaceId, setActiveWorkspace } = useWorkspaceStore();

  return (
    <header className="h-14 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-4 sticky top-0 z-40 shrink-0">
      <div className="flex items-center gap-4 flex-1">
        {/* Workspace Switcher */}
        <div className="hidden md:flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
            DF
          </div>
          <select 
            className="h-8 bg-transparent border-none text-sm font-medium focus:outline-none focus:ring-0 cursor-pointer hover:bg-accent rounded px-2"
            value={activeWorkspaceId || ''}
            onChange={(e) => setActiveWorkspace(e.target.value)}
          >
            {workspaces.length === 0 && <option value="">No workspaces</option>}
            {workspaces.map((ws) => (
              <option key={ws.id} value={ws.id} className="bg-background">
                {ws.name}
              </option>
            ))}
          </select>
        </div>

        {/* Global Search / Command Palette */}
        <div className="max-w-md w-full ml-4">
          <div className="relative group flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            <input 
              type="text" 
              placeholder="Search or type a command..." 
              className="w-full h-9 bg-accent/50 border border-border rounded-md pl-9 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background transition-all"
            />
            <div className="absolute right-3 flex items-center gap-1 text-[10px] text-muted-foreground font-medium bg-background border border-border px-1.5 py-0.5 rounded shadow-sm">
              <Command className="h-3 w-3" /> K
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Bell className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-muted-foreground hover:text-foreground">
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>
        <Button size="sm" className="ml-2 gap-1.5 h-8">
          <Plus className="h-3.5 w-3.5" />
          <span>Create</span>
        </Button>
        <div className="ml-2 h-8 w-8 rounded-full bg-accent border border-border flex items-center justify-center text-xs font-bold uppercase shrink-0 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
          {user?.email?.[0] || 'U'}
        </div>
      </div>
    </header>
  );
}
