import { Router } from 'express';
const router = Router();


import { updatePageUnitPrice,updatePageSizes, updateDefaultPrintConfig, updateNextLogDate, getPrinter, addPrinter, removePrinter, getPrinterList , getSystemConfig, getRoomList, getHistoryLog, resetHistory, index} from '../../controllers/web_controllers/SPSO.js';


// const spsoController = require('../../controllers/web_controllers/SPSO');
// Endpoint liên quan đến cấu hình
router.post('/updatePageUnitPrice', updatePageUnitPrice);
router.post('/updatePageSizes', updatePageSizes); //bug
router.post('/updateDefaultPrintConfig', updateDefaultPrintConfig); //bug
router.post('/updateNextLogDate', updateNextLogDate); //bug


// Endpoint liên quan đến máy in
router.get('/printer/:printerId', getPrinter);
router.post('/addPrinter', addPrinter);
router.delete('/removePrinter/:printerId', removePrinter);
router.get('/printerList', getPrinterList);


// Endpoint lấy cấu hình hệ thống BUG
router.get('/config', getSystemConfig);


// Endpoint liên quan đến phòng
router.get('/roomList', getRoomList);


// Endpoint liên quan đến lịch sử
router.get('/historyLog', getHistoryLog);
router.post('/resetHistory', resetHistory);//bug

router.get('/', index);

 
export default router;
