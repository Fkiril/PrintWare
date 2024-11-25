const SystemConfig = require('./SystemConfig');
const db = require('../firebase');

class SPSO {
    constructor() {
        this.systemConfig = new SystemConfig();
        this.history = [];
        this.printers = [];
        this.rooms = [];
    }

    // Lấy cấu hình hệ thống từ Firebase
    async getSystemConfig() {
        try {
            const doc = await db.collection('SystemConfig').doc('config1').get();
            if (doc.exists) {
                this.systemConfig.setInfoFromJson(doc.data());
                return this.systemConfig;
            } else {
                throw new Error('Không tìm thấy cấu hình hệ thống');
            }
        } catch (error) {
            console.error('Lỗi khi lấy SystemConfig:', error);
            return null;
        }
    }

    // Cập nhật giá mỗi trang
    // async updatePageUnitPrice(price) {
    //     try {
    //         const ref = db.collection('SystemConfig').doc('config1');
    //         await ref.update({ pageUnitPrice: price });
    //         this.systemConfig.pageUnitPrice = price;
    //         return true;
    //     } catch (error) {
    //         console.error('Lỗi khi cập nhật giá mỗi trang:', error);
    //         return false;
    //     }
    // }
   
    

    // Cập nhật kích thước trang
    async updatePageSizes(sizes) {
        try {
            const ref = db.collection('SystemConfig').doc('config1');
            await ref.update({ pageSizes: sizes });
            this.systemConfig.pageSizes = sizes;
            return true;
        } catch (error) {
            console.error('Lỗi khi cập nhật kích thước trang:', error);
            return false;
        }
    }
    async updatePageUnitPrice(price) { 
        try { const ref = db.collection('SystemConfig').doc('config1'); 
            await ref.update({ pageUnitPrice: price }); 
            this.systemConfig.pageUnitPrice = price; // Lưu lịch sử thay đổi giá vào Firebase 
    const historyRef = db.collection('HistoryLog'); 
    await historyRef.add({ action: 'Update Page Unit Price', details: `Updated page unit price to ${price}`, timestamp: new Date() }); return true; } 
    catch (error) { console.error('Lỗi khi cập nhật giá mỗi trang:', error); return false; } }
    // Cập nhật cấu hình in mặc định
    async updateDefaultPrintConfig(config) {
        try {
            const ref = db.collection('SystemConfig').doc('config1');
            await ref.update({ defaultPrintConfig: config });
            this.systemConfig.defaultPrintConfig = config;
            return true;
        } catch (error) {
            console.error('Lỗi khi cập nhật cấu hình in mặc định:', error);
            return false;
        }
    }

    // Cập nhật ngày ghi nhật ký tiếp theo
    async updateNextLogDate(date) {
        try {
            const ref = db.collection('SystemConfig').doc('config1');
            await ref.update({ nextLogDate: date });
            this.systemConfig.nextLogDate = new Date(date);
            return true;
        } catch (error) {
            console.error('Lỗi khi cập nhật ngày ghi nhật ký tiếp theo:', error);
            return false;
        }
    }
    // Lấy thông tin một máy in dựa trên printerId
    async getPrinter(req, res) {
        const { printerId } = req.params;

        try {
            const doc = await db.collection('Printers').doc(printerId).get();

            if (!doc.exists) {
                return res.status(404).json({ message: 'Máy in không tồn tại' });
            }

            res.json({ id: doc.id, ...doc.data() });
        } catch (error) {
            console.error('Lỗi khi lấy thông tin máy in:', error);
            res.status(500).json({
                message: 'Đã xảy ra lỗi khi truy xuất thông tin máy in',
                error: error.message,
            });
        }
    }


    // Lấy danh sách máy in từ Firebase
    async getPrinterList() {
        try {
            const snapshot = await db.collection('Printers').get();
            this.printers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return this.printers;
        } catch (error) {
            console.error('Lỗi khi lấy danh sách máy in:', error);
            return [];
        }
    }
    async addPrinter(req, res) {
        try {
            // Lấy dữ liệu từ request body
            const {
                printerId,
                roomId,
                detail,
                config,
                jobQueue = [],
                historyDocRepo = []
            } = req.body;
    
            // Kiểm tra dữ liệu đầu vào
            if (!printerId || !roomId || !detail || !config) {
                return res.status(400).json({ message: 'Dữ liệu không hợp lệ. Vui lòng cung cấp đầy đủ thông tin!' });
            }
    
            const docRef = db.collection('Printers').doc(printerId);
    
            // Kiểm tra xem máy in đã tồn tại chưa
            const doc = await docRef.get();
            if (doc.exists) {
                return res.status(400).json({ message: 'Máy in đã tồn tại!' });
            }
    
            // Chuẩn bị dữ liệu để lưu
            const printerData = {
                roomId,
                detail,
                config,
                jobQueue,
                historyDocRepo
            };
    
            // Lưu vào Firestore
            await docRef.set(printerData);
    
            // Phản hồi thành công
            res.status(201).json({ message: 'Thêm máy in thành công!', data: printerData });
        } catch (error) {
            console.error('Lỗi khi thêm máy in:', error);
            res.status(500).json({
                message: 'Đã xảy ra lỗi khi thêm máy in',
                error: error.message
            });
        }
    }
    
   
    // Xóa máy in
    async removePrinter(req, res) {
        const { printerId } = req.params;

        try {
            const docRef = db.collection('Printers').doc(printerId);

            // Kiểm tra máy in đã tồn tại chưa
            const doc = await docRef.get();
            if (!doc.exists) {
                return res.status(404).json({ message: 'Máy in không tồn tại' });
            }

            // Xóa máy in
            await docRef.delete();
            res.json({ message: 'Xóa máy in thành công' });
        } catch (error) {
            console.error('Lỗi khi xóa máy in:', error);
            res.status(500).json({
                message: 'Đã xảy ra lỗi khi xóa máy in',
                error: error.message,
            });
        }
    }

    // Lấy danh sách phòng
    async getRoomList() {
        try {
            const snapshot = await db.collection('Rooms').get();
            this.rooms = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return this.rooms;
        } catch (error) {
            console.error('Lỗi khi lấy danh sách phòng:', error);
            return [];
        }
    }

    // Ghi lịch sử
    async logHistory(entry) {
        try {
            const ref = db.collection('HistoryLog');
            await ref.add(entry);
            return true;
        } catch (error) {
            console.error('Lỗi khi ghi lịch sử:', error);
            return false;
        }
    }

    // Lấy toàn bộ lịch sử
    async fetchHistory() {
        try {
            const snapshot = await db.collection('HistoryLog').get();
            this.history = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return this.history;
        } catch (error) {
            console.error('Lỗi khi lấy lịch sử:', error);
            return [];
        }
    }
}

module.exports = SPSO;
