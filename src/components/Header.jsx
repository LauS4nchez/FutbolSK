import React from "react";

export default function Header() {
  return (
    <header>
      <img src="assets/Logo.png" alt="Logo" />
      <div className="contacto">
        <p>Iniciar Sesion</p>
        <p>Contacto</p>
        <p className="compra">Carrito de Compras</p>
      </div>
    </header>
  );
}
