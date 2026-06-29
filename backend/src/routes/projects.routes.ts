import { Router } from 'express';
import { getProjects, createProject } from '../controllers/projects.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getProjects);
router.post('/', authenticate, createProject);

export default router;
