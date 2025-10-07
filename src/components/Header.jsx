import React from "react";
import { useCart } from "../components/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { openCart, getCartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const cartCount = getCartCount();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header>
      <img src="/assets/Logo.png" alt="Logo" />

      <div className="contacto">
        {user ? (
          <>
            {user.role === "admin" && (
              <Link to="/stock" className="login-texto-header">
                Inventario{" "}
                <span className="icono admin">
                  {/* 🗄️ Icono de archivo */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4 4h16a2 2 0 0 1 2 2v13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a2 2 0 0 1 2-2Zm0 3v11h16V7H4Zm2 3h12v2H6v-2Z" />
                  </svg>
                </span>
              </Link>
            )}
            <button onClick={handleLogout} className="close-texto-header">
              Cerrar sesión{" "}
              <span className="icono logout">
                {/* 🚪 Icono de puerta */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14 2v2H5v16h9v2H3V2h11Zm2 10h5l-3.5-3.5 1.42-1.42L24.84 12l-5.92 5.92-1.42-1.42L21 14h-5v-2Z" />
                </svg>
              </span>
            </button>
          </>
        ) : (
          <Link to="/login" className="login-texto-header">
            Iniciar Sesión{" "}
            <span className="icono login">
              {/* 👤 Icono de usuario */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2a5 5 0 0 1 5 5a5 5 0 1 1-10 0a5 5 0 0 1 5-5Zm0 8a3 3 0 1 0 0-6a3 3 0 0 0 0 6Zm0 3c4.418 0 8 2.239 8 5v2H4v-2c0-2.761 3.582-5 8-5Z" />
              </svg>
            </span>
          </Link>
        )}

        <p className="compra" onClick={openCart}>
          Carrito {cartCount > 0 && `(${cartCount})`}{" "}
          <span className="icono carrito">
            {/* 🛒 Icono de carrito */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M7 18a2 2 0 1 0 0 4a2 2 0 0 0 0-4Zm10 0a2 2 0 1 0 0 4a2 2 0 0 0 0-4ZM6.2 4l.4 2h13.6l-1.4 7H8.1l-.3-1.5H4V9h3.1L6.2 4ZM8 12h9l1-5H7.6l.4 2h8.5l-.2 1H8.3l-.3-1.5H6l.5 2.5Z" />
            </svg>
          </span>
        </p>
      </div>
    </header>
  );
}
