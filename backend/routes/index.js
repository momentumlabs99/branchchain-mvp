const express = require("express");
const router = express.Router();

// Import route modules
const authRoutes = require("./auth.routes");
const accountsRoutes = require("./accounts.routes");
const auditRoutes = require("./audit.routes"); // ← New

// Mount routes
router.use("/auth", authRoutes);
router.use("/accounts", accountsRoutes);
router.use("/audit", auditRoutes); // ← New

// Root endpoint
router.get("/", (req, res) => {
  res.json({ 
    message: "BranchChain API",
    version: "2.0.0", // ← Updated version
    endpoints: {
      auth: "/api/auth",
      accounts: "/api/accounts",
      audit: "/api/audit" // ← New
    }
  });
});

module.exports = router;