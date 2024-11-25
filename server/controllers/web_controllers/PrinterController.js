import db from './firebase.js';
import PrintTask from '../../models/PrintTask.js';
import admin from 'firebase-admin';

// Cập nhật thông tin của Printer
export async function updatePrinterInfo(req, res) {
  const { printerId } = req.params;
  const newDetails = req.body;

  if (!printerId || !newDetails) {
    return res.status(400).json({ success: false, message: "Invalid input" });
  }

  try {
    const printerRef = db.collection('printers').doc(printerId);
    await db.runTransaction(async (transaction) => {
      const printerSnapshot = await transaction.get(printerRef);
      if (!printerSnapshot.exists) throw new Error("Printer not found");

      transaction.update(printerRef, newDetails);
    });

    res.status(200).json({ success: true, message: "Printer updated successfully" });
  } catch (error) {
    console.error("Error updating printer info:", error);
    res.status(500).json({ success: false, message: "An error occurred. Please try again later." });
  }
}

// Lấy danh sách tài liệu cần in
export async function takeDocList(req, res) {
  const { printerId } = req.params;

  if (!printerId) {
    return res.status(400).json({ success: false, message: "Printer ID is required" });
  }

  try {
    const printerDoc = await db.collection('printers').doc(printerId).get();
    if (!printerDoc.exists) throw new Error("Printer not found");

    const printerData = printerDoc.data();
    res.status(200).json(printerData.jobQueue || []);
  } catch (error) {
    console.error("Error fetching document list:", error);
    res.status(500).json({ success: false, message: "An error occurred. Please try again later." });
  }
}

// Thêm tác vụ in
export async function addTask(req, res) {
  const { printerId } = req.params;
  const taskData = req.body;

  if (!taskData.taskId || !printerId) {
    return res.status(400).json({ success: false, message: "Invalid input data" });
  }

  try {
    const printTask = new PrintTask(
      taskData.taskId,
      taskData.docId,
      printerId,
      taskData.ownerId,
      taskData.date,
      taskData.state
    );

    const batch = db.batch();
    const printerRef = db.collection('printers').doc(printerId);
    batch.update(printerRef, {
      jobQueue: admin.firestore.FieldValue.arrayUnion(printTask.taskId),
    });

    const taskRef = db.collection('tasks').doc(printTask.taskId);
    batch.set(taskRef, printTask.convertToJson());

    await batch.commit();
    res.status(201).json({ success: true, message: "Task added successfully" });
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ success: false, message: "An error occurred. Please try again later." });
  }
}

// Xóa tác vụ in
export async function removeTask(req, res) {
  const { printerId, taskId } = req.params;

  if (!printerId || !taskId) {
    return res.status(400).json({ success: false, message: "Invalid input" });
  }

  try {
    const batch = db.batch();
    const printerRef = db.collection('printers').doc(printerId);
    batch.update(printerRef, {
      jobQueue: admin.firestore.FieldValue.arrayRemove(taskId),
    });

    const taskRef = db.collection('tasks').doc(taskId);
    batch.delete(taskRef);

    await batch.commit();
    res.status(200).json({ success: true, message: "Task removed successfully" });
  } catch (error) {
    console.error("Error removing task:", error);
    res.status(500).json({ success: false, message: "An error occurred. Please try again later." });
  }
}

// Sắp xếp các tác vụ in
export async function sortTasks(req, res) {
  const { printerId } = req.params;
  const sortAscending = req.query.sortAscending === 'true';

  if (!printerId) {
    return res.status(400).json({ success: false, message: "Printer ID is required" });
  }

  try {
    const printerRef = db.collection('printers').doc(printerId);
    await db.runTransaction(async (transaction) => {
      const printerSnapshot = await transaction.get(printerRef);
      if (!printerSnapshot.exists) throw new Error("Printer not found");

      const printerData = printerSnapshot.data();
      const sortedQueue = printerData.jobQueue.sort((a, b) =>
        sortAscending ? a.localeCompare(b) : b.localeCompare(a)
      );

      transaction.update(printerRef, { jobQueue: sortedQueue });
    });

    res.status(200).json({ success: true, message: "Tasks sorted successfully" });
  } catch (error) {
    console.error("Error sorting tasks:", error);
    res.status(500).json({ success: false, message: "An error occurred. Please try again later." });
  }
}
