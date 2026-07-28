import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';

export const validateRequest = (schema: ZodObject<any, any>) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.issues || (error as any).errors || [];
        res.status(400).json({
          message: 'Validation failed',
          errors: issues.map((e: any) => ({ path: e.path.join('.'), message: e.message }))
        });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  };
};
