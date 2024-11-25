class PrintTask {
    constructor(taskId, docId, printerId, ownerId, date, state) {
      this.taskId = taskId;
      this.docId = docId;
      this.printerId = printerId;
      this.ownerId = ownerId;
      this.date = date;
      this.state = state;
    }
    convertToJson() {
      return {
        taskId: this.taskId,
        docId: this.docId,
        printerId: this.printerId,
        ownerId: this.ownerId,
        date: this.date,
        state: this.state,
      };
    }
    static setInfoFromJson(jsonData) {
      return new PrintTask(
        jsonData.taskId,
        jsonData.docId,
        jsonData.printerId,
        jsonData.ownerId,
        new Date(jsonData.date),
        jsonData.state
      );
    }
  }
export default PrintTask;
  