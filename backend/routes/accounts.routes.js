const express = require("express");
const router = express.Router();
const accountsController = require("../controllers/accounts.controller");
const { authenticate } = require("../middleware/auth.middleware");

// Protected routes - require authentication
router.post("/create", authenticate, accountsController.createAccount);
router.post("/reset-pin", authenticate, accountsController.resetPin);
router.get("/search", authenticate, accountsController.searchAccount);
router.get("/:accountId", authenticate, accountsController.getAccount);
router.get("/", authenticate, accountsController.getAllAccounts);

module.exports = router;
