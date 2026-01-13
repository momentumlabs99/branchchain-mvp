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
  // Mock data - centralized here
  const mockData = {
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
      name: "John Doe",
      accountType: "Savings",
      status: "Active",
      phone: "+254712345678",
      accountNumber: "1111111111",
      customerName: "John Doe",
      email: "john.doe@example.com",
      address: "123 mombasa rd",
      city: "Mombasa",
      state: "KZN",
      zipCode: "10005",
      cardNumber: "**** **** **** 4242",
      expiryDate: "12/24",
      cardType: "VISA Debit",
      balance: "$5,230.00",
    },
    2222222222: {
      name: "M. Silva",
      accountType: "Checking",
      status: "Active",
      phone: "***-***-4402",
      balance: "$1,200.00",
    },
    3333333333: {
      name: "J. Charana",
      accountType: "Savings",
      status: "Pending",
      phone: "***-***-1234",
      balance: "$0.00",
    },
  };

  const handleSearch = () => {
    const result = mockData[value];
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
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 whitespace-nowrap"
          >
            {searchLabel}
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
      {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
    </div>
  );
};

export default AccountLookup;
