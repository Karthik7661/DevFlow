'use client'

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useProjectStore, Task } from '@/store/projectStore';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

export default function ProjectBoardPage() {
  const { projectId } = useParams() as { projectId: string };
  const { tasks, loading, fetchTasks, updateTask, createTask } = useProjectStore();
  const { activeWorkspaceDetails } = useWorkspaceStore();
  
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    if (projectId) {
      fetchTasks(projectId);
    }
  }, [projectId, fetchTasks]);

  const handleTaskMove = async (taskId: string, newStatus: string) => {
    try {
      await updateTask(projectId, taskId, { status: newStatus });
    } catch {
      toast.error('Failed to move task');
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTask(projectId, { title: newTaskTitle, status: 'TODO', priority: 'MEDIUM' });
      setNewTaskTitle('');
      setIsNewTaskOpen(false);
      toast.success('Task created');
    } catch {
      toast.error('Failed to create task');
    }
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  const project = activeWorkspaceDetails?.projects.find(p => p.id === projectId);

  return (
    <div className="flex flex-col h-full p-8 animate-in fade-in duration-500 overflow-hidden">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{project?.name || 'Project Board'}</h1>
          <p className="text-muted-foreground mt-1 text-sm">Kanban Board</p>
        </div>
        
        <Dialog open={isNewTaskOpen} onOpenChange={setIsNewTaskOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="glass">
            <DialogHeader>
              <DialogTitle>Create Task</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateTask} className="space-y-4 pt-4">
              <Input 
                placeholder="What needs to be done?" 
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                required
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setIsNewTaskOpen(false)}>Cancel</Button>
                <Button type="submit">Create</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 overflow-hidden">
        <KanbanBoard tasks={tasks} onTaskMove={handleTaskMove} onTaskClick={setSelectedTask} />
      </div>

      {/* Task Details Modal */}
      <Dialog open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
        <DialogContent className="glass sm:max-w-[600px]">
           <DialogHeader>
             <DialogTitle className="text-xl pr-4">{selectedTask?.title}</DialogTitle>
           </DialogHeader>
           <div className="py-4 space-y-6">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Description</label>
                <p className="text-sm mt-1">{selectedTask?.description || 'No description provided.'}</p>
              </div>
              <div className="grid grid-cols-2 gap-6 bg-background/50 p-4 rounded-lg border border-border">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</label>
                  <div className="mt-1 flex items-center">
                    <span className="bg-accent px-2 py-1 rounded-md text-xs font-medium text-accent-foreground border border-border">
                      {selectedTask?.status}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Priority</label>
                  <div className="mt-1 flex items-center">
                    <span className="bg-background px-2 py-1 rounded-md text-xs font-medium border border-border shadow-sm">
                      {selectedTask?.priority}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Assignee</label>
                  <div className="mt-1 flex items-center gap-2">
                    {selectedTask?.assignee ? (
                      <>
                        <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] uppercase font-bold">
                          {selectedTask.assignee.email[0]}
                        </div>
                        <span className="text-sm">{selectedTask.assignee.fullName || selectedTask.assignee.email}</span>
                      </>
                    ) : (
                      <span className="text-sm text-muted-foreground">Unassigned</span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Due Date</label>
                  <p className="text-sm font-medium mt-1 text-muted-foreground">
                    {selectedTask?.dueDate ? new Date(selectedTask.dueDate).toLocaleDateString() : 'No due date'}
                  </p>
                </div>
              </div>
           </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
