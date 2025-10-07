import React from "react";
import CardSlider from "./CardSlider";

export default function CatalogSection({ title, logo, cards }) {
  return (
    <>
      <section className="catalogo">
        <div className="texto2">
          <img className={logo.includes("Champions") ? "champions" : logo.includes("LPF") ? "LPF" : "futbolSK"} src={logo} alt="Logo" />
          <p>{title}</p>
        </div>
      </section>
      <CardSlider cards={cards} />
    </>
  );
}