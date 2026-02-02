const Account = require("../models/Account");
const dbService = require("./db.service");
const customersService = require("./customers.service");

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
 * Get account by ID with customer data
 * @param {string} accountId - Account ID
 * @returns {Promise<object>} Account with customer data
 */
async function getAccountById(accountId) {
  const account = await dbService.findById("accounts", accountId);
  
  if (!account) {
    throw new Error("Account not found");
  }
  
  // Get customer data
  const customer = await customersService.getCustomerById(account.customerId);
  
  // Combine account and customer data
  return {
    ...account,
    customer: customer
  };
}

/**
 * Get all accounts
 * @returns {Promise<array>} All accounts
 */
async function getAllAccounts() {
  return dbService.findAll("accounts");
}

/**
 * Search account by account number (same as ID)
 * @param {string} accountNumber - Account number
 * @returns {Promise<object>} Account with customer data
 */
async function searchByAccountNumber(accountNumber) {
  return getAccountById(accountNumber);
}

/**
 * Transfer funds between two accounts
 * @param {string} fromAccountId 
 * @param {string} toAccountId 
 * @param {number} amount 
 * @returns {Promise<object>} Transfer result
 */
async function transferFunds(fromAccountId, toAccountId, amount) {
  // 1. Get both accounts
  const fromAccount = await dbService.findById("accounts", fromAccountId);
  const toAccount = await dbService.findById("accounts", toAccountId);

  if (!fromAccount) throw new Error(`Source account ${fromAccountId} not found`);
  if (!toAccount) throw new Error(`Destination account ${toAccountId} not found`);

  // 2. Check balance
  const currentFromBalance = parseFloat(fromAccount.balance || 0);
  const currentToBalance = parseFloat(toAccount.balance || 0);
  const transferAmount = parseFloat(amount);

  if (currentFromBalance < transferAmount) {
    throw new Error("Insufficient funds in source account");
  }

  // 3. Update balances
  const newFromBalance = currentFromBalance - transferAmount;
  const newToBalance = currentToBalance + transferAmount;

  await dbService.update("accounts", fromAccountId, { balance: newFromBalance });
  await dbService.update("accounts", toAccountId, { balance: newToBalance });

  return {
    fromAccountId,
    toAccountId,
    amount: transferAmount,
    newFromBalance,
    newToBalance
  };
}

module.exports = {
  createAccount,
  resetPin,
  getAccountById,
  getAllAccounts,
  searchByAccountNumber,
  transferFunds,
};
