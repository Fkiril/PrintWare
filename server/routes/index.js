import { Router } from 'express';
const router = Router();
import { index } from '../controllers/homeController.js';

router.get('/', index);

export default router;
