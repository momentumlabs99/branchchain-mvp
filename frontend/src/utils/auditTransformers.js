/**
 * Transforms a raw ledger transaction into a UI-friendly audit log entry
 * 
 * @param {Object} entry - The raw transaction object from the backend/ledger
 * @returns {Object} Formatted entry for the Audit Log table
 */
export const transformAuditLog = (entry) => {
  // Defensive programming: return a safe default if entry is malformed
  if (!entry || !entry.details) {
    return {
      id: entry?.txId || Math.random().toString(),
      timestamp: entry?.timestamp || new Date().toISOString(),
      timeAgo: "Unknown",
      staffId: "Unknown",
      staffRole: "System",
      staffInitials: "?",
      staffColor: "slate",
      actionType: "Unknown Action",
      actionColor: "slate",
      customerRef: "N/A",
      accountRef: null,
      ledgerHash: entry?.txId || "Unknown Hash",
    };
  }

  const { actionType, details, timestamp, txId } = entry;

  // 1. Format Timestamp and Time Ago
  const dateObj = new Date(timestamp);
  const formattedTime = dateObj.toLocaleString();
  const timeAgo = getTimeAgo(dateObj);

  // 2. Format Action Type
  // e.g. "CREATE_ACCOUNT" -> "Create Account"
  const humanAction = formatActionType(actionType);
  const actionColor = getActionColor(actionType);

  // 3. Extract References (Customer/Account)
  let customerRef = "N/A";
  let accountRef = null;

  if (details.customerRef) customerRef = details.customerRef;
  if (details.customerId) customerRef = details.customerId;
  
  if (details.accountRef) accountRef = details.accountRef;
  if (details.accountId) accountRef = details.accountId;
  if (details.fromAccountId) accountRef = `${details.fromAccountId} → ${details.toAccountId}`;

  // Special handling for System events
  if (actionType === "INITIALIZE") {
    customerRef = "SYSTEM";
  }

  // 4. Staff Details matches
  const staffId = details.staffId || "System";
  const staffInitials = staffId === "System" ? "SY" : staffId.slice(0, 2).toUpperCase();
  const staffColor = getStaffColor(staffId);

  return {
    id: txId,
    timestamp: formattedTime,
    timeAgo: timeAgo,
    staffId: staffId,
    staffRole: details.role || "Staff", // Start assuming 'Staff' if not provided
    staffInitials: staffInitials,
    staffColor: staffColor,
    actionType: humanAction,
    actionColor: actionColor,
    customerRef: customerRef,
    accountRef: accountRef,
    ledgerHash: txId,
    originalData: entry // Keep original data for reference if needed
  };
};

// --- Helper Functions ---

function formatActionType(type) {
  if (!type) return "Unknown";
  return type
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, l => l.toUpperCase());
}

function getActionColor(type) {
  const map = {
    'CREATE_ACCOUNT': 'emerald',
    'RESET_PIN': 'amber',
    'REPLACE_CARD': 'blue',
    'UPDATE_KYC': 'purple',
    'TRANSFER_FUNDS': 'orange',
    'FREEZE_ACCOUNT': 'red',
    'INITIALIZE': 'slate'
  };
  return map[type] || 'slate';
}

function getStaffColor(staffId) {
  if (staffId === 'System') return 'purple';
  // simple hash to pick a color consistently
  const colors = ['blue', 'slate', 'emerald', 'amber'];
  let hash = 0;
  for (let i = 0; i < staffId.length; i++) {
    hash = staffId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hrs ago";
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " mins ago";
  
  return Math.floor(seconds) + " secs ago";
}
