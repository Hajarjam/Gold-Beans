import { useMemo, useState } from "react";
import SubscriptionCancelModal from "../../common/user/SubscriptionCancelModal";
import SubscriptionHistoryList from "../../common/user/SubscriptionHistoryList";
import useSubscriptionHistory from "../../common/user/useSubscriptionHistory";
import { normalizeStatus } from "../../common/user/subscriptionUtils";

const SubscriptionHistory = () => {
  const {
    subscriptions,
    loading,
    error,
    actionError,
    cancelLoadingId,
    cancelSubscription,
  } = useSubscriptionHistory();
  const [currentPage, setCurrentPage] = useState(1);
  const [cancelTarget, setCancelTarget] = useState(null);

  const stats = useMemo(() => {
    const activeCount = subscriptions.filter(
      (sub) => normalizeStatus(sub) === "active"
    ).length;
    const cancelledCount = subscriptions.filter(
      (sub) => normalizeStatus(sub) === "cancelled"
    ).length;

    return {
      total: subscriptions.length,
      active: activeCount,
      cancelled: cancelledCount,
    };
  }, [subscriptions]);

  const closeCancelModal = () => {
    if (Boolean(cancelLoadingId)) return;
    setCancelTarget(null);
  };

  const handleCancelSubscription = async () => {
    if (!cancelTarget?._id) return;
    const result = await cancelSubscription(cancelTarget._id);
    if (result.ok) {
      setCancelTarget(null);
      setCurrentPage(1);
    }
  };

  return (
    <div className="text-gray-800">
      <h1 className="text-2xl font-semibold mb-8">Subscription History</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow-sm rounded-lg p-5 border border-[#EADFD7]">
          <p className="text-sm font-medium text-gray-500 mb-3">Total Subscriptions</p>
          <p className="text-2xl font-semibold text-[#3B170D]">{stats.total}</p>
        </div>
        <div className="bg-white shadow-sm rounded-lg p-5 border border-[#EADFD7]">
          <p className="text-sm font-medium text-gray-500 mb-3">Active</p>
          <p className="text-2xl font-semibold text-[#3B170D]">{stats.active}</p>
        </div>
        <div className="bg-white shadow-sm rounded-lg p-5 border border-[#EADFD7]">
          <p className="text-sm font-medium text-gray-500 mb-3">Cancelled</p>
          <p className="text-2xl font-semibold text-[#3B170D]">{stats.cancelled}</p>
        </div>
      </div>

      {actionError && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-100 text-red-700 px-4 py-3">
          {actionError}
        </div>
      )}

      <div className="rounded-lg bg-white border border-[#EADFD7] shadow-sm p-6">
        <SubscriptionHistoryList
          subscriptions={subscriptions}
          loading={loading}
          error={error}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          itemsPerPage={5}
          onCancelRequest={setCancelTarget}
          cancelLoadingId={cancelLoadingId}
          emptyMessage="No subscription history yet."
          variant="light"
        />
      </div>

      <SubscriptionCancelModal
        isOpen={Boolean(cancelTarget)}
        onClose={closeCancelModal}
        onConfirm={handleCancelSubscription}
        loading={Boolean(cancelLoadingId)}
      />
    </div>
  );
};

export default SubscriptionHistory;
