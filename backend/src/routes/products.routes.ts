import { Router } from 'express';
import { getProducts, createProduct, deleteProduct } from '../controllers/products.controller';
import { authenticate } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.get('/', getProducts);
router.post('/', authenticate, upload.array('images', 10), createProduct);
router.delete('/:id', authenticate, deleteProduct);

export default router;
