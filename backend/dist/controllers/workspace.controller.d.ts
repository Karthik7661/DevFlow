import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
export declare const createWorkspace: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getWorkspaces: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getWorkspaceDetails: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const updateWorkspace: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const deleteWorkspace: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const inviteMember: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const updateMemberRole: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const removeMember: (req: AuthenticatedRequest, res: Response) => Promise<void>;
//# sourceMappingURL=workspace.controller.d.ts.map