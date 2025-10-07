// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import CatalogSection from "../components/CatalogSection";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabaseClient";

function Home() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      const { data, error } = await supabase
        .from("productos")
        .select("*");

      if (error) {
        console.error("Error al obtener productos:", error);
      } else {
        setProductos(data);
      }
    };

    fetchProductos();
  }, []);

  // Mapea los datos al formato que espera el componente Card
  const mapProductos = (items) =>
    items.map((p) => ({
      name: p.nombre,
      price: `$${Number(p.precio).toLocaleString()}`,
      img: p.imagen_frente,
      backImg: p.imagen_dorso,
      link: `/product/${p.slug}`,
    }));

  // Filtrar por categoría
  const selecciones = mapProductos(
    productos.filter((p) => p.categoria === "Selecciones")
  );
  const ligaArgentina = mapProductos(
    productos.filter((p) => p.categoria === "Liga Argentina")
  );
  const europa = mapProductos(
    productos.filter((p) => p.categoria === "Europa")
  );

  return (
    <div>
      <Header />
      <Hero />

      <CatalogSection
        title="CATÁLOGO SELECCIONES"
        logo="assets/Logo2Invertido.png"
        cards={selecciones}
      />
      <CatalogSection
        title="CATÁLOGO LIGA ARGENTINA"
        logo="assets/LogoLPF.png"
        cards={ligaArgentina}
      />
      <CatalogSection
        title="CATÁLOGO LIGAS DE EUROPA"
        logo="assets/LogoChampions.png"
        cards={europa}
      />

      <Footer />
    </div>
  );
}

export default Home;
