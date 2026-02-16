import React, { useState, useEffect, useCallback } from "react";
import auditApi from "../api/audit";
import { transformAuditLog } from "../utils/auditTransformers";

const AuditLog = () => {
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Pagination States
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Data States
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debounce search query
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, actionFilter, dateFrom, dateTo]);

  // Fetch Logic
  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        limit,
        search: debouncedSearch,
        actionType: actionFilter || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      };

      const data = await auditApi.getAllLogs(params);
      
      const rawTransactions = data.transactions || [];
      const transformed = rawTransactions.map(transformAuditLog);
      
      setLogs(transformed);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalRecords(data.pagination?.total || 0);

    } catch (err) {
      console.error("Failed to load audit logs", err);
      setError("Failed to load audit logs. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, actionFilter, dateFrom, dateTo]);

  // Trigger fetch when dependencies change
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Helper functions for styling (unchanged)
  const getActionColorClasses = (color) => {
    const colors = {
      amber: "bg-amber-50 text-amber-700 border-amber-100",
      emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
      red: "bg-red-50 text-red-700 border-red-100",
      orange: "bg-orange-50 text-orange-700 border-orange-100",
      purple: "bg-purple-50 text-purple-700 border-purple-100",
      slate: "bg-slate-100 text-slate-700 border-slate-200",
      blue: "bg-blue-50 text-blue-700 border-blue-100",
    };
    return colors[color] || colors.slate;
  };

  const getStaffColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-100 text-blue-600",
      purple: "bg-purple-100 text-purple-600",
      slate: "bg-slate-100 text-slate-600",
      emerald: "bg-emerald-100 text-emerald-600",
      amber: "bg-amber-100 text-amber-600",
    };
    return colors[color] || colors.slate;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Optional: Add toast notification here
  };

  return (
    <>
      {/* Page Toolbar */}
      <header className="bg-white border-b border-slate-200 flex-shrink-0">
        <div className="px-4 lg:px-8 py-6 flex flex-wrap justify-between items-end gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-slate-900 text-xl lg:text-2xl font-black tracking-tight">
              System Audit Log
            </h1>
            <p className="text-slate-500 text-sm font-normal max-w-xl">
              Track and review all internal system actions, ledger
              modifications, and security events.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
            <span className={`text-xs font-medium px-2 py-1 rounded-full border flex items-center gap-1 ${error ? "text-red-600 bg-red-50 border-red-100" : "text-emerald-600 bg-emerald-50 border-emerald-100"}`}>
              <span className="material-symbols-outlined text-[14px]">
                {error ? "error" : "verified_user"}
              </span>
              {error ? "Connection Error" : "Live Connection"}
            </span>
            <button className="flex cursor-pointer items-center justify-center rounded-lg h-9 px-4 bg-white border border-slate-200 text-slate-700 text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors">
              <span
                className="material-symbols-outlined mr-2"
                style={{ fontSize: "18px" }}
              >
                download
              </span>
              Export CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="px-4 lg:px-8 pb-4">
          <div className="flex flex-col lg:flex-row lg:flex-wrap items-start lg:items-center gap-3">
            {/* Search */}
            <div className="relative group w-full lg:min-w-[280px] lg:w-auto">
              <span className="absolute left-3 top-2.5 text-slate-400">
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>search</span>
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                placeholder="Search Staff ID, Hash, Ref..."
              />
            </div>

            {/* Action Filter */}
            <div className="relative w-full lg:min-w-[200px] lg:w-auto">
              <span className="absolute left-3 top-2.5 text-slate-400">
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>tune</span>
              </span>
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="w-full h-10 pl-10 pr-8 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm appearance-none cursor-pointer"
              >
                <option value="">All Action Types</option>
                <option value="CREATE_ACCOUNT">Create Account</option>
                <option value="RESET_PIN">Reset Pin</option>
                <option value="REPLACE_CARD">Replace Card</option>
                <option value="TRANSFER_FUNDS">Transfer Funds</option>
                <option value="UPDATE_KYC">Update KYC</option>
                <option value="STAFF_LOGIN">Staff Login</option>
                <option value="STAFF_LOGOUT">Staff Logout</option>
              </select>
              <span className="absolute right-3 top-2.5 text-slate-400 pointer-events-none">
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>arrow_drop_down</span>
              </span>
            </div>

            <div className="hidden lg:block h-8 w-px bg-slate-200 mx-1"></div>

             {/* Date Filters (Simple implementation) */}
             <div className="flex items-center gap-2">
                <input 
                  type="date" 
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="h-10 px-3 rounded-lg border border-slate-200 text-sm text-slate-700"
                />
                <span className="text-slate-400">-</span>
                <input 
                  type="date" 
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="h-10 px-3 rounded-lg border border-slate-200 text-sm text-slate-700"
                />
             </div>
            
            {(totalRecords > 0) && (
               <div className="ml-auto text-xs text-slate-400 hidden lg:block">
                 Total Records: {totalRecords}
               </div>
            )}
          </div>
        </div>
      </header>

      {/* Table */}
      <div className="flex-1 overflow-auto p-4 lg:p-8 pt-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
          
          {loading && logs.length === 0 ? (
             <div className="flex flex-col items-center justify-center p-20 h-full">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
                <p className="text-slate-500 text-sm">Loading Blockchain Ledger...</p>
             </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center p-20 h-full text-center">
                <span className="material-symbols-outlined text-red-400 text-4xl mb-2">error</span>
                <p className="text-slate-900 font-medium mb-1">Unable to fetch logs</p>
                <p className="text-slate-500 text-sm max-w-sm">{error}</p>
                <button 
                  onClick={() => fetchLogs()}
                  className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700 transition"
                >
                  Retry
                </button>
             </div>
          ) : logs.length === 0 ? (
             <div className="flex flex-col items-center justify-center p-20 h-full text-center">
                <span className="material-symbols-outlined text-slate-300 text-4xl mb-2">search_off</span>
                <p className="text-slate-500 text-sm">No audit logs found matching your filters.</p>
             </div>
          ) : (
            <>
              {loading && (
                <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/50">
                      <th className="px-3 lg:px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider w-[200px]">
                        Timestamp (UTC)
                      </th>
                      <th className="px-3 lg:px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider w-[220px]">
                        Staff ID
                      </th>
                      <th className="px-3 lg:px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider w-[200px]">
                        Action Type
                      </th>
                      <th className="px-3 lg:px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Customer / Account Ref
                      </th>
                      <th className="px-3 lg:px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Ledger Hash
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {logs.map((entry) => (
                      <tr
                        key={entry.id}
                        className="group hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-3 lg:px-6 py-3 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-900">
                              {entry.timestamp}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 lg:px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div
                              className={`size-6 rounded-full ${getStaffColorClasses(entry.staffColor)} flex items-center justify-center text-[10px] font-bold`}
                            >
                              {entry.staffInitials}
                            </div>
                            <span className="text-sm text-slate-700">
                              {entry.staffId}{" "}
                              {entry.staffRole && entry.staffRole !== 'Staff' && (
                                <span className="text-xs text-slate-400">
                                  ({entry.staffRole})
                                </span>
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 lg:px-6 py-3 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getActionColorClasses(entry.actionColor)}`}
                          >
                            {entry.actionType}
                          </span>
                        </td>
                        <td className="px-3 lg:px-6 py-3 whitespace-nowrap">
                          {entry.customerRef === "GLOBAL_LEDGER" ? (
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-bold text-slate-700">
                                GLOBAL_LEDGER
                              </span>
                            </div>
                          ) : entry.customerRef ? (
                            <div className="flex items-center gap-1.5 group/link cursor-pointer">
                              <span className="text-sm font-semibold text-primary">
                                {entry.customerRef}
                              </span>
                              {entry.accountRef && (
                                <>
                                  <span className="text-slate-300">/</span>
                                  <span className="text-sm text-slate-600">
                                    {entry.accountRef}
                                  </span>
                                </>
                              )}
                              <span className="material-symbols-outlined text-slate-300 group-hover/link:text-primary transition-colors text-[14px] ml-1 opacity-0 group-hover/link:opacity-100">
                                open_in_new
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-slate-400 italic">
                              N/A
                            </span>
                          )}
                        </td>
                        <td className="px-3 lg:px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded border border-purple-100 max-w-[100px] truncate" title={entry.ledgerHash}>
                              {entry.ledgerHash.slice(0, 12)}...
                            </code>
                            <button
                              onClick={() => copyToClipboard(entry.ledgerHash)}
                              className="text-slate-400 hover:text-purple-600 transition-colors p-1 rounded hover:bg-purple-50"
                              title="Copy Full Hash"
                            >
                              <span className="material-symbols-outlined text-[16px]">
                                content_copy
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-white px-4 lg:px-6 py-4 border-t border-slate-200 flex items-center justify-between mt-auto">
                <div className="text-sm text-slate-500">
                  Showing page <span className="font-medium text-slate-900">{page}</span> of <span className="font-medium text-slate-900">{totalPages}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1 || loading}
                    className="flex items-center px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button 
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages || loading}
                    className="flex items-center px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AuditLog;
