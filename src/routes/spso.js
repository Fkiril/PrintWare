const express = require('express');
const router = express.Router();
const spsoController = require('../controllers/SPSOController');
// Endpoint liên quan đến cấu hình : Chưa kịp check :((((
router.post('/updatePageUnitPrice', spsoController.updatePageUnitPrice);
router.post('/updatePageSizes', spsoController.updatePageSizes);
router.post('/updateDefaultPrintConfig', spsoController.updateDefaultPrintConfig);
router.post('/updateNextLogDate', spsoController.updateNextLogDate);

// Endpoint liên quan đến máy in
router.get('/printer/:printerId', spsoController.getPrinter); //Done
router.post('/addPrinter', spsoController.addPrinter);
router.delete('/removePrinter/:printerId', spsoController.removePrinter);
router.get('/printerList', spsoController.getPrinterList); //Done

// Endpoint liên quan đến phòng : Done
router.get('/roomList', spsoController.getRoomList);

// Endpoint liên quan đến lịch sử: Done
router.get('/historyLog', spsoController.getHistoryLog);

// Endpoint lấy cấu hình hệ thống : Done
router.get('/config', spsoController.getSystemConfig);

// Trang chào
router.get('/', spsoController.index);

module.exports = router;
