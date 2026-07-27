import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
export declare const createSprint: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getSprints: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const updateSprint: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const deleteSprint: (req: AuthenticatedRequest, res: Response) => Promise<void>;
//# sourceMappingURL=sprint.controller.d.ts.map