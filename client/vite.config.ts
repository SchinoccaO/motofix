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

  // Fuerza a Vite a pre-bundlear leaflet y markercluster (ambos son CJS)
  // antes de que cualquier módulo lazy los importe. Sin esto, el dynamic
  // import de MapaTalleres falla con "Failed to fetch" en dev mode.
  optimizeDeps: {
    include: ['leaflet', 'leaflet.markercluster'],
  },

  server: {
    port: 5173,
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true,
      },
    },
  },

  build: {
    target: "es2020",
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-leaflet": ["leaflet", "leaflet.markercluster"],
          "vendor-axios": ["axios"],
        },
      },
    },
  },
});
