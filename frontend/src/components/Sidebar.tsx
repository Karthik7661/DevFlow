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
        { name: 'Documents', href: '/dashboard/documents', icon: FileText },
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
    <motion.div 
      initial={{ width: 240 }}
      animate={{ width: collapsed ? 68 : 240 }}
      className="h-screen flex flex-col border-r border-border bg-background/50 backdrop-blur-xl shrink-0 relative z-50 group"
    >
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 h-6 w-6 rounded-full bg-border border border-background flex items-center justify-center text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity z-50"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-6 mt-2 scrollbar-hide">
        {navGroups.map((group, idx) => (
          <div key={idx}>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2"
                >
                  {group.label}
                </motion.div>
              )}
            </AnimatePresence>
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
                      <motion.div 
                        layoutId="active-indicator"
                        className="absolute left-0 top-1 bottom-1 w-1 bg-primary rounded-r-full"
                      />
                    )}
                    <item.icon className={cn("shrink-0", collapsed ? "h-5 w-5" : "h-4 w-4")} />
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          className="text-sm whitespace-nowrap overflow-hidden"
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
    </motion.div>
  );
}
