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
      className="bg-peach/40 text-brown rounded-lg shadow-md p-6 space-y-4"
      noValidate
    >
      <h2 className="md:text-xl font-semibold font-instrument-sans mb-2">
        Change Password
      </h2>

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
          className="w-full rounded bg-brown text-white py-2 hover:bg-white hover:text-brown disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-peach-light transition-colors"
        >
          {saving ? "Updating..." : "Update Password"}
        </button>
      </div>
    </form>
  );
};

const Input = ({ label, error, ...props }) => (
  <div>
    <label className="block text-sm mb-1">
      {label}
    </label>
    <input
      {...props}
      className={`w-full rounded border px-3 py-2 bg-white text-brown placeholder:text-brown/50 focus:ring-2 focus:ring-peach-light focus:outline-none ${
        error
          ? "border-red-300"
          : "border-brown/25"
      }`}
    />
    {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
  </div>
);

export default PasswordForm;
