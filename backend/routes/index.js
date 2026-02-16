const express = require("express");
const router = express.Router();

// Import route modules
const authRoutes = require("./auth.routes");
const accountsRoutes = require("./accounts.routes");
const auditRoutes = require("./audit.routes"); // ← New
const customersRoutes = require("./customers.routes");
const cardsRoutes = require("./cards.routes");
// const kycRoutes = require("./kyc.routes");

// Mount routes
router.use("/auth", authRoutes);
router.use("/accounts", accountsRoutes);
router.use("/audit", auditRoutes); // ← New
router.use("/customers", customersRoutes);
router.use("/cards", cardsRoutes);
// router.use("/kyc", kycRoutes);

// Root endpoint
router.get("/", (req, res) => {
  res.json({ 
    message: "BranchChain API",
    version: "2.0.0", // ← Updated version
    endpoints: {
      auth: "/api/auth",
      accounts: "/api/accounts",
      customers: "/api/customers",
      cards: "/api/cards",
      kyc: "/api/kyc",
      audit: "/api/audit"
    }
  });
});

module.exports = router;