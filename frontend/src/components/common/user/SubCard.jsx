import React from 'react'

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

const SubCard = ({ sub }) => {
  const isActive = String(sub?.status || "").toLowerCase() === "active";

  return (
    <div className="rounded-xl border border-peach/20 bg-brown p-4 shadow-sm text-peach">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-instrument-serif text-xl text-peach">
            {sub?.coffee?.name || "Coffee Subscription"}
          </h3>

          <p className="text-sm text-peach/80 mt-1">
            Plan: {sub?.plan || "-"} | Grind: {sub?.grind || "-"} | Weight: {sub?.weight || "-"}g
          </p>
        </div>

        <span
          className={`mt-1 inline-block h-3 w-3 rounded-full ${
            isActive ? "bg-green-500" : "bg-red-500"
          }`}
          title={isActive ? "Active" : "Inactive"}
        />
      </div>

      <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div>
          <p className="text-peach/70">Price</p>
          <p className="font-medium text-peach">{priceText(sub?.price)}</p>
        </div>

        <div>
          <p className="text-peach/70">Start</p>
          <p className="font-medium text-peach">{dateText(sub?.startDate)}</p>
        </div>

        <div>
          <p className="text-peach/70">Next Delivery</p>
          <p className="font-medium text-peach">{dateText(sub?.nextDelivery)}</p>
        </div>

        <div>
          <p className="text-peach/70">End</p>
          <p className="font-medium text-peach">{dateText(sub?.endDate)}</p>
        </div>
      </div>
    </div>
  );
};

export default SubCard;
