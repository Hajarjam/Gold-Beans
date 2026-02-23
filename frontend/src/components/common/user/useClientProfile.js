import { useEffect, useState } from "react";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const normalizeProfile = (data) => ({
  firstName: data?.firstName || "",
  lastName: data?.lastName || "",
  email: data?.email || "",
  role: data?.role || "client",
  isActive: typeof data?.isActive === "boolean" ? data.isActive : true,
});

export const useClientProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(`${API_BASE_URL}/client/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || data.message || "Failed to load profile");

      setProfile(normalizeProfile(data));
    } catch (err) {
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (form) => {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_BASE_URL}/client/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data.error || data.message || "Failed to update profile",
        );

      const updated = normalizeProfile(data?.data || data);
      setProfile(updated);
      setMessage("Profile updated");

      return updated;
    } catch (err) {
      setError(err.message || "Failed to update profile");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const updatePassword = async (passwordForm) => {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_BASE_URL}/client/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwordForm),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data.error || data.message || "Failed to update password",
        );

      setMessage("Password updated");
    } catch (err) {
      setError(err.message || "Failed to update password");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const deleteAccount = async () => {
    try {
      setSaving(true);
      setError("");

      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_BASE_URL}/client/account`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data.error || data.message || "Failed to delete account",
        );

      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    } catch (err) {
      setError(err.message || "Failed to delete account");
      setSaving(false);
    }
  };

  return {
    profile,
    loading,
    saving,
    error,
    message,
    updateProfile,
    updatePassword,
    deleteAccount,
  };
};
