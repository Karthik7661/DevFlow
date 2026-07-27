import { Response, NextFunction } from 'express';
import { PrismaClient, WorkspaceRole } from '@prisma/client';
import { AuthenticatedRequest } from './auth.middleware';

const prisma = new PrismaClient();

export const checkWorkspaceRole = (allowedRoles: WorkspaceRole[]) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const uid = req.user?.uid;
      const { workspaceId } = req.params;

      if (!uid || !workspaceId) {
        res.status(400).json({ message: 'Missing user or workspace context' });
        return;
      }

      const membership = await prisma.workspaceMember.findUnique({
        where: {
          workspaceId_userId: {
            workspaceId,
            userId: uid,
          },
        },
      });

      if (!membership) {
        res.status(403).json({ message: 'Forbidden: Not a member of this workspace' });
        return;
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(membership.role as WorkspaceRole)) {
        res.status(403).json({ message: 'Forbidden: Insufficient permissions in workspace' });
        return;
      }

      next();
    } catch (error) {
      console.error('Workspace permission check failed:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
};
