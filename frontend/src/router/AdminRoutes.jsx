import { Navigate, Route, Routes } from "react-router-dom";

import Coffees from "../pages/admin/products/Coffees";
import Machines from "../pages/admin/products/Machines";
import Users from "../pages/admin/users";
import AdminProfile from "../pages/admin/AdminProfile";

import AdminLayout from "../components/layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoutes";
 import AdminDashboard from "../pages/admin/AdminDashboard"; 

export default function AdminRoutes() {
  return (
    <Routes>
      <Route
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="coffees" element={<Coffees />} />
        <Route path="machines" element={<Machines />} />
        <Route path="users" element={<Users />} />
        <Route path="orders" element={<AdminPlaceholder title="Orders" />} />
        <Route
          path="subscription"
          element={<AdminPlaceholder title="Subscription" />}
        />
        <Route path="me" element={<AdminProfile />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

function AdminPlaceholder({ title }) {
  return (
    <div className="rounded-xl border border-dashed border-[#EADFD7] p-8 text-center">
      <h2 className="text-2xl font-instrument-serif mb-2">{title}</h2>
      <p className="text-sm text-[#3B170D]/70">This section is coming soon.</p>
    </div>
  );
}
