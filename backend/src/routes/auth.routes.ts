import { Router } from 'express';
import { login, createStaff, getStaff, deleteStaff, resetStaffPassword } from '../controllers/auth.controller';
import { authenticate, requireManager } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/login', login);

// Protected routes (MANAGER only)
router.post('/staff', authenticate, requireManager, createStaff);
router.get('/staff', authenticate, requireManager, getStaff);
router.put('/staff/:id/reset-password', authenticate, requireManager, resetStaffPassword);
router.delete('/staff/:id', authenticate, requireManager, deleteStaff);

export default router;
