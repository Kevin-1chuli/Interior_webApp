import { Router } from 'express';
import { 
  submitMessage, 
  submitDesignRequest, 
  getMessages, 
  getDesignRequests,
  markMessageRead,
  markDesignRequestRead,
  deleteMessage
} from '../controllers/contact.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/messages', submitMessage);
router.post('/design-requests', submitDesignRequest);

// Admin routes
router.get('/messages', authenticate, getMessages);
router.get('/design-requests', authenticate, getDesignRequests);
router.put('/messages/:id/read', authenticate, markMessageRead);
router.put('/design-requests/:id/read', authenticate, markDesignRequestRead);
router.delete('/messages/:id', authenticate, deleteMessage);

export default router;
