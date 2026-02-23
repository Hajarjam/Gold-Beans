import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import NewProducts from "../../common/user/NewProducts";
import SubscriptionPlans from "../../common/user/SubscriptionPlans";
import SubPreview from "../../common/user/SubPreview";
import DeliveryCalendar from "../../common/user/DeliveryCalendar";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const toDateValue = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
};

const normalizeDate = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && value.$date) return value.$date;
  return "";
};

const getApiOrigin = () => {
  if (!API_BASE_URL) return "";
  return API_BASE_URL.replace(/\/api\/?$/, "");
};

const toBackendImageUrl = (imagePath) => {
  if (!imagePath) return "/assets/coffee-beans.jpg";
  if (imagePath.startsWith("http")) return imagePath;

  const apiOrigin = getApiOrigin();
  if (imagePath.startsWith("/")) {
    return apiOrigin ? `${apiOrigin}${imagePath}` : imagePath;
  }

  const normalized = imagePath.startsWith("uploads/") ? `/${imagePath}` : `/uploads/coffees/${imagePath}`;
  return apiOrigin ? `${apiOrigin}${normalized}` : normalized;
};

const normalizePreviewProducts = (items) => {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => ({
      _id: String(item?._id?.$oid || item?._id || item?.id || item?.name),
      title: item?.name || "Coffee",
      imageUrl: toBackendImageUrl(
        Array.isArray(item?.images) && item.images.length
          ? item.images[0]
          : item?.image || ""
      ),
      sortDate: toDateValue(
        normalizeDate(item?.updatedAt) || normalizeDate(item?.createdAt)
      ),
    }))
    .sort((a, b) => b.sortDate - a.sortDate)
    .slice(0, 3);
};

const collectDeliveryDates = (subs) => {
  if (!Array.isArray(subs)) return [];

  return subs
    .map((sub) => normalizeDate(sub?.nextDelivery || sub?.deliveryDate || sub?.startDate))
    .filter(Boolean);
};

const ClientMainDash = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [history, setHistory] = useState([]);
  const [deliveryDates, setDeliveryDates] = useState([]);
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

        const currentSubs = data.currentSubscriptions || data.subscriptionsPreview || [];
        const historySubs = data.subscriptionHistory || data.historyPreview || [];

        setProducts(normalizePreviewProducts(data.coffeesPreview));
        setSubscriptions(currentSubs);
        setHistory(historySubs.slice(0, 2));
        setDeliveryDates(collectDeliveryDates([...currentSubs, ...historySubs]));
      } catch (err) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const matches = useMemo(
    () => (keywords) => {
      if (!searchQuery.trim()) return true;
      return keywords.some((keyword) =>
        keyword.toLowerCase().includes(searchQuery.toLowerCase())
      );
    },
    [searchQuery]
  );

  if (loading) return <div className="p-6 text-brown">Loading dashboard...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

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
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3 items-stretch">
          {matches(["products", "coffee", "coffees"]) && (
            <div className="bg-brown text-peach-light rounded-lg shadow-md p-6 h-full flex flex-col">
              <NewProducts products={products} />
              <button
                onClick={() => navigate("/client/coffees")}
                className="mt-4 w-full py-2 bg-peach-light text-brown rounded hover:bg-white transition-colors"
              >
                View More
              </button>
            </div>
          )}

          {matches(["plans", "subscriptions"]) && (
            <div className="bg-brown text-peach-light rounded-lg shadow-md p-6 h-full flex flex-col">
              <SubscriptionPlans subscriptions={subscriptions} />
              <button
                onClick={() => navigate("/subscribe")}
                className="mt-4 w-full py-2 bg-peach-light text-brown rounded hover:bg-white transition-colors"
              >
                View More
              </button>
            </div>
          )}

          {matches(["history", "subscriptions"]) && (
            <div className="md:col-span-2">
              <SubPreview data={history} onViewAll={() => navigate("/client/subscriptions")} />
            </div>
          )}
        </div>

        {matches(["delivery", "calendar"]) && (
          <div>
            <DeliveryCalendar deliveryDates={deliveryDates} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientMainDash;
