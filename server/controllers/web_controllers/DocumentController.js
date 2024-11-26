import fs from "fs";
import path from "path";

import { firestore } from "../../services/FirebaseAdminSDK.js";
import { googleDrive } from "../../services/GoogleSDK.js";

import { Document } from "../../models/Document.js";
import { PrintTask } from "../../models/PrintTask.js";
import { Printer } from "../../models/Printer.js";

// const { google } = require("googleapis");

// const document = require("../models/document");
// const PrintTask = require("../models/printTask"); 
// const Printer = require("../models/printer");

// const db = require("../../util/firebase");
// const fs = require("fs");
// const path = require("path");

// const auth = new google.auth.GoogleAuth({
//   keyFile: path.join(__dirname, "../../../google-api-key.json"),
//   scopes: ["https://www.googleapis.com/auth/googleDrive.file"],
// });

// const drive = google.googleDrive({ version: "v3", auth });

const { v4: uuidv4 } = require("uuid");

export const uploadDoc = async (req, res) => {
  try {
    const file = req.file;

    const response = await googleDrive.files.create({
      requestBody: {
        name: file.originalname,
        mimeType: file.mimetype,
      },
      media: {
        mimeType: file.mimetype,
        body: fs.createReadStream(file.path),
      },
    });

    await googleDrive.permissions.create({
      fileId: response.data.id,
      requestBody: { role: "reader", type: "anyone" },
    });

    const fileLink = `https://googleDrive.google.com/uc?id=${response.data.id}`;

    const date = new Date();
    const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    const newDoc = new Document(
      response.data.id,
      req.body.ownerId,
      file.originalname,
      req.body.description || "",
      file.mimetype,
      file.size,
      req.body.numPages || "",
      `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${time}`,
      fileLink
    );

    await firestore
      .collection(process.env.DOCUMENTS_COLLECTION)
      .doc(newDoc.docId)
      .set(newDoc.convertToJson());

    fs.unlinkSync(file.path);
    res
      .status(201)
      .json({ message: "Document uploaded", data: newDoc.convertToJson() });
    return true;
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteDoc = async (req, res) => {
  try {
    const id = req.body.docId;

    await googleDrive.files.delete({ fileId: id });

    await firestore.collection(process.env.DOCUMENTS_COLLECTION).doc(id).delete();

    res.status(200).json({ message: "Document deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const takeDocList = async (req, res) => {
  try {
    const { ownerId } = req.query;
    const snapshot = await firestore
      .collection(process.env.DOCUMENTS_COLLECTION)
      .where("ownerId", "==", ownerId)
      .get();
    const documents = snapshot.docs.map((doc) => doc.data());
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDoc = async (req, res) => {
  try {
    const { docId } = req.query;
    const docRef = firestore.collection(process.env.DOCUMENTS_COLLECTION).doc(docId);
    const docSnapshot = await docRef.get();

    const data = docSnapshot.data();
    if (!data || Object.keys(data).length === 0) {
      return res.status(404).json({ error: "Document has no data" });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const checkFile = async (req, res) => {
  try {
    const { fileId } = req.body;

    // Lấy thông tin tệp từ Google googleDrive
    const response = await googleDrive.files.get({
      fileId,
      fields: "id, name, mimeType",
    });

    const fileName = response.data.name;
    const mimeType = response.data.mimeType;

    // Kiểm tra đuôi tệp (extension)
    const allowedExtensions = [".doc", ".docx", ".pdf"];
    const fileExtension = path.extname(fileName).toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      return res.status(400).json({
        exists: true,
        fileId: response.data.id,
        fileName: fileName,
        message: `File type ${fileExtension} is not supported for printing.`,
      });
    }

    // Trả về thông tin nếu tệp hợp lệ
    res.status(200).json({
      exists: true,
      fileId: response.data.id,
      fileName: fileName,
      message: `File is valid and ready for processing.`,
    });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).json({ exists: false, message: "File not found" });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

export const createPrintTask = async (req, res) => {
  try {
    const { documentId, roomId } = req.body;
    //Lấy sau khi nhấn để in, documentId lấy từ doc chuẩn bị in, printerId lấy từ tòa đã chọn
    const docRef = firestore.collection(process.env.DOCUMENTS_COLLECTION).doc(documentId);
    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      return res.status(404).json({ error: "Document not found" });
    }

    const document = docSnapshot.data();

    const printerRef = firestore.collection(process.env.PRINTERS_COLLECTION).where("RoomId", "==", roomId);
    const printerSnapshot = await printerRef.get();

    if (!printerSnapshot.exists) {
      return res.status(404).json({ error: "Printer not found" });
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
      .collection("printTasks")
      .doc(printTaskId)
      .set(printTask.convertToJson());

    const newPrinter = new Printer();
    newPrinter.setInfoFromJson(printerData); // Chuyển dữ liệu máy in thành đối tượng Printer
    newPrinter.addTask(printTaskId); // Thêm taskId vào jobQueue của máy in

    await firestore
      .collection(process.env.PRINTERS_COLLECTION)
      .doc(printerSnapshot.docs[0].id)
      .set(newPrinter.convertToJson());

    res.status(200).json({ success: true, printTaskId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};