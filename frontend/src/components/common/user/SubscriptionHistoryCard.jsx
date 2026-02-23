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

const SubscriptionHistoryCard = ({ sub, isEmpty = false, onViewAll }) => {
  if (isEmpty) {
    return (
      <div className="bg-brown text-peach-light rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold mb-2">Subscription History</h3>
        <p className="text-sm text-peach-light/80">
          You do not have subscription history yet.
        </p>
        <button
          onClick={onViewAll}
          className="mt-3 w-full py-2 bg-peach-light text-brown rounded hover:bg-white transition-colors"
        >
          View More
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-brown p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-instrument-serif text-xl text-peach">
            {sub?.coffee?.name || "Coffee Subscription"}
          </h3>
          <p className="text-sm text-peach-light mt-1">
            Plan: {sub?.plan || "-"} | Grind: {sub?.grind || "-"} | Weight:{" "}
            {sub?.weight || "-"}g
          </p>
        </div>

        <div
          className={`w-3 h-3 rounded-full mt-2 ${
            sub?.status === "Active" ? "bg-green-500" : "bg-red-500"
          }`}
          title={sub?.status || "Unknown"}
        />
      </div>

      <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div>
          <p className="text-peach-light">Price</p>
          <p className="font-medium text-peach">{priceText(sub?.price)}</p>
        </div>
        <div>
          <p className="text-peach-light">Start</p>
          <p className="font-medium text-peach">{dateText(sub?.startDate)}</p>
        </div>
        <div>
          <p className="text-peach-light">Next Delivery</p>
          <p className="font-medium text-peach">
            {dateText(sub?.nextDelivery)}
          </p>
        </div>
        <div>
          <p className="text-peach-light">End</p>
          <p className="font-medium text-peach">{dateText(sub?.endDate)}</p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionHistoryCard;
