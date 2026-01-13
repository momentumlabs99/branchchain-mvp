const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", routes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "BranchChain API" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 BranchChain API running on http://localhost:${PORT}`);
});

module.exports = app;
