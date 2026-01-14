const express = require("express");
const router = express.Router();
const accountsController = require("../controllers/accounts.controller");
const { authenticate } = require("../middleware/auth.middleware");

// Protected routes - require authentication
router.post("/create", authenticate, accountsController.createAccount);
router.post("/reset-pin", authenticate, accountsController.resetPin);

module.exports = router;
