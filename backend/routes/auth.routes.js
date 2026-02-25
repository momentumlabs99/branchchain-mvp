const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { authenticate } = require("../middleware/auth.middleware");

// POST /api/auth/login
router.post("/login", authController.login);

// POST /api/auth/logout (requires authentication)
router.post("/logout", authenticate, authController.logout);

module.exports = router;
