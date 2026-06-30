import { Router } from 'express';
import { login, createStaff, getStaff, deleteStaff, requestPasswordReset, resetPassword } from '../controllers/auth.controller';
import { authenticate, requireOwner } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/login', login);
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);

// Protected routes (OWNER only)
router.post('/staff', authenticate, requireOwner, createStaff);
router.get('/staff', authenticate, requireOwner, getStaff);
router.delete('/staff/:id', authenticate, requireOwner, deleteStaff);

export default router;
