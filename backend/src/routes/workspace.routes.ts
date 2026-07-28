import { Router } from 'express';
import { verifyToken } from '../middleware/auth.middleware';
import { checkWorkspaceRole } from '../middleware/workspace.middleware';
import { WorkspaceRole } from '@prisma/client';
import projectRoutes from './project.routes';
import analyticsRoutes from './analytics.routes';
import messageRoutes from './message.routes';
import { 
  createWorkspace, 
  getWorkspaces, 
  getWorkspaceDetails, 
  updateWorkspace, 
  deleteWorkspace,
  inviteMember,
  updateMemberRole,
  removeMember
} from '../controllers/workspace.controller';

const router = Router();

router.use(verifyToken as any);

router.post('/', createWorkspace as any);
router.get('/', getWorkspaces as any);

router.get('/:workspaceId', checkWorkspaceRole([]), getWorkspaceDetails as any);
router.put('/:workspaceId', checkWorkspaceRole([WorkspaceRole.ADMIN]), updateWorkspace as any);
router.delete('/:workspaceId', checkWorkspaceRole([WorkspaceRole.ADMIN]), deleteWorkspace as any);

// Member management
router.post('/:workspaceId/members', checkWorkspaceRole([WorkspaceRole.ADMIN, WorkspaceRole.MANAGER]), inviteMember as any);
router.put('/:workspaceId/members/:memberId', checkWorkspaceRole([WorkspaceRole.ADMIN]), updateMemberRole as any);
router.delete('/:workspaceId/members/:memberId', checkWorkspaceRole([]), removeMember as any); // empty [] so users can leave themselves

// Mount nested routes
router.use('/:workspaceId/projects', projectRoutes);
router.use('/:workspaceId/analytics', analyticsRoutes);
router.use('/:workspaceId/messages', messageRoutes);

export default router;
