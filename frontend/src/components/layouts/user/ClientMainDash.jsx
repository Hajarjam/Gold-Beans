import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NewProducts from "../../common/user/NewProducts";
import SubscriptionPlans from "../../common/user/SubscriptionPlans";
import SubPreview from "../../common/user/SubPreview";
import DeliveryCalendar from "../../common/user/DeliveryCalendar";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const ClientMainDash = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("User not authenticated");

        const response = await fetch(`${API_BASE_URL}/client/dashboard`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || data.message || "Failed to fetch dashboard data");

        setProducts(data.coffeesPreview || []);
        setSubscriptions(data.currentSubscriptions || data.subscriptionsPreview || []);
        setHistory(data.subscriptionHistory || data.historyPreview || []);
      } catch (err) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="p-6 text-brown">Loading dashboard...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  const matches = (keywords) => {
    if (!searchQuery.trim()) return true;
    return keywords.some((keyword) =>
      keyword.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-peach-light text-brown">
      <div className="p-4">
        <input
          type="text"
          placeholder="Search sections..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md px-4 py-2 rounded-lg border-2 border-charcoal focus:outline-none bg-white"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 pb-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {matches(["history", "subscriptions"]) && (
            <div>
              <SubPreview data={history} onViewAll={() => navigate("/client/subscriptions")} />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {matches(["products", "coffee", "coffees"]) && (
              <div className="bg-brown text-peach-light rounded-lg shadow-md p-6">
                <NewProducts products={products} />
                <button
                  onClick={() => navigate("/client/coffees")}
                  className="mt-4 w-full py-2 bg-peach-light text-brown rounded hover:bg-white transition-colors"
                >
                  View More →
                </button>
              </div>
            )}

            {matches(["plans", "subscriptions"]) && (
              <div className="bg-brown text-peach-light rounded-lg shadow-md p-6">
                <SubscriptionPlans subscriptions={subscriptions} />
                <button
                  onClick={() => navigate("/client/subscriptions")}
                  className="mt-4 w-full py-2 bg-peach-light text-brown rounded hover:bg-white transition-colors"
                >
                  View More →
                </button>
              </div>
            )}
          </div>
        </div>

        {matches(["delivery", "calendar"]) && (
          <div>
            <DeliveryCalendar />
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientMainDash;
