import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes";
import HomePage from "../pages/public/HomePage";
import ProductCart from "../pages/public/ProductCart";


export default function ClientRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute requiredRole="client" />}>
        <Route index element={<HomePage />} />
        <Route path="home" element={<HomePage />} />
        <Route path="dashboard" element={<HomePage />} />
        <Route path="cart" element={<ProductCart />} />
        <Route path="*" element={<Navigate to="/client" replace />} />
      </Route>
    </Routes>
  );
}
