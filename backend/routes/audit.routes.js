const express = require("express");
const router = express.Router();
const auditController = require("../controllers/audit.controller");

// GET /api/audit - Get all audit logs
router.get("/", auditController.getAuditLogs);

// GET /api/audit/:transactionId - Get single audit log
router.get("/:transactionId", auditController.getAuditLogById);

module.exports = router;