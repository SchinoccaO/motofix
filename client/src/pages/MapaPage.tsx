import { useState, useEffect, useRef, lazy, Suspense, type ReactNode, type CSSProperties } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getProviders, type Provider } from '../services/api';
import { isOpenNow, getHorariosSemana, getDiaArgentina, type Horarios } from '../utils/horarios';

const MapaTalleres = lazy(() => import('../components/MapaTalleres'));

// ── Geocoding (Nominatim, Córdoba-bounded) ────────────────────────────────────
type GeocodeResult = { lat: number; lng: number; label: string };

// Viewbox: SW(-31.58, -64.42) → NE(-31.22, -63.92) — cubre toda la ciudad de Córdoba
const CBA_VIEWBOX = '-64.42,-31.22,-63.92,-31.58';

async function geocodeCba(query: string): Promise<GeocodeResult | null> {
  try {
    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.set('q', `${query}, Córdoba, Argentina`);
    url.searchParams.set('format', 'json');
    url.searchParams.set('limit', '1');
    url.searchParams.set('countrycodes', 'ar');
    url.searchParams.set('viewbox', CBA_VIEWBOX);
    url.searchParams.set('bounded', '1');
    const res = await fetch(url.toString());
    if (!res.ok) return null;
    const data = await res.json() as Array<{ lat: string; lon: string; display_name: string }>;
    if (!data.length) return null;
    const label = data[0].display_name.split(',')[0].trim();
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), label };
  } catch {
    return null;
  }
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function distToPoint(p: Provider, geo: GeocodeResult): number {
  if (!p.location?.latitude || !p.location?.longitude) return Infinity;
  return haversineKm(geo.lat, geo.lng, p.location.latitude, p.location.longitude);
}

const SIDEBAR_W = 288;

const TYPE_LABELS: Record<string, string> = {
  shop:        'Taller',
  mechanic:    'Mecánico',
  parts_store: 'Repuestos',
};

const TYPE_BADGE: Record<string, string> = {
  shop:        'bg-primary text-[#181611]',
  mechanic:    'bg-blue-500 text-white',
  parts_store: 'bg-[#181611] text-white',
};

const TYPE_BADGE_SM: Record<string, string> = {
  shop:        'bg-amber-100 text-amber-700 dark:bg-primary/15 dark:text-primary',
  mechanic:    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  parts_store: 'bg-gray-200 text-gray-700 dark:bg-elevated-dark dark:text-gray-300',
};

const TYPE_PHOTO: Record<string, string> = {
  shop:        'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&h=300&fit=crop',
  mechanic:    'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=300&fit=crop',
  parts_store: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop',
};

function InfoRow({ icon, label, children }: { icon: string; label: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-2.5">
      <span
        className="material-symbols-outlined text-gray-400 dark:text-gray-500 shrink-0 mt-0.5"
        style={{ fontSize: '18px' }}
      >
        {icon}
      </span>
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

export default function MapaPage() {
  const [searchParams] = useSearchParams();
  const [providers, setProviders]     = useState<Provider[]>([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [selected, setSelected]       = useState<Provider | null>(null);
  const [panelOpen, setPanelOpen]     = useState(() => window.innerWidth >= 1024);
  // Mobile sheet state: null = mapa limpio · 'list' = lista completa · 'detail' = detalle completo
  const [mobileSheet, setMobileSheet] = useState<null | 'list' | 'detail'>(null);
  const [isDark, setIsDark]           = useState(
    () => document.documentElement.classList.contains('dark'),
  );
  const [geocodeResult, setGeocodeResult] = useState<GeocodeResult | null>(null);
  const [isGeocoding, setIsGeocoding]     = useState(false);
  const geocodeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    getProviders({ limit: 200 }).then(({ data }) => {
      setProviders(data);
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

  // Desktop: abrir sidebar cuando se selecciona un taller
  useEffect(() => {
    if (selected && window.innerWidth >= 1024) setPanelOpen(true);
  }, [selected]);

  // Geocoding con debounce 600ms
  useEffect(() => {
    if (geocodeTimer.current) clearTimeout(geocodeTimer.current);
    const q = search.trim();
    if (!q) { setGeocodeResult(null); setIsGeocoding(false); return; }

    setIsGeocoding(true);
    geocodeTimer.current = setTimeout(async () => {
      const result = await geocodeCba(q);
      setGeocodeResult(result);
      setIsGeocoding(false);
    }, 600);

    return () => { if (geocodeTimer.current) clearTimeout(geocodeTimer.current); };
  }, [search]);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const handleSelect = (p: Provider) => {
    setSelected(p);
    if (window.innerWidth >= 1024) {
      setPanelOpen(true);    // desktop: mostrar en sidebar
    } else {
      setMobileSheet(null);  // mobile: cerrar cualquier sheet, mostrar preview card
    }
  };

  const q = search.trim().toLowerCase();

  // Búsqueda por nombre, dirección y especialidades
  const nameMatches = q
    ? providers.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.location?.address ?? '').toLowerCase().includes(q) ||
          (p.location?.city ?? '').toLowerCase().includes(q) ||
          (p.tags ?? []).some((t) => t.name.toLowerCase().includes(q)),
      )
    : providers;

  // Modo proximidad: geocodificó algo y no hay coincidencias por nombre
  const inGeoMode = !!q && !!geocodeResult && nameMatches.length === 0;

  const filtered = !q
    ? providers
    : inGeoMode
    ? [...providers].sort((a, b) => distToPoint(a, geocodeResult!) - distToPoint(b, geocodeResult!))
    : nameMatches;

  // ── Contenido del detalle: zona scrolleable (foto + info) ─────────────────────
  const detailBody = selected ? (
    <>
      {/* Foto con badges */}
      <div className="h-44 bg-gray-200 dark:bg-elevated-dark relative shrink-0">
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
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-base leading-tight text-gray-900 dark:text-white mb-1">
              {selected.name}
            </h2>
            <OpenBadge horarios={selected.horarios} override={selected.is_open_override} />
          </div>
          <div className="shrink-0 bg-gray-50 dark:bg-elevated-dark px-2.5 py-1.5 rounded-xl border border-gray-200 dark:border-input-border-dark text-center min-w-[52px]">
            <div className="flex items-center text-primary gap-0.5 justify-center">
              <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="text-xs font-bold">{Number(selected.average_rating).toFixed(1)}</span>
            </div>
            <span className="text-[10px] text-gray-500 font-medium block leading-none mt-0.5">
              {selected.total_reviews} reseñas
            </span>
          </div>
        </div>

        {selected.description && (
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{selected.description}</p>
        )}

        <div className="space-y-3">
          {selected.location && (
            <InfoRow icon="location_on" label="Dirección">
              {[selected.location.address, selected.location.city, selected.location.province].filter(Boolean).join(', ')}
            </InfoRow>
          )}
          {selected.phone && (
            <InfoRow icon="call" label="Teléfono">
              <a href={`tel:${selected.phone}`} className="text-primary hover:underline">{selected.phone}</a>
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
                  <span key={tag.id} className="px-1.5 py-0.5 bg-gray-100 dark:bg-elevated-dark text-[10px] font-bold rounded uppercase text-gray-700 dark:text-gray-300">
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
    </>
  ) : null;

  // ── Botones de acción del detalle (siempre al fondo, no scrollea) ─────────────
  const detailFooter = selected ? (
    <div className="border-t border-gray-100 dark:border-input-border-dark p-4 shrink-0 bg-white dark:bg-card-dark">
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
          Ver perfil completo
        </Link>
      </div>
    </div>
  ) : null;

  // ── Lista de resultados ───────────────────────────────────────────────────────
  const listContent = (
    <>
      {!loading && filtered.length === 0 && (
        <div className="px-4 py-10 text-center">
          <span className="material-symbols-outlined text-3xl text-gray-300 mb-2 block">search_off</span>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Sin resultados{search ? ` para "${search}"` : ''}
          </p>
        </div>
      )}
      {!loading && filtered.map((p) => (
        <div
          key={p.id}
          onClick={() => handleSelect(p)}
          className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-elevated-dark transition-colors border-b border-gray-100 dark:border-input-border-dark last:border-0 cursor-pointer"
        >
          <div className="flex items-start gap-3">
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
                  <p className="font-semibold text-sm leading-tight truncate text-gray-900 dark:text-white">{p.name}</p>
                  {p.is_verified && (
                    <span className="material-symbols-outlined text-green-500 text-[14px] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  )}
                </div>
                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase shrink-0 ${TYPE_BADGE_SM[p.type] ?? TYPE_BADGE_SM.shop}`}>
                  {TYPE_LABELS[p.type]?.substring(0, 3) ?? p.type.substring(0, 3)}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <span className="text-primary text-[11px] font-bold">★ {Number(p.average_rating).toFixed(1)}</span>
                <span className="text-gray-300 dark:text-gray-600 text-[10px]">·</span>
                <span className="text-[11px] text-gray-500 dark:text-gray-400">{p.total_reviews} reseñas</span>
                {inGeoMode && p.location?.latitude && (
                  <>
                    <span className="text-gray-300 dark:text-gray-600 text-[10px]">·</span>
                    <span className="text-[11px] text-blue-500 dark:text-blue-400 font-semibold">
                      {distToPoint(p, geocodeResult!).toFixed(1)} km
                    </span>
                  </>
                )}
              </div>
              <OpenBadge horarios={p.horarios} override={p.is_open_override} />
            </div>
          </div>
        </div>
      ))}
    </>
  );

  // ── Estilos del sidebar desktop ───────────────────────────────────────────────
  const sidebarStyle: CSSProperties = {
    width:      panelOpen ? SIDEBAR_W : 0,
    minWidth:   0,
    overflow:   'hidden',
    transition: 'width 300ms ease-in-out',
    boxShadow:  panelOpen ? '4px 0 20px rgba(0,0,0,0.08)' : 'none',
  };

  const solapaStyle: CSSProperties = {
    left:           panelOpen ? SIDEBAR_W : 0,
    transition:     'left 300ms ease-in-out',
    position:       'absolute',
    top:            '50%',
    transform:      'translateY(-50%)',
    width:          20,
    height:         56,
    zIndex:         1002,
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    cursor:         'pointer',
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

      {/* ════════════════════════════════════════════
          SIDEBAR DESKTOP
      ════════════════════════════════════════════ */}
      <aside
        className="hidden lg:flex flex-col absolute left-0 top-0 bottom-0 z-[1001] bg-white dark:bg-card-dark border-r border-gray-100 dark:border-input-border-dark"
        style={sidebarStyle}
      >
        <div className="flex flex-col h-full" style={{ width: SIDEBAR_W }}>
          {/* Volver */}
          <Link
            to="/talleres"
            className="flex items-center gap-2 px-4 py-3.5 border-b border-gray-100 dark:border-input-border-dark hover:bg-gray-50 dark:hover:bg-elevated-dark transition-colors group shrink-0"
          >
            <span className="material-symbols-outlined text-[18px] text-gray-500 dark:text-gray-400 group-hover:text-primary">arrow_back</span>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 group-hover:text-primary">
              {selected ? (
                <button onClick={(e) => { e.preventDefault(); setSelected(null); }}>
                  Volver al listado
                </button>
              ) : 'Volver al buscador'}
            </span>
          </Link>

          {/* Sub-header */}
          <div className="px-4 py-3 border-b border-gray-100 dark:border-input-border-dark shrink-0">
            <p className="font-bold text-sm text-gray-900 dark:text-white">
              {selected ? selected.name : 'Talleres y Mecánicos'}
            </p>
            <p className="text-[11px] text-gray-500">
              {loading
                ? 'Cargando...'
                : selected
                ? TYPE_LABELS[selected.type]
                : inGeoMode
                ? `${filtered.length} cerca de ${geocodeResult?.label}`
                : `${filtered.length} resultados · Córdoba`}
            </p>
          </div>

          {/* Contenido scrolleable */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {selected ? detailBody : listContent}
          </div>

          {/* Acciones fijas al fondo (solo cuando hay detalle) */}
          {selected && detailFooter}
        </div>
      </aside>

      {/* Toggle sidebar desktop */}
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

      {/* ════════════════════════════════════════════
          MAPA
      ════════════════════════════════════════════ */}
      <div style={mapAreaStyle}>
        {!loading && (
          <Suspense fallback={null}>
            <MapaTalleres
              providers={filtered}
              onMarkerClick={handleSelect}
              selectedId={selected?.id}
              geocodeCenter={inGeoMode && geocodeResult ? geocodeResult : undefined}
              fullScreen
            />
          </Suspense>
        )}

        {/* Header flotante con buscador */}
        <header className="absolute top-4 inset-x-0 z-[1001] flex flex-col items-center gap-2 px-4">
          <div className="w-full max-w-lg bg-white/95 dark:bg-[#1C1F26]/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/60 dark:border-input-border-dark flex items-center px-3 py-2.5 gap-2">
            <Link
              to="/talleres"
              className="lg:hidden flex items-center gap-1 pr-3 border-r border-gray-200 dark:border-input-border-dark text-gray-700 dark:text-gray-200 hover:text-primary transition-colors shrink-0"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </Link>
            <span className="material-symbols-outlined text-gray-500 text-[18px] shrink-0">search</span>
            <input
              className="flex-1 min-w-0 bg-transparent text-sm font-medium outline-none border-none focus:ring-0 placeholder-gray-400 dark:text-white text-gray-900"
              placeholder="Nombre, barrio, calle..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {isGeocoding && (
              <div className="shrink-0 w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            )}
            {search && !isGeocoding && (
              <button onClick={() => { setSearch(''); setGeocodeResult(null); }} className="shrink-0">
                <span className="material-symbols-outlined text-gray-500 hover:text-gray-700 text-[18px]">close</span>
              </button>
            )}
            <button
              onClick={toggleTheme}
              className="shrink-0 pl-2 border-l border-gray-200 dark:border-input-border-dark text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">{isDark ? 'light_mode' : 'dark_mode'}</span>
            </button>
          </div>

          {/* Pill de zona geocodificada */}
          {inGeoMode && geocodeResult && (
            <div className="flex items-center gap-1.5 bg-white/95 dark:bg-[#1C1F26]/95 backdrop-blur-xl border border-primary/40 rounded-full px-3 py-1.5 shadow-md">
              <span className="material-symbols-outlined text-primary text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>near_me</span>
              <span className="text-xs font-semibold text-gray-800 dark:text-gray-100">Cerca de <span className="text-primary">{geocodeResult.label}</span></span>
              <span className="text-[10px] text-gray-400 ml-0.5">— {filtered.length} talleres</span>
            </div>
          )}
        </header>
      </div>

      {/* ════════════════════════════════════════════
          MOBILE UI — 3 capas independientes
      ════════════════════════════════════════════ */}

      {/* ── 1. Pill flotante — visible solo cuando mapa limpio ── */}
      <div
        className={`lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[1001] transition-all duration-300 ${
          !mobileSheet && !selected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
      >
        <button
          onClick={() => setMobileSheet('list')}
          className="flex items-center gap-2 bg-white dark:bg-card-dark rounded-full pl-5 pr-4 py-3 shadow-xl border border-gray-200 dark:border-input-border-dark"
        >
          <span className="text-sm font-bold text-gray-900 dark:text-white">
            {loading
              ? 'Cargando...'
              : isGeocoding
              ? 'Buscando zona...'
              : inGeoMode
              ? `${filtered.length} cerca de ${geocodeResult?.label}`
              : `${filtered.length} resultados`}
          </span>
          <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>expand_less</span>
        </button>
      </div>

      {/* ── 2. Preview card — aparece al seleccionar un pin ── */}
      <div
        className={`lg:hidden fixed inset-x-0 bottom-0 z-[1002] transition-transform duration-300 ease-out ${
          selected && !mobileSheet ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {selected && (
          <div className="bg-white dark:bg-card-dark rounded-t-2xl shadow-2xl">
            {/* Handle */}
            <div className="pt-3 pb-1 flex justify-center">
              <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
            </div>

            <div className="px-4 pb-5 pt-2">
              {/* Info del taller */}
              <div className="flex gap-3 mb-4">
                <img
                  src={TYPE_PHOTO[selected.type] ?? TYPE_PHOTO.shop}
                  alt={selected.name}
                  className="w-[68px] h-[68px] rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <p className="font-bold text-[15px] leading-tight truncate text-gray-900 dark:text-white">
                      {selected.name}
                    </p>
                    {selected.is_verified && (
                      <span
                        className="material-symbols-outlined text-green-500 shrink-0"
                        style={{ fontSize: '15px', fontVariationSettings: "'FILL' 1" }}
                      >verified</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-primary text-xs font-bold">
                      ★ {Number(selected.average_rating).toFixed(1)}
                    </span>
                    <span className="text-gray-300 dark:text-gray-600 text-[10px]">·</span>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">
                      {selected.total_reviews} reseñas
                    </span>
                    <span className="text-gray-300 dark:text-gray-600 text-[10px]">·</span>
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${TYPE_BADGE_SM[selected.type] ?? TYPE_BADGE_SM.shop}`}>
                      {TYPE_LABELS[selected.type]}
                    </span>
                  </div>
                  <OpenBadge horarios={selected.horarios} override={selected.is_open_override} />
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSelected(null)}
                  className="size-11 rounded-xl border border-gray-200 dark:border-input-border-dark flex items-center justify-center text-gray-500 shrink-0"
                  aria-label="Cerrar"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
                {selected.phone && (
                  <a
                    href={`tel:${selected.phone}`}
                    className="size-11 rounded-xl border border-gray-200 dark:border-input-border-dark flex items-center justify-center text-gray-700 dark:text-gray-200 shrink-0"
                    aria-label="Llamar"
                  >
                    <span className="material-symbols-outlined text-[18px]">call</span>
                  </a>
                )}
                <a
                  href={mapsUrl(selected)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-11 rounded-xl border border-gray-200 dark:border-input-border-dark flex items-center justify-center text-gray-700 dark:text-gray-200 shrink-0"
                  aria-label="Cómo llegar"
                >
                  <span className="material-symbols-outlined text-[18px]">directions</span>
                </a>
                <button
                  onClick={() => setMobileSheet('detail')}
                  className="flex-1 h-11 bg-primary hover:bg-primary-hover text-[#181611] font-bold rounded-xl flex items-center justify-center gap-1.5 text-sm transition-colors"
                >
                  Ver detalle
                  <span className="material-symbols-outlined text-[16px]">expand_less</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── 3. Backdrop — cierra el sheet al tocar fuera ── */}
      <div
        className={`lg:hidden fixed inset-0 z-[1003] bg-black/40 transition-opacity duration-300 ${
          mobileSheet ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileSheet(null)}
      />

      {/* ── 4. Sheet completo — lista o detalle ── */}
      <div
        className={`lg:hidden fixed inset-x-0 bottom-0 z-[1004] transition-transform duration-300 ease-out ${
          mobileSheet ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div
          className="bg-white dark:bg-card-dark rounded-t-2xl shadow-2xl flex flex-col overflow-hidden"
          style={{ maxHeight: '88vh' }}
        >
          {/* Cabecera del sheet */}
          <div className="px-4 pt-3 shrink-0">
            <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600 mx-auto mb-3" />
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-input-border-dark">
              {mobileSheet === 'detail' ? (
                <button
                  onClick={() => setMobileSheet(null)}
                  className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-200"
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                  Volver
                </button>
              ) : (
                <div>
                  <p className="font-bold text-sm text-gray-900 dark:text-white">Talleres y Mecánicos</p>
                  <p className="text-[11px] text-gray-500">
                    {loading
                      ? 'Cargando...'
                      : inGeoMode
                      ? `${filtered.length} cerca de ${geocodeResult?.label}`
                      : `${filtered.length} resultados · Córdoba`}
                  </p>
                </div>
              )}
              <button
                onClick={() => setMobileSheet(null)}
                className="size-8 flex items-center justify-center rounded-lg text-gray-400"
                aria-label="Cerrar"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
          </div>

          {/* Contenido scrolleable */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {mobileSheet === 'detail' ? detailBody : listContent}
          </div>

          {/* Footer fijo de acciones (solo en detalle) */}
          {mobileSheet === 'detail' && detailFooter}
        </div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-background-dark z-[1005]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
        </div>
      )}
    </div>
  );
}
