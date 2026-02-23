import SubCard from "../../common/user/SubCard";

const SubscriptionSection = ({ title, countLabel, subscriptions }) => {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-2xl font-instrument-serif">{title}</h2>
        <span className="text-sm text-peach">
          {subscriptions.length} {countLabel}
        </span>
      </div>

      <div className="space-y-3">
        {subscriptions.length === 0 ? (
          <div className="rounded-xl border border-brown/15 bg-brown p-4 text-peach">
            No {countLabel} subscriptions.
          </div>
        ) : (
          subscriptions.map((sub) => <SubCard key={sub._id} sub={sub} />)
        )}
      </div>
    </section>
  );
};

export default SubscriptionSection;
