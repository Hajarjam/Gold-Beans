import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import NewProducts from "../../common/user/NewProducts";
import DeliveryCalendar from "../../common/user/DeliveryCalendar";
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

const collectDeliveryDates = (subs) => {
  if (!Array.isArray(subs)) return [];

  return subs
    .map((sub) => normalizeDate(sub?.nextDelivery || sub?.deliveryDate || sub?.startDate))
    .filter(Boolean);
};

const formatDate = (value) => {
  const normalized = normalizeDate(value);
  if (!normalized) return "-";
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
};

const formatPrice = (value) => {
  const price = Number(value);
  if (!Number.isFinite(price)) return "0.00";
  return price.toFixed(2);
};

const toPlanName = (roastLevel, fallback = "Subscription Plan") => {
  const roast = String(roastLevel || "").trim();
  if (ROAST_PLANS.includes(roast)) return `${roast} Roast`;
  return fallback;
};

const getSubscriptionPlanName = (sub) =>
  toPlanName(sub?.coffee?.roastLevel, sub?.coffee?.name || sub?.plan || "Subscription Plan");

const normalizeStatus = (sub) => {
  const rawStatus = String(sub?.status || "").toLowerCase();
  if (rawStatus === "cancelled" || sub?.isCancelled) return "cancelled";
  if (rawStatus === "active" && !sub?.endDate) return "active";

  const endDate = normalizeDate(sub?.endDate);
  if (endDate) {
    const end = new Date(endDate);
    if (!Number.isNaN(end.getTime()) && end.getTime() <= Date.now()) {
      return "expired";
    }
  }

  return rawStatus === "active" ? "active" : "expired";
};

const normalizeHistory = (items) => {
  if (!Array.isArray(items)) return [];
  return [...items].sort((a, b) => {
    const aDate = normalizeDate(a?.startDate) || normalizeDate(a?.createdAt);
    const bDate = normalizeDate(b?.startDate) || normalizeDate(b?.createdAt);
    return toDateValue(bDate) - toDateValue(aDate);
  });
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

  const [products, setProducts] = useState([]);
  const [plans, setPlans] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [deliveryDates, setDeliveryDates] = useState([]);
  const [searchQuery] = useState("");

  const [productsLoading, setProductsLoading] = useState(true);
  const [plansLoading, setPlansLoading] = useState(true);
  const [subsLoading, setSubsLoading] = useState(true);

  const [productsError, setProductsError] = useState("");
  const [plansError, setPlansError] = useState("");
  const [subsError, setSubsError] = useState("");
  const [actionError, setActionError] = useState("");

  const [subscribingPlanId, setSubscribingPlanId] = useState("");
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const loadSubscriptions = async (token) => {
    setSubsLoading(true);
    setSubsError("");

    try {
      const response = await fetch(`${API_BASE_URL}/subscriptions`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to load subscriptions");
      }

      const list = Array.isArray(data) ? normalizeHistory(data) : [];
      setSubscriptions(list);
      setDeliveryDates(collectDeliveryDates(list));
    } catch (err) {
      setSubsError(err.message || "Failed to load subscriptions");
      setSubscriptions([]);
      setDeliveryDates([]);
    } finally {
      setSubsLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || !userId) {
      setProductsLoading(false);
      setPlansLoading(false);
      setSubsLoading(false);
      setProductsError("User not authenticated.");
      setPlansError("User not authenticated.");
      setSubsError("User not authenticated.");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      setProductsLoading(false);
      setPlansLoading(false);
      setSubsLoading(false);
      setProductsError("User not authenticated.");
      setPlansError("User not authenticated.");
      setSubsError("User not authenticated.");
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
    loadSubscriptions(token);
  }, [authLoading, isAuthenticated, userId]);

  const activeSubscription = useMemo(
    () => subscriptions.find((sub) => normalizeStatus(sub) === "active") || null,
    [subscriptions]
  );

  const activePlanRoast = String(activeSubscription?.coffee?.roastLevel || "").trim();

  const handleSubscribe = async (plan) => {
    const token = localStorage.getItem("authToken");
    if (!token || !userId) {
      setActionError("User not authenticated.");
      return;
    }

    setActionError("");
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

      await loadSubscriptions(token);
    } catch (err) {
      setActionError(err.message || "Failed to subscribe");
    } finally {
      setSubscribingPlanId("");
    }
  };

  const openCancelModal = (subscription) => {
    if (!subscription?._id) return;
    setCancelTarget(subscription);
  };

  const closeCancelModal = () => {
    if (cancelLoading) return;
    setCancelTarget(null);
  };

  const handleCancelSubscription = async () => {
    if (!cancelTarget?._id) return;

    const token = localStorage.getItem("authToken");
    if (!token || !userId) {
      setActionError("User not authenticated.");
      closeCancelModal();
      return;
    }

    setActionError("");
    setCancelLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/subscriptions/${cancelTarget._id}/cancel`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to cancel subscription");
      }

      await loadSubscriptions(token);
      setCancelTarget(null);
    } catch (err) {
      setActionError(err.message || "Failed to cancel subscription");
    } finally {
      setCancelLoading(false);
    }
  };

  const matches = useMemo(
    () => (keywords) => {
      if (!searchQuery.trim()) return true;
      return keywords.some((keyword) =>
        keyword.toLowerCase().includes(searchQuery.toLowerCase())
      );
    },
    [searchQuery]
  );

  return (
    <div className="flex flex-col w-full min-h-screen bg-peach-light text-brown pt-8">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 pb-6 ">
        <div className="lg:col-span-2 space-y-3">
          {matches(["products", "coffee", "coffees"]) && (
            <div className="bg-brown text-peach-light rounded-lg shadow-md p-6">
              {productsLoading ? (
                <p className="text-sm text-peach-light/80">Loading products...</p>
              ) : productsError ? (
                <p className="text-sm text-red-300">{productsError}</p>
              ) : (
                <>
                  <NewProducts products={products} />
                  <button
                    onClick={() => navigate("/client/coffees")}
                    className="mt-4 w-full py-2 bg-peach-light text-brown rounded hover:bg-white transition-colors"
                  >
                    View More
                  </button>
                </>
              )}
            </div>
          )}

          {matches(["plans", "subscriptions"]) && (
            <section id="plans-section" className="bg-brown text-peach-light rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-3">Subscription Plans</h3>

              {plansLoading ? (
                <p className="text-sm text-peach-light/80">Loading subscription plans...</p>
              ) : plansError ? (
                <p className="text-sm text-red-300">{plansError}</p>
              ) : plans.length === 0 ? (
                <p className="text-sm text-peach-light/80">No subscription plans available.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {plans.map((plan) => {
                    const isCurrentPlan = activePlanRoast && plan.roastLevel === activePlanRoast;
                    const isProcessing = subscribingPlanId === plan.id;

                    return (
                      <article
                        key={plan.id}
                        className={`rounded-lg border p-4 ${
                          isCurrentPlan ? "border-peach bg-peach/20" : "border-peach/30 bg-peach/10"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-semibold text-base">{plan.name}</h4>
                          {isCurrentPlan ? (
                            <span className="text-xs px-2 py-1 rounded bg-green-700 text-white">
                              Current Plan
                            </span>
                          ) : null}
                        </div>
                        <p className="text-sm text-peach-light/85 mt-2 line-clamp-3 min-h-[60px]">
                          {plan.description}
                        </p>
                        <p className="mt-3 text-sm font-medium">Price: ${formatPrice(plan.price)}</p>
                        <button
                          type="button"
                          disabled={isCurrentPlan || isProcessing || !plan.coffeeId}
                          onClick={() => handleSubscribe(plan)}
                          className={`mt-3 w-full py-2 rounded transition-colors ${
                            isCurrentPlan || !plan.coffeeId
                              ? "bg-peach/40 text-peach-light/70 cursor-not-allowed"
                              : "bg-peach-light text-brown hover:bg-white"
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
          )}

          {matches(["active", "current", "subscription"]) && (
            <section className="bg-brown text-peach-light rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-3">Active Subscription</h3>

              {subsLoading ? (
                <p className="text-sm text-peach-light/80">Loading active subscription...</p>
              ) : subsError ? (
                <p className="text-sm text-red-300">{subsError}</p>
              ) : activeSubscription ? (
                <div className="rounded-lg border border-peach/30 bg-peach/10 p-4">
                  <p className="font-medium text-base">
                    {getSubscriptionPlanName(activeSubscription)}
                  </p>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <p>Start Date: {formatDate(activeSubscription?.startDate || activeSubscription?.createdAt)}</p>
                    <p>Next Billing Date: {formatDate(activeSubscription?.nextDelivery)}</p>
                    <p>Price: ${formatPrice(activeSubscription?.price)}</p>
                    <p>Status: active</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openCancelModal(activeSubscription)}
                    className="mt-4 px-4 py-2 rounded-lg  bg-peach text-brown hover:bg-[#BB9582] hover:text-[#3B170D] transition"
                  >
                    Cancel Subscription
                  </button>
                </div>
              ) : (
                <div className="rounded-lg border border-peach/30 bg-peach/10 p-4">
                  <p className="text-sm text-peach-light/80">You have no active subscription.</p>
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById("plans-section")?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="mt-3 px-4 py-2 rounded bg-peach-light text-brown hover:bg-white transition-colors"
                  >
                    View Plans
                  </button>
                </div>
              )}
            </section>
          )}

          {matches(["history", "subscriptions"]) && (
            <section className="bg-brown text-peach-light rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-3">Subscription History</h3>

              {subsLoading ? (
                <p className="text-sm text-peach-light/80">Loading subscription history...</p>
              ) : subsError ? (
                <p className="text-sm text-red-300">{subsError}</p>
              ) : subscriptions.length === 0 ? (
                <p className="text-sm text-peach-light/80">No subscription history yet.</p>
              ) : (
                <div className="space-y-2">
                  {subscriptions.map((sub) => {
                    const status = normalizeStatus(sub);
                    return (
                      <article key={sub._id} className="rounded-lg border border-peach/30 bg-peach/10 p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-medium text-sm">
                            {getSubscriptionPlanName(sub)}
                          </p>
                          <span className="text-xs uppercase tracking-wide">{status}</span>
                        </div>
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-4 gap-2 text-sm text-peach-light/90">
                          <p>Start: {formatDate(sub?.startDate || sub?.createdAt)}</p>
                          <p>End: {status === "active" ? "Active" : formatDate(sub?.endDate)}</p>
                          <p>Status: {status}</p>
                          <p>Price Paid: ${formatPrice(sub?.price)}</p>
                        </div>
                        {status === "active" ? (
                          <button
                            type="button"
                            onClick={() => openCancelModal(sub)}
                            className="mt-3 px-3 py-1.5 rounded-lg bg-peach text-brown hover:bg-[#BB9582] hover:text-[#3B170D] transition text-sm"
                          >
                            Cancel
                          </button>
                        ) : null}
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {actionError ? (
            <div className="rounded-lg border border-red-300 bg-red-100 text-red-700 px-4 py-3 text-sm">
              {actionError}
            </div>
          ) : null}

          {!matches(["history", "subscriptions"]) && !matches(["active", "subscription"]) ? (
            <button
              type="button"
              onClick={() => navigate("/client/subscriptions")}
              className="w-full py-2 bg-brown text-peach-light rounded-lg hover:bg-charcoal transition-colors"
            >
              Go to Full Subscription History
            </button>
          ) : null}

          {cancelTarget && typeof document !== "undefined"
            ? createPortal(
                <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center px-4">
                  <div className="w-full max-w-sm rounded-xl bg-[#FFF3EB] text-[#3B170D] p-6 shadow-xl">
                    <h3 className="text-lg font-semibold">Cancel Subscription</h3>
                    <p className="mt-2 text-sm text-[#3B170D]/80">
                      Are you sure you want to cancel this subscription?
                    </p>
                    <div className="mt-6 flex justify-end gap-3">
                      <button
                        type="button"
                        disabled={cancelLoading}
                        onClick={closeCancelModal}
                        className="px-4 py-2 rounded-lg border border-[#3B170D]/30 hover:bg-[#3B170D]/5 transition"
                      >
                        Dismiss
                      </button>
                      <button
                        type="button"
                        disabled={cancelLoading}
                        onClick={handleCancelSubscription}
                        className="px-4 py-2 rounded-lg bg-[#3B170D] text-[#FFF3EB] hover:bg-[#BB9582] hover:text-[#3B170D] transition"
                      >
                        {cancelLoading ? "Cancelling..." : "Confirm"}
                      </button>
                    </div>
                  </div>
                </div>,
                document.body
              )
            : null}

          {matches(["history", "subscriptions"]) ? (
            <button
              onClick={() => navigate("/client/subscriptions")}
              className="w-full py-2 bg-brown text-peach-light rounded-lg hover:bg-charcoal transition-colors"
            >
              View Full History
            </button>
          ) : null}
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
