import { Router } from 'express';
import { verifyToken } from '../middleware/auth.middleware';
import { checkProjectAccess } from '../middleware/project.middleware';
import { WorkspaceRole } from '@prisma/client';
import { 
  createSprint, 
  getSprints, 
  updateSprint, 
  deleteSprint 
} from '../controllers/sprint.controller';

const router = Router({ mergeParams: true });

router.use(verifyToken as any);

router.post('/', checkProjectAccess([WorkspaceRole.ADMIN, WorkspaceRole.MANAGER]), createSprint as any);
router.get('/', checkProjectAccess([]), getSprints as any);
router.put('/:sprintId', checkProjectAccess([WorkspaceRole.ADMIN, WorkspaceRole.MANAGER]), updateSprint as any);
router.delete('/:sprintId', checkProjectAccess([WorkspaceRole.ADMIN, WorkspaceRole.MANAGER]), deleteSprint as any);

export default router;
