const cardsService = require("../services/cards.service");
const ledgerService = require("../services/ledger-gateway.service");
const { success, error } = require("../utils/response.util");

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
  replaceCard,
};