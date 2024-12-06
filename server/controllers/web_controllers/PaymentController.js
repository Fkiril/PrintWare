// import { PrintPayment, PagePayment } from '../../models/Payment.js';
import Wallet from '../../models/Wallet.js';
class PaymentController {
    constructor() {
        this.payments = [];
        this.wallets = new Map();
    }

    createWallet(ownerId) {
        const walletId = `wallet-${Date.now()}`;
        const wallet = new Wallet(walletId, ownerId);
        this.wallets.set(ownerId, wallet);
        return wallet;
    }

    deposit(ownerId, amount) {
        const wallet = this.wallets.get(ownerId);
        if (!wallet)
            throw new Error('Wallet not found');
        wallet.budget += amount;
        return wallet.convertToJson();
    }

    payForPrint(ownerId, document, charge){
        const wallet = this.wallets.get(ownerId);
        if (!wallet || wallet.budget < charge)
            throw new Error('Insufficient balance');
        
        wallet.deduct(charge);
        const payment = new PrintPayment(
            `payment-${Date.now()}`,
            ownerId,
            charge,
            new Date(),
            document.documentId
        );  
        this.payments.push(payment);
        return payment.convertToJson();
    }

    buyPage(ownerId,pageNum){
        const wallet = this.wallets.get(ownerId);
        if (!wallet) throw new Error("Wallet not found");
        const costPerPage = 0.5; // Gia mau
        const totalCost = costPerPage * pageNum;
        wallet.deduct(totalCost);
        wallet.addPages(pageNum);

        const payment = new PagePayment(
            `payment-${Date.now()}`,
            ownerId,
            totalCost,
            new Date(),
            pageNum
        );
        this.payments.push(payment);
        return payment.convertToJson();
    }

    logHistoryPayment(ownerId){
        return this.payments.filter(p => p.ownerId === ownerId)
        .map(p => p.convertToJson());
    }

    getPayment(paymentId){
        return this.payments.find(p => p.paymentId === paymentId)?.convertToJson();
    }

    deletePayment(paymentId){
        const index = this.payments.findIndex(p => p.paymentId === paymentId);
        if(index !== -1){
            this.payments.splice(index, 1);
            return true;
        }
        return false;
    }
}

export default PaymentController;