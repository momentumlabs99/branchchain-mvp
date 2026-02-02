const customersService = require("../services/customers.service");
const ledgerService = require("../services/ledger-gateway.service");
const { success, error } = require("../utils/response.util");

/**
 * Create new customer
 */
async function createCustomer(req, res) {
  try {
    const { firstName, lastName, email, phone, dateOfBirth, address, branchId } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !branchId) {
      return error(res, "Missing required fields", 400);
    }

    // Create customer
    const customer = await customersService.createCustomer({
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      address,
      branchId,
      staffId: req.user.id, // From JWT token
    });

    // Record to ledger
    await ledgerService.recordTransaction("CREATE_CUSTOMER", {
      customerId: customer.id,
      customerName: `${firstName} ${lastName}`,
      email,
      staffId: req.user.id,
      branchId,
    });

    return success(res, customer, 201);

  } catch (err) {
    return error(res, err.message, 500);
  }
}

/**
 * Get customer by ID
 */
async function getCustomer(req, res) {
  try {
    const { customerId } = req.params;

    const customer = await customersService.getCustomerById(customerId);
    return success(res, customer);

  } catch (err) {
    return error(res, err.message, 404);
  }
}

/**
 * Get all customers
 */
async function getAllCustomers(req, res) {
  try {
    const customers = await customersService.getAllCustomers();
    return success(res, customers);

  } catch (err) {
    return error(res, err.message, 500);
  }
}

module.exports = {
  createCustomer,
  getCustomer,
  getAllCustomers,
};
