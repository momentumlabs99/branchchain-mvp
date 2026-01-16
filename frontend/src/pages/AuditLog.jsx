import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AuditLog = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("");

  const auditEntries = [
    {
      id: 1,
      timestamp: "2023-10-27 14:22:01",
      timeAgo: "12 mins ago",
      staffId: "ST-8842",
      staffRole: "Admin",
      staffInitials: "ST",
      staffColor: "blue",
      actionType: "Manual Adjustment",
      actionColor: "amber",
      customerRef: "CUS-99281",
      accountRef: "ACC-22",
      ledgerHash: "8f1a...b29c",
    },
    {
      id: 2,
      timestamp: "2023-10-27 13:45:12",
      timeAgo: "48 mins ago",
      staffId: "ST-1029",
      staffRole: "Staff",
      staffInitials: "ST",
      staffColor: "slate",
      actionType: "Funds Transfer",
      actionColor: "emerald",
      customerRef: "CUS-10293",
      accountRef: "ACC-01",
      ledgerHash: "7b2x...991a",
    },
    {
      id: 3,
      timestamp: "2023-10-27 11:10:05",
      timeAgo: "3 hrs ago",
      staffId: "ST-8842",
      staffRole: "Admin",
      staffInitials: "ST",
      staffColor: "blue",
      actionType: "Account Freeze",
      actionColor: "red",
      customerRef: "CUS-55412",
      accountRef: "ACC-09",
      ledgerHash: "c441...d11f",
    },
    {
      id: 4,
      timestamp: "2023-10-27 09:30:00",
      timeAgo: "5 hrs ago",
      staffId: "SYSTEM_BOT",
      staffRole: null,
      staffInitials: "SY",
      staffColor: "purple",
      actionType: "Auto-Reconcile",
      actionColor: "slate",
      customerRef: "GLOBAL_LEDGER",
      accountRef: null,
      ledgerHash: "a11b...002k",
    },
    {
      id: 5,
      timestamp: "2023-10-27 09:15:22",
      timeAgo: "5 hrs ago",
      staffId: "John Doe",
      staffRole: "Manager",
      staffInitials: "JD",
      staffColor: "slate",
      actionType: "Limit Override",
      actionColor: "orange",
      customerRef: "CUS-99123",
      accountRef: "ACC-44",
      ledgerHash: "f99z...112p",
    },
    {
      id: 6,
      timestamp: "2023-10-27 08:05:41",
      timeAgo: "6 hrs ago",
      staffId: "John Doe",
      staffRole: "Admin",
      staffInitials: "JD",
      staffColor: "blue",
      actionType: "Report Generated",
      actionColor: "slate",
      customerRef: null,
      accountRef: null,
      ledgerHash: "r221...p009",
    },
  ];

  const getActionColorClasses = (color) => {
    const colors = {
      amber: "bg-amber-50 text-amber-700 border-amber-100",
      emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
      red: "bg-red-50 text-red-700 border-red-100",
      orange: "bg-orange-50 text-orange-700 border-orange-100",
      slate: "bg-slate-100 text-slate-700 border-slate-200",
    };
    return colors[color] || colors.slate;
  };

  const getStaffColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-100 text-blue-600",
      purple: "bg-purple-100 text-purple-600",
      slate: "bg-slate-100 text-slate-600",
    };
    return colors[color] || colors.slate;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
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
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">
                verified_user
              </span>
              Live Connection
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
            <div className="relative group w-full lg:min-w-[280px] lg:w-auto">
              <span className="absolute left-3 top-2.5 text-slate-400">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "20px" }}
                >
                  search
                </span>
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                placeholder="Search Staff ID, Customer Ref..."
              />
            </div>

            <div className="relative w-full lg:min-w-[200px] lg:w-auto">
              <span className="absolute left-3 top-2.5 text-slate-400">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "20px" }}
                >
                  tune
                </span>
              </span>
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="w-full h-10 pl-10 pr-8 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm appearance-none cursor-pointer"
              >
                <option value="">All Action Types</option>
                <option value="transfer">Funds Transfer</option>
                <option value="adjustment">Manual Adjustment</option>
                <option value="freeze">Account Freeze</option>
                <option value="override">Limit Override</option>
              </select>
              <span className="absolute right-3 top-2.5 text-slate-400 pointer-events-none">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "20px" }}
                >
                  arrow_drop_down
                </span>
              </span>
            </div>

            <div className="hidden lg:block h-8 w-px bg-slate-200 mx-1"></div>

            <div className="flex items-center rounded-lg border border-slate-200 bg-white p-1 shadow-sm h-10 w-full lg:w-auto">
              <button className="px-3 h-full flex items-center gap-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md transition-colors">
                <span
                  className="material-symbols-outlined text-slate-400"
                  style={{ fontSize: "18px" }}
                >
                  calendar_today
                </span>
                Oct 1, 2023
              </button>
              <span className="text-slate-300 mx-1">→</span>
              <button className="px-3 h-full flex items-center gap-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md transition-colors">
                Oct 31, 2023
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Table */}
      <div className="flex-1 overflow-auto p-4 lg:p-8 pt-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
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
                {auditEntries.map((entry) => (
                  <tr
                    key={entry.id}
                    className="group hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-3 lg:px-6 py-3 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-900">
                          {entry.timestamp}
                        </span>
                        <span className="text-xs text-slate-400">
                          {entry.timeAgo}
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
                          {entry.staffRole && (
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
                          N/A (System Wide)
                        </span>
                      )}
                    </td>
                    <td className="px-3 lg:px-6 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded border border-purple-100">
                          {entry.ledgerHash}
                        </code>
                        <button
                          onClick={() => copyToClipboard(entry.ledgerHash)}
                          className="text-slate-400 hover:text-purple-600 transition-colors p-1 rounded hover:bg-purple-50"
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
              Showing <span className="font-medium text-slate-900">1</span> to{" "}
              <span className="font-medium text-slate-900">6</span> of{" "}
              <span className="font-medium text-slate-900">2,492</span> results
            </div>
            <div className="flex gap-2">
              <button
                disabled
                className="flex items-center px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button className="flex items-center px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuditLog;
