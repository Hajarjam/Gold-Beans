const subscriptionRepository = require("../repositories/subscription.repository");
const coffeeRepository = require("../repositories/coffee.repository");
const clientRepository = require("../repositories/client.repository");
const userRepository = require("../repositories/user.repository");

const resolveSubscriptionOwner = async (user = {}) => {
  const ids = new Set();
  const id = user.id ? String(user.id) : "";
  const email = String(user.email || "").trim();

  let preferredId = null;

  if (id) {
    const [clientById, userById] = await Promise.all([
      clientRepository.findById(id),
      userRepository.findById(id),
    ]);

    if (clientById) {
      const value = String(clientById._id);
      ids.add(value);
      preferredId = value;
    }

    if (userById) {
      const value = String(userById._id);
      ids.add(value);
      if (!preferredId) preferredId = value;
    }
  }

  if (email) {
    const [clientByEmail, userByEmail] = await Promise.all([
      clientRepository.findByEmail(email),
      userRepository.findByEmail(email),
    ]);

    if (clientByEmail) {
      const value = String(clientByEmail._id);
      ids.add(value);
      preferredId = value;
    }

    if (userByEmail) {
      const value = String(userByEmail._id);
      ids.add(value);
      if (!preferredId) preferredId = value;
    }
  }

  if (!preferredId && id) {
    ids.add(id);
    preferredId = id;
  }

  return { ownerIds: Array.from(ids), preferredId };
};

const getClientSubscriptions = async (user) => {
  const { ownerIds } = await resolveSubscriptionOwner(user);
  if (!ownerIds.length) return [];
  return subscriptionRepository.findByClients(ownerIds);
};

const getSubscriptionPreview = async (user) => {
  const { ownerIds } = await resolveSubscriptionOwner(user);
  if (!ownerIds.length) return [];
  return subscriptionRepository.findPreviewByClients(ownerIds, 2);
};

const createSubscription = async (user, data) => {
  const coffee = await coffeeRepository.getCoffeeById(data.coffeeId);
  if (!coffee) throw new Error("Coffee not found");
  const { preferredId } = await resolveSubscriptionOwner(user);
  if (!preferredId) throw new Error("Client introuvable");

  const nextDelivery = new Date();
  if (data.plan === "Bi-Weekly") nextDelivery.setDate(nextDelivery.getDate() + 14);
  else if (data.plan === "Monthly") nextDelivery.setDate(nextDelivery.getDate() + 30);
  else nextDelivery.setMonth(nextDelivery.getMonth() + 3);

  return subscriptionRepository.createSubscription({
    client: preferredId,
    coffee: coffee._id,
    plan: data.plan,
    grind: data.grind,
    weight: data.weight,
    price: coffee.price,
    nextDelivery,
  });
};

const cancelSubscription = async (user, subId) => {
  const sub = await subscriptionRepository.findById(subId);
  if (!sub) throw new Error("Subscription not found");

  const { ownerIds } = await resolveSubscriptionOwner(user);
  if (!ownerIds.includes(String(sub.client))) throw new Error("Not authorized");

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
