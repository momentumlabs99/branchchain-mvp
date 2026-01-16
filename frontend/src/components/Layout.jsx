import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Derive currentPage from location.pathname
  const currentPage = location.pathname.split("/")[1] || "dashboard";
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        currentPage={currentPage}
      />

      {/* Main Content */}
      <main className="flex h-full flex-1 flex-col overflow-y-auto bg-background-light">
        {/* Header */}
        <Header setIsMobileMenuOpen={setIsMobileMenuOpen} />

        {/* Page Content */}
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
