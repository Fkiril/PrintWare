import path from "path";

import { firestore } from "../../services/FirebaseAdminSDK.js";
import { googleDrive } from "../../services/GoogleSDK.js";

import Document from "../../models/Document.js";
import PrintTask from "../../models/PrintTask.js";
import Printer from "../../models/Printer.js";

import { v4 as uuidv4 } from "uuid";
import { Readable } from "stream";

function bufferToStream(buffer) {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
}

function checkFile(file) {
  const allowedExtensions = [".doc", ".docx", ".pdf"];
  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (!allowedExtensions.includes(fileExtension)) {
    throw new Error("File type not supported for uploading.");
  }
  return true;
}

export const uploadDoc = async (file, ownerId, description, numPages) => {
  try {
    if (!file || !ownerId || !description) {
      throw new Error("Chưa đủ thông tin để tải tài liệu lên để in.");
    }

    if (!checkFile(file)) {
      throw new Error("File không phù hợp định dạng tệp để in");
    }
    const fileStream = bufferToStream(file.buffer);

    const response = await googleDrive.files.create({
      requestBody: {
        name: file.originalname,
        mimeType: file.mimetype,
        parents: [process.env.DOCUMENTs_FOLDER_ID],
      },
      media: {
        mimeType: file.mimetype,
        body: fileStream,
      },
    });

    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: { role: "reader", type: "anyone" },
    });

    const fileLink = `https://drive.google.com/uc?id=${response.data.id}`;

    const date = new Date();
    const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    const newDoc = new document(
      response.data.id,
      ownerId,
      file.originalname,
      description || "",
      file.mimetype,
      file.size,
      numPages || "",
      `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${time}`,
      fileLink
    );

    await firestore
      .collection(process.env.DOCUMENTS_COLLECTION)
      .doc(newDoc.docId)
      .set(newDoc.convertToJson());

    return true;
  } catch (error) {
    console.error("Error in uploadDoc:", error);
    throw new Error(error.message);
  }
};

export const deleteDoc = async (documentId) => {
  try {
    if (!documentId) {
      throw new Error("Chưa chọn tài liệu để xóa");
    }

    const response = await drive.files.list({
      q: `'${process.env.DOCUMENTs_FOLDER_ID}' in parents`,
      fields: "files(id, name)",
    });

    const files = response.data.files;

    if (!files || files.length === 0) {
      throw new Error("Thư mục không chứa tài liệu nào");
    }

    const fileToDelete = files.find((file) => file.id === documentId);
    if (!fileToDelete) {
      throw new Error("Tài liệu không tồn tại để xóa");
    }

    await drive.files.delete({ fileId: documentId });

    await db
      .collection(process.env.DOCUMENTS_COLLECTION)
      .doc(documentId)
      .delete();

    return true;
  } catch (error) {
    console.error("Lỗi trong việc xóa tài liệu:", error.message);
    throw new Error(`Xóa tài liệu thất bại: ${error.message}`);
  }
};

export const takeDocList = async (ownerId) => {
  try {
    if (!ownerId) {
      throw new Error("Chưa có thông tin gì về MSSV");
    }
    const snapshot = await firestore
      .collection(process.env.DOCUMENTS_COLLECTION)
      .where("ownerId", "==", ownerId)
      .get();

    if (snapshot.size === 0) return [];
    else if (snapshot.size === 1) return snapshot.docs[0];
    else {
      const documents = snapshot.docs.map((doc) => doc.data());
      return documents;
    }
  } catch (error) {
    console.error("Lấy thông tin thất bại:", error.message);
    throw new Error(`Lấy tài liệu thất bại: ${error.message}`);
  }
};

export const getDoc = async (documentId) => {
  try {
    if (!documentId) {
      throw new Error("Chưa có thông tin gì về mã số tài liệu");
    }
    const docRef = firestore
      .collection(process.env.DOCUMENTS_COLLECTION)
      .doc(documentId);
    const docSnapshot = await docRef.get();
    if (!docSnapshot.exists) {
      throw new Error("Không tồn tại tài liệu với mã số đã cung cấp.");
    }
    const data = docSnapshot.data();

    return data;
  } catch (error) {
    throw new Error(`Lấy tài liệu thất bại: ${error.message}`);
  }
};

export const createPrintTask = async (documentId, roomId) => {
  try {
    if (!documentId || !roomId) {
      throw new Error("Chưa đủ thông tin để tạo task in tài liệu");
    }

    const docRef = firestore
      .collection(process.env.DOCUMENTS_COLLECTION)
      .doc(documentId);
    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      throw new Error("Không tìm thấy tài liệu để in");
    }

    const document = docSnapshot.data();

    const printerRef = firestore
      .collection(process.env.PRINTERS_COLLECTION)
      .where("roomId", "==", roomId);
    const printerSnapshot = await printerRef.get();

    if (!printerSnapshot.exists) {
      throw new Error("Không tìm thấy máy in cần in");
    }

    //chỉ có 1 máy in trong 1 phòng
    const printerData = printerSnapshot.docs[0].data();
    const printerId = printerData.printerId;

    const printTaskId = uuidv4();

    const date = new Date();
    const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

    const printTask = new PrintTask(
      printTaskId,
      documentId,
      printerId,
      document.ownerId,
      `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${time}`, // date (thời gian tạo)
      "pending" // state (trạng thái ban đầu là pending)
    );

    await firestore
      .collection(process.env.PRINT_TASKS_COLLECTION)
      .doc(printTaskId)
      .set(printTask.convertToJson());

    const newPrinter = new Printer(printerId, roomId, {}, {}, [], []);
    newPrinter.addTask(printTaskId);

    await firestore
      .collection(process.env.PRINTERS_COLLECTION)
      .doc(printerSnapshot.docs[0].id)
      .set(newPrinter.convertToJson());

    return true;
  } catch (error) {
    throw new Error(`Lấy tài liệu thất bại: ${error.message}`);
  }
};