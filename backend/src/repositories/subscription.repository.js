const Subscription = require("../models/subscription.model");

const findByClient = (clientId) =>
  Subscription.find({ client: clientId })
    .populate("coffee", "name images roastLevel price")
    .sort({ createdAt: -1 });

const findActiveByClient = (clientId) =>
  Subscription.find({ client: clientId, status: "Active" }).populate("coffee");

const findPreviewByClient = (clientId, limit = 3) =>
  Subscription.find({ client: clientId })
    .populate("coffee", "name images")
    .sort({ createdAt: -1 })
    .limit(limit);

const findById = (id) => Subscription.findById(id).populate("coffee");
const createSubscription = (data) => new Subscription(data).save();
const updateSubscription = (id, data) =>
  Subscription.findByIdAndUpdate(id, data, { new: true });
const deleteSubscription = (id) => Subscription.findByIdAndDelete(id);

module.exports = {
  findByClient,
  findActiveByClient,
  findPreviewByClient,
  findById,
  createSubscription,
  updateSubscription,
  deleteSubscription,
};
