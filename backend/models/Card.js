const { generateId } = require("../utils/id.util");

class Card {
  constructor(data) {
    this.id = generateId("CARD");
    this.accountId = data.accountId;
    this.cardNumber = data.cardNumber;
    this.cardSerial = data.cardSerial;
    this.cardType = data.cardType || "DEBIT"; // DEBIT, CREDIT
    this.status = data.status || "ACTIVE"; // ACTIVE, INACTIVE, BLOCKED
    this.expiryDate = data.expiryDate;
    this.pin = data.pin || null;
    this.dailyLimit = data.dailyLimit || 1000000; // Default limit
    this.monthlyLimit = data.monthlyLimit || 5000000; // Default limit
    this.branchId = data.branchId;
    this.createdBy = data.staffId;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }
}

module.exports = Card;