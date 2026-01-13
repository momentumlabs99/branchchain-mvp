import { Link } from "react-router-dom";

const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen, currentPage }) => {
  return (
    <aside
      className={`${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-50 w-64 flex-col border-r border-[#dbdee6] bg-white transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:flex min-h-screen`}
    >
      <div className="flex h-full flex-col justify-between p-4">
        <div className="flex flex-col gap-6">
          {/* Brand */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
                <span className="material-symbols-outlined text-[24px]">
                  account_balance
                </span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-[#111318] text-lg font-bold leading-tight">
                  BranchChain
                </h1>
                <p className="text-[#616d89] text-xs font-normal">
                  Staff Portal
                </p>
              </div>
            </div>
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="material-symbols-outlined text-gray-600">
                close
              </span>
            </button>
          </div>
          {/* Navigation */}
          <nav className="flex flex-col gap-1">
            <Link
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                currentPage === "dashboard"
                  ? "bg-primary/10 text-primary"
                  : "text-[#616d89] hover:bg-[#f0f1f4] hover:text-[#111318]"
              }`}
              to="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontVariationSettings:
                    currentPage === "dashboard" ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                dashboard
              </span>
              <span
                className={`text-sm ${currentPage === "dashboard" ? "font-semibold" : "font-medium"}`}
              >
                Dashboard
              </span>
            </Link>
            <Link
              className={`group flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                currentPage === "create-account"
                  ? "bg-primary/10 text-primary"
                  : "text-[#616d89] hover:bg-[#f0f1f4] hover:text-[#111318]"
              }`}
              to="/create-account"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span
                className={`material-symbols-outlined ${
                  currentPage === "create-account"
                    ? "text-primary"
                    : "text-[#616d89] group-hover:text-[#111318]"
                }`}
              >
                person_add
              </span>
              <span
                className={`text-sm ${currentPage === "create-account" ? "font-semibold" : "font-medium"}`}
              >
                Create Account
              </span>
            </Link>
            <Link
              className={`group flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                currentPage === "reset-pin"
                  ? "bg-primary/10 text-primary"
                  : "text-[#616d89] hover:bg-[#f0f1f4] hover:text-[#111318]"
              }`}
              to="/reset-pin"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span
                className={`material-symbols-outlined ${
                  currentPage === "reset-pin"
                    ? "text-primary"
                    : "text-[#616d89] group-hover:text-[#111318]"
                }`}
              >
                lock_reset
              </span>
              <span
                className={`text-sm ${currentPage === "reset-pin" ? "font-semibold" : "font-medium"}`}
              >
                Reset PIN
              </span>
            </Link>
            <Link
              className={`group flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                currentPage === "update-kyc"
                  ? "bg-primary/10 text-primary"
                  : "text-[#616d89] hover:bg-[#f0f1f4] hover:text-[#111318]"
              }`}
              to="/update-kyc"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span
                className={`material-symbols-outlined ${
                  currentPage === "update-kyc"
                    ? "text-primary"
                    : "text-[#616d89] group-hover:text-[#111318]"
                }`}
              >
                badge
              </span>
              <span
                className={`text-sm ${currentPage === "update-kyc" ? "font-semibold" : "font-medium"}`}
              >
                Update KYC
              </span>
            </Link>
            <Link
              className={`group flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                currentPage === "replace-card"
                  ? "bg-primary/10 text-primary"
                  : "text-[#616d89] hover:bg-[#f0f1f4] hover:text-[#111318]"
              }`}
              to="/replace-card"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span
                className={`material-symbols-outlined ${
                  currentPage === "replace-card"
                    ? "text-primary"
                    : "text-[#616d89] group-hover:text-[#111318]"
                }`}
              >
                credit_card
              </span>
              <span
                className={`text-sm ${currentPage === "replace-card" ? "font-semibold" : "font-medium"}`}
              >
                Replace Card
              </span>
            </Link>
            <a
              className="group flex items-center gap-3 rounded-lg px-3 py-2 text-[#616d89] hover:bg-[#f0f1f4] hover:text-[#111318] transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined text-[#616d89] group-hover:text-[#111318]">
                description
              </span>
              <span className="text-sm font-medium">Audit Logs</span>
            </a>
          </nav>
        </div>
        {/* Footer User Settings */}
        <div className="flex flex-col gap-2 border-t border-[#dbdee6] pt-4">
          <a
            className="group flex items-center gap-3 rounded-lg px-3 py-2 text-[#616d89] hover:bg-[#f0f1f4] hover:text-[#111318] transition-colors"
            href="#"
          >
            <span className="material-symbols-outlined text-[#616d89] group-hover:text-[#111318]">
              person
            </span>
            <span className="text-sm font-medium">Profile</span>
          </a>
          <Link
            className="group flex items-center gap-3 rounded-lg px-3 py-2 text-[#616d89] hover:bg-[#f0f1f4] hover:text-[#111318] transition-colors"
            to="/"
          >
            <span className="material-symbols-outlined text-[#616d89] group-hover:text-[#111318]">
              logout
            </span>
            <span className="text-sm font-medium">Sign Out</span>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
