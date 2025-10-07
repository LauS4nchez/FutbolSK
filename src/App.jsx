import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Inventario from "./pages/Inventario";
import Login from "./pages/Login";

import { CartProvider } from "./components/CartContext";
import Cart from "./components/Cart";
import OrderConfirmation from "./components/OrderConfirmation";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastContainer } from "react-toastify"; // ⬅️ Importaste bien
import "react-toastify/dist/ReactToastify.css"; // ⬅️ También ok

// Ruta protegida para admin
function AdminRoute({ children }) {
  const { user } = useAuth();

  if (!user || user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Cart />
          <OrderConfirmation />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route
              path="/stock"
              element={
                <AdminRoute>
                  <Inventario />
                </AdminRoute>
              }
            />
            <Route path="/login" element={<Login />} />
          </Routes>

          {/* ✅ ToastContainer debe estar dentro del Router / JSX */}
          <ToastContainer />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
