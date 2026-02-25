const express = require("express");
const router = express.Router();
const cardsController = require("../controllers/cards.controller");
const { authenticate } = require("../middleware/auth.middleware");

// Protected routes - require authentication
router.post("/", authenticate, cardsController.createCard);
router.get("/account/:accountId", authenticate, cardsController.getCardsByAccount);
router.post("/replace", authenticate, cardsController.replaceCard);

module.exports = router;