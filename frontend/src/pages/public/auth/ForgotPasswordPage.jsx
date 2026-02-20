import { useState } from "react";
import { Link } from "react-router-dom";
import publicApi from "../../../api/publicApi";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await publicApi.forgotPassword(email);
      setSuccess("If this email exists, a reset link has been sent.");
      setEmail("");
    } catch (err) {
      setError(err?.message || "Unable to send reset email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-peach-light flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-6">
        <h1 className="font-instrument-serif text-3xl text-brown mb-2">
          Forgot Password
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Enter your email address and we will send a reset link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-700">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brown text-white rounded-md py-2.5 text-sm hover:bg-dark-brown transition disabled:opacity-70"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-4 text-sm">
          <Link to="/login" className="text-brown hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
