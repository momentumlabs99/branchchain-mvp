import { useState } from "react";

const CreateAccount = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    nationalId: "",
    phone: "",
    email: "",
    accountType: "",
    deposit: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Create customer account:", formData);
    // TODO: Implement account creation logic
  };

  return (
    <>
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto bg-[#f6f6f8] p-4 lg:p-8">
        <div className="w-full flex flex-col gap-8 pb-12">
          {/* Page Title */}
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
              Create New Customer Account
            </h1>
            <p className="text-slate-500 text-sm lg:text-base">
              Enter client details below to initialize a new ledger entry and
              profile.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-xl shadow-sm border border-[#e5e7eb] overflow-hidden">
            <form className="divide-y divide-[#e5e7eb]" onSubmit={handleSubmit}>
              {/* Section 1: Personal Details */}
              <div className="p-4 lg:p-8">
                <div className="flex items-center gap-2 mb-6 text-slate-900">
                  <span className="w-1 h-6 bg-primary rounded-full"></span>
                  <h2 className="text-lg font-bold">Personal Details</h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-6">
                  <div className="col-span-1 lg:col-span-2 space-y-2">
                    <label
                      className="block text-sm font-medium text-slate-700"
                      htmlFor="fullName"
                    >
                      Full Legal Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-slate-400 text-lg">
                          person
                        </span>
                      </div>
                      <input
                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-shadow"
                        id="fullName"
                        name="fullName"
                        placeholder="e.g. Johnathan Doe"
                        type="text"
                        value={formData.fullName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-1 space-y-2">
                    <label
                      className="block text-sm font-medium text-slate-700"
                      htmlFor="nationalId"
                    >
                      National ID
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-slate-400 text-lg">
                          badge
                        </span>
                      </div>
                      <input
                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-shadow"
                        id="nationalId"
                        name="nationalId"
                        placeholder="XXX-XXX-XXXX"
                        type="text"
                        value={formData.nationalId}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-1 space-y-2">
                    <label
                      className="block text-sm font-medium text-slate-700"
                      htmlFor="phone"
                    >
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-slate-400 text-lg">
                          call
                        </span>
                      </div>
                      <input
                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-shadow"
                        id="phone"
                        name="phone"
                        placeholder="+245 70000-0000"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-span-1 lg:col-span-2 space-y-2">
                    <label
                      className="block text-sm font-medium text-slate-700"
                      htmlFor="email"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-slate-400 text-lg">
                          mail
                        </span>
                      </div>
                      <input
                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-shadow"
                        id="email"
                        name="email"
                        placeholder="client@example.com"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Account Configuration */}
              <div className="p-4 lg:p-8 bg-slate-50/50">
                <div className="flex items-center gap-2 mb-6 text-slate-900">
                  <span className="w-1 h-6 bg-primary rounded-full"></span>
                  <h2 className="text-lg font-bold">Account Configuration</h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-6">
                  <div className="col-span-1 space-y-2">
                    <label
                      className="block text-sm font-medium text-slate-700"
                      htmlFor="accountType"
                    >
                      Account Type
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-slate-400 text-lg">
                          account_balance_wallet
                        </span>
                      </div>
                      <select
                        className="block w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-shadow appearance-none"
                        id="accountType"
                        name="accountType"
                        value={formData.accountType}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Type...</option>
                        <option value="checking">Checking Account</option>
                        <option value="savings">Savings Account</option>
                        <option value="investment">Investment Account</option>
                        <option value="business">Business Checking</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-slate-400 text-lg">
                          expand_more
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1 space-y-2">
                    <label
                      className="block text-sm font-medium text-slate-700"
                      htmlFor="deposit"
                    >
                      Initial Deposit
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-slate-400 font-semibold">$</span>
                      </div>
                      <input
                        className="block w-full pl-8 pr-3 py-2.5 border border-slate-300 rounded-lg text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-shadow"
                        id="deposit"
                        name="deposit"
                        placeholder="0.00"
                        step="0.01"
                        type="number"
                        value={formData.deposit}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="px-4 lg:px-8 py-6 bg-slate-50 flex flex-col sm:flex-row items-center justify-end gap-3">
                <button
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-primary hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-sm hover:shadow flex items-center justify-center gap-2"
                  type="submit"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    check
                  </span>
                  Create Account
                </button>
              </div>
            </form>
          </div>

          {/* Helper Text */}
          <p className="text-center text-xs text-slate-400">
            By clicking "Create Account", you confirm that all KYC requirements
            have been met and verified.
          </p>
        </div>
      </div>
    </>
  );
};

export default CreateAccount;
