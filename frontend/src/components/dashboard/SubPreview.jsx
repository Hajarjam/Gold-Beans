import React from 'react';

const SubPreview = ({ onViewAll }) => {
  const recentSubscriptions = [
    { id: 1, plan: 'Premium', startDate: 'Jan 15, 2026', status: 'Active' },
    { id: 2, plan: 'Basic', startDate: 'Dec 1, 2025', status: 'Active' },
    { id: 3, plan: 'Elite', startDate: 'Nov 20, 2025', status: 'Cancelled' },
  ];

  return (
    <div className="w-full bg-brown rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-instrument-serif text-peach">Subscription History</h2>
        <button
          onClick={onViewAll}
          className="text-peach hover:text-peach-light font-semibold transition-colors"
        >
          View All →
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-peach">
              <th className="text-left p-3 text-peach font-semibold">Plan</th>
              <th className="text-left p-3 text-peach font-semibold">Start Date</th>
              <th className="text-left p-3 text-peach font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentSubscriptions.map((subscription) => (
              <tr key={subscription.id} className="border-b border-peach-light hover:bg-peach-light/30">
                <td className="p-3 text-charcoal bg-peach">{subscription.plan}</td>
                <td className="p-3 text-charcoal bg-peach">{subscription.startDate}</td>
                <td className="p-3 bg-peach">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      subscription.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {subscription.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubPreview;
