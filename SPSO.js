import { firestore } from '../../services/FirebaseAdminSDK.js';
// import SystemConfig from '../../models/SystemConfig.js';
// import SPSO from '../../models/SPSO.js';

// Trang chào
export const index = async () => {
    return 'Xin chào! Đây là hệ thống quản lý SPSO.';
};

// Cập nhật giá tiền trên mỗi trang
export const updatePageUnitPrice = async ({ configId, pageUnitPrice }) => {
    try {
        // Kiểm tra thông tin đầu vào
        if (!configId || !pageUnitPrice) {
            throw new Error('Thiếu thông tin configId hoặc pageUnitPrice');
        }

        const ref = firestore.collection(process.env.SYSTEM_CONFIGS_COLLECTION).doc(configId);
        const doc = await ref.get();
        if (!doc.exists) {
            throw new Error(`Không tìm thấy cấu hình với ID: ${configId}. Hãy kiểm tra lại ID hoặc tạo cấu hình mới.`);
        }
        // Cập nhật giá trị pageUnitPrice
        await ref.update({ pageUnitPrice });
        return 'Cập nhật pageUnitPrice thành công';
    } catch (error) {
        console.error('Lỗi khi cập nhật pageUnitPrice:', error.message);
        throw new Error(`Không thể cập nhật pageUnitPrice: ${error.message}`);
    }
};

// Cập nhật kích thước trang
export const updatePageSizes = async ({ configId, pageSizes }) => {
    try {
        if (!configId || !Array.isArray(pageSizes)) {
            throw new Error('Thiếu thông tin configId hoặc pageSizes không hợp lệ');
        }

        const ref = firestore.collection(process.env.SYSTEM_CONFIGS_COLLECTION).doc(configId);
        const doc = await ref.get();

        if (!doc.exists) {
            throw new Error(`Không tìm thấy cấu hình với id: ${configId}`);
        }

        await ref.update({ pageSizes });
        return 'Cập nhật pageSizes thành công';
    } catch (error) {
        console.error('Lỗi khi cập nhật pageSizes:', error.message);
        throw new Error(`Không thể cập nhật pageSizes: ${error.message}`);
    }
};

// Cập nhật cấu hình in mặc định
export const updateDefaultPrintConfig = async ({ configId, defaultPrintConfig }) => {
    try {
        if (!configId || typeof defaultPrintConfig !== 'object') {
            throw new Error('Thiếu thông tin configId hoặc defaultPrintConfig không hợp lệ');
        }

        const ref = firestore.collection(process.env.SYSTEM_CONFIGS_COLLECTION).doc(configId);
        const doc = await ref.get();

        if (!doc.exists) {
            throw new Error(`Không tìm thấy cấu hình với id: ${configId}`);
        }

        await ref.update({ defaultPrintConfig });
        return 'Cập nhật defaultPrintConfig thành công';
    } catch (error) {
        console.error('Lỗi khi cập nhật defaultPrintConfig:', error.message);
        throw new Error(`Không thể cập nhật defaultPrintConfig: ${error.message}`);
    }
};

// Cập nhật ngày log tiếp theo
export const updateNextLogDate = async ({ configId, nextLogDate }) => {
    try {
        if (!configId || !nextLogDate) {
            throw new Error('Thiếu thông tin configId hoặc nextLogDate');
        }

        const parsedDate = new Date(nextLogDate);
        if (isNaN(parsedDate.getTime())) {
            throw new Error('nextLogDate không hợp lệ');
        }

        const ref = firestore.collection(process.env.SYSTEM_CONFIGS_COLLECTION).doc(configId);
        const doc = await ref.get();

        if (!doc.exists) {
            throw new Error(`Không tìm thấy cấu hình với id: ${configId}`);
        }

        await ref.update({ nextLogDate: parsedDate });
        return 'Cập nhật nextLogDate thành công';
    } catch (error) {
        console.error('Lỗi khi cập nhật nextLogDate:', error.message);
        throw new Error(`Không thể cập nhật nextLogDate: ${error.message}`);
    }
};

// Lấy thông tin máy in
export const getPrinter = async (printerId) => {
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
};

// Thêm máy in mới
export const addPrinter = async (printerData) => {
    try {
        const { printerId, ...data } = printerData;
        const ref = firestore.collection('Printers').doc(printerId);

        const doc = await ref.get();
        if (doc.exists) {
            throw new Error('Máy in đã tồn tại!');
        }

        await ref.set({ ...data, createdAt: new Date().toISOString() });
        return data;
    } catch (error) {
        console.error('Lỗi khi thêm máy in:', error.message);
        throw new Error('Đã xảy ra lỗi khi thêm máy in');
    }
};

// Xóa máy in
export const removePrinter = async (printerId) => {
    try {
        const ref = firestore.collection('Printers').doc(printerId);
        const doc = await ref.get();

        if (!doc.exists) {
            throw new Error('Máy in không tồn tại');
        }

        await ref.delete();
        return { message: 'Xóa máy in thành công' };
    } catch (error) {
        console.error('Lỗi khi xóa máy in:', error.message);
        throw new Error('Đã xảy ra lỗi khi xóa máy in');
    }
};

export const getPrinterList = async () => {
    try {
        const snapshot = await firestore.collection('Printers').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Lỗi khi lấy danh sách máy in:', error);
        return [];
    }
};
// Lấy danh sách phòng
export const getRoomList = async () => {
    try {
        const snapshot = await firestore.collection('Rooms').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Lỗi khi lấy danh sách phòng:', error.message);
        throw new Error(`Không thể lấy danh sách phòng: ${error.message}`);
    }
};
// Lấy cấu hình hệ thống
export const getSystemConfig = async () => {
    try {
        const snapshot = await firestore.collection(process.env.SYSTEM_CONFIGS_COLLECTION).get();
        return snapshot.docs.map((doc) => {
            const data = doc.data();
            if (data.nextLogDate && data.nextLogDate._seconds) {
                data.nextLogDate = new Date(data.nextLogDate._seconds * 1000).toISOString();
            }
            return { id: doc.id, ...data };
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách cấu hình:', error.message);
        throw new Error(`Không thể lấy danh sách cấu hình: ${error.message}`);
    }
};
