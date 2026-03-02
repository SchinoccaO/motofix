/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    // ⚠️ El dark mode se activa/desactiva agregando la clase "dark" al <html>.
    // El toggle está en Navbar.tsx y persiste en localStorage.
    darkMode: 'class',
    theme: {
        extend: {
            // ─── PALETA DE COLORES ─────────────────────────────────────────────────────
            // Jerarquía dark mode (de más oscuro a más claro):
            //   background-dark → surface-dark → card-dark → elevated-dark
            colors: {
                // 🔧 Cambiar primary si se rediseña la marca (botones CTA, badges, acentos)
                primary: '#FFB800',              // Amarillo dorado MotoFIX
                'primary-hover': '#E6A700',      // Hover de primary — siempre usar este, nunca hardcodear hex en :hover

                // ── Fondos (light) ─────────────────────────────────────────────────────
                'background-light': '#f8f7f6',   // Fondo base en modo claro

                // ── Fondos (dark) — jerarquía de profundidad ───────────────────────────
                'background-dark':  '#121418',   // Nivel 0: fondo de página completa
                'surface-dark':     '#1C1F26',   // Nivel 1: secciones (Footer, "Cómo funciona")
                'card-dark':        '#22262E',   // Nivel 2: cards individuales (talleres, steps)
                'elevated-dark':    '#2A303C',   // Nivel 3: íconos, estados activos, overlays

                // ── Texto ──────────────────────────────────────────────────────────────
                'text-main':        '#181611',   // Texto principal en modo claro (también texto sobre botón primary)
                'text-secondary':   '#887f63',   // Texto secundario / muted en modo claro
                'text-body-dark':   '#E2E8F0',   // Texto de cuerpo en modo oscuro

                // ── Bordes ────────────────────────────────────────────────────────────
                'input-border':     '#e5e7eb',   // Borde de inputs en modo claro
                'input-border-dark':'#2D3748',   // Borde de inputs / divisores en modo oscuro
                'border-subtle':    '#2D3748',   // Alias de input-border-dark — divisores sutiles dark
            },
            // ─── TIPOGRAFÍA ────────────────────────────────────────────────────────────
            fontFamily: {
                display: ['Inter', 'sans-serif'],       // Títulos, encabezados, botones
                body:    ['Noto Sans', 'sans-serif'],   // Texto corrido (poco usado — Inter cubre todo)
            },
            // ─── BORDER RADIUS ─────────────────────────────────────────────────────────
            // 🔧 Cambiar lg si se quiere más/menos redondeado en botones y cards
            borderRadius: {
                DEFAULT: '0.25rem',  // 4px  — el default de rounded
                lg:      '0.5rem',   // 8px  — botones, cards
                xl:      '0.75rem',  // 12px — modales, panels
                full:    '9999px',   // circular — badges, avatares, pills
            },
        },
    },
    plugins: [
        // Plugin que normaliza los estilos base de los inputs nativos de HTML
        require('@tailwindcss/forms'),
    ],
}