class Wallet {
    constructor(walletId, ownerId, budget = 0, availablePages = 0) {
        this.walletId = walletId;
        this.ownerId = ownerId;
        this.budget = budget;
        this.availablePages = availablePages;
}
    convertToJson() {
        return {
            walletId: this.walletId,
            ownerId: this.ownerId,
            budget: this.budget,
            availablePages: this.availablePages
        };
    }

    setInfoFromJson(json) {
        this.walletId = json.walletId;
        this.ownerId = json.ownerId;
        this.budget = json.budget;
        this.availablePages = json.availablePages;
    }

    deposit(amount) {
        if (amount <= 0)
            throw new Error('Invalid amount');
        this.budget += amount;
    }

    deduct(amount){
        if (amount > this.budget)
            throw new Error('Insufficient balance');
        this.budget -= amount;
    }

    addPages(pageNum){
        if (pageNum < 0)
            throw new Error('Invalid page number');
        this.availablePages += pageNum;
    }

    usePages(pageNum){
        if (pageNum > this.availablePages)
            throw new Error('Not enough pages available');
        this.availablePages -= pageNum;
    }

}

module.exports = Wallet;