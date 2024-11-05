import { Router } from 'express';
const router = Router();
import { webAuth } from '../services/firebase.js';

router.post('/login', async (req, res) => {
    console.log('Login request: ', req.body);
    const { email, password } = req.body;

    try {
        const user = await webAuth.getUserByEmail(email);
        console.log('User found: ', user.uid);

        const userRecord = await webAuth.getUser(user.uid);
        if (userRecord) {
            console.log('User record found: ', userRecord.toJSON());
        }

        const customToken = await webAuth.createCustomToken(user.uid);
        res.status(200).json({ token: customToken });
    } catch (error) {
        res.status(401).json({ message: 'Invalid login credentials', error: error.message });
        console.error('Error logging in:', error);
    }
});

export default router;
