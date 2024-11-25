const SystemConfig = require('../models/SystemConfig');
const SPSO = require('../models/SPSO');
const HistoryLog = require('../models/HistoryLog');
const db = require("../firebase")

 const spso = new SPSO();
class SPSOController {
    // Trang chào
    index(req, res) {
        res.send('Xin chào! Đây là hệ thống quản lý SPSO.');
    }

    async updatePageUnitPrice(req, res) { 
        const { pageUnitPrice } = req.body; 
        if (!pageUnitPrice) 
            { return res.status(400).send('Missing required field: pageUnitPrice'); } 
        try { const success = await spso.updatePageUnitPrice(pageUnitPrice); 
            if (success) { res.status(200).send('Page unit price updated successfully'); }
            else { res.status(500).send('Failed to update page unit price'); } } 
            catch (error) { console.error('Error updating page unit price:', error); 
                res.status(500).send('Error updating page unit price'); } }
    // Cập nhật kích thước trang
    async updatePageSizes(req, res) {
        const { sizes } = req.body;
        try {
            const success = await spso.updatePageSizes(sizes);
            res.json({ success });
        } catch (error) {
            console.error('Lỗi khi cập nhật kích thước trang:', error);
            res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật kích thước trang', error: error.message });
        }
    }

    // Cập nhật cấu hình in mặc định
    async updateDefaultPrintConfig(req, res) {
        const { config } = req.body;
        try {
            const success = await spso.updateDefaultPrintConfig(config);
            res.json({ success });
        } catch (error) {
            console.error('Lỗi khi cập nhật cấu hình in mặc định:', error);
            res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật cấu hình in mặc định', error: error.message });
        }
    }

    // Cập nhật ngày ghi nhật ký tiếp theo
    async updateNextLogDate(req, res) {
        const { date } = req.body;
        try {
            const success = await spso.updateNextLogDate(new Date(date));
            res.json({ success });
        } catch (error) {
            console.error('Lỗi khi cập nhật ngày ghi nhật ký tiếp theo:', error);
            res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật ngày ghi nhật ký tiếp theo', error: error.message });
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

    // Lấy cấu hình hệ thống
    async getSystemConfig(req, res) {
        try {
            const config = await spso.getSystemConfig();
            if (!config) {
                return res.status(404).json({ message: 'Không tìm thấy cấu hình hệ thống' });
            }
            res.json(config);
        } catch (error) {
            console.error('Lỗi khi lấy cấu hình hệ thống:', error);
            res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy cấu hình hệ thống', error: error.message });
        }
    }
}
module.exports = new SPSOController();
