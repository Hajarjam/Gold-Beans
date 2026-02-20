import React, { useEffect, useMemo, useState } from "react";

const API_BASE_URL = process.env.REACT_APP_API_URL;

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

const SubCard = ({ sub }) => (
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

const SubscriptionHistory = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSubscriptions = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Not authenticated");

        const res = await fetch(`${API_BASE_URL}/subscriptions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || data.message || "Failed to load subscriptions");

        setSubscriptions(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Failed to load subscriptions");
      } finally {
        setLoading(false);
      }
    };

    loadSubscriptions();
  }, []);

  const { active, inactive } = useMemo(() => {
    const activeSubs = subscriptions.filter((s) => s.status === "Active");
    const inactiveSubs = subscriptions.filter((s) => s.status !== "Active");
    return { active: activeSubs, inactive: inactiveSubs };
  }, [subscriptions]);

  if (loading) return <div className="p-8 text-brown">Loading subscriptions...</div>;

  return (
    <div className="min-h-screen bg-peach-light text-brown px-4 py-8 lg:px-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-instrument-serif mb-2">Subscription History</h1>
        <p className="text-brown/70 mb-6">Active subscriptions are shown first, then inactive ones.</p>

        {error ? <div className="mb-4 rounded bg-red-100 text-red-700 px-4 py-3">{error}</div> : null}

        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-2xl font-instrument-serif">Active Subscriptions</h2>
            <span className="text-sm text-brown/70">{active.length} active</span>
          </div>
          <div className="space-y-3">
            {active.length === 0 ? (
              <div className="rounded-xl border border-brown/15 bg-white/60 p-4 text-brown/70">
                No active subscriptions.
              </div>
            ) : (
              active.map((sub) => <SubCard key={sub._id} sub={sub} />)
            )}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-2xl font-instrument-serif">Inactive Subscriptions</h2>
            <span className="text-sm text-brown/70">{inactive.length} inactive</span>
          </div>
          <div className="space-y-3">
            {inactive.length === 0 ? (
              <div className="rounded-xl border border-brown/15 bg-white/60 p-4 text-brown/70">
                No inactive subscriptions.
              </div>
            ) : (
              inactive.map((sub) => <SubCard key={sub._id} sub={sub} />)
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SubscriptionHistory;
