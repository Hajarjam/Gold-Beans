const Order = require("../models/order.model");
const Subscription = require("../models/subscription.model");
const Client = require("../models/client.model");
const User = require("../models/user.model");
const { isOneTimeItem } = require("../utils/purchase-type.util");

const toMap = (items) => {
  const map = new Map();
  for (const item of items) {
    map.set(String(item._id), item);
  }
  return map;
};

const buildCustomer = (account) => {
  if (!account) return null;
  return {
    _id: account._id,
    firstName: account.firstName || "",
    lastName: account.lastName || "",
    email: account.email || "",
    role: account.role || "",
  };
};

const getAccountMap = async (ids) => {
  if (!ids.length) return new Map();

  const [clients, users] = await Promise.all([
    Client.find({ _id: { $in: ids } })
      .select("firstName lastName email role")
      .lean(),
    User.find({ _id: { $in: ids } })
      .select("firstName lastName email role")
      .lean(),
  ]);

  return new Map([...toMap(clients), ...toMap(users)]);
};

const getAdminOrders = async (_req, res, next) => {
  try {
    const rawOrders = await Order.find().sort({ createdAt: -1 }).lean();
    const orders = rawOrders
      .map((order) => {
        const items = Array.isArray(order.items) ? order.items.filter(isOneTimeItem) : [];
        if (!items.length) return null;

        const subtotal = items.reduce(
          (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
          0
        );

        return {
          ...order,
          items,
          subtotal,
          total: subtotal + Number(order.shipping || 0),
        };
      })
      .filter(Boolean);
    const userIds = [
      ...new Set(
        orders
          .map((order) => order.userId)
          .filter(Boolean)
          .map((id) => String(id))
      ),
    ];

    const accountMap = await getAccountMap(userIds);
    const data = orders.map((order) => ({
      ...order,
      customer: buildCustomer(accountMap.get(String(order.userId))),
    }));

    res.json(data);
  } catch (err) {
    next(err);
  }
};

const getAdminSubscriptions = async (_req, res, next) => {
  try {
    const subscriptions = await Subscription.find()
      .populate("coffee", "name price images")
      .sort({ createdAt: -1 })
      .lean();

    const clientIds = [
      ...new Set(
        subscriptions
          .map((sub) => sub.client)
          .filter(Boolean)
          .map((id) => String(id))
      ),
    ];

    const accountMap = await getAccountMap(clientIds);
    const data = subscriptions.map((sub) => ({
      ...sub,
      client: buildCustomer(accountMap.get(String(sub.client))),
    }));

    res.json(data);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAdminOrders,
  getAdminSubscriptions,
};
