import { useEffect, useMemo, useState } from "react";

const API_URL = process.env.REACT_APP_API_URLL;

const money = (value) => {
  const amount = Number(value || 0);
  return `${amount.toFixed(2)} MAD`;
};

const dateText = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString();
};

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Unauthorized");
      setLoading(false);
      return;
    }

    const loadSubscriptions = async () => {
      try {
        const res = await fetch(`${API_URL}/api/dashboard/subscriptions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json().catch(() => []);
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

  const counts = useMemo(() => {
    return subscriptions.reduce(
      (acc, sub) => {
        const status = String(sub.status || "").toLowerCase();
        if (status === "active") acc.active += 1;
        if (status === "cancelled") acc.cancelled += 1;
        return acc;
      },
      { active: 0, cancelled: 0 }
    );
  }, [subscriptions]);

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-2xl font-instrument-serif">Subscriptions</h2>
        <p className="text-sm text-[#3B170D]/70">
          {subscriptions.length} total | {counts.active} active | {counts.cancelled} cancelled
        </p>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-[#EADFD7] bg-white p-4">Loading subscriptions...</div>
      ) : null}
      {!loading && error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
      ) : null}
      {!loading && !error && subscriptions.length === 0 ? (
        <div className="rounded-2xl border border-[#EADFD7] bg-white p-4 text-[#3B170D]/70">
          No subscriptions found.
        </div>
      ) : null}

      {!loading && !error && subscriptions.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border border-[#EADFD7] bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-[#F6EEE7] text-[#3B170D]">
              <tr>
                <th className="px-4 py-3 text-left">Subscription ID</th>
                <th className="px-4 py-3 text-left">Client</th>
                <th className="px-4 py-3 text-left">Coffee</th>
                <th className="px-4 py-3 text-left">Plan</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Start</th>
                <th className="px-4 py-3 text-left">Next Delivery</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((sub) => (
                <tr key={sub._id} className="border-t border-[#F0E6DF]">
                  <td className="px-4 py-3 font-mono text-xs">{sub._id}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold">
                      {sub.client?.firstName || "-"} {sub.client?.lastName || ""}
                    </div>
                    <div className="text-[#3B170D]/70">{sub.client?.email || "-"}</div>
                  </td>
                  <td className="px-4 py-3">{sub.coffee?.name || "-"}</td>
                  <td className="px-4 py-3">{sub.plan || "-"}</td>
                  <td className="px-4 py-3">{sub.status || "-"}</td>
                  <td className="px-4 py-3">{money(sub.price)}</td>
                  <td className="px-4 py-3">{dateText(sub.startDate)}</td>
                  <td className="px-4 py-3">{dateText(sub.nextDelivery)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
