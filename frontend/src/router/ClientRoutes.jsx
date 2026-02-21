import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";

import ProtectedRoute from "./ProtectedRoutes";

import HomePage from "../pages/public/HomePage";
import ProductCart from "../pages/public/ProductCart";
import PayementPage from "../pages/public/PayementPage";
import OrderConfirmed from "../pages/public/OrderConfirmed";

import SubHistoryPage from "../pages/client/SubHistoryPage";
import ProfilePage from "../pages/client/ProfilePage";
import CoffeesPage from "../pages/public/CoffeesPage";
import ClientDashboard from "../pages/client/clientDashboardPage";



const ClientRoutes = () => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Verification de l'authentification...</div>
      </div>
    );
  }

  // redirect if not logged in
  if (!user) return <Navigate to="/login" replace />;

  // redirect if wrong role
  if (role && !["client", "user"].includes(role)) {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      {/* client protected routes */}
      <Route element={<ProtectedRoute requiredRole="client" />}>
        <Route index element={<ClientDashboard />} />
        <Route path="dashboard" element={<ClientDashboard />} />
        <Route path="home" element={<HomePage />} />
        <Route path="subscriptions" element={<SubHistoryPage />} />
        <Route path="coffees" element={<CoffeesPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="cart" element={<ProductCart />} />
        <Route path="payment" element={<PayementPage />} />
        <Route path="confirmed" element={<OrderConfirmed />} />
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/client" replace />} />
    </Routes>
  );
};

export default ClientRoutes;
