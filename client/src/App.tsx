// ═══════════════════════════════════════════════════════════════════════════
// ARCHIVO: App.tsx - CONFIGURACIÓN DE RUTAS (URLs) DE LA APLICACIÓN
// ═══════════════════════════════════════════════════════════════════════════
// Este archivo define qué página se muestra según la URL:
// - http://localhost:3000/          → Página Home
// - http://localhost:3000/taller    → Perfil del Taller
// - etc.

import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home"; // Página principal/inicio
import BuscarTalleres from "./pages/BuscarTalleres"; // Página de búsqueda de talleres
import TallerProfile from "./pages/TallerProfile"; // Perfil de un taller específico
import RegistroTaller from "./pages/RegistroTaller"; // Formulario para registrar taller
import ResenaForm from "./pages/ResenaForm"; // Formulario para dejar reseña
import "./App.css";

// ─── COMPONENTE PRINCIPAL ────────────────────────────────────────────────────
function App(): JSX.Element {
  return (
    <Routes>
      {/* Cada Route mapea una URL a un componente de página */}
      <Route path="/" element={<Home />} />
      <Route path="/talleres" element={<BuscarTalleres />} />
      <Route path="/taller/:id" element={<TallerProfile />} />
      <Route path="/registro-taller" element={<RegistroTaller />} />
      <Route path="/resena" element={<ResenaForm />} />
    </Routes>
  );
}

export default App;
