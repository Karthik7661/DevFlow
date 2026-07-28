'use client';

import { useState } from 'react';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import { UserPlus, MoreVertical, Trash2, Shield, User, Activity, CheckCircle2, Clock } from 'lucide-react';

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
    <div className="p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-background/50 backdrop-blur-md p-6 rounded-xl border border-border">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Team Members</h2>
          <p className="text-muted-foreground mt-1 text-sm">Manage your team members and their roles for this workspace.</p>
        </div>
        
        {isAdminOrManager && (
          <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
            <DialogTrigger asChild>
              <Button className="shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5">
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent className="glass">
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
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
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
                  <Button type="button" variant="ghost" onClick={() => setIsInviteOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={inviteLoading}>
                    {inviteLoading ? 'Inviting...' : 'Send Invite'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <Card key={member.id} className="overflow-hidden glass hover:bg-accent/20 transition-all duration-300 border-border/50 hover:border-primary/30 flex flex-col group">
            <div className="p-6 flex flex-col flex-1 relative">
              
              {/* Top right actions */}
              {isAdminOrManager && member.userId !== user?.uid && (
                <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                    onClick={() => handleRemove(member.userId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <div className="flex items-start gap-4 mb-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border border-primary/20 shrink-0">
                  {member.user.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0 pr-8">
                  <p className="font-semibold text-lg flex items-center gap-2 truncate">
                    {member.user.fullName}
                    {member.userId === user?.uid && (
                      <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">You</span>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">{member.user.email}</p>
                </div>
              </div>

              {/* Role Selection */}
              <div className="mb-6">
                {currentMember?.role === 'ADMIN' && member.userId !== user?.uid ? (
                  <select 
                    className={`h-8 rounded-md border text-xs font-semibold px-2 py-1 uppercase tracking-wider w-full ${member.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' : member.role === 'MANAGER' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-muted text-muted-foreground border-border'}`}
                    value={member.role}
                    onChange={(e) => handleRoleChange(member.userId, e.target.value)}
                  >
                    <option value="DEVELOPER">Developer</option>
                    <option value="MANAGER">Manager</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                ) : (
                  <div className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-md border ${member.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' : member.role === 'MANAGER' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-muted text-muted-foreground border-border'}`}>
                    {member.role === 'ADMIN' && <Shield className="h-3 w-3" />}
                    {member.role === 'MANAGER' && <Shield className="h-3 w-3" />}
                    {member.role === 'DEVELOPER' && <User className="h-3 w-3" />}
                    <span>{member.role}</span>
                  </div>
                )}
              </div>
              
              {/* Metrics */}
              <div className="mt-auto grid grid-cols-3 gap-2 bg-background/50 rounded-lg p-3 border border-border">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-500/10 text-blue-500 mb-1">
                    <Activity className="h-4 w-4" />
                  </div>
                  <span className="text-xl font-bold">{member.metrics?.totalTasks || 0}</span>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground">Assigned</span>
                </div>
                
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-500/10 text-green-500 mb-1">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <span className="text-xl font-bold">{member.metrics?.completedTasks || 0}</span>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground">Done</span>
                </div>

                <div className="flex flex-col items-center justify-center text-center">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-orange-500/10 text-orange-500 mb-1">
                    <Clock className="h-4 w-4" />
                  </div>
                  <span className="text-xl font-bold">{member.metrics?.inProgressTasks || 0}</span>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground">Active</span>
                </div>
              </div>

            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
