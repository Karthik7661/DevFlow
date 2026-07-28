'use client'

import { useState, useEffect } from 'react';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { Shield, Trash2, Settings2 } from 'lucide-react';

export default function SettingsPage() {
  const { activeWorkspaceDetails, setActiveWorkspace, updateWorkspace, deleteWorkspace } = useWorkspaceStore();
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('DEVELOPER');
  const [isInviting, setIsInviting] = useState(false);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    if (activeWorkspaceDetails) {
      setName(activeWorkspaceDetails.name);
      setDescription(activeWorkspaceDetails.description || '');
    }
  }, [activeWorkspaceDetails]);

  if (!activeWorkspaceDetails) return null;

  const handleUpdateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await updateWorkspace({ name, description });
      toast.success('Workspace updated successfully');
    } catch (error) {
      toast.error('Failed to update workspace');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteWorkspace = async () => {
    const confirmation = window.prompt(`To confirm deletion, type "${activeWorkspaceDetails.name}"`);
    if (confirmation === activeWorkspaceDetails.name) {
      try {
        await deleteWorkspace();
        toast.success('Workspace deleted');
        router.push('/dashboard');
      } catch (error) {
        toast.error('Failed to delete workspace. You may not be the owner.');
      }
    } else if (confirmation !== null) {
      toast.error('Confirmation text did not match.');
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsInviting(true);
    try {
      await api.post(`/workspaces/${activeWorkspaceDetails.id}/members`, {
        email: inviteEmail,
        role: inviteRole
      });
      toast.success('Member invited successfully!');
      setInviteEmail('');
      setInviteRole('DEVELOPER');
      await setActiveWorkspace(activeWorkspaceDetails.id);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to invite member');
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (confirm('Are you sure you want to remove this member?')) {
      try {
        await api.delete(`/workspaces/${activeWorkspaceDetails.id}/members/${memberId}`);
        toast.success('Member removed');
        await setActiveWorkspace(activeWorkspaceDetails.id);
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to remove member');
      }
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Workspace Settings</h1>
        <p className="text-muted-foreground mt-2">Manage preferences and team members for {activeWorkspaceDetails.name}</p>
      </div>

      <Card className="glass border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-primary" />
            Workspace Details
          </CardTitle>
          <CardDescription>Update your workspace information</CardDescription>
        </CardHeader>
        <CardContent>
           <form onSubmit={handleUpdateWorkspace} className="space-y-4 max-w-md">
             <div className="space-y-2">
               <label className="text-sm font-medium">Workspace Name</label>
               <Input value={name} onChange={(e) => setName(e.target.value)} required />
             </div>
             <div className="space-y-2">
               <label className="text-sm font-medium">Description</label>
               <Input value={description} onChange={(e) => setDescription(e.target.value)} />
             </div>
             <Button type="submit" disabled={isUpdating} className="mt-2">
               {isUpdating ? 'Saving...' : 'Save Changes'}
             </Button>
           </form>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Team Access
          </CardTitle>
          <CardDescription>Manage who has access to this workspace</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-accent/30 p-4 rounded-lg border border-border">
            <h4 className="text-sm font-medium mb-3">Invite New Member</h4>
            <form onSubmit={handleInvite} className="flex gap-3 max-w-lg">
              <Input 
                placeholder="user@example.com" 
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
                className="flex-1 bg-background"
              />
              <select 
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="bg-background px-3 py-2 rounded-md text-sm font-medium border border-border shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="DEVELOPER">Developer</option>
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">Admin</option>
              </select>
              <Button type="submit" disabled={isInviting}>
                {isInviting ? 'Inviting...' : 'Invite'}
              </Button>
            </form>
          </div>

          <div className="rounded-md border border-border bg-background/50 overflow-hidden">
            {activeWorkspaceDetails.members.map((member, index) => (
              <div 
                key={member.id} 
                className={`flex items-center justify-between p-4 ${index !== activeWorkspaceDetails.members.length - 1 ? 'border-b border-border/50' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-bold uppercase text-sm border border-primary/20">
                    {member.user.email[0]}
                  </div>
                  <div>
                    <p className="font-medium leading-none mb-1">{member.user.fullName || member.user.email}</p>
                    <p className="text-sm text-muted-foreground">{member.user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm border ${member.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' : member.role === 'MANAGER' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-muted text-muted-foreground border-border'}`}>
                    {member.role}
                  </span>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10" onClick={() => handleRemoveMember(member.user.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-500/50 bg-red-500/5">
        <CardHeader>
          <CardTitle className="text-red-500 flex items-center gap-2">
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible actions for your workspace</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Deleting this workspace will permanently remove all projects, tasks, sprints, and team associations. This action cannot be undone.
          </p>
          <Button variant="destructive" onClick={handleDeleteWorkspace}>
            Delete Workspace
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
