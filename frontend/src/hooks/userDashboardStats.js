import { useEffect, useState } from "react";
import userApi from "../api/userApi";

export default function useUserDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const summary = await userApi.getDashboardSummary();
        setData(summary);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  return { data, loading, error };
}
