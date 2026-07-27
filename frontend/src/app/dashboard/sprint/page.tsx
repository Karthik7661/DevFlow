'use client'

import { useEffect, useState } from 'react';
import { useProjectStore, Task } from '@/store/projectStore';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import { Plus, Layout } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SprintBoardPage() {
  const { activeWorkspaceDetails } = useWorkspaceStore();
  const { tasks, loading, fetchTasks, updateTask, createTask } = useProjectStore();
  
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [newTaskData, setNewTaskData] = useState<Partial<Task>>({ status: 'TODO', priority: 'MEDIUM' });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editTaskData, setEditTaskData] = useState<Partial<Task>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Auto-select first project if available
  useEffect(() => {
    if (activeWorkspaceDetails?.projects?.length && !selectedProjectId) {
      setSelectedProjectId(activeWorkspaceDetails.projects[0].id);
    }
  }, [activeWorkspaceDetails, selectedProjectId]);

  // Fetch tasks when project changes
  useEffect(() => {
    if (selectedProjectId) {
      fetchTasks(selectedProjectId);
    }
  }, [selectedProjectId, fetchTasks]);

  useEffect(() => {
    if (selectedTask) {
      setEditTaskData({
        title: selectedTask.title,
        description: selectedTask.description,
        status: selectedTask.status,
        priority: selectedTask.priority,
        assigneeId: selectedTask.assigneeId,
        dueDate: selectedTask.dueDate,
      });
    }
  }, [selectedTask]);

  const handleTaskMove = async (taskId: string, newStatus: string) => {
    try {
      await updateTask(selectedProjectId, taskId, { status: newStatus });
    } catch {
      toast.error('Failed to move task');
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskData.title || !selectedProjectId) return;
    try {
      await createTask(selectedProjectId, newTaskData);
      setNewTaskData({ status: 'TODO', priority: 'MEDIUM' });
      setIsNewTaskOpen(false);
      toast.success('Task created');
    } catch {
      toast.error('Failed to create task');
    }
  };

  const handleUpdateTaskDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !selectedProjectId) return;
    setIsSaving(true);
    try {
      await updateTask(selectedProjectId, selectedTask.id, editTaskData);
      toast.success('Task updated successfully');
      setSelectedTask(null);
    } catch {
      toast.error('Failed to update task');
    } finally {
      setIsSaving(false);
    }
  };

  if (!activeWorkspaceDetails?.projects?.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-muted-foreground p-8">
        <Layout className="h-16 w-16 mb-4 opacity-50" />
        <h2 className="text-xl font-bold text-foreground mb-2">No Projects Found</h2>
        <p className="max-w-md text-center text-sm">Create a project in your workspace to start using the Sprint Board.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-hidden">
      {/* Header Area */}
      <div className="flex items-center justify-between mb-6 shrink-0 bg-background/50 backdrop-blur-md p-4 rounded-xl border border-border">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
            <Layout className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Active Sprint</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Project:</span>
              <select 
                className="bg-accent text-accent-foreground text-sm font-medium border border-border rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
              >
                {activeWorkspaceDetails.projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <Dialog open={isNewTaskOpen} onOpenChange={setIsNewTaskOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5">
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="glass">
            <DialogHeader>
              <DialogTitle>Create Task for Sprint</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateTask} className="space-y-4 pt-4">
              <input 
                 className="text-xl pr-4 bg-transparent border-b border-transparent hover:border-border focus:border-primary outline-none transition-colors w-full font-semibold mb-2"
                 placeholder="Task Title"
                 value={newTaskData.title || ''}
                 onChange={(e) => setNewTaskData({ ...newTaskData, title: e.target.value })}
                 required
                 autoFocus
               />
               <textarea 
                  className="w-full min-h-[80px] bg-background/50 border border-border rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-y mb-4"
                  placeholder="Add a detailed description..."
                  value={newTaskData.description || ''}
                  onChange={(e) => setNewTaskData({ ...newTaskData, description: e.target.value })}
               />
               <div className="grid grid-cols-2 gap-4 bg-background/50 p-4 rounded-lg border border-border">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Status</label>
                    <select 
                      className="bg-accent px-2 py-1 rounded-md text-xs font-medium text-accent-foreground border border-border w-full focus:outline-none focus:ring-1 focus:ring-primary"
                      value={newTaskData.status || 'TODO'}
                      onChange={(e) => setNewTaskData({ ...newTaskData, status: e.target.value as any })}
                    >
                      <option value="BACKLOG">BACKLOG</option>
                      <option value="TODO">TODO</option>
                      <option value="IN_PROGRESS">IN PROGRESS</option>
                      <option value="REVIEW">REVIEW</option>
                      <option value="TESTING">TESTING</option>
                      <option value="DONE">DONE</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Priority</label>
                    <select 
                      className="bg-background px-2 py-1 rounded-md text-xs font-medium border border-border shadow-sm w-full focus:outline-none focus:ring-1 focus:ring-primary"
                      value={newTaskData.priority || 'MEDIUM'}
                      onChange={(e) => setNewTaskData({ ...newTaskData, priority: e.target.value as any })}
                    >
                      <option value="LOW">LOW</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="HIGH">HIGH</option>
                      <option value="CRITICAL">CRITICAL</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Assignee</label>
                    <select 
                      className="bg-background px-2 py-1 rounded-md text-xs font-medium border border-border shadow-sm w-full focus:outline-none focus:ring-1 focus:ring-primary"
                      value={newTaskData.assigneeId || ''}
                      onChange={(e) => setNewTaskData({ ...newTaskData, assigneeId: e.target.value || null })}
                    >
                      <option value="">Unassigned</option>
                      {activeWorkspaceDetails?.members.map(member => (
                        <option key={member.userId} value={member.userId}>
                          {member.user.fullName || member.user.email}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Due Date</label>
                    <input 
                      type="date"
                      className="bg-background px-2 py-1 rounded-md text-xs font-medium border border-border shadow-sm w-full focus:outline-none focus:ring-1 focus:ring-primary"
                      value={newTaskData.dueDate ? new Date(newTaskData.dueDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => setNewTaskData({ ...newTaskData, dueDate: e.target.value ? new Date(e.target.value).toISOString() : null })}
                    />
                  </div>
               </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="ghost" onClick={() => setIsNewTaskOpen(false)}>Cancel</Button>
                <Button type="submit">Create Task</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Board Area */}
      <div className="flex-1 overflow-hidden relative">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          </div>
        ) : (
          <KanbanBoard tasks={tasks} onTaskMove={handleTaskMove} onTaskClick={setSelectedTask} />
        )}
      </div>

      {/* Task Details Modal */}
      <Dialog open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
        <DialogContent className="glass sm:max-w-[600px]">
           <form onSubmit={handleUpdateTaskDetails}>
             <DialogHeader>
               <input 
                 className="text-xl pr-4 bg-transparent border-b border-transparent hover:border-border focus:border-primary outline-none transition-colors w-full font-semibold mb-2"
                 value={editTaskData.title || ''}
                 onChange={(e) => setEditTaskData({ ...editTaskData, title: e.target.value })}
                 required
               />
             </DialogHeader>
             <div className="py-4 space-y-6">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Description</label>
                  <textarea 
                    className="w-full min-h-[100px] bg-background/50 border border-border rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-y"
                    placeholder="Add a more detailed description..."
                    value={editTaskData.description || ''}
                    onChange={(e) => setEditTaskData({ ...editTaskData, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-6 bg-background/50 p-4 rounded-lg border border-border">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Status</label>
                    <select 
                      className="bg-accent px-2 py-1 rounded-md text-xs font-medium text-accent-foreground border border-border w-full focus:outline-none focus:ring-1 focus:ring-primary"
                      value={editTaskData.status || 'TODO'}
                      onChange={(e) => setEditTaskData({ ...editTaskData, status: e.target.value as any })}
                    >
                      <option value="BACKLOG">BACKLOG</option>
                      <option value="TODO">TODO</option>
                      <option value="IN_PROGRESS">IN PROGRESS</option>
                      <option value="REVIEW">REVIEW</option>
                      <option value="TESTING">TESTING</option>
                      <option value="DONE">DONE</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Priority</label>
                    <select 
                      className="bg-background px-2 py-1 rounded-md text-xs font-medium border border-border shadow-sm w-full focus:outline-none focus:ring-1 focus:ring-primary"
                      value={editTaskData.priority || 'MEDIUM'}
                      onChange={(e) => setEditTaskData({ ...editTaskData, priority: e.target.value as any })}
                    >
                      <option value="LOW">LOW</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="HIGH">HIGH</option>
                      <option value="CRITICAL">CRITICAL</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Assignee</label>
                    <select 
                      className="bg-background px-2 py-1 rounded-md text-xs font-medium border border-border shadow-sm w-full focus:outline-none focus:ring-1 focus:ring-primary"
                      value={editTaskData.assigneeId || ''}
                      onChange={(e) => setEditTaskData({ ...editTaskData, assigneeId: e.target.value || null })}
                    >
                      <option value="">Unassigned</option>
                      {activeWorkspaceDetails?.members.map(member => (
                        <option key={member.userId} value={member.userId}>
                          {member.user.fullName || member.user.email}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Due Date</label>
                    <input 
                      type="date"
                      className="bg-background px-2 py-1 rounded-md text-xs font-medium border border-border shadow-sm w-full focus:outline-none focus:ring-1 focus:ring-primary"
                      value={editTaskData.dueDate ? new Date(editTaskData.dueDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => setEditTaskData({ ...editTaskData, dueDate: e.target.value ? new Date(e.target.value).toISOString() : null })}
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button type="button" variant="ghost" className="mr-2" onClick={() => setSelectedTask(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
             </div>
           </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
