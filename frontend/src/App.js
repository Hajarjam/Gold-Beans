import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import PublicRoutes from "./router/PublicRoutes";
import AuthProvider from "./contexts/AuthProvider";
import ClientRoutes from "./router/ClientRoutes";
import { CartProvider } from "./contexts/CartProvider";
import BreadcrumbProvider from "./contexts/BreadcrumbContext";
import ProtectedRoute from "./router/ProtectedRoutes";
import AdminLayout from "./components/layouts/AdminLayout";
/* import AdminDashboard from "./pages/admin/AdminDashboard"; */
import Coffees from "./pages/admin/products/Coffees";
import Machines from "./pages/admin/products/Machines";
//import { Toaster } from 'react-hot-toast';
import "@fontsource/instrument-serif";
import "@fontsource/instrument-sans";
import "@fontsource/roboto-serif";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <BreadcrumbProvider>
            <Routes>
              <Route path="/*" element={<PublicRoutes />} />
              <Route path="/client/*" element={<ClientRoutes />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                {/* Default: /admin → /admin/dashboard */}
{/*                 <Route index element={<AdminDashboard />} /> */}
                {/* Explicit /admin/dashboard route */}
{/*                 <Route path="dashboard" element={<AdminDashboard />} /> */}
                <Route path="coffees" element={<Coffees />} />
                <Route path="machines" element={<Machines />} />
              </Route>
            </Routes>
          </BreadcrumbProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
