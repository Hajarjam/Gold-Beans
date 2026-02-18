import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/public/HomePage";
import CoffeesPage from "../pages/public/CoffeesPage";
import CoffeeDetailPage from "../pages/public/CoffeeDetailPage";
import MachinePage from "../pages/public/MachinePage";
import MachineDetailPage from "../pages/public/MachineDetailPage";

import LoginPage from "../pages/public/auth/LoginPage";
import RegisterPage from "../pages/public/auth/RegisterPage";

import ProductCart from "../pages/public/ProductCart";
import OrderConfirmed from "../pages/public/OrderConfirmed";

export default function PublicRoutes() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/coffees" element={<CoffeesPage />} />
      <Route path="/coffees/:id" element={<CoffeeDetailPage />} />
      <Route path="/machines" element={<MachinePage />} />
      <Route path="/machine/:id" element={<MachineDetailPage />} />
      <Route path="/cart" element={<ProductCart />} />
      <Route path="Confirmed" element={<OrderConfirmed />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}
