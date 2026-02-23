import { useSubscriptions } from "../../common/user/useSubscriptions";
import SubscriptionSection from "../../common/user/SubscriptionSection";

const SubscriptionHistory = () => {
  const { active, inactive, loading, error } = useSubscriptions();

  if (loading)
    return <div className="p-8 text-brown">Loading subscriptions...</div>;

  return (
    <div className="min-h-screen bg-peach-light text-brown px-4 py-8 lg:px-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-instrument-serif mb-2">
          Subscription History
        </h1>

        {error && (
          <div className="mb-4 rounded bg-red-100 text-red-700 px-4 py-3">
            {error}
          </div>
        )}

        <SubscriptionSection
          title="Active Subscriptions"
          countLabel="active"
          subscriptions={active}
        />

        <SubscriptionSection
          title="Inactive Subscriptions"
          countLabel="inactive"
          subscriptions={inactive}
        />
      </div>
    </div>
  );
};

export default SubscriptionHistory;
