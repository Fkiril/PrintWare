import { Router } from 'express';
const router = Router();

import PaymentController from '../../controllers/web_controllers/PaymentController.js';
const paymentController = new PaymentController();

router.post('/create-wallet', (req, res) => {
    try {
        const { ownerId } = req.body;
        const wallet = paymentController.createWallet(ownerId);
        res.status(201).json(wallet);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/deposit', (req, res) => {
    try {
        const {ownerId, amount} = req.body;
        const wallet = paymentController.deposit(ownerId, amount);
        res.status(200).json(wallet);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

router.post('/pay-for-print', (req, res) => {
    try {
        const {ownerId, document, charge} = req.body;
        const payment = paymentController.payForPrint(ownerId, document, charge);
        res.status(200).json(payment);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

router.get('/history/:ownerId', (req, res) => {
    try {
        const {ownerId} = req.params;
        const history = paymentController.logHistoryPayment(ownerId);
        res.status(200).json(history);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

export default router;