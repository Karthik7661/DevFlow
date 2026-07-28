import { Router } from 'express';
import { verifyToken } from '../middleware/auth.middleware';
import { 
  getNotifications, 
  markAsRead, 
  markAllAsRead 
} from '../controllers/notification.controller';

const router = Router();

router.use(verifyToken as any);

router.get('/', getNotifications as any);
router.put('/read-all', markAllAsRead as any);
router.put('/:notificationId/read', markAsRead as any);

export default router;
