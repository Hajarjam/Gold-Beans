import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/public/HomePage";
import CoffeesPage from "../pages/public/CoffeesPage";
//import ProductDetailsPage from "../pages/public/ProductDetailsPage";
//import NotFoundPage from "../pages/public/NotFoundPage";
import LoginPage from "../pages/public/auth/LoginPage";
import RegisterPage from "../pages/public/auth/RegisterPage";
//import ForgotPasswordPage from "../pages/public/auth/ForgotPasswordPage";
//import ResetPasswordPage from "../pages/public/auth/ResetPasswordPage";
//import ActivateAccountPage from "../pages/public/auth/ActivateAccountPage";

import ProductCart from "../pages/public/ProductCart";
import OrderConfirmed from "../pages/public/OrderConfirmed";


export default function PublicRoutes() {
    return (
        <Routes>
            <Route index element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/coffees" element={<CoffeesPage />} />
            <Route path="/cart" element={<ProductCart />} />
            <Route path="Confirmed" element={<OrderConfirmed />} />
            <Route path="/login" element={<LoginPage />} />
         
            

        </Routes>
    );
}
