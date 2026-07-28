'use client'

import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { useNotificationStore } from '@/store/notificationStore';
import { Bell, Search, Sun, Moon, Plus, Command, User, Settings, LogOut, Check } from 'lucide-react';
import { Button } from './ui/Button';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function TopNav() {
  const { theme, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();
  const { workspaces, activeWorkspaceId, setActiveWorkspace } = useWorkspaceStore();
  const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead } = useNotificationStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user, fetchNotifications]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

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
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-foreground relative"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background animate-pulse" />
            )}
          </Button>
          
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-border bg-background/95 backdrop-blur-xl shadow-xl shadow-black/20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              <div className="px-4 py-3 border-b border-border bg-accent/20 flex items-center justify-between">
                <h3 className="font-semibold text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" className="h-6 text-xs px-2" onClick={() => markAllAsRead()}>
                    Mark all read
                  </Button>
                )}
              </div>
              <div className="max-h-[300px] overflow-y-auto p-1">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No notifications
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`flex gap-3 p-3 rounded-lg mb-1 transition-colors ${notif.read ? 'opacity-70 hover:bg-accent/50' : 'bg-primary/5 hover:bg-primary/10'}`}
                      onClick={() => { if (!notif.read) markAsRead(notif.id); }}
                    >
                      <div className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${notif.read ? 'bg-transparent' : 'bg-primary'}`} />
                      <div className="flex-1 cursor-pointer">
                        <p className="text-sm font-medium leading-none mb-1 text-foreground">{notif.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{notif.message}</p>
                        <p className="text-[10px] text-muted-foreground mt-2">
                          {new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {!notif.read && (
                        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={(e) => { e.stopPropagation(); markAsRead(notif.id); }}>
                          <Check className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-muted-foreground hover:text-foreground">
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>
        <Button size="sm" className="ml-2 gap-1.5 h-8">
          <Plus className="h-3.5 w-3.5" />
          <span>Create</span>
        </Button>
        <div className="relative ml-2" ref={profileRef}>
          <div 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="h-8 w-8 rounded-full bg-accent border border-border flex items-center justify-center text-xs font-bold uppercase shrink-0 cursor-pointer hover:ring-2 hover:ring-primary transition-all select-none"
          >
            {user?.email?.[0] || 'U'}
          </div>
          
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-background/95 backdrop-blur-xl shadow-xl shadow-black/20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              <div className="px-4 py-3 border-b border-border bg-accent/20">
                <p className="text-sm font-semibold truncate text-foreground">{user?.fullName || 'User'}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
              <div className="p-1">
                <div className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md cursor-pointer transition-colors" onClick={() => { setIsProfileOpen(false); router.push('/dashboard/settings'); }}>
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Profile Settings</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md cursor-pointer transition-colors" onClick={() => { setIsProfileOpen(false); router.push('/dashboard/settings'); }}>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <span>Preferences</span>
                </div>
              </div>
              <div className="p-1 border-t border-border">
                <div onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 hover:text-red-600 rounded-md cursor-pointer transition-colors">
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
