import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
export declare const register: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const login: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getMe: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const updateProfile: (req: AuthenticatedRequest, res: Response) => Promise<void>;
//# sourceMappingURL=auth.controller.d.ts.map