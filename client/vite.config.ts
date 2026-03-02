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
  plugins: [react()],

  // Separar maplibre-gl en su propio chunk (lazy, solo carga en /mapa)
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('maplibre-gl')) return 'maplibre';
        },
      },
    },
  },

  // Configuración del servidor de desarrollo
  server: {
    port: 5173, // Abre la app en http://localhost:5173
    open: true, // Abre el navegador automáticamente al ejecutar "npm run dev"
    proxy: {
      // Redirige peticiones /api al backend
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true,
      },
    },
  },
});
