import { Routes, Route } from "react-router-dom";

import Coffees from "../pages/admin/products/Coffees";
import Machines from "../pages/admin/products/Machines";
import Users from "../pages/admin/users";
import AdminProfile from "../pages/admin/AdminProfile";

import AdminLayout from "../components/layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoutes";
/* import AdminDashboard from "../pages/admin/AdminDashboard"; */

export default function AdminRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* <Route path="dashboard" element={<AdminDashboard />} /> */}
        <Route path="coffees" element={<Coffees />} />
        <Route path="machines" element={<Machines />} />
        <Route path="users" element={<Users />} />
        <Route path="me" element={<AdminProfile />} />
      </Route>
    </Routes>
  );
}
