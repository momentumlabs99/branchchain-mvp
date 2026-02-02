const accountsService = require("../services/accounts.service");
const ledgerService = require("../services/ledger-gateway.service"); // ← Changed to new service
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

    // Create account in database
    const account = await accountsService.createAccount({
      customerId,
      accountType,
      initialDeposit: initialDeposit || 0,
      staffId,
      branchId,
    });

    // Record to ledger using Gateway API
    const transactionId = await ledgerService.recordTransaction("CREATE_ACCOUNT", {
      accountId: account.id,
      customerId,
      accountType,
      initialDeposit,
      staffId,
      branchId,
    });

    return success(res, {
      account,
      transactionId, // Return transaction ID for tracking
    }, 201);

  } catch (err) {
    console.error('Error in createAccount:', err);
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

    // Reset PIN in database
    await accountsService.resetPin(accountId, newPin);

    // Record to ledger using Gateway API
    const transactionId = await ledgerService.recordTransaction("RESET_PIN", {
      accountId,
      staffId,
      branchId,
      timestamp: new Date().toISOString(),
    });

    return success(res, {
      message: "PIN reset successful",
      transactionId,
    });

  } catch (err) {
    console.error('Error in resetPin:', err);
    return error(res, err.message, 500);
  }
}

/**
 * Get account by ID
 */
async function getAccount(req, res) {
  try {
    const { accountId } = req.params;

    const account = await accountsService.getAccountById(accountId);
    return success(res, account);

  } catch (err) {
    return error(res, err.message, 404);
  }
}

/**
 * Get all accounts
 */
async function getAllAccounts(req, res) {
  try {
    const accounts = await accountsService.getAllAccounts();
    return success(res, accounts);

  } catch (err) {
    return error(res, err.message, 500);
  }
}

/**
 * Search account by account number
 */
async function searchAccount(req, res) {
  try {
    const { accountNumber } = req.query;

    if (!accountNumber) {
      return error(res, "Account number required", 400);
    }

    const accountWithCustomer = await accountsService.searchByAccountNumber(accountNumber);
    return success(res, accountWithCustomer);

  } catch (err) {
    return error(res, err.message, 404);
  }
}

/**
 * Transfer funds between accounts
 */
async function transferFunds(req, res) {
  try {
    const { fromAccountId, toAccountId, amount, staffId, branchId } = req.body;

    // Validate input
    if (!fromAccountId || !toAccountId || !amount || !staffId || !branchId) {
      return error(res, "Missing required fields", 400);
    }

    // Perform transfer in database
    const result = await accountsService.transferFunds(fromAccountId, toAccountId, amount);

    // Record to ledger using Gateway API
    const transactionId = await ledgerService.recordTransaction("TRANSFER_FUNDS", {
      fromAccountId,
      toAccountId,
      amount,
      staffId,
      branchId,
      timestamp: new Date().toISOString(),
    });

    return success(res, {
      message: "Transfer successful",
      result,
      transactionId,
    });

  } catch (err) {
    console.error('Error in transferFunds:', err);
    return error(res, err.message, 500);
  }
}

module.exports = {
  createAccount,
  resetPin,
  getAccount,
  getAllAccounts,
  searchAccount,
  transferFunds,
};
