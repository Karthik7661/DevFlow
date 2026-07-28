'use client'

import { useWorkspaceStore } from '@/store/workspaceStore';
import { useAnalyticsStore } from '@/store/analyticsStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Users, FolderKanban, Activity, Box, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { Skeleton } from '@/components/ui/Skeleton';

export default function DashboardPage() {
  const { workspaces, activeWorkspaceDetails, loading, createWorkspace } = useWorkspaceStore();
  const { summary, fetchSummary } = useAnalyticsStore();
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (activeWorkspaceDetails?.id) {
      fetchSummary(activeWorkspaceDetails.id);
    }
  }, [activeWorkspaceDetails?.id, fetchSummary]);

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
      <div className="p-8 space-y-8 animate-in fade-in duration-500">
        <div>
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-5 w-72" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-28 w-full" />)}
        </div>
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
          <Skeleton className="h-[350px] w-full" />
          <Skeleton className="h-[350px] w-full lg:col-span-2" />
        </div>
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
            <div className="text-2xl font-bold">{summary?.totalProjects || 0}</div>
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
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{summary?.pendingTasks || 0}</div>
          </CardContent>
        </Card>

        <Card className="glass border-primary/30 bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Completed Tasks</CardTitle>
            <Box className="h-4 w-4 text-primary/70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{summary?.completedTasks || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        <Card className="glass">
          <CardHeader>
            <CardTitle>Project Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {summary?.chartData ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summary.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} allowDecimals={false} />
                  <Tooltip cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }} />
                  <Bar dataKey="count" fill="#ffffff" radius={[4, 4, 0, 0]} maxBarSize={60} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground text-sm">No data available</div>
            )}
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
            {summary?.burndownData && summary.burndownData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={summary.burndownData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                  <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="ideal" stroke="#888888" strokeWidth={2} strokeDasharray="5 5" name="Ideal Tasks" />
                  <Line type="monotone" dataKey="actual" stroke="#ffffff" strokeWidth={3} name="Remaining Tasks" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center flex-col text-muted-foreground text-sm">
                <Box className="h-8 w-8 mb-2 opacity-20" />
                No active sprints to track
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
