import React, { useState } from "react";
import { MenuUser } from "../../components/layouts/user/MenuUser";
import SubscriptionHistory from "../../components/layouts/user/SubscriptionHistory";

const SubHistoryPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-peach-light">
      <MenuUser sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="lg:ml-72">
        <SubscriptionHistory />
      </div>
    </div>
  );
};

export default SubHistoryPage;
