// src/pages/AgregarProducto.jsx
import { useState, useEffect } from "react";
import { supabase } from "../lib/supaBaseClient";
import { useNavigate } from "react-router-dom";

export default function AgregarProducto() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [slug, setSlug] = useState("");
  const [stock, setStock] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState("");
  const [imagenFrente, setImagenFrente] = useState(null);
  const [imagenDorso, setImagenDorso] = useState(null);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const categorias = ["Selecciones", "Liga Argentina", "Europa"];

  // Traer productos existentes
  useEffect(() => {
    const fetchProductos = async () => {
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .order("id", { ascending: false });

      if (error) console.error(error);
      else setProductos(data);
    };
    fetchProductos();
  }, []);

  const getStockColor = (cantidad) => {
    if (cantidad >= 20) return "#4CAF50";
    if (cantidad >= 10) return "#FFA500";
    return "#FF5252";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMensaje("");

    try {
      const slugGenerado = nombre
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
      setSlug(slugGenerado);

      // Subir imagen de frente
      let urlFrente = null;
      if (imagenFrente) {
        const { data, error } = await supabase.storage
          .from("productos")
          .upload(`frente-${Date.now()}-${imagenFrente.name}`, imagenFrente);

        if (error) throw error;
        const { data: urlData } = supabase.storage
          .from("productos")
          .getPublicUrl(data.path);
        urlFrente = urlData.publicUrl;
      }

      // Subir imagen de dorso
      let urlDorso = null;
      if (imagenDorso) {
        const { data, error } = await supabase.storage
          .from("productos")
          .upload(`dorso-${Date.now()}-${imagenDorso.name}`, imagenDorso);

        if (error) throw error;
        const { data: urlData } = supabase.storage
          .from("productos")
          .getPublicUrl(data.path);
        urlDorso = urlData.publicUrl;
      }

      // Insertar producto
      const { data, error: insertError } = await supabase.from("productos").insert([
        {
          nombre,
          slug: slugGenerado,
          stock: parseInt(stock),
          precio: parseFloat(precio),
          categoria,
          imagen_frente: urlFrente,
          imagen_dorso: urlDorso,
        },
      ]).select();

      if (insertError) throw insertError;

      setProductos((prev) => [data[0], ...prev]);
      setMensaje("✅ Producto agregado correctamente");
      resetForm();
    } catch (err) {
      console.error(err);
      setError("❌ Error al agregar el producto");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNombre("");
    setPrecio("");
    setStock("");
    setCategoria("");
    setImagenFrente(null);
    setImagenDorso(null);
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;
    try {
      const { error } = await supabase.from("productos").delete().eq("id", id);
      if (error) throw error;
      setProductos((prev) => prev.filter((p) => p.id !== id));
      setMensaje("✅ Producto eliminado correctamente");
    } catch (err) {
      console.error(err);
      setError("❌ Error al eliminar el producto");
    }
  };

  // === ESTILOS (mismos que el código original) ===
  const styles = {
    container: { maxWidth: "700px", margin: "40px auto", fontFamily: "Arial, sans-serif" },
    form: { display: "grid", gap: "10px", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" },
    input: { padding: "8px", borderRadius: "4px", border: "1px solid #ccc" },
    button: { padding: "8px 12px", borderRadius: "4px", border: "none", backgroundColor: "#1E88E5", color: "white", cursor: "pointer" },
    camisetaCard: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px", margin: "10px 0", border: "1px solid #ddd", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" },
    img: { width: "60px", height: "60px", objectFit: "contain", marginRight: "10px" },
    stock: { padding: "5px 10px", borderRadius: "5px", color: "white", fontWeight: "bold" },
  };

  return (
    <div style={styles.container}>
      <h2>Agregar producto</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          style={styles.input}
          type="text"
          placeholder="Nombre del producto"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          style={styles.input}
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />

        <input
          style={styles.input}
          type="number"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />

        <select
          style={styles.input}
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >
          <option value="">Seleccionar categoría</option>
          {categorias.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <label>Imagen frente:</label>
        <input
          style={styles.input}
          type="file"
          accept="image/*"
          onChange={(e) => setImagenFrente(e.target.files[0])}
        />

        <label>Imagen dorso:</label>
        <input
          style={styles.input}
          type="file"
          accept="image/*"
          onChange={(e) => setImagenDorso(e.target.files[0])}
        />

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Agregando..." : "Guardar producto"}
        </button>
      </form>

      <h2 style={{ marginTop: "40px" }}>Stock actual</h2>
      {productos.length === 0 && <p>No hay productos cargados</p>}
      {productos.map((p) => (
        <div key={p.id} style={styles.camisetaCard}>
          <img src={p.imagen_frente} alt={p.nombre} style={styles.img} />
          <span>{p.nombre}</span>
          <span>${p.precio}</span>
          <span>Stock: {p.stock}</span>
          <span style={{ ...styles.stock, backgroundColor: getStockColor(Number(p.stock)) }}>
            {p.stock >= 20 ? "Alto" : p.stock >= 10 ? "Medio" : "Bajo"}
          </span>
          <button
            style={{ ...styles.button, backgroundColor: "#F44336" }}
            onClick={() => handleEliminar(p.id)}
          >
            Eliminar
          </button>
        </div>
      ))}
    </div>
  );
}
