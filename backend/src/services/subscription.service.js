const subscriptionRepository = require("../repositories/subscription.repository");
const coffeeRepository = require("../repositories/coffee.repository");

const getClientSubscriptions = (clientId) => subscriptionRepository.findByClient(clientId);
const getSubscriptionPreview = (clientId) =>
  subscriptionRepository.findPreviewByClient(clientId, 2);

const createSubscription = async (clientId, data) => {
  const coffee = await coffeeRepository.getCoffeeById(data.coffeeId);
  if (!coffee) throw new Error("Coffee not found");

  const nextDelivery = new Date();
  if (data.plan === "Bi-Weekly") nextDelivery.setDate(nextDelivery.getDate() + 14);
  else if (data.plan === "Monthly") nextDelivery.setDate(nextDelivery.getDate() + 30);
  else nextDelivery.setMonth(nextDelivery.getMonth() + 3);

  return subscriptionRepository.createSubscription({
    client: clientId,
    coffee: coffee._id,
    plan: data.plan,
    grind: data.grind,
    weight: data.weight,
    price: coffee.price,
    nextDelivery,
  });
};

const cancelSubscription = async (clientId, subId) => {
  const sub = await subscriptionRepository.findById(subId);
  if (!sub) throw new Error("Subscription not found");
  if (String(sub.client) !== String(clientId)) throw new Error("Not authorized");

  return subscriptionRepository.updateSubscription(subId, {
    status: "Cancelled",
    endDate: new Date(),
  });
};

module.exports = {
  getClientSubscriptions,
  getSubscriptionPreview,
  createSubscription,
  cancelSubscription,
};
