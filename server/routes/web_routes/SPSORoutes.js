import { Router } from 'express';
const router = Router();

import { spsoController } from '../../controllers/web_controllers/SPSO.js';

// const spsoController = require('../../controllers/web_controllers/SPSO');
// Endpoint liên quan đến cấu hình : Chưa kịp check :((((
router.post('/updatePageUnitPrice', spsoController.updatePageUnitPrice); //done
router.post('/updatePageSizes', spsoController.updatePageSizes); //done
router.post('/updateDefaultPrintConfig', spsoController.updateDefaultPrintConfig); //done
router.post('/updateNextLogDate', spsoController.updateNextLogDate); //done

// Endpoint liên quan đến máy in
router.get('/printer/:printerId', spsoController.getPrinter); //Done
router.post('/addPrinter', spsoController.addPrinter);//done
router.delete('/removePrinter/:printerId', spsoController.removePrinter);//Done
router.get('/printerList', spsoController.getPrinterList); //Done

// Endpoint liên quan đến phòng : Done
router.get('/roomList', spsoController.getRoomList);

// Endpoint liên quan đến lịch sử: Done
router.get('/historyLog', spsoController.getHistoryLog);
router.post('/resetHistory', spsoController.resetHistory);

// Endpoint lấy cấu hình hệ thống : Done
router.get('/config', spsoController.getSystemConfig);

// Trang chào
router.get('/', spsoController.index);

export default router;