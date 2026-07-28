import { Response, NextFunction } from 'express';
import { WorkspaceRole } from '@prisma/client';
import { AuthenticatedRequest } from './auth.middleware';
export declare const checkWorkspaceRole: (allowedRoles: WorkspaceRole[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=workspace.middleware.d.ts.map