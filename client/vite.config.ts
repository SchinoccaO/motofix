// ═══════════════════════════════════════════════════════════════════════════
// ARCHIVO: vite.config.ts - CONFIGURACIÓN DEL SERVIDOR DE DESARROLLO
// ═══════════════════════════════════════════════════════════════════════════
// Vite es la herramienta que:
// - Arranca el servidor local (localhost:3000)
// - Recarga automáticamente cuando guardas cambios (Hot Module Replacement)
// - Construye la app para producción

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Plugin que permite usar React con JSX/TSX
  plugins: [react()],

  // Configuración del servidor de desarrollo
  server: {
    port: 3000, // Abre la app en http://localhost:3000
    open: true, // Abre el navegador automáticamente al ejecutar "npm run dev"
  },
});
