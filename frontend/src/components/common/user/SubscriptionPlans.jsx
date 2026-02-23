import React from "react";

const SubscriptionPlans = ({ subscriptions }) => {
  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-2">Subscription Plans</h3>

      {!subscriptions || subscriptions.length === 0 ? (
        <div className="bg-peach/20 p-4 rounded shadow text-sm text-peach flex-1 flex items-center">
          No subscription plans available.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subscriptions.map((plan) => (
            <div key={plan._id} className="bg-peach/20 p-4 rounded shadow">
              <h4 className="font-medium">
                {plan.coffee?.name || "Coffee Subscription"}
              </h4>
              <p className="text-sm text-peach-light/80">
                Plan: {plan.plan || "-"}
              </p>
              <p className="text-sm text-peach-light/80">
                Status: {plan.status || "-"}
              </p>
              <p className="text-sm text-peach-light/80">
                Price: ${plan.price}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlans;
