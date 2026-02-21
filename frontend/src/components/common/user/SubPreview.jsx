import React from "react";

const SubPreview = ({ data, onViewAll }) => {
  if (!data || data.length === 0) return <p>No subscription history found.</p>;

  return (
    <div className="bg-brown text-peach-light rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-2">Recent Subscription History</h3>
      <ul className="space-y-2">
        {data.map((sub) => (
          <li key={sub._id} className="border-b border-peach/30 pb-2">
            <p className="font-medium">{sub.coffee?.name || "Coffee Subscription"}</p>
            <p className="text-sm text-peach-light/80">
              {sub.plan || "-"} | {sub.status || "-"}
            </p>
            <p className="text-sm text-peach-light/80">Price: ${sub.price}</p>
          </li>
        ))}
      </ul>
      <button
        onClick={onViewAll}
        className="mt-3 w-full py-2 bg-peach-light text-brown rounded hover:bg-white transition-colors"
      >
        View All History →
      </button>
    </div>
  );
};

export default SubPreview;
