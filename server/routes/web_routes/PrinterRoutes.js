import express from 'express';
const router = express.Router();

import { updatePrinterInfo, takeDocList, addTask, removeTask, sortTasks } from '../../controllers/web_controllers/PrinterController.js';

router.put('/printer/:printerId', updatePrinterInfo);
router.get('/printer/:printerId/doc-list', takeDocList);
router.post('/printer/:printerId/task', addTask);
router.delete('/printer/:printerId/task/:taskId', removeTask);
router.put('/printer/:printerId/sort-tasks', sortTasks);

export default router;
