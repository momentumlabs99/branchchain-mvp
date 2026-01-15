const { generateId } = require("../utils/id.util");

class Customer {
  constructor(data) {
    this.id = generateId("CUST");
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.phone = data.phone;
    this.dateOfBirth = data.dateOfBirth;
    this.address = {
      street: data.address?.street || "",
      city: data.address?.city || "",
      state: data.address?.state || "",
      zipCode: data.address?.zipCode || "",
    };
    this.kycStatus = "PENDING"; // PENDING, VERIFIED, REJECTED
    this.accountStatus = "ACTIVE"; // ACTIVE, SUSPENDED, CLOSED
    this.branchId = data.branchId;
    this.createdBy = data.staffId;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }
}

module.exports = Customer;
