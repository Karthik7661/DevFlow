import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
export declare const getDashboardSummary: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getTeamProductivity: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const exportReport: (req: AuthenticatedRequest, res: Response) => Promise<void>;
//# sourceMappingURL=analytics.controller.d.ts.map