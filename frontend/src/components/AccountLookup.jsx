import { useState } from "react";
import { searchAccount } from "../api/accounts";

const AccountLookup = ({
  value,
  onChange,
  onResult,
  disabled,
  placeholder = "Enter 10-digit account number",
  label = "Account Number",
  loaded,
  onReset,
  resetLabel = "New Search",
  searchLabel = "Search",
  error,
}) => {
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    setSearchError("");
    try {
      const data = await searchAccount(value);
      // Transform the data to match expected structure
      const transformed = {
        accountId: data.id,
        customerId: data.customerId, // Include customerId for KYC updates
        name: `${data.customer.firstName} ${data.customer.lastName}`,
        accountType: data.accountType,
        status: data.status,
        phone: data.customer.phone,
        accountNumber: data.id,
        customerName: `${data.customer.firstName} ${data.customer.lastName}`,
        email: data.customer.email,
        address: data.customer.address.street,
        city: data.customer.address.city,
        state: data.customer.address.state,
        zipCode: data.customer.address.zipCode,
        balance: `$${data.balance.toFixed(2)}`,
        cardNumber: data.customer?.cardNumber || "", // For card replacement
        expiryDate: data.customer?.expiryDate || "",
        cardType: data.customer?.cardType || "",
      };
      onResult(transformed);
    } catch (err) {
      setSearchError(err.message);
      onResult(null);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-white rounded border border-gray-200 p-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex gap-3">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
        />
        {!loaded ? (
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? "Searching..." : searchLabel}
          </button>
        ) : (
          <button
            onClick={onReset}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 whitespace-nowrap"
          >
            {resetLabel}
          </button>
        )}
      </div>
      {(error || searchError) && (
        <p className="text-sm text-red-500 mt-3">{error || searchError}</p>
      )}
    </div>
  );
};

export default AccountLookup;
