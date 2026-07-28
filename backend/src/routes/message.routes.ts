import { Router } from 'express';
import { getMessages, sendMessage } from '../controllers/message.controller';
import { checkWorkspaceRole } from '../middleware/workspace.middleware';
import { WorkspaceRole } from '@prisma/client';

const router = Router({ mergeParams: true });

// All routes here will have workspaceId from the parent router due to mergeParams: true
router.get('/', checkWorkspaceRole([]), getMessages as any);
router.post('/', checkWorkspaceRole([]), sendMessage as any);

export default router;
