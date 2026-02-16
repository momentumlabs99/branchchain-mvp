const express = require("express");
const router = express.Router();
const customersController = require("../controllers/customers.controller");
const { authenticate } = require("../middleware/auth.middleware");

// Protected routes - require authentication
router.post("/", authenticate, customersController.createCustomer);
router.get("/:customerId", authenticate, customersController.getCustomer);
router.get("/", authenticate, customersController.getAllCustomers);
router.put("/:customerId/kyc", authenticate, customersController.updateCustomerKYC);

module.exports = router;
