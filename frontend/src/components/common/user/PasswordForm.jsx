import { useState } from "react";

const PasswordForm = ({ onUpdatePassword, saving }) => {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onUpdatePassword(form);
    setForm({ currentPassword: "", newPassword: "" });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-peach/60 border border-brown/15 rounded-xl p-6 space-y-4"
    >
      <h2 className="text-xl font-instrument-serif">Change Password</h2>

      <Input
        label="Current Password"
        name="currentPassword"
        type="password"
        value={form.currentPassword}
        onChange={handleChange}
      />

      <Input
        label="New Password"
        name="newPassword"
        type="password"
        value={form.newPassword}
        onChange={handleChange}
      />

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded bg-brown text-peach py-2 hover:bg-brown/40 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-peach-light"
      >
        Update Password
      </button>
    </form>
  );
};

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm mb-1">{label}</label>
    <input
      {...props}
      className="w-full rounded border border-brown px-3 py-2 bg-brown/60 text-peach placeholder:text-peach/70 focus:ring-2 focus:ring-peach-light focus:outline-none"
    />
  </div>
);

export default PasswordForm;
