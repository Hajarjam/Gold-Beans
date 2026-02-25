import { createPortal } from "react-dom";

export default function SubscriptionCancelModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}) {
  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl bg-[#FFF3EB] text-[#3B170D] p-6 shadow-xl">
        <h3 className="text-lg font-semibold">Cancel Subscription</h3>
        <p className="mt-2 text-sm text-[#3B170D]/80">
          Are you sure you want to cancel this subscription?
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-[#3B170D]/30 hover:bg-[#3B170D]/5 transition"
          >
            Dismiss
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-[#3B170D] text-[#FFF3EB] hover:bg-[#BB9582] hover:text-[#3B170D] transition"
          >
            {loading ? "Cancelling..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
