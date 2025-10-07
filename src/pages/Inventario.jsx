import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    fetchProductos();
    window.addEventListener("resize", () => setWindowWidth(window.innerWidth));
    return () =>
      window.removeEventListener("resize", () =>
        setWindowWidth(window.innerWidth)
      );
  }, []);

  const fetchProductos = async () => {
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Error al cargar productos:", error);
    } else {
      setProductos(data);
    }
  };

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

      const { error: insertError } = await supabase
        .from("productos")
        .insert([
          {
            nombre,
            slug: slugGenerado,
            stock: parseInt(stock),
            precio: parseFloat(precio),
            categoria,
            imagen_frente: urlFrente,
            imagen_dorso: urlDorso,
          },
        ]);

      if (insertError) throw insertError;

      await fetchProductos();

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

  const handleIncreaseStock = async (id) => {
    const producto = productos.find((p) => p.id === id);
    if (!producto) return;
    const nuevoStock = producto.stock + 1;

    const { error } = await supabase
      .from("productos")
      .update({ stock: nuevoStock })
      .eq("id", id);

    if (!error) {
      setProductos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, stock: nuevoStock } : p))
      );
    }
  };

  const handleDecreaseStock = async (id) => {
    const producto = productos.find((p) => p.id === id);
    if (!producto || producto.stock <= 0) return;

    const nuevoStock = producto.stock - 1;

    const { error } = await supabase
      .from("productos")
      .update({ stock: nuevoStock })
      .eq("id", id);

    if (!error) {
      setProductos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, stock: nuevoStock } : p))
      );
    }
  };

  const styles = {
    container: {
      maxWidth: 700,
      margin: "40px auto",
      fontFamily: "Arial, sans-serif",
      padding: "0 15px",
    },
    volverBtn: {
      background: "transparent",
      border: "none",
      color: "#555",
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      fontSize: 16,
      marginBottom: 10,
    },
    form: {
      display: "grid",
      gap: 10,
      padding: 20,
      border: "1px solid #ccc",
      borderRadius: 8,
    },
    input: {
      padding: 8,
      borderRadius: 4,
      border: "1px solid #ccc",
      fontSize: 16,
      width: "100%",
      boxSizing: "border-box",
    },
    button: {
      padding: "10px 16px",
      borderRadius: 4,
      border: "none",
      backgroundColor: "#1E88E5",
      color: "white",
      cursor: "pointer",
      fontSize: 16,
    },
    buttonDisabled: {
      backgroundColor: "#90caf9",
      cursor: "not-allowed",
    },
    camisetaCard: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: windowWidth < 600 ? 20 : 10,
      margin: "10px 0",
      border: "1px solid #ddd",
      borderRadius: 8,
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      flexWrap: windowWidth < 600 ? "wrap" : "nowrap",
      gap: windowWidth < 600 ? 10 : 0,
    },
    img: {
      width: windowWidth < 600 ? 100 : 60,
      height: windowWidth < 600 ? 100 : 60,
      objectFit: "contain",
      marginRight: 10,
    },
    stockControl: {
      display: "flex",
      alignItems: "center",
      gap: 16,
    },
    stockNumber: {
      fontSize: 18,
      fontWeight: "bold",
    },
    stockButton: {
      padding: "6px 16px",
      borderRadius: 4,
      border: "none",
      backgroundColor: "#1E88E5",
      color: "white",
      cursor: "pointer",
      fontSize: 18,
    },
    eliminarButton: {
      padding: "8px 12px",
      borderRadius: 4,
      border: "none",
      backgroundColor: "#F44336",
      color: "white",
      cursor: "pointer",
      fontSize: 16,
    },
    stockLabel: {
      padding: "5px 10px",
      borderRadius: 5,
      color: "white",
      fontWeight: "bold",
    },
  };

  return (
    <div style={styles.container}>
      {/* 🔙 Botón para volver al inicio */}
      <button style={styles.volverBtn} onClick={() => navigate("/")}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          viewBox="0 0 24 24"
          style={{ marginRight: "6px" }}
        >
          <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
        Volver al inicio
      </button>

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
          required
        />
        <input
          style={styles.input}
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
          min="0"
        />
        <input
          style={styles.input}
          type="number"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          required
          min="0"
          step="0.01"
        />
        <select
          style={styles.input}
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          required
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

        <button
          type="submit"
          style={{
            ...styles.button,
            ...(loading ? styles.buttonDisabled : {}),
          }}
          disabled={loading}
        >
          {loading ? "Agregando..." : "Guardar producto"}
        </button>
      </form>

      <h2 style={{ marginTop: 40 }}>Stock actual</h2>
      {productos.length === 0 && <p>No hay productos cargados</p>}
      {productos.map((p) => (
        <div key={p.id} style={styles.camisetaCard}>
          <img
            src={p.imagen_frente || "https://via.placeholder.com/60"}
            alt={p.nombre}
            style={styles.img}
          />
          <span>{p.nombre}</span>
          <span>${p.precio.toFixed(2)}</span>

          <div style={styles.stockControl}>
            <button
              style={styles.stockButton}
              onClick={() => handleDecreaseStock(p.id)}
            >
              –
            </button>
            <span style={styles.stockNumber}>{p.stock}</span>
            <button
              style={styles.stockButton}
              onClick={() => handleIncreaseStock(p.id)}
            >
              +
            </button>
          </div>

          <span
            style={{
              ...styles.stockLabel,
              backgroundColor: getStockColor(Number(p.stock)),
            }}
          >
            {p.stock >= 20 ? "Alto" : p.stock >= 10 ? "Medio" : "Bajo"}
          </span>

          <button
            style={styles.eliminarButton}
            onClick={() => handleEliminar(p.id)}
          >
            Eliminar
          </button>
        </div>
      ))}
    </div>
  );
}
