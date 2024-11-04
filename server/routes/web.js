import { Router } from 'express';
const router = Router();
import { getHomePage, getDashboard } from '../controllers/webController.js';

router.get('/', getHomePage);
router.get('/dashboard', getDashboard);

export default router;
