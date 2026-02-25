const cardsService = require("../services/cards.service");
const ledgerService = require("../services/ledger-gateway.service");
const { success, error } = require("../utils/response.util");

/**
 * Create new card
 */
async function createCard(req, res) {
  try {
    const { accountId, cardNumber, cardSerial, cardType, expiryDate, staffId, branchId } = req.body;

    // Validate required fields
    if (!accountId || !cardNumber || !cardSerial) {
      return error(res, "Missing required fields", 400);
    }

    // Create card in database
    const card = await cardsService.createCard({
      accountId,
      cardNumber,
      cardSerial,
      cardType: cardType || "DEBIT",
      status: "ACTIVE",
      expiryDate,
      staffId,
      branchId,
    });

    // Record to ledger
    const transactionId = await ledgerService.recordTransaction("CREATE_CARD", {
      cardId: card.id,
      accountId,
      cardNumber,
      cardSerial,
      cardType: card.cardType,
      expiryDate,
      staffId,
      branchId,
      timestamp: new Date().toISOString(),
    });

    return success(res, {
      card,
      transactionId,
    }, 201);

  } catch (err) {
    console.error('Error in createCard:', err);
    return error(res, err.message, 500);
  }
}

/**
 * Get cards by account ID
 */
async function getCardsByAccount(req, res) {
  try {
    const { accountId } = req.params;

    if (!accountId) {
      return error(res, "Account ID required", 400);
    }

    const cards = await cardsService.getCardsByAccountId(accountId);
    return success(res, cards);

  } catch (err) {
    return error(res, err.message, 500);
  }
}

/**
 * Replace card endpoint
 */
async function replaceCard(req, res) {
  try {
    const { accountId, oldCardNumber, newCardSerial, reason, staffId } = req.body;

    // Validate required fields
    if (!accountId || !oldCardNumber || !newCardSerial || !reason || !staffId) {
      return error(res, "Missing required fields", 400);
    }

    // Perform card replacement
    const replacementResult = await cardsService.replaceCard(
      oldCardNumber,
      newCardSerial,
      reason,
      staffId,
      req.user.branchId || req.user.branchId // From JWT token
    );

    // Record to ledger
    const transactionId = await ledgerService.recordTransaction("REPLACE_CARD", {
      accountId,
      oldCardNumber,
      newCardSerial,
      reason,
      staffId,
      branchId: req.user.branchId || req.user.branchId,
      timestamp: new Date().toISOString(),
    });

    return success(res, {
      message: "Card replacement successful",
      replacementResult,
      transactionId,
    });

  } catch (err) {
    console.error('Error in replaceCard:', err);
    return error(res, err.message, 500);
  }
}

module.exports = {
  createCard,
  getCardsByAccount,
  replaceCard,
};