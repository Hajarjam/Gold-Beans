import { createPortal } from "react-dom";

export default function AuthGateModal({
  isOpen,
  onClose,
  onLogin,
  onRegister,
}) {
  if (!isOpen || typeof document === "undefined") return null;

  const handleLogin = () => {
    onClose?.();
    onLogin?.();
  };

  const handleRegister = () => {
    onClose?.();
    onRegister?.();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-xl bg-[#FFF3EB] text-[#3B170D] p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold">Authentication Required</h3>
        <p className="mt-2 text-sm text-[#3B170D]/80">
          Please login or register to continue.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={handleRegister}
            className="px-4 py-2 rounded-lg border border-[#3B170D]/30 hover:bg-[#3B170D]/5 transition"
          >
            Register
          </button>
          <button
            onClick={handleLogin}
            className="px-4 py-2 rounded-lg bg-[#3B170D] text-[#FFF3EB] hover:bg-[#BB9582] hover:text-[#3B170D] transition"
          >
            Login
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
