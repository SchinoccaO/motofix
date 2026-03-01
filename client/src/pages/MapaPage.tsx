import { useState, useEffect, lazy, Suspense, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { getProviders, type Provider } from '../services/api';

// Lazy-load MapLibre to keep the main bundle small
const MapaTalleres = lazy(() => import('../components/MapaTalleres'));

// ─── Constantes ───────────────────────────────────────────────────────────────

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

// ─── Sub-componente InfoRow ───────────────────────────────────────────────────

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

// ─── Página ───────────────────────────────────────────────────────────────────

export default function MapaPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [selected, setSelected]   = useState<Provider | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const [isDark, setIsDark]       = useState(
    () => document.documentElement.classList.contains('dark'),
  );

  useEffect(() => {
    getProviders().then(setProviders).finally(() => setLoading(false));
  }, []);

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
    ? providers.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.location?.city?.toLowerCase().includes(search.toLowerCase()),
      )
    : providers;

  // ── Contenido del panel (compartido desktop / mobile) ─────────────────────

  const panelContent = selected ? (
    /* DETALLE */
    <>
      {/* Volver al listado — sticky top */}
      <div className="sticky top-0 z-10 bg-white dark:bg-card-dark px-4 py-3 border-b border-gray-100 dark:border-input-border-dark">
        <button
          onClick={() => setSelected(null)}
          className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Volver al listado completo
        </button>
      </div>

      {/* Foto */}
      <div className="h-44 bg-gray-200 dark:bg-elevated-dark relative">
        <img
          src={TYPE_PHOTO[selected.type] ?? TYPE_PHOTO.shop}
          alt={selected.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2 flex gap-1.5">
          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest shadow-sm ${TYPE_BADGE[selected.type] ?? TYPE_BADGE.shop}`}>
            {TYPE_LABELS[selected.type] ?? selected.type}
          </span>
          {selected.is_verified && (
            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-white/90 dark:bg-black/80 shadow-sm">
              Verificado
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-bold text-base leading-tight text-gray-900 dark:text-white">{selected.name}</h2>
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
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{selected.description}</p>
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
    /* LISTA */
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

      {!loading && filtered.map((p) => (
        <button
          key={p.id}
          onClick={() => handleSelect(p)}
          className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-elevated-dark transition-colors flex items-center gap-3 group border-b border-gray-100 dark:border-input-border-dark last:border-0"
        >
          <div className="size-12 rounded-xl overflow-hidden bg-gray-100 dark:bg-elevated-dark shrink-0">
            <img
              src={TYPE_PHOTO[p.type] ?? TYPE_PHOTO.shop}
              alt={p.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-1.5 mb-0.5">
              <p className="font-semibold text-sm leading-tight truncate text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                {p.name}
              </p>
              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase shrink-0 ${TYPE_BADGE_SM[p.type] ?? TYPE_BADGE_SM.shop}`}>
                {TYPE_LABELS[p.type]?.substring(0, 3) ?? p.type.substring(0, 3)}
              </span>
            </div>
            {p.location && (
              <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{p.location.city}</p>
            )}
            <div className="flex items-center gap-1 mt-1">
              <span className="text-primary text-[11px] font-bold">
                ★ {Number(p.average_rating).toFixed(1)}
              </span>
              <span className="text-gray-300 dark:text-gray-600 text-[10px]">·</span>
              <span className="text-[11px] text-gray-500 dark:text-gray-400">{p.total_reviews} reseñas</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-gray-400 text-[18px] shrink-0 group-hover:text-primary transition-colors">
            chevron_right
          </span>
        </button>
      ))}
    </>
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="relative h-screen overflow-hidden bg-slate-300 dark:bg-background-dark">

      {/* ════════════════════════════════════════════════════════
          MAPA — width fija: inset-0 en mobile, left-72 en desktop
          → Leaflet NUNCA necesita redimensionar
      ════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 lg:left-72">
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

        {/* ── Header flotante centrado sobre el mapa ─────── */}
        <header className="absolute top-4 inset-x-0 z-[1001] flex justify-center px-4">
          <div className="w-full max-w-lg bg-white/95 dark:bg-[#1C1F26]/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/60 dark:border-input-border-dark flex items-center px-3 py-2.5 gap-2">

            {/* ← Volver — siempre visible, centrado con el resto */}
            <Link
              to="/talleres"
              className="flex items-center gap-1 pr-3 border-r border-gray-200 dark:border-input-border-dark text-gray-700 dark:text-gray-200 hover:text-primary transition-colors shrink-0"
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

      {/* ════════════════════════════════════════════════════════
          SIDEBAR DESKTOP — absolute left, width fija w-72
          → no afecta el ancho del mapa
      ════════════════════════════════════════════════════════ */}
      <aside className="hidden lg:flex flex-col absolute left-0 top-0 bottom-0 w-72 z-[1001] bg-white dark:bg-card-dark border-r border-gray-100 dark:border-input-border-dark shadow-md">

        {/* Header — siempre visible */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-gray-100 dark:border-input-border-dark shrink-0">
          <div>
            <p className="font-bold text-sm text-gray-900 dark:text-white">Talleres y Mecánicos</p>
            <p className="text-[11px] text-gray-500 leading-none mt-0.5">
              {loading ? 'Cargando...' : `${filtered.length} resultados · Córdoba`}
            </p>
          </div>
          <button
            onClick={() => setPanelOpen(!panelOpen)}
            className="size-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-elevated-dark hover:text-gray-800 dark:hover:text-white transition-colors"
            title={panelOpen ? 'Contraer lista' : 'Expandir lista'}
          >
            <span className="material-symbols-outlined text-[20px]">
              {panelOpen ? 'expand_less' : 'expand_more'}
            </span>
          </button>
        </div>

        {/* Body — colapsa verticalmente, ancho nunca cambia */}
        <div
          className="overflow-hidden transition-[height] duration-300 ease-in-out"
          style={{ height: panelOpen ? 'calc(100vh - 3.5rem)' : '0px' }}
        >
          <div className="h-[calc(100vh-3.5rem)] overflow-y-auto">
            {panelContent}
          </div>
        </div>
      </aside>

      {/* ════════════════════════════════════════════════════════
          BOTTOM DRAWER MOBILE — fixed, overlay sobre el mapa
          → no afecta la altura del mapa
      ════════════════════════════════════════════════════════ */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-[1001]">
        <div
          className="bg-white dark:bg-card-dark rounded-t-2xl shadow-2xl border-t border-gray-100 dark:border-input-border-dark transition-transform duration-300 ease-in-out"
          style={{ transform: panelOpen ? 'translateY(0)' : 'translateY(calc(100% - 4rem))' }}
        >
          {/* Peek strip — siempre visible */}
          <button
            className="w-full px-4 pt-2.5 pb-3 flex flex-col items-center"
            onClick={() => setPanelOpen(!panelOpen)}
          >
            {/* Handle */}
            <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mb-2" />
            {/* Title row */}
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
            className="overflow-hidden transition-[max-height] duration-300 ease-in-out border-t border-gray-100 dark:border-input-border-dark"
            style={{ maxHeight: panelOpen ? '55vh' : '0px' }}
          >
            <div className="overflow-y-auto max-h-[55vh]">
              {panelContent}
            </div>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background-light dark:bg-background-dark z-[1002]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
        </div>
      )}

      <style>{`.filled { font-variation-settings: 'FILL' 1; }`}</style>
    </div>
  );
}
