import { useState } from "react";
import resetPin from "../api/resetPin";
import AccountDetails from "../components/AccountDetails";
import AccountLookup from "../components/AccountLookup";

const ResetPin = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [customer, setCustomer] = useState(null);
  const [verified, setVerified] = useState(false);

  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lookupError, setLookupError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (newPin !== confirmPin) {
      setError("PINs do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await resetPin(accountNumber, newPin);
      if (response.ok) {
        alert("PIN reset successful!");
        // Reset form
        setAccountNumber("");
        setCustomer(null);
        setVerified(false);
        setNewPin("");
        setConfirmPin("");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to reset PIN");
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
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
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              1. Account Lookup
            </h2>
            <AccountLookup
              value={accountNumber}
              onChange={setAccountNumber}
              onResult={(result) => {
                setCustomer(result);
                setVerified(false);
                setLookupError(
                  result ? "" : "No account found for this number."
                );
              }}
              disabled={!!customer}
              loaded={!!customer}
              onReset={() => {
                setAccountNumber("");
                setCustomer(null);
                setVerified(false);
                setLookupError("");
              }}
              error={lookupError}
            />
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
                disabled={!verified || loading}
                className="px-6 h-11 bg-primary text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? "Resetting..." : "Submit PIN Reset"}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>

        {/* Right Column: Account Details */}
        <div className="lg:col-span-5">
          <AccountDetails
            customer={customer}
            verified={verified}
            onVerifiedChange={setVerified}
          />
        </div>
      </div>
    </div>
  );
};

export default ResetPin;
