import { Router } from 'express';
import { login, createStaff, getStaff, deleteStaff, resetStaffPassword } from '../controllers/auth.controller';
import { authenticate, requireOwner } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/login', login);

// Protected routes (OWNER only)
router.post('/staff', authenticate, requireOwner, createStaff);
router.get('/staff', authenticate, requireOwner, getStaff);
router.put('/staff/:id/reset-password', authenticate, requireOwner, resetStaffPassword);
router.delete('/staff/:id', authenticate, requireOwner, deleteStaff);

export default router;
