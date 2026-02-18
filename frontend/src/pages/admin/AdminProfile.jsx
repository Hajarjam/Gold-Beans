import { useMemo, useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaCamera } from "react-icons/fa";


const API_URL = process.env.REACT_APP_API_URLL;

export default function AdminProfile() {



  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState("/assets/default-profile.jpg");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "admin",
    isActive: false,
  });

  const token = localStorage.getItem("authToken"); 
  console.log("TOKEN =", token);


  // charger l'admin connecté
  useEffect(() => {
    async function loadMe() {
      try {
        setLoading(true);
        const r = await fetch(`${API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(data.message || "Erreur /me");

        setForm((f) => ({
          ...f,
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          role: data.role || "",
          isActive: Boolean(data.isActive),
          password: "",
        }));
      } catch (e) {
        console.error(e);
        alert(e.message);
      } finally {
        setLoading(false);
      }
    }
    if (token) loadMe();
  }, [token]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  //save profil connecté
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        isActive: Boolean(form.isActive),
        ...(form.password ? { password: form.password } : {}),
      };

      const r = await fetch(`${API_URL}/api/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await r.json().catch(() => ({}));
      if (!r.ok) return alert(data.message || "Update failed");

      // refresh form sans password
      setForm((f) => ({ ...f, password: "" }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
      alert("Erreur update");
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Supprimer ton compte ?")) return;
    const r = await fetch(`${API_URL}/api/users/me`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) return alert(data.message || "Delete failed");

    localStorage.removeItem("authToken");
    window.location.href = "/login";
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setProfileImage(reader.result);
    reader.readAsDataURL(file);
  };

  const initials = useMemo(() => {
    const a = (form.firstName || "").trim().slice(0, 1).toUpperCase();
    const b = (form.lastName || "").trim().slice(0, 1).toUpperCase();
    return (a + b) || "A";
  }, [form.firstName, form.lastName]);

  if (loading) return <div className="px-8 py-8 text-[#3B170D]">Loading profile...</div>;
  

  return (
    <div className="min-h-[calc(100vh-120px)] px-4 sm:px-8 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3B170D]">
            Profile Settings
          </h1>
          <p className="text-sm text-[#3B170D]/70">
            Update your personal information and account settings.
          </p>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: form */}
          <form
            onSubmit={handleSave}
            className="lg:col-span-2 rounded-2xl border border-[#EADFD7] bg-[#F6EEE7]/60 shadow-sm p-5 sm:p-7"
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-[#3B170D]">
                  Account details
                </h2>
                <p className="text-sm text-[#3B170D]/60">
                  Make sure your information is up to date.
                </p>
              </div>

              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${form.role === "admin"
                  ? "bg-purple-100 text-purple-800"
                  : "bg-blue-100 text-blue-800"
                  }`}
              >
                {form.role}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label className="block text-sm font-bold text-[#3B170D] mb-2">
                  First Name
                </label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={onChange}
                  placeholder="Your first name"
                  className="w-full rounded-xl border border-[#E6D8CF] bg-white/60 px-4 py-3 text-sm outline-none
                             focus:ring-2 focus:ring-[#3B170D]/20 focus:border-[#3B170D]/40"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-bold text-[#3B170D] mb-2">
                  Last Name
                </label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={onChange}
                  placeholder="Your last name"
                  className="w-full rounded-xl border border-[#E6D8CF] bg-white/60 px-4 py-3 text-sm outline-none
                             focus:ring-2 focus:ring-[#3B170D]/20 focus:border-[#3B170D]/40"
                />
              </div>

              {/* Email */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-[#3B170D] mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-[#E6D8CF] bg-white/60 px-4 py-3 text-sm outline-none
                             focus:ring-2 focus:ring-[#3B170D]/20 focus:border-[#3B170D]/40"
                />
              </div>

              {/* Password */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-[#3B170D] mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={onChange}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-[#E6D8CF] bg-white/60 px-4 py-3 pr-12 text-sm outline-none
                               focus:ring-2 focus:ring-[#3B170D]/20 focus:border-[#3B170D]/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#3B170D]/60 hover:bg-[#3B170D]/10 hover:text-[#3B170D]"
                    title={showPassword ? "Hide" : "Show"}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>


            </div>

            {/* footer buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
             

              <button
                type="submit"
                className={`w-full sm:w-auto rounded-xl px-6 py-3 text-sm font-extrabold text-white transition
                  ${saved ? "bg-green-700" : "bg-[#3B170D] hover:opacity-90"}`}
              >
                {saved ? "Saved!" : "Save changes"}
              </button>
            </div>
          </form>

          {/* RIGHT: card */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Profile card */}
            <div className="rounded-2xl border border-[#EADFD7] bg-white shadow-sm p-5 sm:p-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="h-20 w-20 rounded-2xl overflow-hidden border-4 border-[#3B170D] bg-[#F6EEE7]">
                    {/* image */}
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* camera */}
                  <label
                    htmlFor="profile-upload"
                    className="absolute -bottom-2 -right-2 rounded-xl bg-[#3B170D] text-[#F6EEE7] p-2 cursor-pointer hover:opacity-90"
                    title="Change photo"
                  >
                    <FaCamera className="w-4 h-4" />
                  </label>
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                <div className="min-w-0">
                  <div className="text-lg font-extrabold text-[#3B170D] truncate">
                    {form.firstName || form.lastName
                      ? `${form.firstName} ${form.lastName}`.trim()
                      : "Admin User"}
                  </div>
                  <div className="text-sm text-[#3B170D]/60 truncate">
                    {form.email || "email@example.com"}
                  </div>

                  <div className="mt-2 inline-flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#F6EEE7] border border-[#EADFD7] font-extrabold text-[#3B170D]">
                      {initials}
                    </span>

                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${form.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}
                    >
                      {form.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 border-t border-[#EADFD7] pt-4 text-sm text-[#3B170D]/70">
                Tip: use a strong password and keep your email correct.
              </div>
            </div>

            {/* Danger zone */}
            <div className="rounded-2xl border border-[#EADFD7] bg-white shadow-sm p-5 sm:p-6">
              <h3 className="text-sm font-extrabold text-[#3B170D]">
                Danger zone
              </h3>
              <p className="mt-1 text-sm text-[#3B170D]/60">
                This action can’t be undone.
              </p>

              <button
                type="button"
                onClick={handleDeleteAccount}
                className="mt-4 w-full rounded-xl border-2 border-[#3B170D] px-5 py-3 text-sm font-extrabold text-[#3B170D]
                           hover:bg-[#3B170D] hover:text-[#F6EEE7] transition"
              >
                Delete account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
