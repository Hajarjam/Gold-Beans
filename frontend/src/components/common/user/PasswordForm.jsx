import { useState } from "react";

const initialForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const PasswordForm = ({ onUpdatePassword, saving }) => {
  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errors = {};
    if (!form.currentPassword) errors.currentPassword = "Current password is required.";
    if (!form.newPassword) errors.newPassword = "New password is required.";
    if (!form.confirmPassword) errors.confirmPassword = "Please confirm your new password.";
    if (
      form.newPassword &&
      form.confirmPassword &&
      form.newPassword !== form.confirmPassword
    ) {
      errors.confirmPassword = "Passwords do not match.";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    await onUpdatePassword({
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
    });
    setForm(initialForm);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg bg-white border border-[#EADFD7] shadow-sm p-6"
      noValidate
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Current Password"
          name="currentPassword"
          type="password"
          value={form.currentPassword}
          onChange={handleChange}
          error={fieldErrors.currentPassword}
        />
        <Input
          label="New Password"
          name="newPassword"
          type="password"
          value={form.newPassword}
          onChange={handleChange}
          error={fieldErrors.newPassword}
        />
        <Input
          label="Confirm New Password"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          error={fieldErrors.confirmPassword}
        />
      </div>

      <div className="mt-5">
        <button
          type="submit"
          disabled={saving}
          className="w-full md:w-auto px-4 py-2 rounded-lg bg-[#3B170D] text-[#FFF3EB] hover:bg-[#BB9582] hover:text-[#3B170D] transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? "Updating..." : "Update Password"}
        </button>
      </div>
    </form>
  );
};

const Input = ({ label, error, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-[#3B170D]/80 mb-1.5">
      {label}
    </label>
    <input
      {...props}
      className={`w-full rounded-xl border px-3 py-2.5 text-[#3B170D] bg-[#FDF9F5] focus:outline-none focus:ring-2 focus:ring-[#3B170D]/20 ${
        error ? "border-red-300" : "border-[#EADFD7]"
      }`}
    />
    {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
  </div>
);

export default PasswordForm;
