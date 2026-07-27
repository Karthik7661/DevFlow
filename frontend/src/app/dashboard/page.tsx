'use client'

import { useWorkspaceStore } from '@/store/workspaceStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Users, FolderKanban, Activity, Box, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { workspaces, activeWorkspaceDetails, loading, createWorkspace } = useWorkspaceStore();
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateFirstWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      await createWorkspace({ name: newWorkspaceName, description: '' });
      toast.success('Workspace created!');
    } catch (error) {
      toast.error('Failed to create workspace');
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  if (workspaces.length === 0 || !activeWorkspaceDetails) {
    return (
       <div className="flex h-full flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in-95 duration-500">
         <Card className="max-w-md w-full glass">
           <CardHeader>
             <CardTitle className="text-2xl font-semibold">Welcome to DevFlow!</CardTitle>
           </CardHeader>
           <CardContent>
             <p className="text-muted-foreground mb-6">Create your first workspace to get started.</p>
             <form onSubmit={handleCreateFirstWorkspace} className="space-y-4">
               <Input 
                 placeholder="Workspace Name (e.g., Acme Corp)" 
                 value={newWorkspaceName}
                 onChange={(e) => setNewWorkspaceName(e.target.value)}
                 required
               />
               <Button className="w-full" type="submit" disabled={isCreating}>
                 {isCreating ? 'Creating...' : 'Create Workspace'}
               </Button>
             </form>
           </CardContent>
         </Card>
       </div>
    )
  }

  const projectStats = activeWorkspaceDetails.projects.reduce((acc: any, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {});

  const chartData = [
    { name: 'Planned', count: projectStats.PLANNED || 0 },
    { name: 'In Progress', count: projectStats.IN_PROGRESS || 0 },
    { name: 'Completed', count: projectStats.COMPLETED || 0 },
  ];

  const burndownData = [
    { day: 'Day 1', ideal: 100, actual: 100 },
    { day: 'Day 2', ideal: 90, actual: 95 },
    { day: 'Day 3', ideal: 80, actual: 85 },
    { day: 'Day 4', ideal: 70, actual: 60 },
    { day: 'Day 5', ideal: 60, actual: 55 },
    { day: 'Day 6', ideal: 50, actual: 45 },
    { day: 'Day 7', ideal: 40, actual: 30 },
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground mt-2">
          Here's what's happening in {activeWorkspaceDetails.name}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeWorkspaceDetails.projects.length}</div>
          </CardContent>
        </Card>
        
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeWorkspaceDetails.members.length}</div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectStats.IN_PROGRESS || 0}</div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Box className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectStats.COMPLETED || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        <Card className="glass">
          <CardHeader>
            <CardTitle>Project Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} allowDecimals={false} />
                <Tooltip cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }} />
                <Bar dataKey="count" fill="#ffffff" radius={[4, 4, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-primary" />
              Active Sprint Burndown
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={burndownData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="ideal" stroke="#888888" strokeWidth={2} strokeDasharray="5 5" name="Ideal Tasks" />
                <Line type="monotone" dataKey="actual" stroke="#ffffff" strokeWidth={3} name="Remaining Tasks" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
