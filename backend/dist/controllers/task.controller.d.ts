import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
export declare const createTask: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getTasks: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const updateTask: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const addComment: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const deleteTask: (req: AuthenticatedRequest, res: Response) => Promise<void>;
//# sourceMappingURL=task.controller.d.ts.map