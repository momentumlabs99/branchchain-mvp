import { useState } from "react";

/**
 * Mock customer data (simulating backend lookup)
 */
const MOCK_ACCOUNTS = {
  1234567890: {
    name: "Sarah Jenkins",
    accountType: "Savings",
    status: "Active",
    phone: "***-***-9921",
  },
  9876543210: {
    name: "Michael Brown",
    accountType: "Checking",
    status: "Active",
    phone: "***-***-4402",
  },
};

const ResetPin = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [customer, setCustomer] = useState(null);
  const [verified, setVerified] = useState(false);

  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showPin, setShowPin] = useState(false);

  const handleLookup = () => {
    const result = MOCK_ACCOUNTS[accountNumber];
    setCustomer(result || null);
    setVerified(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("PIN reset submitted:", {
      accountNumber,
      newPin,
    });

    alert("PIN reset action submitted (mock)");
  };

  return (
    <div className="w-full flex flex-col gap-8 p-4 lg:p-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Reset Customer PIN
        </h1>
        <p className="text-sm text-slate-500 max-w-xl">
          Search for a customer account, confirm identity, then reset the PIN.
          All actions are logged for audit purposes.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Account Lookup */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              1. Account Lookup
            </h2>

            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter 10-digit account number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="flex-1 h-11 rounded-lg border border-slate-300 px-3 focus:ring-2 focus:ring-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={handleLookup}
                className="px-6 h-11 bg-primary text-white rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Search
              </button>
            </div>

            {!customer && accountNumber && (
              <p className="text-sm text-red-500 mt-3">
                No account found for this number.
              </p>
            )}
          </div>

          {/* PIN Reset */}
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col gap-6"
          >
            <h2 className="text-lg font-bold text-slate-900">2. Reset PIN</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  New PIN
                </label>
                <input
                  type={showPin ? "text" : "password"}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  disabled={!verified}
                  placeholder="••••"
                  className="w-full h-11 rounded-lg border border-slate-300 px-3 focus:ring-2 focus:ring-primary focus:outline-none disabled:bg-slate-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Confirm PIN
                </label>
                <input
                  type={showPin ? "text" : "password"}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  disabled={!verified}
                  placeholder="••••"
                  className="w-full h-11 rounded-lg border border-slate-300 px-3 focus:ring-2 focus:ring-primary focus:outline-none disabled:bg-slate-100"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="text-sm rounded bg-blue-300 p-1.5 text-slate-900 hover:text-white hover:bg-blue-700 transition"
                disabled={!verified}
              >
                {showPin ? "Hide PIN" : "Show PIN"}
              </button>

              <button
                type="submit"
                disabled={!verified}
                className="px-6 h-11 bg-primary text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
              >
                Submit PIN Reset
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Account Details */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm h-full">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              Account Details
            </h3>

            {!customer ? (
              <p className="text-sm text-slate-500">
                Search for an account to view customer details.
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-xs text-slate-500">Customer Name</p>
                  <p className="font-medium text-slate-900">{customer.name}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Account Type</p>
                  <p className="font-medium text-slate-900">
                    {customer.accountType}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Status</p>
                  <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                    {customer.status}
                  </span>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Phone</p>
                  <p className="font-medium text-slate-900">{customer.phone}</p>
                </div>

                {/* Confirmation */}
                <label className="flex items-start gap-3 mt-4 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={verified}
                    onChange={(e) => setVerified(e.target.checked)}
                  />
                  <span>
                    I confirm this is the correct account and identity
                    verification has been completed.
                  </span>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPin;
