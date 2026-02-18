import React, { useState } from 'react';
import NewProducts from '../dashboard/NewProducts.jsx';
import SubscriptionPlans from '../dashboard/SubscriptionPlans.jsx';
import DeliveryCalendar from '../dashboard/DeliveryCalendar.jsx';
import SubscriptionHistorySummary from '../dashboard/SubPreview.jsx';

const MainDash = ({ setActivePage, sidebarOpen, setSidebarOpen }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filterBySearch = (text) => {
    return searchQuery.toLowerCase() === '' || text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-peach-light">
      <div className="p-2 lg:p-4 w-full flex flex-col gap-6">
        {/* Header with hamburger and search */}
        <div className="flex flex-col items-start px-4 gap-4">
          <div className="w-full flex items-center justify-between">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="lg:hidden text-charcoal text-2xl"
            >
              ☰
            </button>
            <h1 className="flex-1 text-center text-2xl md:text-4xl font-instrument-serif text-charcoal">Dashboard</h1>
            <div className="lg:hidden w-8"></div>
          </div>
          <input
            type="text"
            placeholder="Search products, plans, or history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md px-4 py-2 rounded-lg border-2 border-charcoal bg-transparent text-charcoal placeholder-gray-400 focus:outline-none focus:border-[#d4a574]"
          />
        </div>

        {/* Desktop layout: 2 boxes left, Calendar fixed right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4">
          {/* Left column: Products, Plans, History */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* History on top */}
            <div>
              {filterBySearch('history') && <SubscriptionHistorySummary onViewAll={() => setActivePage('subscriptions')} />}
            </div>
            {/* Bottom row: Products and Plans */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filterBySearch('products') && (
                <div className="w-full bg-brown rounded-lg shadow-md p-6 flex flex-col">
                  <NewProducts />
                  <button
                    onClick={() => setActivePage('coffees')}
                    className="mt-4 w-full py-2 text-center text-sm font-semibold text-brown bg-peach rounded hover:bg-peach-light hover:text-charcoal transition-colors"
                  >
                    View More →
                  </button>
                </div>
              )}
              {filterBySearch('plans') && (
                <div className="w-full bg-brown rounded-lg shadow-md p-6 flex flex-col">
                  <SubscriptionPlans />
                  <button
                    onClick={() => setActivePage('plans')}
                    className="mt-4 w-full py-2 text-center text-sm font-semibold text-brown bg-peach rounded hover:bg-peach-light hover:text-charcoal transition-colors"
                  >
                    View More →
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right column: Calendar */}
          <div className="lg:col-span-1">
            {filterBySearch('delivery') && <DeliveryCalendar />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDash;