import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import publicApi from "../../../api/publicApi";

export default function ActivateAccountPage() {
  const { token } = useParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function activate() {
      try {
        await publicApi.activateAccount(token);
        if (!isMounted) return;
        setStatus("success");
        setMessage("Your account is now active. You can log in.");
      } catch (err) {
        if (!isMounted) return;
        setStatus("error");
        setMessage(err?.message || "Activation link is invalid or expired.");
      }
    }

    activate();
    return () => {
      isMounted = false;
    };
  }, [token]);

  return (
    <div className="min-h-screen bg-peach-light flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-6">
        <h1 className="font-instrument-serif text-3xl text-brown mb-3">
          Account Activation
        </h1>
        {status === "loading" && (
          <p className="text-sm text-gray-600">Activating your account...</p>
        )}
        {status === "success" && (
          <p className="text-sm text-green-700">{message}</p>
        )}
        {status === "error" && <p className="text-sm text-red-600">{message}</p>}

        <div className="mt-6 text-sm">
          <Link to="/login" className="text-brown hover:underline">
            Go to login
          </Link>
        </div>
      </div>
    </div>
  );
}
