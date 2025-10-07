import React, { useState } from "react";

export default function Card({ name, price, img, backImg, link }) {
  const [hovered, setHovered] = useState(false);

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
        <h1 className="card-price">{price}</h1>
        <p className="card-payment-info">Efectivo SOLO con retiro PERSONAL</p>
        <p className="card-full-price">3 cuotas sin interes</p>
      </div>

      <div className="card-buttons">
        <button className="btn-buy">COMPRAR</button>
        <button className="btn-view">👁 VER</button>
      </div>
    </div>
  );
}
