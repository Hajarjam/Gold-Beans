const normalize = (value) => String(value || "").trim().toLowerCase();

const isSubscriptionBuyOption = (value) => {
  const option = normalize(value);
  return option === "subscribe" || option === "subscription" || option === "recurring";
};

const isSubscriptionItem = (item = {}) => {
  const productType = normalize(item.productType);
  return productType === "subscription" || isSubscriptionBuyOption(item.buyOption);
};

const isOneTimeItem = (item = {}) => !isSubscriptionItem(item);

module.exports = {
  normalize,
  isSubscriptionItem,
  isOneTimeItem,
};
