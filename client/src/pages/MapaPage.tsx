import { useState, useEffect, lazy, Suspense, type ReactNode, type CSSProperties } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getProviders, type Provider } from '../services/api';
import { isOpenNow, getHorariosSemana, getDiaArgentina, type Horarios } from '../utils/horarios';

// Lazy-load MapLibre — keeps the main bundle small
const MapaTalleres = lazy(() => import('../components/MapaTalleres'));

// ─── Constantes ───────────────────────────────────────────────────────────────
// 🔧 SIDEBAR_W debe coincidir con la clase Tailwind usada en el aside (w-72 = 288px).
//    Si cambiás el ancho del sidebar, actualizá este número también.
const SIDEBAR_W = 288; // w-72 = 18rem = 288px

// Etiquetas legibles para el tipo de negocio (usadas en el panel y la lista)
const TYPE_LABELS: Record<string, string> = {
  shop:        'Taller',
  mechanic:    'Mecánico',
  parts_store: 'Repuestos',
};

// Badges grandes — sobre la foto en la vista de DETALLE del panel
const TYPE_BADGE: Record<string, string> = {
  shop:        'bg-primary text-[#181611]',
  mechanic:    'bg-blue-500 text-white',
  parts_store: 'bg-[#181611] text-white',
};

// Badges pequeños — abreviados (3 letras) en la LISTA compacta del panel
const TYPE_BADGE_SM: Record<string, string> = {
  shop:        'bg-amber-100 text-amber-700 dark:bg-primary/15 dark:text-primary',
  mechanic:    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  parts_store: 'bg-gray-200 text-gray-700 dark:bg-elevated-dark dark:text-gray-300',
};

// 🔧 Fotos de placeholder por tipo — reemplazar cuando haya imágenes reales
const TYPE_PHOTO: Record<string, string> = {
  shop:        'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&h=300&fit=crop',
  mechanic:    'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=300&fit=crop',
  parts_store: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop',
};

// ─── Componentes auxiliares ───────────────────────────────────────────────────
// InfoRow    → fila con ícono + label + contenido (dirección, teléfono, horario)
// OpenBadge  → punto verde/rojo con texto "Abierto ahora / Abre a las HH:MM / Cerrado hoy"
// mapsUrl    → genera URL de Google Maps usando coordenadas si existen, o texto si no

function InfoRow({ icon, label, children }: { icon: string; label: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="size-8 rounded-full bg-gray-100 dark:bg-elevated-dark flex items-center justify-center shrink-0 mt-0.5">
        <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-[16px]">{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">{label}</p>
        <div className="text-xs font-semibold text-gray-900 dark:text-gray-100 leading-snug">{children}</div>
      </div>
    </div>
  );
}

function OpenBadge({ horarios, override }: { horarios?: Horarios | null; override?: boolean | null }) {
  if (!horarios) return null;
  const { open, opensAt } = isOpenNow(horarios, override);
  return (
    <div className={`flex items-center gap-1 text-[10px] font-semibold ${open ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${open ? 'bg-green-500' : 'bg-red-500'}`} />
      {open ? 'Abierto ahora' : opensAt ? `Abre a las ${opensAt}` : 'Cerrado hoy'}
    </div>
  );
}

function mapsUrl(p: Provider): string {
  if (p.location?.latitude && p.location?.longitude) {
    return `https://www.google.com/maps/dir/?api=1&destination=${p.location.latitude},${p.location.longitude}`;
  }
  if (p.location) {
    const q = [p.location.address, p.location.city].filter(Boolean).join(', ');
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
  }
  return '#';
}

// ─── Estado del componente principal ──────────────────────────────────────────
// providers  → lista completa cargada del backend al montar
// loading    → muestra spinner hasta que la API responda
// search     → filtro de texto (nombre o ciudad) aplicado en el frontend, sin nueva request
// selected   → provider que el usuario clickeó en el mapa; null = mostrar lista
// panelOpen  → controla si el sidebar/drawer está abierto o colapsado
// isDark     → refleja el estado actual del dark mode para pasar el tile correcto al mapa

export default function MapaPage() {
  const [searchParams] = useSearchParams();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [selected, setSelected]   = useState<Provider | null>(null);
  const [panelOpen, setPanelOpen] = useState(false); // abre automáticamente tras delay
  const [isDark, setIsDark]       = useState(
    () => document.documentElement.classList.contains('dark'),
  );

  // ── Effect: carga inicial de providers ─────────────────────────────────────
  useEffect(() => {
    getProviders({ limit: 200 }).then(({ data }) => {
      setProviders(data);
      // Si viene ?taller=ID desde BuscarTalleres, auto-seleccionar ese pin
      const tallerId = searchParams.get('taller');
      if (tallerId) {
        const match = data.find((p: any) => p.id === Number(tallerId));
        if (match) {
          setSelected(match);
          setPanelOpen(true);
        }
      }
    }).finally(() => setLoading(false));
  }, []);

  // ── Effect: abrir sidebar automáticamente 500ms después del mount ───────────
  // Pequeño delay para que el mapa termine de renderizarse antes de animar el panel
  useEffect(() => {
    const t = setTimeout(() => setPanelOpen(true), 500);
    return () => clearTimeout(t);
  }, []);

  // ── Effect: cuando el usuario selecciona un taller (mobile), abrir el drawer ─
  useEffect(() => {
    if (selected) setPanelOpen(true);
  }, [selected]);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const handleSelect = (p: Provider) => {
    setSelected(p);
    setPanelOpen(true);
  };

  const filtered = search.trim()
    ? providers.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.location?.city?.toLowerCase().includes(search.toLowerCase()),
      )
    : providers;

  // ── Filtrado en el frontend ───────────────────────────────────────────────
  // No genera una nueva request al backend; filtra el array ya cargado en memoria.
  // ─────────────────────────────────────────────────────────────────────────

  // ── Contenido del panel (DETALLE o LISTA) ─────────────────────────────────
  // panelContent se comparte entre el sidebar desktop y el bottom drawer mobile.
  // Si hay un provider seleccionado → vista DETALLE; si no → lista de resultados.

  const panelContent = selected ? (
    /* ═══ PANEL: DETALLE DE UN TALLER ═══════════════════════════════════════ */
    <>
      {/* ← Volver al listado */}
      <div className="sticky top-0 z-10 bg-white dark:bg-card-dark px-4 py-3 border-b border-gray-100 dark:border-input-border-dark">
        <button
          onClick={() => setSelected(null)}
          className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Volver al listado
        </button>
      </div>

      {/* Foto */}
      <div className="h-44 bg-gray-200 dark:bg-elevated-dark relative">
        <img
          src={TYPE_PHOTO[selected.type] ?? TYPE_PHOTO.shop}
          alt={selected.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-2 left-2 flex gap-1.5">
          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest shadow-sm ${TYPE_BADGE[selected.type] ?? TYPE_BADGE.shop}`}>
            {TYPE_LABELS[selected.type] ?? selected.type}
          </span>
          {selected.is_verified && (
            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-green-500 text-white shadow-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-[11px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              Verificado
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 space-y-4">
        {/* Nombre + rating */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-base leading-tight text-gray-900 dark:text-white mb-1">
              {selected.name}
            </h2>
            <OpenBadge horarios={selected.horarios} override={selected.is_open_override} />
          </div>
          <div className="shrink-0 bg-gray-50 dark:bg-elevated-dark px-2.5 py-1.5 rounded-xl border border-gray-200 dark:border-input-border-dark text-center min-w-[52px]">
            <div className="flex items-center text-primary gap-0.5 justify-center">
              <span className="material-symbols-outlined text-[13px] filled">star</span>
              <span className="text-xs font-bold">{Number(selected.average_rating).toFixed(1)}</span>
            </div>
            <span className="text-[10px] text-gray-500 font-medium block leading-none mt-0.5">
              {selected.total_reviews} reseñas
            </span>
          </div>
        </div>

        {selected.description && (
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            {selected.description}
          </p>
        )}

        <div className="space-y-3">
          {selected.location && (
            <InfoRow icon="location_on" label="Dirección">
              {[selected.location.address, selected.location.city, selected.location.province]
                .filter(Boolean)
                .join(', ')}
            </InfoRow>
          )}
          {selected.phone && (
            <InfoRow icon="call" label="Teléfono">
              <a href={`tel:${selected.phone}`} className="text-primary hover:underline">
                {selected.phone}
              </a>
            </InfoRow>
          )}
          {selected.horarios && (
            <InfoRow icon="schedule" label="Horarios">
              <div className="space-y-0.5 mt-0.5">
                {getHorariosSemana(selected.horarios).map(({ dia, label, horario }) => {
                  const isToday = dia === getDiaArgentina();
                  return (
                    <div
                      key={dia}
                      className={`flex items-center gap-2 text-[11px] ${isToday ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}
                    >
                      <span className="w-20 shrink-0">{label}</span>
                      <span>
                        {horario?.abre && horario?.cierra
                          ? `${horario.abre} – ${horario.cierra}`
                          : <span className="text-gray-400 dark:text-gray-500">Cerrado</span>}
                      </span>
                    </div>
                  );
                })}
              </div>
            </InfoRow>
          )}
          {selected.tags && selected.tags.length > 0 && (
            <InfoRow icon="build" label="Especialidades">
              <div className="flex flex-wrap gap-1 mt-1">
                {selected.tags.slice(0, 6).map((tag) => (
                  <span
                    key={tag.id}
                    className="px-1.5 py-0.5 bg-gray-100 dark:bg-elevated-dark text-[10px] font-bold rounded uppercase text-gray-700 dark:text-gray-300"
                  >
                    {tag.name}
                  </span>
                ))}
                {selected.tags.length > 6 && (
                  <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-elevated-dark text-[10px] font-bold rounded uppercase text-gray-700 dark:text-gray-300">
                    +{selected.tags.length - 6}
                  </span>
                )}
              </div>
            </InfoRow>
          )}
        </div>
      </div>

      {/* Acciones — sticky bottom */}
      <div className="sticky bottom-0 bg-white dark:bg-card-dark border-t border-gray-100 dark:border-input-border-dark p-4">
        <div className="flex gap-2">
          {selected.phone && (
            <a
              href={`tel:${selected.phone}`}
              className="size-11 rounded-xl border-2 border-gray-200 dark:border-input-border-dark flex items-center justify-center hover:bg-gray-50 dark:hover:bg-elevated-dark transition-colors text-gray-700 dark:text-gray-200 shrink-0"
              title="Llamar"
            >
              <span className="material-symbols-outlined text-[20px]">call</span>
            </a>
          )}
          <a
            href={mapsUrl(selected)}
            target="_blank"
            rel="noopener noreferrer"
            className="size-11 rounded-xl border-2 border-gray-200 dark:border-input-border-dark flex items-center justify-center hover:bg-gray-50 dark:hover:bg-elevated-dark transition-colors text-gray-700 dark:text-gray-200 shrink-0"
            title="Cómo llegar"
          >
            <span className="material-symbols-outlined text-[20px]">directions</span>
          </a>
          <Link
            to={`/taller/${selected.id}`}
            className="flex-1 h-11 bg-primary text-[#181611] font-bold rounded-xl flex items-center justify-center gap-1.5 text-sm hover:bg-primary-hover transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            Ver perfil
          </Link>
        </div>
      </div>
    </>

  ) : (
    /* ═══ PANEL: LISTA DE RESULTADOS ════════════════════════════════════════ */
    <>
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="px-4 py-10 text-center">
          <span className="material-symbols-outlined text-3xl text-gray-300 mb-2 block">search_off</span>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Sin resultados{search ? ` para "${search}"` : ''}
          </p>
        </div>
      )}

      {!loading &&
        filtered.map((p) => (
          <div
            key={p.id}
            onClick={() => handleSelect(p)}
            className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-elevated-dark transition-colors border-b border-gray-100 dark:border-input-border-dark last:border-0 cursor-pointer"
          >
            {/* Fila superior: foto + info */}
            <div className="flex items-start gap-3 mb-2.5">
              <div className="size-12 rounded-xl overflow-hidden bg-gray-100 dark:bg-elevated-dark shrink-0">
                <img
                  src={TYPE_PHOTO[p.type] ?? TYPE_PHOTO.shop}
                  alt={p.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-1.5 mb-0.5">
                  <div className="flex items-center gap-1 min-w-0">
                    <p className="font-semibold text-sm leading-tight truncate text-gray-900 dark:text-white">
                      {p.name}
                    </p>
                    {p.is_verified && (
                      <span className="material-symbols-outlined text-green-500 text-[14px] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    )}
                  </div>
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase shrink-0 ${TYPE_BADGE_SM[p.type] ?? TYPE_BADGE_SM.shop}`}>
                    {TYPE_LABELS[p.type]?.substring(0, 3) ?? p.type.substring(0, 3)}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-primary text-[11px] font-bold">
                    ★ {Number(p.average_rating).toFixed(1)}
                  </span>
                  <span className="text-gray-300 dark:text-gray-600 text-[10px]">·</span>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">
                    {p.total_reviews} reseñas
                  </span>
                </div>
                <OpenBadge horarios={p.horarios} override={p.is_open_override} />
              </div>
            </div>

            {/* Botones de acción — stopPropagation para no activar handleSelect */}
            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
              {p.phone && (
                <a
                  href={`tel:${p.phone}`}
                  className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg border border-gray-200 dark:border-input-border-dark text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-elevated-dark transition-colors text-xs font-semibold"
                >
                  <span className="material-symbols-outlined text-[14px]">call</span>
                  Llamar
                </a>
              )}
              {p.location && (
                <a
                  href={mapsUrl(p)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg border border-gray-200 dark:border-input-border-dark text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-elevated-dark transition-colors text-xs font-semibold"
                >
                  <span className="material-symbols-outlined text-[14px]">directions</span>
                  Cómo llegar
                </a>
              )}
            </div>
          </div>
        ))}
    </>
  );

  // ── Render ────────────────────────────────────────────────────────────────

  const sidebarStyle: CSSProperties = {
    width:      panelOpen ? SIDEBAR_W : 0,
    minWidth:   0,
    overflow:   'hidden',
    transition: 'width 300ms ease-in-out',
    boxShadow:  panelOpen ? '4px 0 20px rgba(0,0,0,0.08)' : 'none',
  };

  const solapaStyle: CSSProperties = {
    left:       panelOpen ? SIDEBAR_W : 0,
    transition: 'left 300ms ease-in-out',
    position:   'absolute',
    top:        '50%',
    transform:  'translateY(-50%)',
    width:      20,
    height:     56,
    zIndex:     1002,
    display:    'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor:     'pointer',
  };

  const mapAreaStyle: CSSProperties = {
    position:   'absolute',
    top:        0,
    bottom:     0,
    right:      0,
    left:       panelOpen ? SIDEBAR_W : 0,
    transition: 'left 300ms ease-in-out',
  };

  return (
    <div className="relative h-screen overflow-hidden bg-gray-200 dark:bg-background-dark">

      {/* ════════════════════════════════════════════════════════════════
          SIDEBAR DESKTOP — width colapsa con CSS transition
      ════════════════════════════════════════════════════════════════ */}
      <aside
        className="hidden lg:flex flex-col absolute left-0 top-0 bottom-0 z-[1001] bg-white dark:bg-card-dark border-r border-gray-100 dark:border-input-border-dark"
        style={sidebarStyle}
      >
        {/* Inner div mantiene el ancho fijo para que el contenido no se comprima */}
        <div className="flex flex-col h-full" style={{ width: SIDEBAR_W }}>

          {/* ← Volver — siempre en la parte superior */}
          <Link
            to="/talleres"
            className="flex items-center gap-2 px-4 py-3.5 border-b border-gray-100 dark:border-input-border-dark hover:bg-gray-50 dark:hover:bg-elevated-dark transition-colors group shrink-0"
          >
            <span className="material-symbols-outlined text-[18px] text-gray-500 dark:text-gray-400 group-hover:text-primary">
              arrow_back
            </span>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 group-hover:text-primary">
              Volver al buscador
            </span>
          </Link>

          {/* Sub-header: conteo */}
          <div className="px-4 py-3 border-b border-gray-100 dark:border-input-border-dark shrink-0">
            <p className="font-bold text-sm text-gray-900 dark:text-white">Talleres y Mecánicos</p>
            <p className="text-[11px] text-gray-500">
              {loading ? 'Cargando...' : `${filtered.length} resultados · Córdoba`}
            </p>
          </div>

          {/* Contenido scrolleable */}
          <div className="flex-1 overflow-y-auto">{panelContent}</div>
        </div>
      </aside>

      {/* ════════════════════════════════════════════════════════════════
          SOLAPA TOGGLE — desktop, sigue el borde derecho del sidebar
      ════════════════════════════════════════════════════════════════ */}
      <button
        onClick={() => setPanelOpen((v) => !v)}
        className="hidden lg:block bg-white dark:bg-card-dark border border-primary/40 dark:border-input-border-dark rounded-r-lg hover:bg-primary/5 dark:hover:bg-elevated-dark transition-colors"
        style={solapaStyle}
        title={panelOpen ? 'Contraer panel' : 'Expandir panel'}
      >
        <span className="material-symbols-outlined text-primary" style={{ fontSize: 14 }}>
          {panelOpen ? 'chevron_left' : 'chevron_right'}
        </span>
      </button>

      {/* ════════════════════════════════════════════════════════════════
          ÁREA DEL MAPA — left se ajusta al ancho del sidebar
          MapLibre detecta el resize automáticamente (ResizeObserver)
      ════════════════════════════════════════════════════════════════ */}
      <div style={mapAreaStyle}>
        {!loading && (
          <Suspense fallback={null}>
            <MapaTalleres
              providers={filtered}
              onMarkerClick={handleSelect}
              selectedId={selected?.id}
              fullScreen
            />
          </Suspense>
        )}

        {/* Header flotante sobre el mapa */}
        <header className="absolute top-4 inset-x-0 z-[1001] flex justify-center px-4">
          <div className="w-full max-w-lg bg-white/95 dark:bg-[#1C1F26]/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/60 dark:border-input-border-dark flex items-center px-3 py-2.5 gap-2">

            {/* ← Volver — SOLO MOBILE (en desktop está en el sidebar) */}
            <Link
              to="/talleres"
              className="lg:hidden flex items-center gap-1 pr-3 border-r border-gray-200 dark:border-input-border-dark text-gray-700 dark:text-gray-200 hover:text-primary transition-colors shrink-0"
              title="Volver al buscador"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              <span className="text-xs font-bold hidden sm:block">Volver</span>
            </Link>

            {/* Buscador */}
            <span className="material-symbols-outlined text-gray-500 text-[18px] shrink-0">search</span>
            <input
              className="flex-1 min-w-0 bg-transparent text-sm font-medium outline-none border-none focus:ring-0 placeholder-gray-400 dark:text-white text-gray-900"
              placeholder="Buscar por nombre o ciudad..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch('')} className="shrink-0">
                <span className="material-symbols-outlined text-gray-500 hover:text-gray-700 text-[18px]">close</span>
              </button>
            )}

            {/* Toggle dark/light */}
            <button
              onClick={toggleTheme}
              className="shrink-0 pl-2 border-l border-gray-200 dark:border-input-border-dark text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
              title={isDark ? 'Modo claro' : 'Modo oscuro'}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
          </div>
        </header>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          BOTTOM DRAWER MOBILE
      ════════════════════════════════════════════════════════════════ */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-[1001]">
        <div
          className="bg-white dark:bg-card-dark rounded-t-2xl shadow-2xl border-t border-gray-100 dark:border-input-border-dark"
          style={{
            transform:  panelOpen ? 'translateY(0)' : 'translateY(calc(100% - 4rem))',
            transition: 'transform 300ms ease-in-out',
          }}
        >
          {/* Peek strip — siempre visible */}
          <button
            className="w-full px-4 pt-2.5 pb-3 flex flex-col items-center"
            onClick={() => setPanelOpen((v) => !v)}
          >
            <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mb-2" />
            <div className="w-full flex items-center justify-between">
              <div className="text-left">
                <p className="font-bold text-sm text-gray-900 dark:text-white">
                  {selected ? selected.name : 'Talleres y Mecánicos'}
                </p>
                {!selected && (
                  <p className="text-[11px] text-gray-500">
                    {loading ? 'Cargando...' : `${filtered.length} resultados`}
                  </p>
                )}
              </div>
              <span className="material-symbols-outlined text-gray-500 text-[20px]">
                {panelOpen ? 'expand_more' : 'expand_less'}
              </span>
            </div>
          </button>

          {/* Contenido scrolleable */}
          <div
            className="overflow-hidden border-t border-gray-100 dark:border-input-border-dark"
            style={{ maxHeight: panelOpen ? '55vh' : '0px', transition: 'max-height 300ms ease-in-out' }}
          >
            <div className="overflow-y-auto max-h-[55vh]">{panelContent}</div>
          </div>
        </div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-background-dark z-[1002]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
        </div>
      )}

      <style>{`.filled { font-variation-settings: 'FILL' 1; }`}</style>
    </div>
  );
}
