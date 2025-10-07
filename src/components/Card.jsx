import React, { useState } from "react";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

export default function Card({ name, price, img, backImg, link }) {
  const [hovered, setHovered] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault();
    console.log("COMPRAR clicked");

    if (!user) {
      toast.error("Debes iniciar sesión para comprar", {
        position: "bottom-right",
      });
      return;
    }

    addToCart({ name, price, img, link });

    toast.success("Producto agregado al carrito", {
      position: "bottom-right",
      autoClose: 3000,
    });
  };

  const handleViewClick = () => {
    navigate(link);
  };

  return (
    <div
      className="card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="image-content">
        <a href={link}>
          <div className="card-image">
            <img
              className="card-img"
              src={hovered ? backImg : img}
              alt={name}
            />
          </div>
        </a>
      </div>

      <div className="card-divider"></div>

      <div className="card-content">
        <h2 className="card-title">{name}</h2>
        <h1 className="card-price">{price.toLocaleString("es-AR")}</h1>
        <p className="card-payment-info">Efectivo SOLO con retiro PERSONAL</p>
        <p className="card-full-price">3 cuotas sin interés</p>
      </div>

      <div className="card-buttons">
        <button className="btn-buy" onClick={handleAddToCart}>
          COMPRAR
        </button>
        <button className="btn-view" onClick={handleViewClick}>
          👁 VER
        </button>
      </div>
    </div>
  );
}
