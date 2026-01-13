const accountsService = require("../services/accounts.service");
const ledgerService = require("../services/ledger.service");
const { success, error } = require("../utils/response.util");

/**
 * Create new account
 */
async function createAccount(req, res) {
  try {
    const { customerId, accountType, initialDeposit, staffId, branchId } = req.body;

    // Validate input
    if (!customerId || !accountType || !staffId || !branchId) {
      return error(res, "Missing required fields", 400);
    }

    // Create account
    const account = await accountsService.createAccount({
      customerId,
      accountType,
      initialDeposit: initialDeposit || 0,
      staffId,
      branchId,
    });

    // Record to ledger
    //await ledgerService.recordTransaction("CREATE_ACCOUNT", {
    //  accountId: account.id,
    //  customerId,
    //  accountType,
    //  initialDeposit,
    //  staffId,
    //  branchId,
    //});

    return success(res, account, 201);

  } catch (err) {
    return error(res, err.message, 500);
  }
}

/**
 * Reset account PIN
 */
async function resetPin(req, res) {
  try {
    const { accountId, newPin, staffId, branchId } = req.body;

    // Validate input
    if (!accountId || !newPin || !staffId || !branchId) {
      return error(res, "Missing required fields", 400);
    }

    // Reset PIN
    await accountsService.resetPin(accountId, newPin);

    // Record to ledger
    //await ledgerService.recordTransaction("RESET_PIN", {
    //  accountId,
    //  staffId,
    //  branchId,
    //});

    return success(res, { message: "PIN reset successful" });

  } catch (err) {
    return error(res, err.message, 500);
  }
}

module.exports = {
  createAccount,
  resetPin,
};
