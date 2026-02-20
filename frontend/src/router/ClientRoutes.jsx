import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";

import SubHistoryPage from "../pages/client/SubHistoryPage";
import ProfilePage from "../pages/client/ProfilePage";
import CoffeesPage from "../pages/public/CoffeesPage";
import ClientDashboard from "../pages/client/clientDashboardPage";

const ClientRoutes = () => {
  const { user, role } = useAuth();

  // redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (role && !["client", "user"].includes(role)) {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<ClientDashboard />} />
      <Route path="/dashboard" element={<Navigate to="/client" replace />} />
      <Route path="/subscriptions" element={<SubHistoryPage />} />
      <Route path="/coffees" element={<CoffeesPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
};

export default ClientRoutes;
