import { Router } from 'express';
import { 
  getCategories, 
  getCategory,
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../controllers/categories.controller';
import { authenticate, requireManager } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', getCategories);

// Manager-only routes
router.get('/:id', authenticate, requireManager, getCategory);
router.post('/', authenticate, requireManager, createCategory);
router.put('/:id', authenticate, requireManager, updateCategory);
router.delete('/:id', authenticate, requireManager, deleteCategory);

export default router;
