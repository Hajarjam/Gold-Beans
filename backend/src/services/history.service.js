const historyRepository = require("../repositories/history.repository");

const getSubscriptionHistory = (clientId) =>
  historyRepository.findByClient(clientId);

module.exports = {
  getSubscriptionHistory,
};
