import { Routes, Route } from "react-router-dom";
import ClientLayout from "../components/layouts/ClientLayout";
import ProtectedRoute from "./ProtectedRoutes";


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
      ></Route>
            <Route
        path="/dashboard"
        element={
          <ProtectedRoute requiredRole="client">
            
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
