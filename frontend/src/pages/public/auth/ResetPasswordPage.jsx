import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import publicApi from "../../../api/publicApi";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await publicApi.resetPassword(token, password, passwordConfirmation);
      setSuccess("Your password has been reset successfully.");
      setPassword("");
      setPasswordConfirmation("");
    } catch (err) {
      setError(err?.message || "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-peach-light flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-6">
        <h1 className="font-instrument-serif text-3xl text-brown mb-2">
          Reset Password
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="New password"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
          <input
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
            placeholder="Confirm new password"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-700">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brown text-white rounded-md py-2.5 text-sm hover:bg-dark-brown transition disabled:opacity-70"
          >
            {loading ? "Updating..." : "Reset Password"}
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
