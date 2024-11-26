const Wallet = require('./Wallet');

class IPayment {
    constructor(paymentId, ownerId, charge, date) {
        //if (this.constructor === IPayment) {
        //    throw new Error("Cannot instantiate interface");
        //}
        this.paymentId = paymentId;
        this.ownerId = ownerId;
        this.charge = charge;
        this.date = date;
    }

    convertToJson(){
        return {
            paymentId: this.paymentId,
            ownerId: this.ownerId,
            charge: this.charge,
            date: this.date
        };
    }

    setInfoFromJson(json){
        this.paymentId = json.paymentId;
        this.ownerId = json.ownerId;
        this.charge = json.charge;
        this.date = json.date;
    }
}

class PrintPayment extends IPayment {
    constructor(paymentId, ownerId, charge, date) {
        super(paymentId, ownerId, charge, date);
        this.documentId = json.documentId;
    }

    convertToJson() {
        const json = super.convertToJson();
        json.pageNum = this.pageNum;
        return json;
    }

    setInfoFromJson(json){
        super.setInfoFromJson(json);
        this.pageNum = json.pageNum;
    }
}

class PagePayment extends IPayment {
    constructor(paymentId, ownerId, charge, date, pageNum) {
        super(paymentId, ownerId, charge, date);
        this.pageNum = pageNum;
    }

    convertToJson() {
        const json = super.convertToJson();
        json.pageNum = this.pageNum;
        return json;
    }

    setInfoFromJson(json) {
        super.setInfoFromJson(json);
        this.pageNum = json.pageNum;
    }
}

module.exports = {IPayment, PrintPayment, PagePayment, Wallet};