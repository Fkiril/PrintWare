class SystemConfig {
    constructor() {
        this.pageUnitPrice = 0;
        this.pageSizes = [];
        this.pageTypes = [];
        this.defaultPrintConfig = {};
        this.nextLogDate = new Date();
    }

    // Chuyển đối tượng thành JSON
    convertToJson() {
        return {
            pageUnitPrice: this.pageUnitPrice,
            pageSizes: this.pageSizes,
            pageTypes: this.pageTypes,
            defaultPrintConfig: this.defaultPrintConfig,
            nextLogDate: this.nextLogDate
        };
    }

    // Khởi tạo đối tượng từ JSON
    setInfoFromJson(jsonData) {
        this.pageUnitPrice = jsonData.pageUnitPrice || 0;
        this.pageSizes = jsonData.pageSizes || [];
        this.pageTypes = jsonData.pageTypes || [];
        this.defaultPrintConfig = jsonData.defaultPrintConfig || {};
        this.nextLogDate = new Date(jsonData.nextLogDate) || new Date();
    }
}

module.exports = SystemConfig;
