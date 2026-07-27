import { Router } from 'express';
import { verifyToken } from '../middleware/auth.middleware';
import { checkWorkspaceRole } from '../middleware/workspace.middleware';
import { WorkspaceRole } from '@prisma/client';
import { 
  createProject, 
  updateProject, 
  archiveProject, 
  deleteProject 
} from '../controllers/project.controller';

const router = Router({ mergeParams: true });

router.use(verifyToken as any);

// /api/workspaces/:workspaceId/projects
router.post('/', checkWorkspaceRole([WorkspaceRole.ADMIN, WorkspaceRole.MANAGER, WorkspaceRole.DEVELOPER]), createProject as any);
router.put('/:projectId', checkWorkspaceRole([WorkspaceRole.ADMIN, WorkspaceRole.MANAGER, WorkspaceRole.DEVELOPER]), updateProject as any);
router.put('/:projectId/archive', checkWorkspaceRole([WorkspaceRole.ADMIN, WorkspaceRole.MANAGER]), archiveProject as any);
router.delete('/:projectId', checkWorkspaceRole([WorkspaceRole.ADMIN, WorkspaceRole.MANAGER]), deleteProject as any);

export default router;
