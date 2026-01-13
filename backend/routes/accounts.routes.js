const express = require("express");
const router = express.Router();
const accountsController = require("../controllers/accounts.controller");

// POST /api/accounts/create
router.post("/create", accountsController.createAccount);

// POST /api/accounts/reset-pin
router.post("/reset-pin", accountsController.resetPin);

module.exports = router;
