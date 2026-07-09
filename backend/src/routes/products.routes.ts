import { Router } from 'express';
import { getProducts, createProduct, deleteProduct, updateProduct, getProductById } from '../controllers/products.controller';
import { authenticate } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', authenticate, upload.array('images', 10), createProduct);
router.put('/:id', authenticate, upload.array('images', 10), updateProduct);
router.delete('/:id', authenticate, deleteProduct);

export default router;
