import { Router } from 'express';
const router = Router();
import { getDashboard, getSampleData } from '../../controllers/web_controllers/WebController.js';

router.get('/dashboard', getDashboard);

router.get('/sample-data', getSampleData);

export default router;
