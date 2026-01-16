const Customer = require("../models/Customer");
const dbService = require("./db.service");

/**
 * Create new customer
 * @param {object} data - Customer data
 * @returns {Promise<object>} Created customer
 */
async function createCustomer(data) {
  const customer = new Customer(data);
  const saved = await dbService.save("customers", customer);
  return saved;
}

/**
 * Get customer by ID
 * @param {string} customerId - Customer ID
 * @returns {Promise<object|null>} Customer or null
 */
async function getCustomerById(customerId) {
  const customer = await dbService.findById("customers", customerId);
  
  if (!customer) {
    throw new Error("Customer not found");
  }
  
  return customer;
}

/**
 * Get all customers
 * @returns {Promise<array>} All customers
 */
async function getAllCustomers() {
  return dbService.findAll("customers");
}

/**
 * Update customer KYC status
 * @param {string} customerId - Customer ID
 * @param {string} status - KYC status
 * @returns {Promise<object>} Updated customer
 */
async function updateKycStatus(customerId, status) {
  return dbService.update("customers", customerId, { 
    kycStatus: status,
    updatedAt: new Date().toISOString()
  });
}

module.exports = {
  createCustomer,
  getCustomerById,
  getAllCustomers,
  updateKycStatus,
};
