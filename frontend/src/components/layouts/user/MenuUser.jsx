import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LogoutButton from "../../common/LogoutButton";

const MenuBar = ({ toggleSidebar }) => (
  <button
    onClick={toggleSidebar}
    className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-2xl border border-[#EADFD7] bg-[#F6EEE7] text-[#3B170D] grid place-items-center"
    type="button"
  >
    <span className="text-xl leading-none">☰</span>
  </button>
);

export const MenuUser = ({ sidebarOpen = false, setSidebarOpen = () => {} }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const sideItems = [
    { id: "dashboard", label: "Dashboard", to: "/client" },
    { id: "subscriptions", label: "Subscription History", to: "/client/subscriptions" },
    { id: "profile", label: "Profile", to: "/client/profile" },
  ];

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const handleBar = (to) => {
    if (sidebarOpen) toggleSidebar();
    navigate(to);
  };

  const isActive = (to) => {
    if (to === "/client") {
      return location.pathname === "/client" || location.pathname === "/client/dashboard";
    }
    return location.pathname.startsWith(to);
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <MenuBar toggleSidebar={toggleSidebar} />

      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 h-screen p-4 bg-[#F6EEE7] text-[#3B170D] transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="rounded-3xl border border-[#EADFD7] bg-white shadow-sm p-4 flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between mb-8 pb-5 border-b border-[#EADFD7]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F6EEE7] border border-[#EADFD7] flex items-center justify-center">
                <img src="/assets/logo2.png" alt="Logo" className="w-7 h-7 object-contain" />
              </div>
              <div className="leading-tight">
                <div className="text-lg font-instrument-serif tracking-wide">User Panel</div>
                <div className="text-xs text-[#3B170D]/55">Gold Beans</div>
              </div>
            </div>
            <button
              onClick={toggleSidebar}
              className="lg:hidden text-[#3B170D] hover:text-[#5A2A1A]"
              type="button"
            >
              ✕
            </button>
          </div>

          <nav className="space-y-1">
            {sideItems.map(({ id, label, to }) => (
              <button
                key={id}
                onClick={() => handleBar(to)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors text-left ${
                  isActive(to)
                    ? "bg-[#3B170D] text-white shadow-sm"
                    : "text-[#3B170D]/80 hover:bg-[#F6EEE7]"
                }`}
                type="button"
              >
                <span className="font-semibold">{label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-4 border-t border-[#EADFD7] space-y-3">
            <button
              onClick={() => navigate("/")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[#3B170D]/80 hover:bg-[#F6EEE7] transition-colors"
              type="button"
            >
              <span className="font-semibold">Back to Site ←</span>
            </button>

            <LogoutButton
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl bg-[#3B170D] text-white hover:bg-[#BB9582] hover:text-[#3B170D] transition-colors"
              redirectTo="/login"
            />
          </div>
        </div>
      </div>
    </>
  );
};
