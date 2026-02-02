const ledgerService = require("../services/ledger-gateway.service");
const { success, error } = require("../utils/response.util");

/**
 * Get all audit logs
 */
async function getAuditLogs(req, res) {
  try {
    const transactions = await ledgerService.queryTransactions();
    
    return success(res, {
      total: transactions.length,
      transactions,
    });

  } catch (err) {
    console.error('Error in getAuditLogs:', err);
    return error(res, err.message, 500);
  }
}

/**
 * Get single audit log by ID
 */
async function getAuditLogById(req, res) {
  try {
    const { transactionId } = req.params;
    
    const transaction = await ledgerService.queryTransactionById(transactionId);
    
    return success(res, transaction);

  } catch (err) {
    console.error('Error in getAuditLogById:', err);
    return error(res, err.message, 500);
  }
}

module.exports = {
  getAuditLogs,
  getAuditLogById,
};