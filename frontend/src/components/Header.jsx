import React from "react";

const Header = React.memo(({ setIsMobileMenuOpen }) => {
  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-[#dbdee6] bg-white px-4 lg:px-6 shadow-sm flex-shrink-0">
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
        onClick={() => setIsMobileMenuOpen(true)}
      >
        <span className="material-symbols-outlined text-gray-600">menu</span>
      </button>

      {/* Profile Info */}
      <div className="flex items-center gap-4 ml-auto">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-bold text-[#111318]">John Doe</p>
          <p className="text-xs text-[#616d89]">Branch: 001 • ID: 8942</p>
        </div>
        <div className="h-9 w-9 overflow-hidden rounded-full bg-[#f0f1f4] ring-2 ring-white">
          <img
            alt="User Avatar"
            className="h-full w-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCR5_I9F2mLBprtRlCvn_vq0eW8WsQwSAx_QwKGzWZ5WMblwnt6JNMS-mQsXoEiZw9qSDKz51ir4yYp2K2j6cIdPLL0z-nMPjERNUH2PdMxaYdY0NDryhCdn01fc9AYqi8lpRo2wl-BG4DYAimyUC1EekzgKK3gvChJiRRbgJNPki-GgsorzEqb7OctkcnM6gKYL9jrdkYL1Ur-5lnIhJqMkqTnVme7XOH-j6Mu5YEYvH_3I6sF9ZVjEj4gqht_v8NtHqqam6RO574G"
          />
        </div>
      </div>
    </header>
  );
});

export default Header;
