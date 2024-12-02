import { firestore } from '../../services/FirebaseAdminSDK.js';
import SystemConfig from '../../models/SystemConfig.js';
import SPSO from '../../models/SPSO.js';

const spso = new SPSO();

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

        // Lấy cấu hình từ Firestore
        // const ref = firestore.collection('SystemConfig').doc(configId);
        // const doc = await ref.get();
        const ref = firestore.collection(process.env.SYSTEM_CONFIGS_COLLECTION).doc(configId);
        const doc = await ref.get();

    //     if (!doc.exists) {
    //         throw new Error(`Không tìm thấy cấu hình với id: ${configId}`);
    //     }

    //     await ref.update({ pageSizes });
    //     return 'Cập nhật pageSizes thành công';
    // } catch (error) {
    //     console.error('Lỗi khi cập nhật pageSizes:', error.message);
    //     throw new Error(`Không thể cập nhật pageSizes: ${error.message}`);
    // }
        if (!doc.exists) {
            throw new Error(`Không tìm thấy cấu hình với ID: ${configId}. Hãy kiểm tra lại ID hoặc tạo cấu hình mới.`);
        }

        // Cập nhật giá trị pageUnitPrice
        await ref.update({ pageUnitPrice });

        // // Cập nhật lại giá trị trong instance của config
        // const updatedConfig = doc.data();
        // updatedConfig.pageUnitPrice = pageUnitPrice;

        
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
        const printer = await spso.getPrinter(printerId);
        if (!printer) {
            throw new Error(`Không tìm thấy máy in với id: ${printerId}`);
        }
        return printer;
    } catch (error) {
        console.error('Lỗi khi lấy thông tin máy in:', error.message);
        throw new Error(`Không thể lấy thông tin máy in: ${error.message}`);
    }
};


// Thêm máy in mới
export const addPrinter = async (printerData) => {
    try {
        return await spso.addPrinter(printerData);
    } catch (error) {
        console.error('Lỗi khi thêm máy in:', error.message);
        throw new Error(`Không thể thêm máy in: ${error.message}`);
    }
};



// Xóa máy in
export const removePrinter = async (printerId) => {
    try {
        const response = await spso.removePrinter(printerId);
        return response;
    } catch (error) {
        console.error('Lỗi khi xóa máy in:', error.message);
        throw new Error(`Không thể xóa máy in: ${error.message}`);
    }
};

// Lấy danh sách máy in
export const getPrinterList = async () => {
    try {
        return await spso.getPrinterList();
    } catch (error) {
        console.error('Lỗi khi lấy danh sách máy in:', error.message);
        throw new Error(`Không thể lấy danh sách máy in: ${error.message}`);
    }
};

// Lấy danh sách phòng
export const getRoomList = async () => {
    try {
        return await spso.getRoomList();
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

// Xóa lịch sử
export const resetHistory = async () => {
    try {
        const historyLogCollection = firestore.collection(process.env.HISTORY_LOGS_COLLECTION);
        const snapshot = await historyLogCollection.get();

        if (snapshot.empty) {
            return 'Không có lịch sử để xóa.';
        }

        const batch = firestore.batch();
        snapshot.docs.forEach((doc) => batch.delete(doc.ref));
        await batch.commit();

        return 'Lịch sử đã được xóa thành công.';
    } catch (error) {
        console.error('Lỗi khi xóa lịch sử:', error.message);
        throw new Error(`Không thể xóa lịch sử: ${error.message}`);
    }
};
