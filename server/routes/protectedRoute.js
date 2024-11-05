import { Router } from 'express';
const router = Router();
import authenticate from '../middleware/authenticate.js';

router.get('/protected', authenticate, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

export default router;
