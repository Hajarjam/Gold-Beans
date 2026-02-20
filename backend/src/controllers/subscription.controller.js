const subscriptionService = require("../services/subscription.service");

const getUserSubscriptions = async (req, res, next) => {
  try {
    const subs = await subscriptionService.getClientSubscriptions(req.user.id);
    res.json(subs);
  } catch (err) {
    next(err);
  }
};

const getSubscriptionPreview = async (req, res, next) => {
  try {
    const subs = await subscriptionService.getSubscriptionPreview(req.user.id);
    res.json(subs);
  } catch (err) {
    next(err);
  }
};

const createSubscription = async (req, res, next) => {
  try {
    const sub = await subscriptionService.createSubscription(req.user.id, req.body);
    res.status(201).json(sub);
  } catch (err) {
    next(err);
  }
};

const cancelSubscription = async (req, res, next) => {
  try {
    const sub = await subscriptionService.cancelSubscription(req.user.id, req.params.id);
    res.json(sub);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUserSubscriptions,
  getSubscriptionPreview,
  createSubscription,
  cancelSubscription,
};
