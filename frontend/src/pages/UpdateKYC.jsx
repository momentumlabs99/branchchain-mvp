import { useState } from "react";

const UpdateKYC = () => {
  const [searchAccount, setSearchAccount] = useState("");
  const [customerLoaded, setCustomerLoaded] = useState(false);
  const [formData, setFormData] = useState({
    accountNumber: "",
    customerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [status, setStatus] = useState("");

  // Mock customer data - replace with actual API call
  const mockCustomerData = {
    11111111: {
      accountNumber: "11111111",
      customerName: "John Doe",
      email: "john.doe@example.com",
      phone: "+254712345678",
      address: "123 mombasa rd",
      city: "Mombasa",
      state: "KZN",
      zipCode: "10005",
    },
  };

  const handleSearch = () => {
    // TODO: Replace with actual API call
    const customer = mockCustomerData[searchAccount];

    if (customer) {
      setFormData(customer);
      setCustomerLoaded(true);
      setStatus("");
    } else {
      setStatus("Account not found");
      setCustomerLoaded(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Updating KYC:", formData);
    setStatus("KYC information updated successfully");
    // TODO: Call API to update KYC
  };

  const handleReset = () => {
    setSearchAccount("");
    setCustomerLoaded(false);
    setFormData({
      accountNumber: "",
      customerName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
    });
    setStatus("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="w-full flex flex-col gap-6 pb-12">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Update KYC Information
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Search for account and update customer information
          </p>
        </div>

        {/* Status Message */}
        {status && (
          <div
            className={`p-4 border rounded text-sm ${
              status.includes("success")
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {status}
          </div>
        )}

        {/* Search Box */}
        <div className="bg-white rounded border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Account Number
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={searchAccount}
              onChange={(e) => setSearchAccount(e.target.value)}
              placeholder="Enter account number"
              disabled={customerLoaded}
              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
            />
            {!customerLoaded ? (
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Search
              </button>
            ) : (
              <button
                onClick={handleReset}
                className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                New Search
              </button>
            )}
          </div>
        </div>

        {/* Customer Form - Only shows after search */}
        {customerLoaded && (
          <div className="bg-white rounded border border-gray-200 p-6">
            {/* Customer Info */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Customer
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={formData.accountNumber}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={formData.customerName}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-gray-600"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Address Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select</option>
                      <option value="NY">NY</option>
                      <option value="CA">CA</option>
                      <option value="TX">TX</option>
                      <option value="FL">FL</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Zip Code *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={handleReset}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Update KYC
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateKYC;
