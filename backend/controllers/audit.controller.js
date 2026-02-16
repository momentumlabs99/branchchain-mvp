const ledgerService = require("../services/ledger-gateway.service");
const { success, error } = require("../utils/response.util");

/**
 * Parse date filter parameters
 */
function parseDateFilters(dateFrom, dateTo) {
  const filters = {};
  
  if (dateFrom) {
    filters.dateFrom = new Date(dateFrom);
    if (isNaN(filters.dateFrom.getTime())) {
      throw new Error('Invalid dateFrom format. Use ISO format (YYYY-MM-DD)');
    }
  }
  
  if (dateTo) {
    filters.dateTo = new Date(dateTo);
    filters.dateTo.setHours(23, 59, 59, 999); // End of day
    if (isNaN(filters.dateTo.getTime())) {
      throw new Error('Invalid dateTo format. Use ISO format (YYYY-MM-DD)');
    }
  }
  
  return filters;
}

/**
 * Apply filtering and sorting to transactions
 */
function filterAndSortTransactions(transactions, filters) {
  let filtered = [...transactions];
  
  // Filter by actionType
  if (filters.actionType) {
    filtered = filtered.filter(tx => tx.actionType === filters.actionType);
  }
  
  // Filter by staffId
  if (filters.staffId) {
    filtered = filtered.filter(tx => tx.details && tx.details.staffId === filters.staffId);
  }
  
  // Filter by date range
  if (filters.dateFrom) {
    filtered = filtered.filter(tx => new Date(tx.timestamp) >= filters.dateFrom);
  }
  
  if (filters.dateTo) {
    filtered = filtered.filter(tx => new Date(tx.timestamp) <= filters.dateTo);
  }
  
  // Search functionality
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filtered = filtered.filter(tx => {
      // Search in actionType
      if (tx.actionType.toLowerCase().includes(searchTerm)) {
        return true;
      }
      // Search in details JSON
      if (tx.details) {
        const detailsStr = JSON.stringify(tx.details).toLowerCase();
        if (detailsStr.includes(searchTerm)) {
          return true;
        }
      }
      return false;
    });
  }
  
  // Sort by timestamp DESC (newest first)
  filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  return filtered;
}

/**
 * Get all audit logs with filtering, pagination, and search
 */
async function getAuditLogs(req, res) {
  try {
    // Parse query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;
    const actionType = req.query.actionType;
    const staffId = req.query.staffId;
    const dateFrom = req.query.dateFrom;
    const dateTo = req.query.dateTo;
    const search = req.query.q || req.query.search;
    
    // Validate pagination parameters
    if (limit < 1 || limit > 1000) {
      return error(res, 'Limit must be between 1 and 1000', 400);
    }
    
    if (offset < 0) {
      return error(res, 'Offset must be non-negative', 400);
    }
    
    // Parse date filters
    const dateFilters = parseDateFilters(dateFrom, dateTo);
    
    // Build filter object
    const filters = {
      actionType,
      staffId,
      search,
      ...dateFilters
    };
    
    // Get all transactions from ledger
    const allTransactions = await ledgerService.queryTransactions();
    
    // Apply filtering and sorting
    const filteredTransactions = filterAndSortTransactions(allTransactions, filters);
    
    // Apply pagination
    const paginatedTransactions = filteredTransactions.slice(offset, offset + limit);
    
    // Calculate pagination metadata
    const total = filteredTransactions.length;
    const totalPages = Math.ceil(total / limit);
    
    return success(res, {
      pagination: {
        page,
        limit,
        offset,
        total,
        totalPages
      },
      filters: Object.keys(filters).filter(key => filters[key] !== undefined),
      transactions: paginatedTransactions
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