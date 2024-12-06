import {firestore} from '../../services/FirebaseAdminSDK.js';
import PrintTask from '../../models/PrintTask.js';


// Cập nhật thông tin của Printer
export async function updatePrinterInfo(printerId, newDetails) {
  if (!printerId || !newDetails) {
    throw new Error("Invalid input");
  }

  try {
    const printerRef = firestore.collection('Printers').doc(printerId);
    const docSnapshot = await printerRef.get();

    if (!docSnapshot.exists) {
      throw new Error("Printer not found");
    }

    await printerRef.update(newDetails);
    return { success: true, message: "Printer updated successfully" };
  } catch (error) {
    console.error("Error updating printer info:", error);
    throw new Error("An error occurred while updating the printer");
  }
}
// Lấy danh sách tài liệu cần in
export async function takeDocList(printerId) {
  if (!printerId) {
    throw new Error("Printer ID is required");
  }

  const printerSnapshot = await firestore.collection('Printers').doc(printerId).get();
  if (!printerSnapshot.exists) {
    throw new Error("Printer not found");
  }

  const printerData = printerSnapshot.data();
  const jobQueue = printerData.jobQueue || [];
  console.log("Job Queue:", jobQueue);
  console.log("Is Array:", Array.isArray(jobQueue));
  console.log("Job Queue Length:", jobQueue.length);
  // Truy vấn tất cả PrintTask với taskId có trong jobQueue
  const printTasksSnapshot = await firestore
    .collection('printTasks')
    .where('taskId', 'in', jobQueue)
    .get();

  return printTasksSnapshot.docs.map((doc) => doc.data().docId);
}
// Thêm tác vụ in
export async function addTask(printerId, taskData) {
  console.log("Task data:", taskData);
  console.log("Printer ID:", printerId);

  if (!taskData.taskId || !printerId) {
    throw new Error("Invalid input data");
  }

  try {
    // Kiểm tra taskId hợp lệ
    if (!taskData.taskId || !taskData.taskId.trim()) {
      throw new Error("taskId cannot be empty");
    }

    // Tạo PrintTask từ dữ liệu
    const printTask = new PrintTask({ ...taskData, printerId });
    console.log("PrintTask:", printTask);
    if (!printTask.taskId) {
      throw new Error("Invalid taskId");
    }

    // Lưu PrintTask vào Firestore
    await firestore.collection('printTasks').doc(printTask.taskId).set(printTask.convertToJson());

    // Lấy Printer hiện tại để cập nhật jobQueue
    const printerRef = firestore.collection('Printers').doc(printerId);
    const printerSnapshot = await printerRef.get();

    if (!printerSnapshot.exists) {
      throw new Error("Printer not found");
    }

    const printerData = printerSnapshot.data();
    const updatedJobQueue = [...(printerData.jobQueue || []), printTask.taskId];

    // Cập nhật jobQueue của Printer
    await printerRef.update({ jobQueue: updatedJobQueue });

    // Trả về kết quả
    return { success: true, message: "Task added successfully" };

  } catch (error) {
    console.error("Error adding task:", error);
    throw error; 
}
}
// Xóa tác vụ in
export async function removeTask(printerId, taskId) {
  if (!taskId || !printerId) {
    throw new Error("Invalid input data");
  }
  
  try {
    // Lấy Printer hiện tại
    const printerRef = firestore.collection('Printers').doc(printerId);
    const printerSnapshot = await printerRef.get();

    if (!printerSnapshot.exists) {
      throw new Error("Printer not found");
    }

    const printerData = printerSnapshot.data();
    const jobQueue = printerData.jobQueue || [];

    // Kiểm tra nếu taskId có trong jobQueue
    if (!jobQueue.includes(taskId)) {
      throw new Error("Task not found in printer's job queue");
    }

    // Xóa task khỏi Firestore
    await firestore.collection('printTasks').doc(taskId).delete();

    // Cập nhật lại jobQueue sau khi xóa taskId
    const updatedJobQueue = jobQueue.filter((id) => id !== taskId);
    await printerRef.update({ jobQueue: updatedJobQueue });

    return { success: true, message: "Task removed successfully" };
  } catch (error) {
    console.error("Error removing task:", error);
    throw error;
  }
}
// Thực hiện tác vụ in
export async function print(taskId) {
  if (!taskId) {
    throw new Error("Task ID is required");
  }

  try {
    // 1. Lấy thông tin chi tiết của printTask từ Firestore
    const taskRef = firestore.collection('printTasks').doc(taskId);
    const taskSnapshot = await taskRef.get();

    if (!taskSnapshot.exists) {
      throw new Error("Task not found");
    }

    const taskData = taskSnapshot.data();

    // 2. Lấy thông tin máy in liên quan
    const printerRef = firestore.collection('Printers').doc(taskData.printerId);
    const printerSnapshot = await printerRef.get();

    if (!printerSnapshot.exists) {
      throw new Error("Printer not found");
    }

    const printerData = printerSnapshot.data();

    // 3. Kiểm tra xem taskId có nằm trong jobQueue của Printer không
    const jobQueue = printerData.jobQueue || [];
    if (!jobQueue.includes(taskId)) {
      throw new Error("Task is not in the printer's job queue");
    }

    // 4. Cập nhật trạng thái của tác vụ thành "PRINTING"
    await taskRef.update({ state: PrintTask.STATES.PRINTING });

    // 5. Thực hiện quá trình in
    console.log(`Printing task ${taskData.taskId} for document ${taskData.docId}`);

    // 6. Cập nhật trạng thái của tác vụ thành "COMPLETED"
    await taskRef.update({ state: PrintTask.STATES.COMPLETED });

    // 7. Cập nhật lại `jobQueue` của máy in (loại bỏ taskId vừa in xong)
    const updatedJobQueue = jobQueue.filter((id) => id !== taskId);
    await printerRef.update({ jobQueue: updatedJobQueue });

    // 8. Gửi thông báo qua SSE cho user nếu có kết nối
    // const userId = taskData.ownerId;
    // if (connectedUsers[userId]) {
    //   connectedUsers[userId].write(
    //     `data: ${JSON.stringify({ taskId: taskData.taskId, status: "completed" })}\n\n`
    //   );
      
    // }

    // 9. Trả về kết quả thành công
    return { success: true, message: `Task ${taskId} printed successfully` };
  } catch (error) {
    console.error("Error printing task:", error);
    throw new Error(error.message || "An error occurred while printing");
  }
}


