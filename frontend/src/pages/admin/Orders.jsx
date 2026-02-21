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
  return d.toLocaleString();
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Unauthorized");
      setLoading(false);
      return;
    }

    const loadOrders = async () => {
      try {
        const res = await fetch(`${API_URL}/api/dashboard/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json().catch(() => []);
        if (!res.ok) throw new Error(data.error || data.message || "Failed to load orders");
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const summary = useMemo(() => {
    const total = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    return {
      count: orders.length,
      total,
    };
  }, [orders]);

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-instrument-serif">Orders</h2>
          <p className="text-sm text-[#3B170D]/70">
            {summary.count} order(s) | Revenue: {money(summary.total)}
          </p>
        </div>
      </div>

      {loading ? <div className="rounded-2xl border border-[#EADFD7] bg-white p-4">Loading orders...</div> : null}
      {!loading && error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
      ) : null}
      {!loading && !error && orders.length === 0 ? (
        <div className="rounded-2xl border border-[#EADFD7] bg-white p-4 text-[#3B170D]/70">No orders found.</div>
      ) : null}

      {!loading && !error && orders.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border border-[#EADFD7] bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-[#F6EEE7] text-[#3B170D]">
              <tr>
                <th className="px-4 py-3 text-left">Order ID</th>
                <th className="px-4 py-3 text-left">Client</th>
                <th className="px-4 py-3 text-left">Items</th>
                <th className="px-4 py-3 text-left">Total</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-t border-[#F0E6DF]">
                  <td className="px-4 py-3 font-mono text-xs">{order._id}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold">
                      {order.customer?.firstName || "-"} {order.customer?.lastName || ""}
                    </div>
                    <div className="text-[#3B170D]/70">{order.customer?.email || "-"}</div>
                  </td>
                  <td className="px-4 py-3">{Array.isArray(order.items) ? order.items.length : 0}</td>
                  <td className="px-4 py-3">{money(order.total)}</td>
                  <td className="px-4 py-3">{order.status || "-"}</td>
                  <td className="px-4 py-3">{dateText(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
