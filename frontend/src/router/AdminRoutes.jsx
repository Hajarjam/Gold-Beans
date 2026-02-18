import { Routes, Route } from "react-router-dom";


//import AdminDashboard from "../pages/admin/dashboard/AdminDashboard";
import Coffees from "../pages/admin/products/Coffees";
import Machines from "../pages/admin/products/Machines";
import Users from "../pages/admin/users";
import AdminProfile from "../pages/admin/AdminProfile"
//import ProductAdd from "../pages/admin/products/ProductAdd";
//import ProductEdit from "../pages/admin/products/ProductEdit";
//import UserList from "../pages/admin/users/UserList";
//import UserAdd from "../pages/admin/users/UserAdd";
//import UserEdit from "../pages/admin/users/UserEdit";
import AdminLayout from "../components/layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoutes";

//import CategoryList from "../pages/admin/categories/CategoryList";
//import CategoryAdd from "../pages/admin/categories/CategoryAdd";
//import CategoryEdit from "../pages/admin/categories/CategoryEdit";



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
                <Route path="coffees" element={<Coffees />} />
                <Route path="machines" element={<Machines />} />
                <Route path="users" element={<Users />} />
                <Route path="me" element={<AdminProfile />} />
                
            </Route> 
        </Routes>
    );
}


