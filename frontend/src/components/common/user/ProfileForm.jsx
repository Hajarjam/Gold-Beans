import { useEffect, useState } from "react";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
};

const isValidEmail = (value) => /\S+@\S+\.\S+/.test(String(value || "").trim());

const ProfileForm = ({ profile, onSave, saving }) => {
  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!profile) return;

    setForm({
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      email: profile.email || "",
      phone: profile.phone || "",
    });
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errors = {};

    if (!form.firstName.trim()) errors.firstName = "First name is required.";
    if (!form.lastName.trim()) errors.lastName = "Last name is required.";
    if (!form.email.trim()) {
      errors.email = "Email is required.";
    } else if (!isValidEmail(form.email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (form.phone && !/^[+0-9\s()-]{6,20}$/.test(form.phone.trim())) {
      errors.phone = "Please enter a valid phone number.";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    await onSave({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-peach/40 text-brown rounded-lg shadow-md p-6 space-y-4"
      noValidate
    >
      <h2 className="md:text-xl font-semibold font-instrument-sans mb-2">
        Personal Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First Name"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          error={fieldErrors.firstName}
        />
        <Input
          label="Last Name"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          error={fieldErrors.lastName}
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          error={fieldErrors.email}
        />
        <Input
          label="Phone Number"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          error={fieldErrors.phone}
        />
      </div>

      <div className="mt-5">
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded bg-brown text-white py-2 hover:bg-white hover:text-brown disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-peach-light transition-colors"
        >
          {saving ? "Saving..." : "Save Changes"}
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

export default ProfileForm;
