'use client'

import { useState } from 'react';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function ProjectsPage() {
  const { activeWorkspaceDetails, createProject } = useWorkspaceStore();
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();

  if (!activeWorkspaceDetails) return null;

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProject({ name, description });
      toast.success('Project created successfully!');
      setName('');
      setDescription('');
      setIsCreating(false);
    } catch (error) {
      toast.error('Failed to create project');
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-2">Manage projects for {activeWorkspaceDetails.name}</p>
        </div>
        <Button onClick={() => setIsCreating(!isCreating)}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      {isCreating && (
        <Card className="glass animate-in slide-in-from-top-4">
          <CardHeader>
            <CardTitle>Create New Project</CardTitle>
            <CardDescription>Add a new project to your workspace</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateProject} className="space-y-4 max-w-xl">
              <div className="space-y-2">
                <label className="text-sm font-medium">Project Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Q3 Marketing Campaign" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional details..." />
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit">Create</Button>
                <Button type="button" variant="ghost" onClick={() => setIsCreating(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {activeWorkspaceDetails.projects.length === 0 && !isCreating && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            No projects found. Create one to get started.
          </div>
        )}
        {activeWorkspaceDetails.projects.map((project) => (
          <Card 
            key={project.id} 
            className="glass hover:bg-accent/10 transition-colors cursor-pointer"
            onClick={() => router.push(`/dashboard/projects/${project.id}`)}
          >
            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
              <CardDescription className="truncate">{project.description || 'No description provided.'}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center text-sm mt-4">
                <span className="bg-accent px-2 py-1 rounded-md text-xs font-medium capitalize border border-border text-primary">
                  {project.status.replace('_', ' ').toLowerCase()}
                </span>
                <span className="text-muted-foreground capitalize text-xs">
                  {project.priority.toLowerCase()} priority
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
