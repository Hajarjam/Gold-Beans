import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LogoutButton from "../../common/LogoutButton";

const MenuBar = ({ toggleSidebar }) => (
  <button
    onClick={toggleSidebar}
    className="lg:hidden fixed top-4 left-4 z-50 bg-charcoal text-peach px-3 py-2 rounded"
  >
    ☰
  </button>
);

export const MenuUser = ({ sidebarOpen = false, setSidebarOpen = () => {} }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const sideItems = [
    { id: "dashboard", label: "Dashboard", to: "/client" },
    { id: "subscriptions", label: "Subscriptions History", to: "/client/subscriptions" },
    { id: "profile", label: "Profile", to: "/client/profile" },
  ];

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const handleBar = (to) => {
    if (sidebarOpen) toggleSidebar();
    navigate(to);
  };

  const isActive = (to) => {
    if (to === "/client") return location.pathname === "/client" || location.pathname === "/client/dashboard";
    return location.pathname.startsWith(to);
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-charcoal/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <MenuBar toggleSidebar={toggleSidebar} />

      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 h-screen bg-charcoal text-peach transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col`}
      >
        <div className="p-6 flex-1 overflow-hidden">
          <div className="flex items-center justify-between mb-10 pb-5 border-b border-peach/50">
            <div className="flex items-center gap-3">
              <img src="/assets/logo.png" alt="Logo" className="w-10 h-10" />
              <span className="text-lg font-instrument-serif tracking-wide">The Beans</span>
            </div>
            <button onClick={toggleSidebar} className="lg:hidden text-peach hover:text-peach">
              ✕
            </button>
          </div>

          <nav className="space-y-1">
            {sideItems.map(({ id, label, to }) => (
              <button
                key={id}
                onClick={() => handleBar(to)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                  isActive(to)
                    ? "bg-brown text-peach"
                    : "text-peach hover:bg-brown/50 hover:text-peach"
                }`}
              >
                <span className="font-instrument-serif">{label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6 border-t border-charcoal space-y-3">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-peach hover:bg-brown/50 hover:text-peach transition-colors"
          >
            <span className="font-instrument-serif">Back to Site ←</span>
          </button>

          <LogoutButton
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-brown text-peach hover:bg-peach hover:text-charcoal transition-colors"
            redirectTo="/login"
          />
        </div>
      </div>
    </>
  );
};
