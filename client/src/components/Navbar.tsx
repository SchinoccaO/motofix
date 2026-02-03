// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTE: Navbar.tsx - BARRA DE NAVEGACIÓN SUPERIOR
// ═══════════════════════════════════════════════════════════════════════════
// Esta barra aparece en todas las páginas (sticky = pegada arriba)
// Incluye: Logo, buscador, menú de navegación y botón de login

import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    // "sticky top-0 z-50": Se queda fija arriba incluso al hacer scroll
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white dark:bg-background-dark dark:border-gray-800">
      <div className="px-4 md:px-8 lg:px-12 py-3">
        <div className="flex items-center justify-between">
          {/* ─── LOGO Y MARCA ─────────────────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-text-main dark:text-white">
              {/* Ícono de moto */}
              <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-text-main">
                <span className="material-symbols-outlined">two_wheeler</span>
              </div>
              {/* Nombre del sitio */}
              <h2 className="text-xl font-bold leading-tight tracking-tight">
                motoTEC
              </h2>
            </div>
          </Link>

          {/* ─── BUSCADOR (solo se muestra en pantallas medianas+) ───────── */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <label className="relative w-full">
              {/* Ícono de lupa dentro del input */}
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-text-secondary">
                <span className="material-symbols-outlined">search</span>
              </div>
              {/* Campo de búsqueda */}
              <input
                className="block w-full p-2.5 pl-10 text-sm text-text-main bg-gray-100 rounded-lg border-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                placeholder="Buscar talleres, repuestos..."
                type="text"
              />
            </label>
          </div>

          {/* ─── MENÚ DE NAVEGACIÓN ───────────────────────────────────────── */}
          <div className="flex items-center gap-6">
            {/* Links (solo en pantallas grandes) */}
            <div className="hidden lg:flex items-center gap-6">
              <Link
                to="/talleres"
                className="text-sm font-medium hover:text-primary transition-colors dark:text-gray-300"
              >
                Talleres
              </Link>
              <a
                className="text-sm font-medium hover:text-primary transition-colors dark:text-gray-300"
                href="#"
              >
                Repuestos
              </a>
              <a
                className="text-sm font-medium hover:text-primary transition-colors dark:text-gray-300"
                href="#"
              >
                Comunidad
              </a>
              {/* Link a la página de registro de taller */}
              <Link
                to="/registro-taller"
                className="text-sm font-medium hover:text-primary transition-colors dark:text-gray-300"
              >
                Registrar taller
              </Link>
              {/* Link a la página de dejar reseña */}
              <Link
                to="/resena"
                className="text-sm font-medium hover:text-primary transition-colors dark:text-gray-300"
              >
                Dejar reseña
              </Link>
            </div>
            {/* Botón de login */}
            <button className="flex items-center justify-center px-4 py-2 text-sm font-bold bg-primary text-text-main rounded-lg hover:bg-opacity-90 transition-colors">
              Ingresar
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
