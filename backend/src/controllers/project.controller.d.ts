import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
export declare const createProject: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const updateProject: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const archiveProject: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const deleteProject: (req: AuthenticatedRequest, res: Response) => Promise<void>;
//# sourceMappingURL=project.controller.d.ts.map