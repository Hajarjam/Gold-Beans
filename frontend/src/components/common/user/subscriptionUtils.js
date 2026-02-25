const toDateValue = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
};

export const normalizeDate = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && value.$date) return value.$date;
  return "";
};

export const formatDate = (value) => {
  const normalized = normalizeDate(value);
  if (!normalized) return "-";
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
};

export const formatPrice = (value) => {
  const price = Number(value);
  if (!Number.isFinite(price)) return "0.00";
  return price.toFixed(2);
};

export const normalizeStatus = (sub) => {
  const rawStatus = String(sub?.status || "").toLowerCase();
  if (rawStatus === "cancelled" || sub?.isCancelled) return "cancelled";
  if (rawStatus === "active" && !sub?.endDate) return "active";

  const endDate = normalizeDate(sub?.endDate);
  if (endDate) {
    const end = new Date(endDate);
    if (!Number.isNaN(end.getTime()) && end.getTime() <= Date.now()) {
      return "expired";
    }
  }

  return rawStatus === "active" ? "active" : "expired";
};

export const getSubscriptionPlanName = (sub) => {
  const roast = String(sub?.coffee?.roastLevel || "").trim();
  if (roast === "Light" || roast === "Medium" || roast === "Dark") {
    return `${roast} Roast`;
  }
  return sub?.coffee?.name || sub?.plan || "Subscription Plan";
};

export const sortSubscriptionsByRecent = (items) => {
  if (!Array.isArray(items)) return [];
  return [...items].sort((a, b) => {
    const aDate = normalizeDate(a?.startDate) || normalizeDate(a?.createdAt);
    const bDate = normalizeDate(b?.startDate) || normalizeDate(b?.createdAt);
    return toDateValue(bDate) - toDateValue(aDate);
  });
};

export const collectDeliveryDates = (subs) => {
  if (!Array.isArray(subs)) return [];
  return subs
    .map((sub) =>
      normalizeDate(sub?.nextDelivery || sub?.deliveryDate || sub?.startDate)
    )
    .filter(Boolean);
};
