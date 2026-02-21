import React from "react";

const SubscriptionSummaryCard = ({ item, compact = false }) => {
  return (
    <div className="bg-peach/20 p-4 rounded shadow">
      <h4 className="font-medium">{item.coffee?.name || "Coffee Subscription"}</h4>
      {compact ? (
        <p className="text-sm text-peach-light/80">
          {item.plan || "-"} | {item.status || "-"}
        </p>
      ) : (
        <>
          <p className="text-sm text-peach-light/80">Plan: {item.plan || "-"}</p>
          <p className="text-sm text-peach-light/80">Status: {item.status || "-"}</p>
        </>
      )}
      <p className="text-sm text-peach-light/80">Price: ${item.price}</p>
    </div>
  );
};

export default SubscriptionSummaryCard;
