import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import PublicRoutes from './router/PublicRoutes';
import AuthProvider from './contexts/AuthProvider';
import AdminRoutes from './router/AdminRoutes';
import ClientRoutes from './router/ClientRoutes';
import { CartProvider } from './contexts/CartProvider';

function App() {
 
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/*" element={<PublicRoutes />} />
            <Route path="/admin/*" element={<AdminRoutes />} />
            <Route path="/client/*" element={<ClientRoutes />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
    

  );
}

export default App;