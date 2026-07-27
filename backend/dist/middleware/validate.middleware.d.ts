import { Request, Response, NextFunction } from 'express';
import { ZodObject } from 'zod';
export declare const validateRequest: (schema: ZodObject<any, any>) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=validate.middleware.d.ts.map