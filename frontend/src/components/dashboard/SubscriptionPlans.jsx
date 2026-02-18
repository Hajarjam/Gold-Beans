import React from 'react';

const SubscriptionPlans = () => {
  const plans = [
    { id: 1, name: 'Basic', price: '$9.99/mo', features: '5 products' },
    { id: 2, name: 'Premium', price: '$19.99/mo', features: '15 products' },
    { id: 3, name: 'Elite', price: '$29.99/mo', features: 'Unlimited' },
  ];

  return (
    <div className="w-full bg-brown rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-instrument-serif text-peach mb-4">Subscription Plans</h2>
      <div className="space-y-3">
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            className="flex justify-between items-center p-3 bg-peach-light rounded whitespace-nowrap"
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold text-charcoal">{plan.name}</span>
              <span className="text-peach ml-4">{plan.price}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{plan.features}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlans;
