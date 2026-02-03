// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTE: Icon.tsx - RENDERIZA ICONOS SVG REUTILIZABLES
// ═══════════════════════════════════════════════════════════════════════════
// Este componente usa el sistema de "SVG Sprites" definido en index.html
// En vez de cargar cada ícono por separado, se usa un "diccionario" de iconos
// y se llaman por nombre.

import React from "react";

// Define qué "props" (parámetros) acepta el componente
interface IconProps {
  name: string; // Nombre del ícono (ej: "search", "location_on", "star")
  className?: string; // Clases CSS opcionales (ej: "text-blue-500")
  size?: number; // Tamaño en píxeles (por defecto 24)
}

const Icon: React.FC<IconProps> = ({ name, className = "", size = 24 }) => {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      {/* "use" conecta con los símbolos definidos en index.html */}
      {/* Busca un <symbol id="search"> y lo renderiza aquí */}
      <use href={`#${name}`} />
    </svg>
  );
};

export default Icon;
