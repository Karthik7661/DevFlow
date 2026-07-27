import { Router } from 'express';
import { register, login, getMe, updateProfile } from '../controllers/auth.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

// Registration endpoint: verify Firebase token, create MySQL record
router.post('/register', verifyToken as any, register as any);

// Login endpoint: verify Firebase token, update lastLogin timestamp
router.post('/login', verifyToken as any, login as any);

// Profile endpoints
router.get('/me', verifyToken as any, getMe as any);
router.put('/profile', verifyToken as any, updateProfile as any);

export default router;
