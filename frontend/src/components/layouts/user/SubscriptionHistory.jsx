import { useState } from "react";
import SubscriptionCancelModal from "../../common/user/SubscriptionCancelModal";
import SubscriptionHistoryList from "../../common/user/SubscriptionHistoryList";
import useSubscriptionHistory from "../../common/user/useSubscriptionHistory";

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
    <div className="flex flex-col w-full min-h-screen bg-peach-light text-brown pt-8">
      <div className="px-4 pb-6">
        <h1 className="md:text-xl font-semibold font-instrument-sans mb-3">
          Subscription History
        </h1>

        {actionError && (
          <div className="mb-3 rounded-lg border border-red-300 bg-red-100 text-red-700 px-4 py-3 text-sm">
            {actionError}
          </div>
        )}

        <div className="bg-peach/40 text-brown rounded-lg shadow-md p-6">
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
            variant="newProduct"
          />
        </div>

        <SubscriptionCancelModal
          isOpen={Boolean(cancelTarget)}
          onClose={closeCancelModal}
          onConfirm={handleCancelSubscription}
          loading={Boolean(cancelLoadingId)}
        />
      </div>
    </div>
  );
};

export default SubscriptionHistory;
