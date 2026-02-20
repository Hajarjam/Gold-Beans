import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes";
import HomePage from "../pages/public/HomePage";
import ProductCart from "../pages/public/ProductCart";
import PayementPage from "../pages/public/PayementPage";
import OrderConfirmed from "../pages/public/OrderConfirmed";


export default function ClientRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute requiredRole="client" />}>
        <Route index element={<HomePage />} />
        <Route path="home" element={<HomePage />} />
        <Route path="dashboard" element={<HomePage />} />
        <Route path="cart" element={<ProductCart />} />
        <Route path="payment" element={<PayementPage />} />
        <Route path="confirmed" element={<OrderConfirmed />} />
        <Route path="*" element={<Navigate to="/client" replace />} />
      </Route>
    </Routes>
  );
}
