import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../contexts/AuthProvider";
import {
  normalizeStatus,
  sortSubscriptionsByRecent,
} from "./subscriptionUtils";

const API_BASE_URL = process.env.REACT_APP_API_URL;

export default function useSubscriptionHistory() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const userId = user?._id || user?.id || "";

  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [cancelLoadingId, setCancelLoadingId] = useState("");

  const loadSubscriptions = useCallback(async () => {
    if (authLoading) return;

    if (!isAuthenticated || !userId) {
      setSubscriptions([]);
      setError("User not authenticated.");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      setSubscriptions([]);
      setError("User not authenticated.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

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

      setSubscriptions(sortSubscriptionsByRecent(Array.isArray(data) ? data : []));
    } catch (err) {
      setSubscriptions([]);
      setError(err.message || "Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  }, [authLoading, isAuthenticated, userId]);

  useEffect(() => {
    loadSubscriptions();
  }, [loadSubscriptions]);

  const cancelSubscription = useCallback(
    async (subscriptionId) => {
      if (!subscriptionId) return { ok: false };

      const token = localStorage.getItem("authToken");
      if (!token || !userId) {
        setActionError("User not authenticated.");
        return { ok: false };
      }

      setActionError("");
      setCancelLoadingId(subscriptionId);

      try {
        const response = await fetch(
          `${API_BASE_URL}/subscriptions/${subscriptionId}/cancel`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || data.message || "Failed to cancel subscription");
        }

        await loadSubscriptions();
        return { ok: true };
      } catch (err) {
        setActionError(err.message || "Failed to cancel subscription");
        return { ok: false };
      } finally {
        setCancelLoadingId("");
      }
    },
    [loadSubscriptions, userId]
  );

  const activeSubscription = useMemo(
    () => subscriptions.find((sub) => normalizeStatus(sub) === "active") || null,
    [subscriptions]
  );

  return {
    subscriptions,
    activeSubscription,
    loading,
    error,
    actionError,
    cancelLoadingId,
    refreshSubscriptions: loadSubscriptions,
    cancelSubscription,
    clearActionError: () => setActionError(""),
  };
}
