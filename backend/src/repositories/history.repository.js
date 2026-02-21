const Subscription = require("../models/subscription.model");

const findByClient = (clientId) =>
  Subscription.find({ client: clientId }).sort({ createdAt: -1 }).lean();

module.exports = {
  findByClient,
};
