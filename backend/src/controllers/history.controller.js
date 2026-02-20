const historyService = require("../services/history.service");

const getSubscriptionHistory = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const history = await historyService.getSubscriptionHistory(clientId);
    res.json(history);
  } catch (err) {
    next(err);
  }
};

const getSubscriptionHistoryPreview = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const history = await historyService.getSubscriptionHistory(clientId);
    res.json(history.slice(0, 3)); 
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSubscriptionHistory,
  getSubscriptionHistoryPreview,
};
