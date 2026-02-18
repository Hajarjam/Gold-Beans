import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";


export default function ProtectedRoute({ children, requiredRole = null }) {
  const { isAuthenticated, role, loading } = useContext(AuthContext)


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Vérification de l'authentification...</div>
      </div>
    );
  }


  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }


  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />;
  }


  return children;
}
