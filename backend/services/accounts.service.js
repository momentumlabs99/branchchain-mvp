const Account = require("../models/Account");
const dbService = require("./db.service");

/**
 * Create new account
 * @param {object} data - Account data
 * @returns {Promise<object>} Created account
 */
async function createAccount(data) {
  const account = new Account(data);
  
  // Save to database
  const saved = await dbService.save("accounts", account);
  
  return saved;
}

/**
 * Reset account PIN
 * @param {string} accountId - Account ID
 * @param {string} newPin - New PIN
 * @returns {Promise<void>}
 */
async function resetPin(accountId, newPin) {
  // Find account
  const account = await dbService.findById("accounts", accountId);
  
  if (!account) {
    throw new Error("Account not found");
  }

  // Update PIN
  await dbService.update("accounts", accountId, { pin: newPin });
}

/**
 * Get account by ID
 * @param {string} accountId - Account ID
 * @returns {Promise<object>} Account
 */
async function getAccountById(accountId) {
  return dbService.findById("accounts", accountId);
}

module.exports = {
  createAccount,
  resetPin,
  getAccountById,
};
