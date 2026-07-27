'use client'

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { Task } from '@/store/projectStore';
import api from '@/lib/axios';
import { CheckSquare, Clock, Calendar, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

export default function MyTasksPage() {
  const { user } = useAuthStore();
  const { activeWorkspaceDetails } = useWorkspaceStore();
  const [myTasks, setMyTasks] = useState<(Task & { projectName: string, projectId: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllMyTasks() {
      if (!user || !activeWorkspaceDetails?.projects) return;
      
      setLoading(true);
      try {
        const allTasks: (Task & { projectName: string, projectId: string })[] = [];
        
        // Fetch tasks from every project in the active workspace
        for (const project of activeWorkspaceDetails.projects) {
          const res = await api.get(`/projects/${project.id}/tasks`);
          const projectTasks = res.data as Task[];
          
          // Filter tasks assigned to the current user
          const assignedToMe = projectTasks
            .filter(t => t.assigneeId === user.id)
            .map(t => ({ ...t, projectName: project.name, projectId: project.id }));
            
          allTasks.push(...assignedToMe);
        }
        
        // Sort by due date (newest first, or nulls last)
        allTasks.sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });

        setMyTasks(allTasks);
      } catch (error) {
        console.error('Failed to fetch user tasks', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAllMyTasks();
  }, [user, activeWorkspaceDetails]);

  const priorityColors: Record<string, string> = {
    LOW: 'text-blue-500 bg-blue-500/10',
    MEDIUM: 'text-yellow-500 bg-yellow-500/10',
    HIGH: 'text-orange-500 bg-orange-500/10',
    CRITICAL: 'text-red-500 bg-red-500/10',
  };

  const statusColors: Record<string, string> = {
    BACKLOG: 'text-gray-500',
    TODO: 'text-gray-300',
    IN_PROGRESS: 'text-blue-500',
    REVIEW: 'text-purple-500',
    TESTING: 'text-orange-500',
    DONE: 'text-green-500',
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 max-w-5xl mx-auto w-full">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
          <CheckSquare className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Tasks</h1>
          <p className="text-muted-foreground text-sm mt-1">All tasks assigned to you across this workspace.</p>
        </div>
      </div>

      {myTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-accent/20 rounded-xl border border-border/50 border-dashed">
          <CheckSquare className="h-12 w-12 mb-4 opacity-20" />
          <h3 className="text-lg font-medium text-foreground mb-1">You are all caught up!</h3>
          <p className="text-sm text-center max-w-sm">You have no active tasks assigned to you in any project within this workspace.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {myTasks.map(task => (
            <Link key={task.id} href={`/dashboard/projects/${task.projectId}`}>
              <Card className="group flex items-center justify-between p-4 bg-background/50 backdrop-blur-sm border-border/50 hover:border-primary/50 hover:bg-accent/30 transition-all cursor-pointer">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className={`shrink-0 ${statusColors[task.status]}`}>
                    {task.status === 'DONE' ? (
                      <CheckSquare className="h-5 w-5" />
                    ) : task.status === 'IN_PROGRESS' ? (
                      <Clock className="h-5 w-5" />
                    ) : (
                      <div className="h-5 w-5 rounded border-2 border-current opacity-50" />
                    )}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-foreground truncate">{task.title}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-[4px] shrink-0 border border-current/20 ${priorityColors[task.priority]}`}>
                        {task.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="font-medium bg-accent px-1.5 py-0.5 rounded text-accent-foreground border border-border/50">
                        {task.projectName}
                      </span>
                      <span className="font-mono opacity-60 uppercase">{task.status.replace('_', ' ')}</span>
                      {task.dueDate && (
                        <div className="flex items-center gap-1 opacity-80">
                          <Calendar className="h-3 w-3" />
                          {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="shrink-0 ml-4 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1 duration-200 text-muted-foreground group-hover:text-primary">
                  <ChevronRight className="h-5 w-5" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
