// ═══════════════════════════════════════════════════════════════════════════
// ARCHIVO: main.tsx - PUNTO DE ENTRADA DE LA APLICACIÓN REACT
// ═══════════════════════════════════════════════════════════════════════════
// Este es el primer archivo que se ejecuta cuando la app arranca.
// Aquí se "monta" React en el HTML y se configuran las características globales.

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Permite navegación entre páginas sin recargar
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import "./index.css"; // Estilos globales (Tailwind CSS)
import "./assets/icons/sprite.svg";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

// ─── 1. BUSCAR EL ELEMENTO HTML DONDE SE MONTARÁ REACT ──────────────────────
// En index.html hay un <div id="root"></div> vacío
// React se "apodera" de ese div y mete toda la aplicación ahí
const rootElement = document.getElementById("root");

// Si no encuentra el div, lanza un error (no puede funcionar sin él)
if (!rootElement) {
  throw new Error(
    'Root element not found: ensure client/index.html contains <div id="root"></div>',
  );
}

// ─── 2. CREAR Y RENDERIZAR LA APLICACIÓN ────────────────────────────────────
ReactDOM.createRoot(rootElement).render(
  // StrictMode: Modo de desarrollo que detecta problemas en el código
  // (solo afecta desarrollo, no producción)
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {/* BrowserRouter: Habilita navegación tipo SPA (Single Page App) */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
