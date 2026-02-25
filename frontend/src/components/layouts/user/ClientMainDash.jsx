import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import NewProducts from "../../common/user/NewProducts";
import DeliveryCalendar from "../../common/user/DeliveryCalendar";
import SubscriptionHistoryList from "../../common/user/SubscriptionHistoryList";
import SubscriptionCancelModal from "../../common/user/SubscriptionCancelModal";
import useSubscriptionHistory from "../../common/user/useSubscriptionHistory";
import {
  collectDeliveryDates,
  formatDate,
  formatPrice,
  getSubscriptionPlanName,
  normalizeStatus,
} from "../../common/user/subscriptionUtils";
import { useAuth } from "../../../contexts/AuthProvider";

const API_BASE_URL = process.env.REACT_APP_API_URL;
const ROAST_ORDER = { Light: 0, Medium: 1, Dark: 2 };
const ROAST_PLANS = ["Light", "Medium", "Dark"];
const ROAST_DESCRIPTIONS = {
  Light:
    "A bright and delicate subscription with fruity, citrus-forward notes.",
  Medium:
    "A balanced and smooth subscription with chocolate and nutty notes.",
  Dark:
    "A bold and roasty subscription with deep, rich flavor.",
};

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

const normalizePlans = (items) => {
  if (!Array.isArray(items)) return [];

  const sorted = [...items].sort((a, b) => {
    const roastA = ROAST_ORDER[a?.roastLevel] ?? 99;
    const roastB = ROAST_ORDER[b?.roastLevel] ?? 99;
    if (roastA !== roastB) return roastA - roastB;
    return toDateValue(normalizeDate(b?.createdAt)) - toDateValue(normalizeDate(a?.createdAt));
  });

  return ROAST_PLANS.map((roast) => {
    const coffee = sorted.find((item) => String(item?.roastLevel || "").trim() === roast);

    return {
      id: String(coffee?._id || `plan-${roast.toLowerCase()}`),
      coffeeId: String(coffee?._id || ""),
      roastLevel: roast,
      name: `${roast} Roast`,
      description: coffee?.description || ROAST_DESCRIPTIONS[roast],
      price: Number(coffee?.price || 0),
    };
  });
};

const ClientMainDash = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const userId = user?._id || user?.id || "";
  const navigate = useNavigate();
  const {
    subscriptions,
    activeSubscription,
    loading: subsLoading,
    error: subsError,
    actionError: subsActionError,
    cancelLoadingId,
    refreshSubscriptions,
    cancelSubscription,
    clearActionError,
  } = useSubscriptionHistory();

  const [products, setProducts] = useState([]);
  const [plans, setPlans] = useState([]);
  const [deliveryDates, setDeliveryDates] = useState([]);
  const [historyPage, setHistoryPage] = useState(1);

  const [productsLoading, setProductsLoading] = useState(true);
  const [plansLoading, setPlansLoading] = useState(true);

  const [productsError, setProductsError] = useState("");
  const [plansError, setPlansError] = useState("");
  const [subscribeActionError, setSubscribeActionError] = useState("");

  const [subscribingPlanId, setSubscribingPlanId] = useState("");
  const [cancelTarget, setCancelTarget] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || !userId) {
      setProductsLoading(false);
      setPlansLoading(false);
      setProductsError("User not authenticated.");
      setPlansError("User not authenticated.");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      setProductsLoading(false);
      setPlansLoading(false);
      setProductsError("User not authenticated.");
      setPlansError("User not authenticated.");
      return;
    }

    const fetchProducts = async () => {
      setProductsLoading(true);
      setProductsError("");

      try {
        const response = await fetch(`${API_BASE_URL}/client/dashboard`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || data.message || "Failed to fetch dashboard data");
        }

        setProducts(normalizePreviewProducts(data.coffeesPreview));
      } catch (err) {
        setProductsError(err.message || "Failed to load dashboard data");
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };

    const fetchPlans = async () => {
      setPlansLoading(true);
      setPlansError("");

      try {
        const response = await fetch(`${API_BASE_URL}/coffees`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || data.message || "Failed to load subscription plans");
        }

        setPlans(normalizePlans(Array.isArray(data) ? data : []));
      } catch (err) {
        setPlansError(err.message || "Failed to load subscription plans");
        setPlans([]);
      } finally {
        setPlansLoading(false);
      }
    };

    fetchProducts();
    fetchPlans();
  }, [authLoading, isAuthenticated, userId]);

  useEffect(() => {
    setDeliveryDates(collectDeliveryDates(subscriptions));
  }, [subscriptions]);

  const activePlanRoast = String(activeSubscription?.coffee?.roastLevel || "").trim();
  const actionError = subscribeActionError || subsActionError;
  const stats = useMemo(() => {
    const active = subscriptions.filter((sub) => normalizeStatus(sub) === "active").length;
    const cancelled = subscriptions.filter((sub) => normalizeStatus(sub) === "cancelled").length;
    return {
      availablePlans: plans.filter((plan) => Boolean(plan.coffeeId)).length,
      totalSubscriptions: subscriptions.length,
      activeSubscriptions: active,
      cancelledSubscriptions: cancelled,
      nextBillingDate: activeSubscription?.nextDelivery
        ? formatDate(activeSubscription.nextDelivery)
        : "-",
    };
  }, [plans, subscriptions, activeSubscription]);

  const handleSubscribe = async (plan) => {
    const token = localStorage.getItem("authToken");
    if (!token || !userId) {
      setSubscribeActionError("User not authenticated.");
      return;
    }

    setSubscribeActionError("");
    clearActionError();
    setSubscribingPlanId(plan.id);

    try {
      const response = await fetch(`${API_BASE_URL}/subscriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          coffeeId: plan.coffeeId,
          plan: "Monthly",
          grind: "whole-bean",
          weight: 500,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to subscribe");
      }

      await refreshSubscriptions();
      setHistoryPage(1);
    } catch (err) {
      setSubscribeActionError(err.message || "Failed to subscribe");
    } finally {
      setSubscribingPlanId("");
    }
  };

  const openCancelModal = (subscription) => {
    if (!subscription?._id) return;
    setCancelTarget(subscription);
  };

  const closeCancelModal = () => {
    if (Boolean(cancelLoadingId)) return;
    setCancelTarget(null);
  };

  const handleCancelSubscription = async () => {
    if (!cancelTarget?._id) return;

    const result = await cancelSubscription(cancelTarget._id);
    if (result.ok) {
      setCancelTarget(null);
      setHistoryPage(1);
    }
  };

  return (
    <div className="px-6 py-4 text-gray-800">
      <h1 className="text-2xl font-semibold mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow-sm rounded-lg p-5 border border-[#EADFD7]">
          <p className="text-sm font-medium text-gray-500 mb-3">Subscription Plans</p>
          <p className="text-2xl font-semibold text-[#3B170D]">{stats.availablePlans}</p>
        </div>
        <div className="bg-white shadow-sm rounded-lg p-5 border border-[#EADFD7]">
          <p className="text-sm font-medium text-gray-500 mb-3">Active Subscriptions</p>
          <p className="text-2xl font-semibold text-[#3B170D]">{stats.activeSubscriptions}</p>
        </div>
        <div className="bg-white shadow-sm rounded-lg p-5 border border-[#EADFD7]">
          <p className="text-sm font-medium text-gray-500 mb-3">Total Subscription History</p>
          <p className="text-2xl font-semibold text-[#3B170D]">{stats.totalSubscriptions}</p>
        </div>
        <div className="bg-white shadow-sm rounded-lg p-5 border border-[#EADFD7]">
          <p className="text-sm font-medium text-gray-500 mb-3">Next Billing Date</p>
          <p className="text-2xl font-semibold text-[#3B170D]">{stats.nextBillingDate}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-[#EADFD7]">
            {productsLoading ? (
              <p className="text-sm text-gray-500">Loading products...</p>
            ) : productsError ? (
              <p className="text-sm text-red-600">{productsError}</p>
            ) : (
              <>
                <NewProducts products={products} />
                <button
                  onClick={() => navigate("/client/coffees")}
                  className="mt-4 w-full py-2 bg-[#3B170D] text-white rounded hover:bg-[#5A2A1A] transition-colors"
                >
                  View More
                </button>
              </>
            )}
          </div>

          <section id="plans-section" className="bg-white rounded-lg shadow-sm p-6 border border-[#EADFD7]">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Subscription Plans</h3>

            {plansLoading ? (
              <p className="text-sm text-gray-500">Loading subscription plans...</p>
            ) : plansError ? (
              <p className="text-sm text-red-600">{plansError}</p>
            ) : plans.length === 0 ? (
              <p className="text-sm text-gray-500">No subscription plans available.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {plans.map((plan) => {
                  const isCurrentPlan = activePlanRoast && plan.roastLevel === activePlanRoast;
                  const isProcessing = subscribingPlanId === plan.id;

                  return (
                    <article
                      key={plan.id}
                      className={`rounded-lg border p-4 ${
                        isCurrentPlan ? "border-[#3B170D] bg-[#F6EEE7]" : "border-[#EADFD7] bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-semibold text-base text-gray-800">{plan.name}</h4>
                        {isCurrentPlan ? (
                          <span className="text-xs px-2 py-1 rounded bg-[#3B170D] text-white">
                            Current Plan
                          </span>
                        ) : null}
                      </div>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-3 min-h-[60px]">
                        {plan.description}
                      </p>
                      <p className="mt-3 text-sm font-medium text-gray-800">Price: ${formatPrice(plan.price)}</p>
                      <button
                        type="button"
                        disabled={isCurrentPlan || isProcessing || !plan.coffeeId}
                        onClick={() => handleSubscribe(plan)}
                        className={`mt-3 w-full py-2 rounded transition-colors ${
                          isCurrentPlan || !plan.coffeeId
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-[#3B170D] text-white hover:bg-[#5A2A1A]"
                        }`}
                      >
                        {isCurrentPlan
                          ? "Current Plan"
                          : isProcessing
                            ? "Subscribing..."
                            : !plan.coffeeId
                              ? "Unavailable"
                              : "Subscribe"}
                      </button>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <section className="bg-white rounded-lg shadow-sm p-6 border border-[#EADFD7]">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Active Subscription</h3>

            {subsLoading ? (
              <p className="text-sm text-gray-500">Loading active subscription...</p>
            ) : subsError ? (
              <p className="text-sm text-red-600">{subsError}</p>
            ) : activeSubscription ? (
              <div className="rounded-lg border border-[#EADFD7] bg-[#FDF9F5] p-4">
                <p className="font-medium text-base text-gray-800">
                  {getSubscriptionPlanName(activeSubscription)}
                </p>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                  <p>Start Date: {formatDate(activeSubscription?.startDate || activeSubscription?.createdAt)}</p>
                  <p>Next Billing Date: {formatDate(activeSubscription?.nextDelivery)}</p>
                  <p>Price: ${formatPrice(activeSubscription?.price)}</p>
                  <p>Status: active</p>
                </div>
                <button
                  type="button"
                  onClick={() => openCancelModal(activeSubscription)}
                  className="mt-4 px-4 py-2 rounded-lg bg-[#3B170D] text-[#FFF3EB] hover:bg-[#BB9582] hover:text-[#3B170D] transition"
                >
                  Cancel Subscription
                </button>
              </div>
            ) : (
              <div className="rounded-lg border border-[#EADFD7] bg-[#FDF9F5] p-4">
                <p className="text-sm text-gray-600">You have no active subscription.</p>
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("plans-section")?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="mt-3 px-4 py-2 rounded bg-[#3B170D] text-white hover:bg-[#5A2A1A] transition-colors"
                >
                  View Plans
                </button>
              </div>
            )}
          </section>

          <section className="bg-white rounded-lg shadow-sm p-6 border border-[#EADFD7]">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Subscription History</h3>
            <SubscriptionHistoryList
              subscriptions={subscriptions}
              loading={subsLoading}
              error={subsError}
              currentPage={historyPage}
              onPageChange={setHistoryPage}
              itemsPerPage={3}
              onCancelRequest={openCancelModal}
              cancelLoadingId={cancelLoadingId}
              emptyMessage="No subscription history yet."
              variant="light"
            />

            <button
              onClick={() => navigate("/client/subscriptions")}
              className="mt-4 w-full py-2 bg-[#3B170D] text-white rounded hover:bg-[#5A2A1A] transition-colors"
            >
              View Full History
            </button>
          </section>

          {actionError ? (
            <div className="rounded-lg border border-red-300 bg-red-100 text-red-700 px-4 py-3 text-sm">
              {actionError}
            </div>
          ) : null}

          <SubscriptionCancelModal
            isOpen={Boolean(cancelTarget)}
            onClose={closeCancelModal}
            onConfirm={handleCancelSubscription}
            loading={Boolean(cancelLoadingId)}
          />
        </div>

        <div>
          <DeliveryCalendar deliveryDates={deliveryDates} />
        </div>
      </div>
    </div>
  );
};

export default ClientMainDash;
