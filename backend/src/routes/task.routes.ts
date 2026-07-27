import { Router } from 'express';
import { verifyToken } from '../middleware/auth.middleware';
import { checkProjectAccess } from '../middleware/project.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { createTaskSchema, updateTaskSchema } from '../schemas/task.schema';
import { 
  createTask, 
  getTasks, 
  updateTask,
  deleteTask,
  addComment 
} from '../controllers/task.controller';

const router = Router({ mergeParams: true });

router.use(verifyToken as any);

router.get('/', checkProjectAccess([]), getTasks as any);
router.post('/', checkProjectAccess([]), validateRequest(createTaskSchema), createTask as any);
router.put('/:taskId', checkProjectAccess([]), validateRequest(updateTaskSchema), updateTask as any);
router.delete('/:taskId', checkProjectAccess([]), deleteTask as any);
router.post('/:taskId/comments', checkProjectAccess([]), addComment as any);

export default router;
