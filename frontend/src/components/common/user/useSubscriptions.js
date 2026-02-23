import { useEffect, useMemo, useState } from "react";

const API_BASE_URL = process.env.REACT_APP_API_URL;

export const useSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(`${API_BASE_URL}/subscriptions`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data.error || data.message || "Failed to load subscriptions",
        );

      setSubscriptions(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  };

  const { active, inactive } = useMemo(() => {
    const activeSubs = subscriptions.filter((s) => s.status === "Active");
    const inactiveSubs = subscriptions.filter((s) => s.status !== "Active");
    return { active: activeSubs, inactive: inactiveSubs };
  }, [subscriptions]);

  return {
    active,
    inactive,
    loading,
    error,
  };
};
