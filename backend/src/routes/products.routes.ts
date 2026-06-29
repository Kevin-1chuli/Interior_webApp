import { Router } from 'express';
import { getProducts, createProduct } from '../controllers/products.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getProducts);
router.post('/', authenticate, createProduct);

export default router;
