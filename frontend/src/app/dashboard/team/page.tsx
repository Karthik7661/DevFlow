'use client';

import { useState } from 'react';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import { UserPlus, MoreVertical, Trash2, Shield, User } from 'lucide-react';

export default function TeamPage() {
  const { activeWorkspaceDetails, inviteMember, updateMemberRole, removeMember } = useWorkspaceStore();
  const { user } = useAuthStore();
  
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('DEVELOPER');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState('');

  if (!activeWorkspaceDetails) {
    return <div className="p-8 text-center text-muted-foreground">Loading workspace details...</div>;
  }

  const members = activeWorkspaceDetails.members;
  const currentMember = members.find(m => m.userId === user?.uid);
  const isAdminOrManager = currentMember?.role === 'ADMIN' || currentMember?.role === 'MANAGER';

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError('');
    setInviteLoading(true);
    try {
      await inviteMember(inviteEmail, inviteRole);
      setIsInviteOpen(false);
      setInviteEmail('');
      setInviteRole('DEVELOPER');
    } catch (err: any) {
      setInviteError(err.response?.data?.message || 'Failed to invite user');
    } finally {
      setInviteLoading(false);
    }
  };

  const handleRemove = async (memberId: string) => {
    if (confirm('Are you sure you want to remove this member?')) {
      try {
        await removeMember(memberId);
      } catch (err) {
        console.error('Failed to remove member', err);
      }
    }
  };

  const handleRoleChange = async (memberId: string, role: string) => {
    try {
      await updateMemberRole(memberId, role);
    } catch (err) {
      console.error('Failed to update role', err);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Team Members</h2>
          <p className="text-muted-foreground">Manage your team members and their roles for this workspace.</p>
        </div>
        
        {isAdminOrManager && (
          <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleInvite} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input 
                    type="email" 
                    placeholder="colleague@example.com" 
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                  >
                    <option value="DEVELOPER">Developer</option>
                    <option value="MANAGER">Manager</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                {inviteError && <p className="text-sm text-red-500">{inviteError}</p>}
                <div className="flex justify-end gap-2 mt-6">
                  <Button type="button" variant="outline" onClick={() => setIsInviteOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={inviteLoading}>
                    {inviteLoading ? 'Inviting...' : 'Send Invite'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-4">
        {members.map((member) => (
          <Card key={member.id} className="overflow-hidden">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                  {member.user.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium flex items-center gap-2">
                    {member.user.fullName}
                    {member.userId === user?.uid && (
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">You</span>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">{member.user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-md">
                  {member.role === 'ADMIN' && <Shield className="h-3.5 w-3.5 text-purple-500" />}
                  {member.role === 'MANAGER' && <Shield className="h-3.5 w-3.5 text-blue-500" />}
                  {member.role === 'DEVELOPER' && <User className="h-3.5 w-3.5" />}
                  <span className="font-medium capitalize">{member.role.toLowerCase()}</span>
                </div>

                {isAdminOrManager && member.userId !== user?.uid && (
                  <div className="flex items-center gap-2">
                    {currentMember?.role === 'ADMIN' && (
                      <select 
                        className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                        value={member.role}
                        onChange={(e) => handleRoleChange(member.userId, e.target.value)}
                      >
                        <option value="DEVELOPER">Developer</option>
                        <option value="MANAGER">Manager</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                      onClick={() => handleRemove(member.userId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
