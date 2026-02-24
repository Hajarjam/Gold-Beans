const Order = require("../models/order.model");
const Coffee = require("../models/coffee.model");
const Subscription = require("../models/subscription.model");
const { isSubscriptionItem, isOneTimeItem, normalize } = require("../utils/purchase-type.util");

const calcSubtotal = (items) =>
  items.reduce((sum, it) => sum + Number(it.price || 0) * Number(it.quantity || 0), 0);

const extractObjectId = (value) => {
  const raw = String(value || "").trim();
  const match = raw.match(/[a-fA-F0-9]{24}/);
  return match ? match[0] : null;
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const mapDeliveryPlan = (deliveryEvery) => {
  const value = normalize(deliveryEvery);
  if (value === "1-week" || value === "weekly") return "Weekly";
  if (value === "2-weeks" || value === "bi-weekly" || value === "biweekly") return "Bi-Weekly";
  if (value === "3-weeks") return "Every-3-Weeks";
  if (value === "1-month" || value === "monthly") return "Monthly";
  return "Monthly";
};

const computeNextDelivery = (plan) => {
  const nextDelivery = new Date();
  if (plan === "Weekly") nextDelivery.setDate(nextDelivery.getDate() + 7);
  else if (plan === "Bi-Weekly") nextDelivery.setDate(nextDelivery.getDate() + 14);
  else if (plan === "Every-3-Weeks") nextDelivery.setDate(nextDelivery.getDate() + 21);
  else if (plan === "Monthly") nextDelivery.setDate(nextDelivery.getDate() + 30);
  else nextDelivery.setMonth(nextDelivery.getMonth() + 3);
  return nextDelivery;
};

const mapWeight = (size, quantity) => {
  const normalizedSize = normalize(size);
  const qty = Math.max(1, Number(quantity || 1));
  const unitWeight =
    normalizedSize === "small" ? 250 :
    normalizedSize === "large" ? 1000 :
    500;
  return unitWeight * qty;
};

const resolveCoffeeId = async (item) => {
  const candidateId = extractObjectId(item.productId || item.coffeeId || item.sourceProductId);
  if (candidateId) {
    const coffeeById = await Coffee.findById(candidateId).select("_id").lean();
    if (coffeeById?._id) return coffeeById._id;
  }

  const roast = String(item.roast || "").trim();
  if (roast) {
    const coffeeByRoast = await Coffee.findOne({
      roastLevel: { $regex: escapeRegex(roast), $options: "i" },
    }).select("_id").lean();
    if (coffeeByRoast?._id) return coffeeByRoast._id;
  }

  return null;
};

const createFakeCheckout = async ({ userId, items, shippingAddress, payment }) => {
  if (!Array.isArray(items) || items.length === 0) throw new Error("Cart empty");

  const oneTimeItems = items.filter(isOneTimeItem);
  const subscriptionItems = items.filter(isSubscriptionItem);

  let order = null;
  if (oneTimeItems.length > 0) {
    const subtotal = calcSubtotal(oneTimeItems);
    const shipping = 0;
    const total = subtotal + shipping;

    order = await Order.create({
      userId,
      items: oneTimeItems,
      subtotal,
      shipping,
      total,
      shippingAddress,
      payment,
      status: "CONFIRMED",
    });
  }

  const subscriptions = [];
  for (const item of subscriptionItems) {
    const coffeeId = await resolveCoffeeId(item);
    if (!coffeeId) throw new Error("Unable to create subscription for selected item");

    const plan = mapDeliveryPlan(item.deliveryEvery);
    const nextDelivery = computeNextDelivery(plan);
    const grind = String(item.grind || "whole-bean");
    const weight = mapWeight(item.size, item.quantity);
    const price = Number(item.price || 0) * Math.max(1, Number(item.quantity || 1));

    const subscription = await Subscription.create({
      client: userId,
      coffee: coffeeId,
      plan,
      grind,
      weight,
      price,
      nextDelivery,
      status: "Active",
      isActive: true,
      isCancelled: false,
    });

    subscriptions.push(subscription);
  }

  return { order, subscriptions };
};

module.exports = { createFakeCheckout };
