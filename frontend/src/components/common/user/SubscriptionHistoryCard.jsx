import React from "react";

const priceText = (price) => {
  if (typeof price !== "number") return "-";
  return `$${price.toFixed(2)}`;
};

const dateText = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString();
};

const SubscriptionHistoryCard = ({ sub }) => (
  <div className="rounded-xl border border-brown/15 bg-white/70 p-4 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div>
        <h3 className="font-instrument-serif text-xl text-brown">
          {sub.coffee?.name || "Coffee Subscription"}
        </h3>
        <p className="text-sm text-brown/75 mt-1">
          Plan: {sub.plan || "-"} | Grind: {sub.grind || "-"} | Weight: {sub.weight || "-"}g
        </p>
      </div>
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          sub.status === "Active"
            ? "bg-green-100 text-green-800"
            : "bg-stone-200 text-stone-700"
        }`}
      >
        {sub.status || "Unknown"}
      </span>
    </div>

    <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
      <div>
        <p className="text-brown/60">Price</p>
        <p className="font-medium text-brown">{priceText(sub.price)}</p>
      </div>
      <div>
        <p className="text-brown/60">Start</p>
        <p className="font-medium text-brown">{dateText(sub.startDate)}</p>
      </div>
      <div>
        <p className="text-brown/60">Next Delivery</p>
        <p className="font-medium text-brown">{dateText(sub.nextDelivery)}</p>
      </div>
      <div>
        <p className="text-brown/60">End</p>
        <p className="font-medium text-brown">{dateText(sub.endDate)}</p>
      </div>
    </div>
  </div>
);

export default SubscriptionHistoryCard;
