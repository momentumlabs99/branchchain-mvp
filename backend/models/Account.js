const { generateId } = require("../utils/id.util");

class Account {
  constructor(data) {
    this.id = generateId("ACC");
    this.customerId = data.customerId;
    this.accountType = data.accountType; // SAVINGS, CURRENT, etc.
    this.balance = data.initialDeposit || 0;
    this.pin = data.pin || null;
    this.status = "ACTIVE";
    this.branchId = data.branchId;
    this.createdBy = data.staffId;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }
}

module.exports = Account;
