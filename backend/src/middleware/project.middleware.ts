import { Response, NextFunction } from 'express';
import { PrismaClient, WorkspaceRole } from '@prisma/client';
import { AuthenticatedRequest } from './auth.middleware';

const prisma = new PrismaClient();

export const checkProjectAccess = (allowedRoles: WorkspaceRole[]) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const uid = req.user?.uid;
      const { projectId } = req.params;

      if (!uid || !projectId) {
        res.status(400).json({ message: 'Missing user or project context' });
        return;
      }

      const project = await prisma.project.findUnique({
        where: { id: projectId as string }
      });

      if (!project) {
        res.status(404).json({ message: 'Project not found' });
        return;
      }

      const membership = await prisma.workspaceMember.findUnique({
        where: {
          workspaceId_userId: {
            workspaceId: project.workspaceId,
            userId: uid,
          },
        },
      });

      if (!membership) {
        res.status(403).json({ message: 'Forbidden' });
        return;
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(membership.role as WorkspaceRole)) {
        res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
        return;
      }

      next();
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };
};
