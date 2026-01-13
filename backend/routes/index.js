const express = require("express");
const router = express.Router();

// Import route modules
const authRoutes = require("./auth.routes");
const accountsRoutes = require("./accounts.routes");
// const cardsRoutes = require("./cards.routes");
// const kycRoutes = require("./kyc.routes");
// const auditRoutes = require("./audit.routes");

// Mount routes
router.use("/auth", authRoutes);
router.use("/accounts", accountsRoutes);
// router.use("/cards", cardsRoutes);
// router.use("/kyc", kycRoutes);
// router.use("/audit", auditRoutes);

// root endpoint
router.get("/", (req, res) => {
  res.json({ 
    message: "BranchChain API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      accounts: "/api/accounts",
      cards: "/api/cards",
      kyc: "/api/kyc",
      audit: "/api/audit"
    }
  });
});

module.exports = router;
