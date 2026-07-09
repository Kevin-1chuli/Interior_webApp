import { Router } from 'express';
import { 
  getCategories, 
  getCategory,
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../controllers/categories.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', getCategories);

// Admin routes (protected)
router.get('/:id', authenticate, getCategory);
router.post('/', authenticate, createCategory);
router.put('/:id', authenticate, updateCategory);
router.delete('/:id', authenticate, deleteCategory);

export default router;
