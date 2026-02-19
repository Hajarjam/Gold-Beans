import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import PublicRoutes from "./router/PublicRoutes";
import AuthProvider from "./contexts/AuthProvider";
import ClientRoutes from "./router/ClientRoutes";
import { CartProvider } from "./contexts/CartProvider";
import BreadcrumbProvider from "./contexts/BreadcrumbContext";
import AdminRoutes from "./router/AdminRoutes";
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
              <Route path="/admin/*" element={<AdminRoutes />} />
              
            </Routes>
          </BreadcrumbProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
