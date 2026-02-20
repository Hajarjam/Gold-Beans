import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCoffees: 0,
    totalMachines: 0,
    activeSubscriptions: 0,
    cancelledSubscriptions: 0,
    totalRevenue: 0,
  });

  const [salesData, setSalesData] = useState([]);
  const [period, setPeriod] = useState("month");

  const [bestCoffees, setBestCoffees] = useState([]);
  const [bestMachines, setBestMachines] = useState([]);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // Fetch dashboard stats
  useEffect(() => {
    axios
      .get("http://localhost:5001/api/dashboard")
      .then((res) => setStats(res.data))
      .catch(console.error);
  }, []);

  // Fetch sales data based on period
  useEffect(() => {
    axios
      .get(`http://localhost:5001/api/dashboard/sales/${period}`)
      .then((res) => setSalesData(res.data))
      .catch(console.error);
  }, [period]);

  // Fetch best-selling coffees
  useEffect(() => {
    axios
      .get("http://localhost:5001/api/dashboard/best-sellers")
      .then((res) => setBestCoffees(res.data))
      .catch(console.error);
  }, []);

  // Fetch best-selling machines
  useEffect(() => {
    axios
      .get("http://localhost:5001/api/dashboard/best-selling-machines")
      .then((res) => setBestMachines(res.data))
      .catch(console.error);
  }, []);

  const fetchCustomRange = () => {
    if (!from || !to) return alert("Please select both dates");
    axios
      .get(`http://localhost:5001/api/dashboard/sales/range?from=${from}&to=${to}`)
      .then((res) => setSalesData(res.data.data))
      .catch(console.error);
  };

  const xKey = period === "year" ? "month" : "day";

  return (
    <div className="flex flex-col px-6 py-4 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-8">Dashboard Statistics</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white shadow-md rounded-lg p-5">
          <p className="text-sm font-medium text-gray-500 mb-3">Products</p>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-600">Coffees</span>
            <span className="text-xl font-semibold">{stats.totalCoffees}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Machines</span>
            <span className="text-xl font-semibold">{stats.totalMachines}</span>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-5">
          <p className="text-sm font-medium text-gray-500">Active Subscriptions</p>
          <p className="text-2xl font-semibold mt-4">{stats.activeSubscriptions}</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-5">
          <p className="text-sm font-medium text-gray-500">Total Revenue</p>
          <p className="text-2xl font-semibold mt-4">{stats.totalRevenue} MAD</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-5">
          <p className="text-sm font-medium text-gray-500">Cancelled Subscriptions</p>
          <p className="text-2xl font-semibold mt-4">{stats.cancelledSubscriptions}</p>
        </div>
      </div>

      {/* Sales Overview */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-10">
        <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
          <h2 className="text-lg font-semibold text-gray-800">Sales Overview</h2>

          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
            {["week", "month", "year"].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 transition-colors duration-200 ${
                  period === p
                    ? "bg-brown text-white"
                    : "bg-white text-gray-900 hover:bg-brown hover:text-white"
                } ${p === "week" ? "rounded-l-lg" : p === "year" ? "rounded-r-lg" : ""}`}
              >
                {p === "week" ? "This Week" : p === "month" ? "This Month" : "This Year"}
              </button>
            ))}
          </div>
        </div>

        <div className="h-64 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xKey} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#77523C" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
          <span>Custom Range:</span>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="px-2 py-1 border rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-brown"
          />
          <span>to</span>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="px-2 py-1 border rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-brown"
          />
          <button
            onClick={fetchCustomRange}
            className="px-3 py-1 bg-brown text-white rounded shadow hover:bg-dark-brown text-center"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Best Sellers */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Best-Selling Coffees */}
        <div className="bg-white shadow-md rounded-lg flex-1">
          <div className="bg-brown p-4 rounded-t-lg">
            <h2 className="text-lg font-semibold text-white">Best-Selling Coffees</h2>
          </div>
          <div className="p-4">
            {bestCoffees.map((coffee, index) => (
              <div key={coffee._id} className="flex items-center gap-3 mb-3 p-3 shadow-sm rounded hover:bg-gray-50">
                <span className="font-bold text-brown">#{index + 1}</span>
                <img
                  src={coffee.image || "/assets/coffee-beans.jpg"}
                  alt={coffee.name}
                  className="w-12 h-12 object-cover rounded"
                  onError={(e) => (e.currentTarget.src = "/assets/coffee-beans.jpg")}
                />
                <div className="flex-1">
                  <p className="font-semibold">{coffee.name}</p>
                  <p className="text-xs text-gray-500">
                    Taste: {coffee.tasteProfile?.join(", ") || "—"} <br />
                    Roast: {coffee.roast}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Best-Selling Machines */}
        <div className="bg-white shadow-md rounded-lg flex-1">
          <div className="bg-dark-brown p-4 rounded-t-lg">
            <h2 className="text-lg font-semibold text-white">Best-Selling Machines</h2>
          </div>
          <div className="p-4">
            {bestMachines.map((machine, index) => (
              <div key={machine._id} className="flex items-center gap-3 mb-3 p-3 shadow-sm rounded hover:bg-gray-50 cursor-pointer">
                <span className="font-bold text-brown">#{index + 1}</span>
                <img
                  src={machine.images?.[0] || "/assets/machine.jpg"}
                  alt={machine.name}
                  className="w-12 h-12 object-cover rounded"
                  onError={(e) => (e.currentTarget.src = "/assets/machine.jpg")}
                />
                <div className="flex-1">
                  <p className="font-semibold">{machine.name}</p>
                  <p className="text-xs text-gray-500">
                    Type: {machine.type} <br />
                    Coffee Type: {machine.coffeeTypeSupported?.join(", ") || "—"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
