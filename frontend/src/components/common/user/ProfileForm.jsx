import { useState, useEffect } from "react";

const ProfileForm = ({ profile, onSave, saving }) => {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "" });

  useEffect(() => {
    if (profile) {
      setForm({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
      });
    }
  }, [profile]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-peach/60 border border-brown/15 rounded-xl p-6 space-y-4"
    >
      <h2 className="text-xl font-instrument-serif">Account Info</h2>

      <Input
        label="First Name"
        name="firstName"
        value={form.firstName}
        onChange={handleChange}
      />
      <Input
        label="Last Name"
        name="lastName"
        value={form.lastName}
        onChange={handleChange}
      />
      <Input
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
      />

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded bg-brown text-peach py-2 hover:bg-brown/40 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-peach-light"
      >
        Save Profile
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

export default ProfileForm;
