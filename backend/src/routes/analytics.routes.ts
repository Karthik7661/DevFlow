import { Router } from 'express';
import { verifyToken } from '../middleware/auth.middleware';
import { checkWorkspaceRole } from '../middleware/workspace.middleware';
import { WorkspaceRole } from '@prisma/client';
import { getDashboardSummary, getTeamProductivity, exportReport } from '../controllers/analytics.controller';

const router = Router({ mergeParams: true });

router.use(verifyToken as any);

router.get('/summary', checkWorkspaceRole([WorkspaceRole.ADMIN, WorkspaceRole.MANAGER]), getDashboardSummary as any);
router.get('/productivity', checkWorkspaceRole([WorkspaceRole.ADMIN, WorkspaceRole.MANAGER]), getTeamProductivity as any);
router.get('/export', checkWorkspaceRole([WorkspaceRole.ADMIN, WorkspaceRole.MANAGER]), exportReport as any);

export default router;
