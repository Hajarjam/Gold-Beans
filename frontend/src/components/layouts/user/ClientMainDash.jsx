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
} from "../../common/user/subscriptionUtils";
import { useAuth } from "../../../contexts/AuthProvider";

const API_BASE_URL = process.env.REACT_APP_API_URL;
const ROAST_ORDER = { Light: 0, Medium: 1, Dark: 2 };
const ROAST_PLANS = ["Light", "Medium", "Dark"];
const ROAST_DESCRIPTIONS = {
  Light:
    "A bright and delicate subscription with fruity, citrus-forward notes.",
  Medium: "A balanced and smooth subscription with chocolate and nutty notes.",
  Dark: "A bold and roasty subscription with deep, rich flavor.",
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

  const normalized = imagePath.startsWith("uploads/")
    ? `/${imagePath}`
    : `/uploads/coffees/${imagePath}`;
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
          : item?.image || "",
      ),
      sortDate: toDateValue(
        normalizeDate(item?.updatedAt) || normalizeDate(item?.createdAt),
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
    return (
      toDateValue(normalizeDate(b?.createdAt)) -
      toDateValue(normalizeDate(a?.createdAt))
    );
  });

  return ROAST_PLANS.map((roast) => {
    const coffee = sorted.find(
      (item) => String(item?.roastLevel || "").trim() === roast,
    );

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
  const [searchQuery] = useState("");
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
          throw new Error(
            data.error || data.message || "Failed to fetch dashboard data",
          );
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
          throw new Error(
            data.error || data.message || "Failed to load subscription plans",
          );
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

  const activePlanRoast = String(
    activeSubscription?.coffee?.roastLevel || "",
  ).trim();
  const actionError = subscribeActionError || subsActionError;

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

  const matches = useMemo(
    () => (keywords) => {
      if (!searchQuery.trim()) return true;
      return keywords.some((keyword) =>
        keyword.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    },
    [searchQuery],
  );

  return (
    <div className="flex flex-col w-full min-h-screen bg-peach-light text-brown pt-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 pb-6 ">
        <div className="lg:col-span-2 space-y-3">
          {matches(["products", "coffee", "coffees"]) && (
            <div className="bg-peach/40 text-brown rounded-lg shadow-md p-6">
              {productsLoading ? (
                <p className="text-sm text-peach-light/80">
                  Loading products...
                </p>
              ) : productsError ? (
                <p className="text-sm text-red-300">{productsError}</p>
              ) : (
                <>
                  <NewProducts products={products} />
                  <button
                    onClick={() => navigate("/client/coffees")}
                    className="mt-4 w-full py-2 bg-brown text-white rounded hover:bg-white transition-colors"
                  >
                    View More
                  </button>
                </>
              )}
            </div>
          )}

          {matches(["plans", "subscriptions"]) && (
            <section
              id="plans-section"
              className="bg-peach/40 text-brown rounded-lg shadow-md p-6"
            >
              <h3 className="md:text-xl font-semibold font-instrument-sans mb-2">
                Subscription Plans
              </h3>

              {plansLoading ? (
                <p className="text-sm text-brown/70">
                  Loading subscription plans...
                </p>
              ) : plansError ? (
                <p className="text-sm text-red-700">{plansError}</p>
              ) : plans.length === 0 ? (
                <div className="bg-peach px-3 py-2 rounded text-sm text-brown">
                  No subscription plans available.
                </div>
              ) : (
                <div className="flex gap-2 overflow-x-auto pb-1 px-1">
                  {plans.map((plan) => {
                    const isCurrentPlan =
                      activePlanRoast && plan.roastLevel === activePlanRoast;
                    const isProcessing = subscribingPlanId === plan.id;

                    return (
                      <article
                        key={plan.id}
                        className={`min-w-[220px] flex-1 px-3 py-2 rounded-lg border shadow-sm transition-colors ${
                          isCurrentPlan
                            ? "border-brown/60 bg-peach"
                            : "border-brown/25 bg-peach/30 hover:bg-peach/70"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-medium text-sm text-brown">
                            {plan.name}
                          </h4>
                          {isCurrentPlan ? (
                            <span className="text-xs px-2 py-1 rounded bg-peach-light text-brown">
                              Current Plan
                            </span>
                          ) : null}
                        </div>
                        <p className="text-sm text-brown/80 mt-2 line-clamp-3 min-h-[60px]">
                          {plan.description}
                        </p>
                        <p className="mt-2 text-sm font-medium text-brown">
                          Price: ${formatPrice(plan.price)}
                        </p>
                        <button
                          type="button"
                          disabled={
                            isCurrentPlan || isProcessing || !plan.coffeeId
                          }
                          onClick={() => handleSubscribe(plan)}
                          className={`mt-2 w-full py-2 rounded transition-colors ${
                            isCurrentPlan || !plan.coffeeId
                              ? "bg-peach-light/70 text-brown/70 cursor-not-allowed"
                              : "bg-brown text-white hover:bg-white"
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

          {(matches(["active", "current", "subscription"]) ||
            matches(["history", "subscriptions"])) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {matches(["active", "current", "subscription"]) && (
                <section className="bg-peach/40 text-brown rounded-lg shadow-md p-6">
                  <h3 className="md:text-xl font-semibold font-instrument-sans mb-2">
                    Active Subscription
                  </h3>

                  {subsLoading ? (
                    <p className="text-sm text-brown/70">
                      Loading active subscription...
                    </p>
                  ) : subsError ? (
                    <p className="text-sm text-red-700">{subsError}</p>
                  ) : activeSubscription ? (
                    <div className="bg-peach px-3 py-2 rounded shadow-sm">
                      <p className="font-medium text-sm text-brown">
                        {getSubscriptionPlanName(activeSubscription)}
                      </p>
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-brown/85">
                        <p>
                          Start Date:{" "}
                          {formatDate(
                            activeSubscription?.startDate ||
                              activeSubscription?.createdAt,
                          )}
                        </p>
                        <p>
                          Next Billing Date:{" "}
                          {formatDate(activeSubscription?.nextDelivery)}
                        </p>
                        <p>Price: ${formatPrice(activeSubscription?.price)}</p>
                        <p>Status: active</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => openCancelModal(activeSubscription)}
                        className="mt-3 px-4 py-2 rounded bg-peach-light text-brown hover:bg-white transition-colors"
                      >
                        Cancel Subscription
                      </button>
                    </div>
                  ) : (
                    <div className="bg-peach px-3 py-2 rounded shadow-sm">
                      <p className="text-sm text-brown/70">
                        You have no active subscription.
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          document
                            .getElementById("plans-section")
                            ?.scrollIntoView({ behavior: "smooth" })
                        }
                        className="mt-2 px-4 py-2 rounded bg-peach-light text-brown hover:bg-white transition-colors"
                      >
                        View Plans
                      </button>
                    </div>
                  )}
                </section>
              )}

              {matches(["history", "subscriptions"]) && (
                <section className="bg-peach/40 text-brown rounded-lg shadow-md p-6">
                  <h3 className="md:text-xl font-semibold font-instrument-sans mb-2">
                    Subscription History
                  </h3>
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
                    variant="newProduct"
                  />
                </section>
              )}
            </div>
          )}

          {actionError ? (
            <div className="rounded-lg border border-red-300 bg-red-100 text-red-700 px-4 py-3 text-sm">
              {actionError}
            </div>
          ) : null}

          {!matches(["history", "subscriptions"]) &&
          !matches(["active", "subscription"]) ? (
            <button
              type="button"
              onClick={() => navigate("/client/subscriptions")}
              className="w-full py-2 bg-brown text-peach-light rounded-lg hover:bg-charcoal transition-colors"
            >
              Go to Full Subscription History
            </button>
          ) : null}

          <SubscriptionCancelModal
            isOpen={Boolean(cancelTarget)}
            onClose={closeCancelModal}
            onConfirm={handleCancelSubscription}
            loading={Boolean(cancelLoadingId)}
          />

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
