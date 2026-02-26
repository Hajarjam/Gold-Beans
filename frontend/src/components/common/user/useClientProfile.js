import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthProvider";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const normalizeProfile = (data = {}) => ({
  ...data,
  firstName: data?.firstName || "",
  lastName: data?.lastName || "",
  email: data?.email || "",
  phone: data?.phone || "",
  role: data?.role || "client",
  isActive: typeof data?.isActive === "boolean" ? data.isActive : true,
});

export const useClientProfile = () => {
  const { user, refreshAuth, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (!user) return;

    setProfile((prev) => {
      if (prev) return prev;
      return normalizeProfile(user);
    });
  }, [user]);

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

      const nextData = data?.data || data;
      let updatedProfile = null;
      setProfile((prev) => {
        updatedProfile = normalizeProfile({ ...(prev || {}), ...nextData });
        return updatedProfile;
      });
      setMessage("Profile updated successfully");
      await refreshAuth();

      return updatedProfile;
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

  const uploadAvatar = async (file) => {
    try {
      setAvatarUploading(true);
      setError("");
      setMessage("");

      if (!file) throw new Error("Please select an image.");

      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Not authenticated");

      const formData = new FormData();
      formData.append("avatar", file);

      const res = await fetch(`${API_BASE_URL}/client/avatar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || data.message || "Failed to upload avatar");
      }

      const nextData = data?.data || data;
      let updatedProfile = null;
      setProfile((prev) => {
        updatedProfile = normalizeProfile({ ...(prev || {}), ...nextData });
        return updatedProfile;
      });
      setMessage("Profile image updated successfully");
      await refreshAuth();

      return updatedProfile;
    } catch (err) {
      setError(err.message || "Failed to upload avatar");
      throw err;
    } finally {
      setAvatarUploading(false);
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
    avatarUploading,
    error,
    message,
    updateProfile,
    uploadAvatar,
    updatePassword,
    deleteAccount,
    logout,
  };
};
