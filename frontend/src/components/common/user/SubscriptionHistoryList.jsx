import Pagination from "../Pagination";
import {
  formatDate,
  formatPrice,
  getSubscriptionPlanName,
  normalizeStatus,
} from "./subscriptionUtils";

export default function SubscriptionHistoryList({
  subscriptions = [],
  loading = false,
  error = "",
  currentPage = 1,
  onPageChange = () => {},
  itemsPerPage = 3,
  onCancelRequest = () => {},
  cancelLoadingId = "",
  emptyMessage = "No subscription history yet.",
  variant = "dark",
}) {
  const isLight = variant === "light";
  const mutedTextClass = isLight ? "text-[#3B170D]/70" : "text-peach-light/80";
  const errorTextClass = isLight ? "text-red-700" : "text-red-300";
  const cardClass = isLight
    ? "rounded-xl border border-[#EADFD7] bg-[#FDF9F5] p-4"
    : "rounded-lg border border-peach/30 bg-peach/10 p-3";
  const statusClass = isLight
    ? "text-xs uppercase tracking-wide text-[#3B170D]/80"
    : "text-xs uppercase tracking-wide";
  const detailsClass = isLight
    ? "mt-2 grid grid-cols-1 md:grid-cols-4 gap-2 text-sm text-[#3B170D]/85"
    : "mt-2 grid grid-cols-1 md:grid-cols-4 gap-2 text-sm text-peach-light/90";
  const cancelButtonClass = isLight
    ? "mt-3 px-3 py-1.5 rounded-lg bg-[#3B170D] text-[#FFF3EB] hover:bg-[#BB9582] hover:text-[#3B170D] transition text-sm disabled:opacity-60 disabled:cursor-not-allowed"
    : "mt-3 px-3 py-1.5 rounded-lg bg-peach text-brown hover:bg-[#BB9582] hover:text-[#3B170D] transition text-sm disabled:opacity-60 disabled:cursor-not-allowed";

  if (loading) {
    return <p className={`text-sm ${mutedTextClass}`}>Loading subscription history...</p>;
  }

  if (error) {
    return <p className={`text-sm ${errorTextClass}`}>{error}</p>;
  }

  if (!Array.isArray(subscriptions) || subscriptions.length === 0) {
    return <p className={`text-sm ${mutedTextClass}`}>{emptyMessage}</p>;
  }

  const totalPages = Math.ceil(subscriptions.length / itemsPerPage) || 1;
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);
  const start = (safePage - 1) * itemsPerPage;
  const pageItems = subscriptions.slice(start, start + itemsPerPage);

  return (
    <div>
      <div className="space-y-2">
        {pageItems.map((sub) => {
          const status = normalizeStatus(sub);
          const isCancelling = cancelLoadingId === String(sub?._id);

          return (
            <article key={sub._id} className={cardClass}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium text-sm">{getSubscriptionPlanName(sub)}</p>
                <span className={statusClass}>{status}</span>
              </div>
              <div className={detailsClass}>
                <p>Start: {formatDate(sub?.startDate || sub?.createdAt)}</p>
                <p>End: {status === "active" ? "Active" : formatDate(sub?.endDate)}</p>
                <p>Status: {status}</p>
                <p>Price Paid: ${formatPrice(sub?.price)}</p>
              </div>
              {status === "active" ? (
                <button
                  type="button"
                  disabled={Boolean(cancelLoadingId)}
                  onClick={() => onCancelRequest(sub)}
                  className={cancelButtonClass}
                >
                  {isCancelling ? "Cancelling..." : "Cancel"}
                </button>
              ) : null}
            </article>
          );
        })}
      </div>

      <Pagination
        currentPage={safePage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
