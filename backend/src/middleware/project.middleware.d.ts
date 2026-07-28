import { Response, NextFunction } from 'express';
import { WorkspaceRole } from '@prisma/client';
import { AuthenticatedRequest } from './auth.middleware';
export declare const checkProjectAccess: (allowedRoles: WorkspaceRole[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=project.middleware.d.ts.map