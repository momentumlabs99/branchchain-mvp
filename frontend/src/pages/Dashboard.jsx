import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [accountNumber, setAccountNumber] = useState("");
  const [accountDetails, setAccountDetails] = useState(null);

  // fake data lookup for demo, replace with actual API call later
  const handleLookup = () => {
    // demo: returns dummy data
    const dummyData = {
      "00000000": { name: "John Doe", balance: "$5,230.00", status: "Active" },
      11111111: { name: "M. Silva", balance: "$1,200.00", status: "Active" },
      22222222: { name: "J. Charana", balance: "$0.00", status: "Pending" },
    };
    setAccountDetails(dummyData[accountNumber] || null);
  };

  return (
    <>
      {/* Dashboard Content */}
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-4 lg:p-8">
        {/* Welcome Section */}
        <div>
          <h2 className="text-xl lg:text-2xl font-bold leading-tight tracking-tight text-[#111318]">
            Overview
          </h2>
          <p className="text-[#616d89] text-sm lg:text-base">
            Welcome back, John Doe.
          </p>
        </div>

        {/* Quick Actions Grid */}
        <section>
          <h3 className="mb-4 text-lg font-bold text-[#111318]">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1 */}
            <div
              className="group relative flex cursor-pointer flex-col gap-4 rounded-xl border border-[#dbdee6] bg-white p-5 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
              onClick={() => navigate("/create-account")}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                <span className="material-symbols-outlined text-[28px]">
                  how_to_reg
                </span>
              </div>
              <div>
                <h4 className="text-base font-semibold text-[#111318]">
                  New Account
                </h4>
                <p className="text-sm text-[#616d89]">Onboard customer</p>
              </div>
            </div>
            {/* Card 2 */}
            <div
              className="group relative flex cursor-pointer flex-col gap-4 rounded-xl border border-[#dbdee6] bg-white p-5 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
              onClick={() => navigate("/reset-pin")}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50 text-orange-600 transition-colors group-hover:bg-orange-600 group-hover:text-white">
                <span className="material-symbols-outlined text-[28px]">
                  lock_reset
                </span>
              </div>
              <div>
                <h4 className="text-base font-semibold text-[#111318]">
                  Reset PIN
                </h4>
                <p className="text-sm text-[#616d89]">Security reset</p>
              </div>
            </div>
            {/* Card 3 */}
            <div
              className="group relative flex cursor-pointer flex-col gap-4 rounded-xl border border-[#dbdee6] bg-white p-5 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
              onClick={() => navigate("/replace-card")}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50 text-purple-600 transition-colors group-hover:bg-purple-600 group-hover:text-white">
                <span className="material-symbols-outlined text-[28px]">
                  credit_card
                </span>
              </div>
              <div>
                <h4 className="text-base font-semibold text-[#111318]">
                  Replace Card
                </h4>
                <p className="text-sm text-[#616d89]">Issue replacement</p>
              </div>
            </div>
            {/* Card 4 */}
            <div
              className="group relative flex cursor-pointer flex-col gap-4 rounded-xl border border-[#dbdee6] bg-white p-5 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
              onClick={() => navigate("/update-kyc")}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-50 text-teal-600 transition-colors group-hover:bg-teal-600 group-hover:text-white">
                <span className="material-symbols-outlined text-[28px]">
                  badge
                </span>
              </div>
              <div>
                <h4 className="text-base font-semibold text-[#111318]">
                  Update KYC
                </h4>
                <p className="text-sm text-[#616d89]">Document check</p>
              </div>
            </div>
          </div>
        </section>

        {/* Account Lookup Section */}
        <section className="flex flex-col gap-4">
          <h3 className="text-lg font-bold text-[#111318]">Account Lookup</h3>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Input Area */}
            <div className="flex flex-col gap-2 w-full lg:w-1/3">
              <label className="text-sm font-medium text-[#616d89]">
                Enter Account Number
              </label>
              <input
                type="text"
                className="rounded-lg border border-[#dbdee6] bg-white px-3 py-2 text-sm focus:border-primary focus:ring focus:ring-primary/20"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="e.g., 9921-0032"
              />
              <button
                onClick={handleLookup}
                className="mt-2 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90"
              >
                Lookup
              </button>
            </div>

            {/* Details Area */}
            <div className="flex-1 rounded-xl border border-[#dbdee6] bg-white p-5 shadow-sm">
              {accountDetails ? (
                <div className="flex flex-col gap-3">
                  <div>
                    <span className="font-semibold text-[#111318]">
                      Account:
                    </span>{" "}
                    {accountNumber}
                  </div>
                  <div>
                    <span className="font-semibold text-[#111318]">Name:</span>{" "}
                    {accountDetails.name}
                  </div>
                  <div>
                    <span className="font-semibold text-[#111318]">
                      Balance:
                    </span>{" "}
                    {accountDetails.balance}
                  </div>
                  <div>
                    <span className="font-semibold text-[#111318]">
                      Status:
                    </span>{" "}
                    {accountDetails.status}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-[#616d89]">
                  Enter an account number to see details
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Dashboard;
