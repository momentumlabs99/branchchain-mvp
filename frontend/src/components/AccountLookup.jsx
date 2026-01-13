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
  dataType = "customers",
}) => {
  // Mock data - centralized here
  const mockData = {
    customers: {
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
      1111111111: {
        accountNumber: "1111111111",
        customerName: "John Doe",
        email: "john.doe@example.com",
        phone: "+254712345678",
        address: "123 mombasa rd",
        city: "Mombasa",
        state: "KZN",
        zipCode: "10005",
      },
    },
    cards: {
      1111111111: {
        accountNumber: "1111111111",
        customerName: "John Doe",
        cardNumber: "**** **** **** 4242",
        expiryDate: "12/24",
        cardType: "VISA Debit",
        status: "Active",
      },
    },
  };

  const handleSearch = () => {
    const result = mockData[dataType][value];
    onResult(result);
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
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {searchLabel}
          </button>
        ) : (
          <button
            onClick={onReset}
            className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
          >
            {resetLabel}
          </button>
        )}
      </div>
      {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
    </div>
  );
};

export default AccountLookup;
