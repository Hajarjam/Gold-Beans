import { Routes, Route } from "react-router-dom";
import ClientLayout from "../components/layouts/ClientLayout";
import ProtectedRoute from "./ProtectedRoutes";
import HomePage from "../pages/public/HomePage";


export default function ClientRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute requiredRole="client">
            <HomePage />
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
