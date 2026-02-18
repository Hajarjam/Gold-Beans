import React, { useState } from 'react';


export const MenuUser = ({ sidebarOpen, setSidebarOpen }) => {
  const [activePage, setActivePage] = useState('dashboard');

  const sideItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'subscriptions', label: 'Subscriptions History' },
    { id: 'profile', label: 'Profile' },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleBar = (id) => {
    setActivePage(id);
    if (sidebarOpen) toggleSidebar();
  };

  const handleLogout = () => {
    console.log('Logout');
    // Add logout logic here
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 h-screen
        bg-charcoal text-peach
        transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        flex flex-col
      `}>
        <div className="p-6 flex-1 overflow-hidden">

          {/* Logo */}
          <div className="flex items-center justify-between mb-10 pb-5 border-b border-[#3d2517]">
            <div className="flex items-center gap-3">
              <img src="/assets/logo.png" alt="Logo" className="w-10 h-10" />
              <span className="text-lg font-instrument-sans tracking-wide">The Beans</span>
            </div>
            <button onClick={toggleSidebar} className="lg:hidden text-peach hover:text-white">
              ✕
            </button>
          </div>

          {/* items */}
          <nav className="space-y-1">
            {sideItems.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => handleBar(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                  activePage === id
                    ? 'bg-[#4a2f1f] text-[#f5f0e8]'
                    : 'text-[#d4a574] hover:bg-[#2d1810] hover:text-[#f5f0e8]'
                }`}
              >
                <span className="font-serif">{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Back to landing and Logout */}
        <div className="p-6 border-t border-charcoal space-y-3">
          <button
            onClick={() => handleBar('landing')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-peach hover:bg-[#2d1810] hover:text-[#f5f0e8] transition-colors"
          >
            <span className="font-serif">Back to Site &larr; </span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-serif"
          >
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
