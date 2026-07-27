'use client'

import { useState } from 'react';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import api from '@/lib/axios';

export default function SettingsPage() {
  const { activeWorkspaceDetails, setActiveWorkspace } = useWorkspaceStore();
  const [inviteEmail, setInviteEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);

  if (!activeWorkspaceDetails) return null;

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsInviting(true);
    try {
      await api.post(`/workspaces/${activeWorkspaceDetails.id}/members`, {
        email: inviteEmail,
        role: 'DEVELOPER'
      });
      toast.success('Member invited successfully!');
      setInviteEmail('');
      await setActiveWorkspace(activeWorkspaceDetails.id);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to invite member');
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      await api.delete(`/workspaces/${activeWorkspaceDetails.id}/members/${memberId}`);
      toast.success('Member removed');
      await setActiveWorkspace(activeWorkspaceDetails.id);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to remove member');
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage settings and team members for {activeWorkspaceDetails.name}</p>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Workspace Details</CardTitle>
          <CardDescription>Update your workspace information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="space-y-2 max-w-md">
             <label className="text-sm font-medium">Workspace Name</label>
             <Input defaultValue={activeWorkspaceDetails.name} readOnly />
             <p className="text-xs text-muted-foreground">Name editing is disabled in this demo.</p>
           </div>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Manage who has access to this workspace</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleInvite} className="flex gap-2 max-w-md">
            <Input 
              placeholder="user@example.com" 
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              required
            />
            <Button type="submit" disabled={isInviting}>
              {isInviting ? 'Inviting...' : 'Invite'}
            </Button>
          </form>

          <div className="rounded-md border border-border bg-background/50">
            {activeWorkspaceDetails.members.map((member, index) => (
              <div 
                key={member.id} 
                className={`flex items-center justify-between p-4 ${index !== activeWorkspaceDetails.members.length - 1 ? 'border-b border-border' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-bold uppercase text-sm">
                    {member.user.email[0]}
                  </div>
                  <div>
                    <p className="font-medium leading-none mb-1">{member.user.fullName || member.user.email}</p>
                    <p className="text-sm text-muted-foreground">{member.user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-semibold uppercase bg-accent px-2 py-1 rounded-md">{member.role}</span>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleRemoveMember(member.user.id)}>
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
