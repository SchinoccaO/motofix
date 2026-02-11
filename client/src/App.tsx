// ═══════════════════════════════════════════════════════════════════════════
// ARCHIVO: App.tsx - CONFIGURACIÓN DE RUTAS (URLs) DE LA APLICACIÓN
// ═══════════════════════════════════════════════════════════════════════════
// Este archivo define qué página se muestra según la URL:
// - http://localhost:3000/          → Página Home
// - http://localhost:3000/taller    → Perfil del Taller
// - etc.

import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home"; // Página principal/inicio
import Login from "./pages/Login"; // Página de inicio de sesión
import Register from "./pages/Register"; // Página de registro
import BuscarTalleres from "./pages/BuscarTalleres"; // Página de búsqueda de talleres
import TallerProfile from "./pages/TallerProfile"; // Perfil de un taller específico
import RegistroTaller from "./pages/RegistroTaller"; // Formulario para registrar taller
import ResenaForm from "./pages/ResenaForm"; // Formulario para dejar reseña
import "./App.css";

// ─── COMPONENTE PRINCIPAL ────────────────────────────────────────────────────
function App(): JSX.Element {
  return (
    <>
      <ScrollToTop />
      <Routes>
      {/* Cada Route mapea una URL a un componente de página */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/talleres" element={<BuscarTalleres />} />
      <Route path="/taller/:id" element={<TallerProfile />} />
      <Route path="/registro-taller" element={<RegistroTaller />} />
      <Route path="/taller/:id/resena" element={<ResenaForm />} />
    </Routes>
    </>
  );
}

export default App;
