class HistoryLog {
    constructor() {
        this.hisLogId = "";
        this.ownerId = "";
        this.paymentRepo = [];
        this.printedDocRepo = [];
    }

    // Phương thức để chuyển dữ liệu thành JSON
    convertToJson() {
        return {
            hisLogId: this.hisLogId,
            ownerId: this.ownerId,
            paymentRepo: this.paymentRepo,
            printedDocRepo: this.printedDocRepo
        };
    }

    // Phương thức để lấy thông tin từ JSON
    setInfoFromJson(json) {
        this.hisLogId = json.hisLogId;
        this.ownerId = json.ownerId;
        this.paymentRepo = json.paymentRepo;
        this.printedDocRepo = json.printedDocRepo;
    }
}

module.exports = HistoryLog;
