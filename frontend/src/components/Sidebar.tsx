'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Layout, 
  CheckSquare, 
  MessageSquare, 
  FileText, 
  LineChart, 
  Users, 
  Bell, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navGroups = [
    {
      label: 'Favorites',
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'My Tasks', href: '/dashboard/tasks', icon: CheckSquare },
      ]
    },
    {
      label: 'Workspace',
      items: [
        { name: 'Projects', href: '/dashboard/projects', icon: FolderKanban },
        { name: 'Sprint Board', href: '/dashboard/sprint', icon: Layout },
        { name: 'Team Chat', href: '/dashboard/chat', icon: MessageSquare },
        { name: 'Files', href: '/dashboard/files', icon: FileText },
      ]
    },
    {
      label: 'Insights',
      items: [
        { name: 'Analytics', href: '/dashboard/analytics', icon: LineChart },
        { name: 'Team Members', href: '/dashboard/team', icon: Users },
      ]
    },
    {
      label: 'Settings',
      items: [
        { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
        { name: 'Settings', href: '/dashboard/settings', icon: Settings },
      ]
    }
  ];

  return (
    <div 
      className={cn(
        "h-full flex flex-col border-r border-border bg-background/95 shrink-0 relative z-30 group transition-all duration-300 ease-in-out",
        collapsed ? "w-[68px]" : "w-[240px]"
      )}
    >
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 h-6 w-6 rounded-full bg-border border border-background flex items-center justify-center text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity z-50"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
      <nav className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-3 space-y-6 mt-2">
        {navGroups.map((group, idx) => (
          <div key={idx}>
            <div
              className={cn(
                "px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2",
                collapsed ? "hidden" : "block"
              )}
            >
              {group.label}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    title={collapsed ? item.name : undefined}
                    className={cn(
                      "flex items-center rounded-md transition-all duration-200 relative group/item",
                      collapsed ? "justify-center p-2" : "px-3 py-1.5 gap-3",
                      isActive 
                        ? "bg-primary/10 text-primary font-medium" 
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    )}
                  >
                    {isActive && (
                      <div 
                        className="absolute left-0 top-1 bottom-1 w-1 bg-primary rounded-r-full"
                      />
                    )}
                    <item.icon className={cn("shrink-0", collapsed ? "h-5 w-5" : "h-4 w-4")} />
                    <span
                      className={cn(
                        "text-sm whitespace-nowrap",
                        collapsed ? "hidden" : "block"
                      )}
                    >
                      {item.name}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}
