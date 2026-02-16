import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes";
import ClientLayout from "../components/layouts/ClientLayout";

import DashboardPage from "../pages/client/DashboardPage";
import SubscriptionsPage from "../pages/client/SubscriptionsPage";
import SubscriptionHistory from "../pages/client/SubscriptionHistory";
import SubscriptionDetails from "../pages/client/SubscriptionDetails";
import ProfilePage from "../pages/client/ProfilePage";

export default function ClientRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute requiredRole="client">
            <ClientLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="subscriptions" element={<SubscriptionsPage />} />
        <Route path="subscriptions/:id" element={<SubscriptionDetails />} />
        <Route path="history" element={<SubscriptionHistory />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}
