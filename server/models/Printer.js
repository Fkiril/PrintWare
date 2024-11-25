class Printer {
  constructor(printerId, roomId, detail, config, jobQueue = [], historyDocRepo = []) {
    this.printerId = printerId;
    this.roomId = roomId;
    this.detail = detail;
    this.config = config;
    this.jobQueue = jobQueue;
    this.historyDocRepo = historyDocRepo;
  }

  // Chuyển đổi sang JSON
  convertToJson() {
    return {
      printerId: this.printerId,
      roomId: this.roomId,
      detail: this.detail,
      config: this.config,
      jobQueue: this.jobQueue,
      historyDocRepo: this.historyDocRepo,
    };
  }

  // Lấy thông tin từ JSON
  setInfoFromJson(json) {
    this.printerId = json.printerId;
    this.roomId = json.roomId;
    this.detail = json.detail || {};
    this.config = json.config || {};
    this.jobQueue = json.jobQueue || [];
    this.historyDocRepo = json.historyDocRepo || [];
  }

  // Thêm tác vụ
  addTask(taskId) {
    if (!this.jobQueue.includes(taskId)) {
      this.jobQueue.push(taskId);
    }
  }

  // Xóa tác vụ
  removeTask(taskId) {
    this.jobQueue = this.jobQueue.filter((id) => id !== taskId);
  }

  // Hoàn tất tác vụ
  completeTask(taskId) {
    this.removeTask(taskId);
    if (!this.historyDocRepo.includes(taskId)) {
      this.historyDocRepo.push(taskId);
    }
  }
}

// Export default
export default Printer;
