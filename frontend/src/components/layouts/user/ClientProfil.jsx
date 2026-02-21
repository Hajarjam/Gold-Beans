import React, { useEffect, useState } from "react";
import LogoutButton from "../../common/LogoutButton";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const ClientProfil = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Not authenticated");

        const res = await fetch(`${API_BASE_URL}/client/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || data.message || "Failed to load profile");

        setForm({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
        });
      } catch (err) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const onProfileChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const onPasswordChange = (e) =>
    setPasswordForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);

    try {
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
      if (!res.ok) throw new Error(data.error || data.message || "Failed to update profile");
      setMessage("Profile updated");
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);

    try {
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
      if (!res.ok) throw new Error(data.error || data.message || "Failed to update password");
      setPasswordForm({ currentPassword: "", newPassword: "" });
      setMessage("Password updated");
    } catch (err) {
      setError(err.message || "Failed to update password");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("Delete your account permanently?");
    if (!confirmed) return;

    setError("");
    setMessage("");
    setSaving(true);

    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_BASE_URL}/client/account`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Failed to delete account");

      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    } catch (err) {
      setError(err.message || "Failed to delete account");
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-brown">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-peach-light text-brown px-4 py-8 lg:px-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-instrument-serif mb-6">Profile</h1>

        {error ? <div className="mb-4 rounded bg-red-100 text-red-700 px-4 py-3">{error}</div> : null}
        {message ? <div className="mb-4 rounded bg-green-100 text-green-700 px-4 py-3">{message}</div> : null}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <form onSubmit={handleSaveProfile} className="bg-white/60 border border-brown/15 rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-instrument-serif">Account Info</h2>
            <div>
              <label className="block text-sm mb-1">First Name</label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={onProfileChange}
                className="w-full rounded border border-brown/25 px-3 py-2 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Last Name</label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={onProfileChange}
                className="w-full rounded border border-brown/25 px-3 py-2 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onProfileChange}
                className="w-full rounded border border-brown/25 px-3 py-2 bg-white"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded bg-brown text-peach-light py-2 hover:bg-[#2f1209] disabled:opacity-60"
            >
              Save Profile
            </button>
          </form>

          <form onSubmit={handleUpdatePassword} className="bg-white/60 border border-brown/15 rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-instrument-serif">Security</h2>
            <div>
              <label className="block text-sm mb-1">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={onPasswordChange}
                className="w-full rounded border border-brown/25 px-3 py-2 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={onPasswordChange}
                className="w-full rounded border border-brown/25 px-3 py-2 bg-white"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded bg-brown text-peach-light py-2 hover:bg-[#2f1209] disabled:opacity-60"
            >
              Update Password
            </button>

            <div className="pt-4 border-t border-brown/15 space-y-3">
              <LogoutButton
                className="w-full rounded border border-brown/40 py-2 hover:bg-brown/5"
                redirectTo="/login"
              />
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={saving}
                className="w-full rounded border border-red-600 text-red-700 py-2 hover:bg-red-50 disabled:opacity-60"
              >
                Delete Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClientProfil;
