// const SystemConfig = require('../../models/SystemConfig').default;
// const SPSO = require('../../models/SPSO');
// const HistoryLog = require('../../models/HistoryLog').default;
import { firestore } from '../../services/FirebaseAdminSDK.js';

import SystemConfig from '../../models/SystemConfig.js';
import SPSO from '../../models/SPSO.js';
import HistoryLog from '../../models/HistoryLog.js';

const spso = new SPSO();
class SPSOController {
    // Trang chào
    index(req, res) {
        res.send('Xin chào! Đây là hệ thống quản lý SPSO.');
    }
    async updatePageUnitPrice(req, res) {
        const { configId, pageUnitPrice } = req.body;
    
        if (!configId || !pageUnitPrice) {
            return res.status(400).json({ message: 'Thiếu thông tin configId hoặc pageUnitPrice' });
        }
    
        try {
            // Lấy dữ liệu hiện tại từ Firestore
            const systemConfig = await SystemConfig.getConfigById(configId, firestore);
    
            // Cập nhật giá trị pageUnitPrice
            const success = await systemConfig.updatePageUnitPrice(pageUnitPrice, firestore, configId);
    
            if (success) {
                return res.status(200).json({ message: 'Cập nhật pageUnitPrice thành công' });
            } else {
                return res.status(500).json({ message: 'Cập nhật pageUnitPrice thất bại' });
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật pageUnitPrice:', error.message);
            return res.status(500).json({
                message: 'Đã xảy ra lỗi khi cập nhật pageUnitPrice',
                error: error.message,
            });
        }
    }
    
    async updatePageSizes(req, res) {
        const { configId, pageSizes } = req.body;
    
        if (!configId || !Array.isArray(pageSizes)) {
            return res.status(400).json({ message: 'Thiếu thông tin configId hoặc pageSizes không hợp lệ' });
        }
    
        try {
            // Lấy tài liệu Firestore tương ứng
            const ref = firestore.collection('SystemConfig').doc(configId);
    
            // Kiểm tra nếu tài liệu tồn tại
            const doc = await ref.get();
            if (!doc.exists) {
                return res.status(404).json({ message: `Không tìm thấy cấu hình với id: ${configId}` });
            }
    
            // Ghi đè giá trị mới của pageSizes
            await ref.update({
                pageSizes: pageSizes,
            });
    
            return res.status(200).json({ message: 'Cập nhật pageSizes thành công' });
        } catch (error) {
            console.error('Lỗi khi cập nhật pageSizes:', error.message);
            return res.status(500).json({
                message: 'Đã xảy ra lỗi khi cập nhật pageSizes',
                error: error.message,
            });
        }
    }
    
    async updateDefaultPrintConfig(req, res) {
        const { configId, defaultPrintConfig } = req.body;
    
        if (!configId || typeof defaultPrintConfig !== 'object') {
            return res.status(400).json({ message: 'Thiếu thông tin configId hoặc defaultPrintConfig không hợp lệ' });
        }
    
        try {
            // Lấy tài liệu Firestore tương ứng
            const ref = firestore.collection('SystemConfig').doc(configId);
    
            // Kiểm tra nếu tài liệu tồn tại
            const doc = await ref.get();
            if (!doc.exists) {
                return res.status(404).json({ message: `Không tìm thấy cấu hình với id: ${configId}` });
            }
    
            // Ghi đè giá trị mới của defaultPrintConfig
            await ref.update({
                defaultPrintConfig: defaultPrintConfig,
            });
    
            return res.status(200).json({ message: 'Cập nhật defaultPrintConfig thành công' });
        } catch (error) {
            console.error('Lỗi khi cập nhật defaultPrintConfig:', error.message);
            return res.status(500).json({
                message: 'Đã xảy ra lỗi khi cập nhật defaultPrintConfig',
                error: error.message,
            });
        }
    }
    
    async updateNextLogDate(req, res) {
        const { configId, nextLogDate } = req.body;
    
        if (!configId || !nextLogDate) {
            return res.status(400).json({ message: 'Thiếu thông tin configId hoặc nextLogDate' });
        }
    
        try {
            const parsedDate = new Date(nextLogDate);
            if (isNaN(parsedDate.getTime())) {
                return res.status(400).json({ message: 'nextLogDate không hợp lệ' });
            }
    
            // Lấy tài liệu Firestore tương ứng
            const ref = firestore.collection('SystemConfig').doc(configId);
    
            // Kiểm tra nếu tài liệu tồn tại
            const doc = await ref.get();
            if (!doc.exists) {
                return res.status(404).json({ message: `Không tìm thấy cấu hình với id: ${configId}` });
            }
    
            // Ghi đè giá trị mới của nextLogDate
            await ref.update({
                nextLogDate: parsedDate,
            });
    
            return res.status(200).json({ message: 'Cập nhật nextLogDate thành công' });
        } catch (error) {
            console.error('Lỗi khi cập nhật nextLogDate:', error.message);
            return res.status(500).json({
                message: 'Đã xảy ra lỗi khi cập nhật nextLogDate',
                error: error.message,
            });
        }
    }

    // Lấy thông tin máy in
    async getPrinter(req, res) {
        try {
            await spso.getPrinter(req, res);
        } catch (error) {
            console.error('Lỗi khi lấy thông tin máy in:', error);
            res.status(500).json({ message: 'Đã xảy ra lỗi khi truy xuất máy in', error: error.message });
        }
    }

    // Thêm máy in mới
    async addPrinter(req, res) {
        try {
            await spso.addPrinter(req, res);
        } catch (error) {
            console.error('Lỗi khi thêm máy in:', error);
            res.status(500).json({ message: 'Đã xảy ra lỗi khi thêm máy in', error: error.message });
        }
    }

    // Xóa máy in
    async removePrinter(req, res) {
        try {
            await spso.removePrinter(req, res);
        } catch (error) {
            console.error('Lỗi khi xóa máy in:', error);
            res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa máy in', error: error.message });
        }
    }

    // Lấy danh sách máy in
    async getPrinterList(req, res) {
        try {
            const printers = await spso.getPrinterList();
            res.json(printers);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách máy in:', error);
            res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách máy in', error: error.message });
        }
    }

    // Lấy danh sách phòng
    async getRoomList(req, res) {
        try {
            const rooms = await spso.getRoomList();
            res.json(rooms);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách phòng:', error);
            res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách phòng', error: error.message });
        }
    }

    // Ghi lịch sử
    async logHistory(req, res) {
        const { entry } = req.body;
        try {
            const success = await spso.logHistory(entry);
            res.json({ success });
        } catch (error) {
            console.error('Lỗi khi ghi lịch sử:', error);
            res.status(500).json({ message: 'Đã xảy ra lỗi khi ghi lịch sử', error: error.message });
        }
    }

    // Lấy lịch sử
    async getHistoryLog(req, res) {
        try {
            const history = await spso.fetchHistory();
            res.json(history);
        } catch (error) {
            console.error('Lỗi khi lấy lịch sử:', error);
            res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy lịch sử', error: error.message });
        }
    }
    //xóa lịch sử
    async resetHistory(req, res) {
        try {
            const historyLogCollection = firestore.collection('HistoryLog');

            // Lấy tất cả các document trong collection
            const snapshot = await historyLogCollection.get();

            // Nếu không có dữ liệu, trả về thông báo
            if (snapshot.empty) {
                return res.status(200).json({ message: 'Không có lịch sử để xóa.' });
            }

            // Xóa từng document trong collection
            const batch = firestore.batch();
            snapshot.docs.forEach((doc) => {
                batch.delete(doc.ref);
            });

            // Thực hiện xóa batch
            await batch.commit();

            res.status(200).json({ message: 'Lịch sử trong HistoryLog đã được xóa thành công.' });
        } catch (error) {
            console.error('Lỗi khi reset lịch sử:', error.message);
            res.status(500).json({
                message: 'Lỗi khi xóa lịch sử trong HistoryLog',
                error: error.message,
            });
        }
    }
    //Lấy cấu hình hệ thống
    async getSystemConfig(req, res) {
        try {
            const snapshot = await firestore.collection('SystemConfig').get();
            const configs = snapshot.docs.map((doc) => {
                const data = doc.data();
    
                // Chuyển đổi nextLogDate từ Firestore timestamp sang ISO string
                if (data.nextLogDate && data.nextLogDate._seconds) {
                    data.nextLogDate = new Date(data.nextLogDate._seconds * 1000).toISOString();
                }
    
                return {
                    id: doc.id,
                    ...data,
                };
            });
    
            res.status(200).json(configs);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách cấu hình:', error.message);
            res.status(500).json({
                message: 'Không thể lấy danh sách cấu hình',
                error: error.message,
            });
        }
    }
    
}
export const spsoController = new SPSOController();