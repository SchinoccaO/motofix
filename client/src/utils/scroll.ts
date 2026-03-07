/**
 * scrollToId — smooth scroll hacia una sección con offset para sticky headers.
 *
 * Compensa automáticamente:
 *   - Navbar sticky (≈ 64px)
 *   - Anchor nav secundaria (≈ 44px) si la página la tiene
 *   - Gap de respiración (12px)
 *
 * Uso:
 *   scrollToId('resenas')              // offset por defecto (solo navbar)
 *   scrollToId('resenas', 44)          // + anchor nav secundaria
 *
 * Compatible con Safari iOS, Chrome Android y todos los navegadores modernos.
 * Fallback a scrollIntoView si window.scrollTo no soporta opciones.
 */
export function scrollToId(id: string, extraOffset = 0): void {
  const el = document.getElementById(id);
  if (!el) return;

  const NAVBAR_H = 64;   // altura del sticky Navbar
  const GAP      = 12;   // respiración visual
  const offset   = NAVBAR_H + extraOffset + GAP;

  const top = el.getBoundingClientRect().top + window.scrollY - offset;

  try {
    window.scrollTo({ top, behavior: 'smooth' });
  } catch {
    // Fallback para navegadores muy antiguos
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * scrollToTop — vuelve al inicio de la página suavemente.
 */
export function scrollToTop(): void {
  try {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch {
    window.scrollTo(0, 0);
  }
}
