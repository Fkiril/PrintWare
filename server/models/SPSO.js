import { firestore } from '../services/FirebaseAdminSDK.js';


import SystemConfig from './SystemConfig.js';


export default class SPSO {
    constructor() {
        this.systemConfig = new SystemConfig();
        this.history = [];
        this.printers = [];
        this.rooms = [];
    }
    // Lấy cấu hình hệ thống từ Firebase
    async getSystemConfig() {
        try {
            const snapshot = await firestore.collection('SystemConfig').get();
            if (snapshot.empty) {
                console.error('No system configurations found.');
                return []; // Trả về mảng rỗng nếu không có cấu hình nào
            }
   
            // Lấy danh sách tất cả các cấu hình
            const configs = snapshot.docs.map(doc => ({
                id: doc.id, // ID của tài liệu
                ...doc.data() // Dữ liệu bên trong tài liệu
            }));
   
            return configs;
        } catch (error) {
            console.error('Lỗi khi lấy danh sách SystemConfig:', error);
            return []; // Trả về mảng rỗng nếu có lỗi xảy ra
        }
    }
    async updatePageUnitPrice(price) {
        try {
            const ref = firestore.collection('SystemConfig').doc('config1');
            await ref.update({ pageUnitPrice: price });
            this.systemConfig.pageUnitPrice = price;
            return true;
        } catch (error) {
            console.error('Lỗi khi cập nhật kích giá trang:', error);
            return false;
        }
    }
    
    
    // Cập nhật kích thước trang
    async updatePageSizes(sizes) {
        try {
            const ref = firestore.collection('SystemConfig').doc('config1');
            await ref.update({ pageSizes: sizes });
            this.systemConfig.pageSizes = sizes;
            return true;
        } catch (error) {
            console.error('Lỗi khi cập nhật kích thước trang:', error);
            return false;
        }
    }
    async updateDefaultPrintConfig(config) {
        try {
            const ref = firestore.collection('SystemConfig').doc('config1');
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
            const ref = firestore.collection('SystemConfig').doc('config1');
            await ref.update({ nextLogDate: date });
            this.systemConfig.nextLogDate = new Date(date);
            return true;
        } catch (error) {
            console.error('Lỗi khi cập nhật ngày ghi nhật ký tiếp theo:', error);
            return false;
        }
    }
    // Lấy thông tin một máy in dựa trên printerId
    async getPrinter(printerId) {
        try {
            const doc = await firestore.collection('Printers').doc(printerId).get();
    
            if (!doc.exists) {
                console.error(`Máy in với id ${printerId} không tồn tại.`);
                return null;
            }
    
            return { id: doc.id, ...doc.data() };
        } catch (error) {
            console.error('Lỗi khi lấy thông tin máy in:', error.message);
            throw new Error('Đã xảy ra lỗi khi truy xuất thông tin máy in');
        }
    }
    async getPrinterList() {
        try {
            const snapshot = await firestore.collection('Printers').get();
            this.printers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return this.printers;
        } catch (error) {
            console.error('Lỗi khi lấy danh sách máy in:', error);
            return [];
        }
    }
    // Thêm máy in
    async addPrinter(printerData) {
        try {
            const { printerId, roomId, detail, config, jobQueue = [], historyDocRepo = [] } = printerData;
    
            // Tham chiếu đến tài liệu máy in
            const docRef = firestore.collection('Printers').doc(printerId);
    
            // Kiểm tra xem máy in đã tồn tại chưa
            const doc = await docRef.get();
            if (doc.exists) {
                throw new Error('Máy in đã tồn tại!');
            }
    
            // Chuẩn bị dữ liệu để lưu
            const newPrinterData = {
                roomId,
                detail,
                config,
                jobQueue,
                historyDocRepo,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
    
            // Lưu vào Firestore
            await docRef.set(newPrinterData);
    
            return newPrinterData;  // Trả về dữ liệu vừa thêm
        } catch (error) {
            console.error('Lỗi khi thêm máy in:', error.message);  // Log chi tiết lỗi
            throw new Error(`Đã xảy ra lỗi khi thêm máy in: ${error.message}`);
        }
    }
    
    //Xóa máy in
    async removePrinter(printerId) {
        try {
            const docRef = firestore.collection('Printers').doc(printerId);
    
            // Kiểm tra máy in đã tồn tại chưa
            const doc = await docRef.get();
            if (!doc.exists) {
                throw new Error('Máy in không tồn tại');
            }
    
            // Xóa máy in
            await docRef.delete();
            return { message: 'Xóa máy in thành công' };  // Trả về thông báo thành công
        } catch (error) {
            console.error('Lỗi khi xóa máy in:', error.message);
            throw new Error(`Đã xảy ra lỗi khi xóa máy in: ${error.message}`);
        }
    }
    


    // Lấy danh sách phòng
    async getRoomList() {
        try {
            const snapshot = await firestore.collection('Rooms').get();
            this.rooms = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return this.rooms;
        } catch (error) {
            console.error('Lỗi khi lấy danh sách phòng:', error);
            return [];
        }
    }



    // Lấy toàn bộ lịch sử
    async fetchHistory() {
        try {
            const snapshot = await firestore.collection('HistoryLog').get();
            this.history = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return this.history;
        } catch (error) {
            console.error('Lỗi khi lấy lịch sử:', error);
            return [];
        }
    }
}
