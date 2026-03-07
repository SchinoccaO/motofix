import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useMemo } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getProviders, type Provider } from "../services/api";
import { isOpenNow, getHorariosSemana, getDiaArgentina, type Horarios } from "../utils/horarios";

// Etiquetas legibles para mostrar en la UI según el tipo de negocio del backend
const TYPE_LABELS: Record<string, string> = {
  shop: "Taller",
  mechanic: "Mecanico",
  parts_store: "Repuestos",
};

// ─── ESTILOS DE BADGES POR TIPO ───────────────────────────────────────────────
// Colores de los badges que aparecen sobre la foto de cada card.
// 🔧 Cambiar aquí si se quiere otro color por tipo de negocio.
//   shop        → amarillo primary (taller mecánico)
//   mechanic    → azul           (mecánico independiente)
//   parts_store → negro          (casa de repuestos)
const TYPE_BADGE_STYLES: Record<string, string> = {
  shop: "bg-primary text-[#181611]",
  mechanic: "bg-blue-500 text-white",
  parts_store: "bg-[#181611] text-white",
};

// ─── MARCAS DEL CARRUSEL ──────────────────────────────────────────────────────
// 🔧 Agregar o quitar marcas aquí. Cada objeto necesita:
//   name  → texto que aparece debajo del logo y que se usa como término de búsqueda
//   logo  → URL del logo (se usa Clearbit como CDN gratuito de logos)
//   color → color de la marca, usado para el ring del badge activo y el texto seleccionado
// Si el logo falla al cargar, se muestra las primeras 3 letras del nombre con ese color.
const BRANDS = [
  { name: "Honda", logo: "https://logo.clearbit.com/honda.com", color: "#E40521" },
  { name: "Yamaha", logo: "https://logo.clearbit.com/yamaha-motor.com", color: "#0033A0" },
  { name: "Kawasaki", logo: "https://logo.clearbit.com/kawasaki.com", color: "#6BBE44" },
  { name: "Suzuki", logo: "https://logo.clearbit.com/globalsuzuki.com", color: "#E30613" },
  { name: "BMW", logo: "https://logo.clearbit.com/bmw.com", color: "#0066B1" },
  { name: "Ducati", logo: "https://logo.clearbit.com/ducati.com", color: "#CC0000" },
  { name: "KTM", logo: "https://logo.clearbit.com/ktm.com", color: "#FF6600" },
  { name: "Bajaj", logo: "https://logo.clearbit.com/bajajauto.com", color: "#003DA5" },
  { name: "Harley-Davidson", logo: "https://logo.clearbit.com/harley-davidson.com", color: "#F26522" },
  { name: "Royal Enfield", logo: "https://logo.clearbit.com/royalenfield.com", color: "#87190D" },
  { name: "Benelli", logo: "https://logo.clearbit.com/benelli.com", color: "#1B365D" },
  { name: "Aprilia", logo: "https://logo.clearbit.com/aprilia.com", color: "#B71234" },
];

// ─── HORARIOS MINI ────────────────────────────────────────────────────────────
// Muestra el horario del día actual con un badge abierto/cerrado.
// Al pulsar "Ver horarios" expande una tabla 2 columnas lunes→domingo.
// IMPORTANTE: el botón llama a e.stopPropagation() para no activar el Link padre.

function HorariosMini({
  horarios,
  override,
}: {
  horarios: Horarios | null | undefined;
  override?: boolean | null;
}) {
  const [expanded, setExpanded] = useState(false);

  if (!horarios) return null;

  const { open, opensAt } = isOpenNow(horarios, override);
  const hoy = getDiaArgentina();
  const semana = getHorariosSemana(horarios);
  const hoyHorario = semana.find((d) => d.dia === hoy)?.horario;

  // Si ningún día tiene horario configurado, no mostrar nada
  if (!semana.some((d) => d.horario?.abre)) return null;

  return (
    <div className="border-t border-gray-100 dark:border-input-border-dark pt-3 mt-3">
      {/* ── Fila compacta: status + horas hoy + trigger expandir ── */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setExpanded((v) => !v);
        }}
        className="w-full flex items-center justify-between gap-2 group/hor text-left"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-2 min-w-0 overflow-hidden">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              open ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span
            className={`text-xs font-semibold shrink-0 ${
              open
                ? "text-green-600 dark:text-green-400"
                : "text-red-500 dark:text-red-400"
            }`}
          >
            {open ? "Abierto" : opensAt ? `Abre ${opensAt}` : "Cerrado hoy"}
          </span>
          {hoyHorario?.abre && (
            <span className="text-xs text-gray-400 dark:text-gray-500 truncate">
              · {hoyHorario.abre}–{hoyHorario.cierra}
            </span>
          )}
        </div>
        <span className="flex items-center gap-0.5 text-[11px] text-gray-400 dark:text-gray-500 group-hover/hor:text-primary transition-colors shrink-0 ml-1">
          Ver horarios
          <span
            className={`material-symbols-outlined text-[15px] transition-transform duration-200 ${
              expanded ? "rotate-180" : ""
            }`}
          >
            expand_more
          </span>
        </span>
      </button>

      {/* ── Vista expandida: grilla 2 columnas ── */}
      {expanded && (
        <div className="mt-2 grid grid-cols-2 gap-x-5 gap-y-0.5 pb-1">
          {semana.map(({ dia, label, horario }) => {
            const isHoy = dia === hoy;
            return (
              <div
                key={dia}
                className={`flex items-center justify-between text-[11px] py-0.5 ${
                  isHoy
                    ? "font-bold text-text-main dark:text-white"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              >
                <span className={isHoy ? "text-primary" : ""}>{label.slice(0, 3)}</span>
                <span>
                  {horario?.abre ? `${horario.abre}–${horario.cierra}` : "—"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Haversine distance (km) ──────────────────────────────────────────────────
function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function BuscarTalleres() {
  const [searchParams] = useSearchParams();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || "");
  const [typeFilter, setTypeFilter] = useState<string>(searchParams.get('type') || "");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [failedLogos, setFailedLogos] = useState<Set<string>>(new Set());
  const brandScrollRef = useRef<HTMLDivElement>(null);

  // ─── Filtros rápidos ─────────────────────────────────────────────────────────
  const [filterOpenNow, setFilterOpenNow] = useState(false);
  const [sortByRating, setSortByRating]   = useState(false);
  const [minRating, setMinRating]         = useState<number>(0);
  const [userLocation, setUserLocation]   = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [sortByNearby, setSortByNearby]   = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragScrollLeft, setDragScrollLeft] = useState(0);
  const [wasDragging, setWasDragging] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage]   = useState(1);
  const [totalPages,  setTotalPages]    = useState(1);
  const [totalCount,  setTotalCount]    = useState(0);
  const navigate = useNavigate();

  const fetchProviders = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const result = await getProviders({
        ...(typeFilter && { type: typeFilter }),
        ...(searchTerm && { search: searchTerm }),
        page,
        limit: 20,
      });
      setProviders(result.data);
      setCurrentPage(result.page ?? 1);
      setTotalPages(result.totalPages ?? 1);
      setTotalCount(result.total ?? result.data.length);
    } catch (err) {
      setError("No se pudieron cargar los negocios. Verifica que el servidor este corriendo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchProviders(1);
  }, [typeFilter, selectedBrand]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProviders(1);
  };

  // Brand carousel handlers
  const handleBrandMouseDown = (e: React.MouseEvent) => {
    if (!brandScrollRef.current) return;
    setIsDragging(true);
    setWasDragging(false);
    setDragStartX(e.pageX - brandScrollRef.current.offsetLeft);
    setDragScrollLeft(brandScrollRef.current.scrollLeft);
  };

  const handleBrandMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !brandScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - brandScrollRef.current.offsetLeft;
    const walk = (x - dragStartX) * 1.5;
    if (Math.abs(walk) > 5) setWasDragging(true);
    brandScrollRef.current.scrollLeft = dragScrollLeft - walk;
  };

  const handleBrandMouseUp = () => {
    setIsDragging(false);
  };

  const scrollBrands = (direction: "left" | "right") => {
    if (brandScrollRef.current) {
      brandScrollRef.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  const handleBrandClick = (brandName: string) => {
    if (wasDragging) {
      setWasDragging(false);
      return;
    }
    if (selectedBrand === brandName) {
      setSelectedBrand(null);
      setSearchTerm("");
    } else {
      setSelectedBrand(brandName);
      setSearchTerm(brandName);
    }
  };

  // ─── Geolocalización ─────────────────────────────────────────────────────────
  const handleNearby = () => {
    if (sortByNearby) {
      setSortByNearby(false);
      return;
    }
    if (userLocation) {
      setSortByNearby(true);
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setSortByNearby(true);
        setLocationLoading(false);
      },
      () => {
        setLocationLoading(false);
        alert('No se pudo obtener tu ubicación. Verificá los permisos del navegador.');
      }
    );
  };

  // ─── Lista final con filtros y orden client-side ──────────────────────────────
  const displayedProviders = useMemo(() => {
    let list = [...providers];

    // Filtro: abierto ahora
    if (filterOpenNow) {
      list = list.filter((p) => {
        const { open } = isOpenNow(p.horarios ?? null, p.is_open_override);
        return open;
      });
    }

    // Filtro: calificación mínima
    if (minRating > 0) {
      list = list.filter((p) => p.average_rating >= minRating);
    }

    // Orden: más valorados
    if (sortByRating) {
      list.sort((a, b) => b.average_rating - a.average_rating || b.total_reviews - a.total_reviews);
    }

    // Orden: más cercanos (requiere location del provider)
    if (sortByNearby && userLocation) {
      list.sort((a, b) => {
        const dA = a.location
          ? distanceKm(userLocation.lat, userLocation.lng, a.location.latitude ?? 0, a.location.longitude ?? 0)
          : Infinity;
        const dB = b.location
          ? distanceKm(userLocation.lat, userLocation.lng, b.location.latitude ?? 0, b.location.longitude ?? 0)
          : Infinity;
        return dA - dB;
      });
    }

    return list;
  }, [providers, filterOpenNow, minRating, sortByRating, sortByNearby, userLocation]);

  return (
    <div className="bg-background-light dark:bg-background-dark text-[#181611] dark:text-gray-100 min-h-screen font-display">
      <Navbar activePage="talleres" />

      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* ─── BARRA DE BÚSQUEDA MOBILE ─────────────────────────────────────────
            Input de texto que filtra providers por nombre. El submit llama a fetchProviders().
            En desktop se oculta o pasa a segundo plano — los filtros laterales toman protagonismo. */}
        <form onSubmit={handleSearch} className="mb-4">
          <label className="relative w-full block">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="material-symbols-outlined text-gray-400">search</span>
            </span>
            <input
              className="block w-full rounded-lg border-none bg-[#f4f3f0] dark:bg-card-dark dark:text-white py-3 pl-10 pr-3 text-sm placeholder-gray-500 focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="Buscar talleres o repuestos..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </label>
        </form>

        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
            Encuentra los mejores especialistas
          </h1>
          <p className="text-gray-700 dark:text-gray-400 text-sm sm:text-base">
            {loading
              ? "Cargando negocios..."
              : `Mostrando ${displayedProviders.length}${totalCount > providers.length ? ` de ${totalCount}` : ''} negocios.`}
          </p>
        </div>

        {/* ─── CARRUSEL DE MARCAS POPULARES ────────────────────────────────────
            Muestra las marcas del array BRANDS. Click en una marca filtra los providers
            por nombre usando setSearchTerm(brandName). Soporta drag para desplazarse
            en mobile. El flag wasDragging evita que un drag cuente como click. */}
        <div className="mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-600 mb-4">
            Marcas Populares
          </h3>
          <div className="relative group/carousel">
            {/* Left Arrow */}
            <button
              onClick={() => scrollBrands("left")}
              className="absolute left-0 top-[32px] -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white dark:bg-card-dark shadow-lg border border-gray-200 dark:border-input-border-dark flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200 hover:bg-gray-50 dark:hover:bg-elevated-dark -translate-x-2"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>

            {/* Scrollable Container */}
            <div
              ref={brandScrollRef}
              className={`flex gap-4 overflow-x-auto pb-2 no-scrollbar scroll-smooth px-1 select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
              onMouseDown={handleBrandMouseDown}
              onMouseMove={handleBrandMouseMove}
              onMouseUp={handleBrandMouseUp}
              onMouseLeave={handleBrandMouseUp}
            >
              {BRANDS.map((brand) => (
                <div
                  key={brand.name}
                  onClick={() => handleBrandClick(brand.name)}
                  className={`flex flex-col items-center gap-2 min-w-[80px] cursor-pointer transition-all duration-200 ${
                    selectedBrand === brand.name ? "scale-110" : "hover:scale-105"
                  }`}
                >
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                      selectedBrand === brand.name
                        ? "shadow-lg ring-2 ring-offset-2 bg-white dark:bg-elevated-dark"
                        : "bg-white dark:bg-card-dark border border-gray-100 dark:border-input-border-dark hover:shadow-md"
                    }`}
                    style={
                      selectedBrand === brand.name
                        ? ({ "--tw-ring-color": brand.color } as React.CSSProperties)
                        : {}
                    }
                  >
                    {!failedLogos.has(brand.name) ? (
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="w-10 h-10 object-contain pointer-events-none"
                        draggable={false}
                        loading="lazy"
                        onError={() =>
                          setFailedLogos((prev) => new Set(prev).add(brand.name))
                        }
                      />
                    ) : (
                      <span
                        className="text-sm font-black"
                        style={{ color: brand.color }}
                      >
                        {brand.name.substring(0, 3)}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium text-center leading-tight transition-colors whitespace-nowrap ${
                      selectedBrand === brand.name ? "font-bold" : ""
                    }`}
                    style={
                      selectedBrand === brand.name ? { color: brand.color } : {}
                    }
                  >
                    {brand.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => scrollBrands("right")}
              className="absolute right-0 top-[32px] -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white dark:bg-card-dark shadow-lg border border-gray-200 dark:border-input-border-dark flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200 hover:bg-gray-50 dark:hover:bg-elevated-dark translate-x-2"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>

          {/* Selected brand indicator */}
          {selectedBrand && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-gray-600">Filtrando por:</span>
              <span className="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 text-primary px-3 py-1 rounded-full text-xs font-bold">
                {selectedBrand}
                <button
                  onClick={() => handleBrandClick(selectedBrand)}
                  className="ml-1 hover:text-red-500 transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </span>
            </div>
          )}
        </div>

        {/* ─── BARRA DE FILTROS RÁPIDOS ─────────────────────────────────────────*/}
        <div className="flex items-center gap-3 overflow-x-auto pb-6 no-scrollbar border-b border-gray-100 dark:border-elevated-dark mb-8">
          <button
            onClick={handleNearby}
            disabled={locationLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all whitespace-nowrap ${
              sortByNearby
                ? 'bg-primary text-[#181611] hover:bg-primary-hover'
                : 'bg-white dark:bg-card-dark border border-gray-200 dark:border-input-border-dark hover:border-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {locationLoading ? 'sync' : 'location_on'}
            </span>
            {locationLoading ? 'Localizando...' : 'Cerca de mí'}
          </button>
          <button
            onClick={() => setFilterOpenNow((v) => !v)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all whitespace-nowrap ${
              filterOpenNow
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-white dark:bg-card-dark border border-gray-200 dark:border-input-border-dark hover:border-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">schedule</span>
            Abierto ahora
          </button>
          <button
            onClick={() => setSortByRating((v) => !v)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all whitespace-nowrap ${
              sortByRating
                ? 'bg-primary text-[#181611] hover:bg-primary-hover'
                : 'bg-white dark:bg-card-dark border border-gray-200 dark:border-input-border-dark hover:border-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            Más valorados
          </button>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-gray-200 dark:border-input-border-dark bg-white dark:bg-card-dark text-sm font-medium hover:border-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
          </button>

          {/* Sidebar Filters */}
          <aside className={`w-full lg:w-64 shrink-0 space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-input-border-dark">
              <h3 className="font-bold text-base">Filtros</h3>
              <button
                className="text-xs text-primary font-bold hover:underline"
                onClick={() => {
                  setTypeFilter("");
                  setSearchTerm("");
                  setSelectedBrand(null);
                  setFilterOpenNow(false);
                  setSortByRating(false);
                  setSortByNearby(false);
                  setMinRating(0);
                }}
              >
                Limpiar
              </button>
            </div>

              {/* Business Type Filter */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600">
                  Tipo de Negocio
                </h4>
                <div className="space-y-2">
                  {[
                    { label: "Todos", value: "" },
                    { label: "Talleres Mecanicos", value: "shop" },
                    { label: "Mecanicos", value: "mechanic" },
                    { label: "Casas de Repuestos", value: "parts_store" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-3 cursor-pointer group"
                      onClick={() => setTypeFilter(option.value)}
                    >
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          typeFilter === option.value
                            ? "border-primary bg-primary"
                            : "border-gray-300 dark:border-input-border-dark group-hover:border-primary"
                        }`}
                      >
                        {typeFilter === option.value && (
                          <span className="material-symbols-outlined text-white text-[16px] font-bold">
                            check
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-medium">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600">
                  Calificación Mínima
                </h4>
                <div className="space-y-2">
                  {[
                    { label: "Todas", value: 0 },
                    { label: "4.5 o mas", value: 4.5 },
                    { label: "4.0 o mas", value: 4.0 },
                    { label: "3.5 o mas", value: 3.5 },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-3 cursor-pointer group"
                      onClick={() => setMinRating(option.value)}
                    >
                      <input
                        checked={minRating === option.value}
                        onChange={() => setMinRating(option.value)}
                        className="w-5 h-5 border-2 border-gray-300 dark:border-input-border-dark text-primary focus:ring-primary rounded-full cursor-pointer"
                        name="rating"
                        type="radio"
                      />
                      <span className="text-sm font-medium">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

            {/* Map Preview — tile estático de Córdoba */}
            <div
              onClick={() => navigate('/mapa')}
              className="rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-input-border-dark h-48 relative group cursor-pointer hover:border-primary transition-colors"
              aria-label="Ver mapa interactivo de talleres"
            >
              {/* Tile real de Córdoba (Carto Voyager z=12) */}
              <div
                className="absolute inset-0 bg-cover bg-center scale-105 group-hover:scale-110 transition-transform duration-500"
                style={{ backgroundImage: 'url(https://a.basemaps.cartocdn.com/rastertiles/voyager/12/1317/2421.png)' }}
              />
              {/* Overlay degradado */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-colors" />
              {/* CTA */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <div className="size-10 rounded-full bg-primary/90 flex items-center justify-center mb-2 shadow-lg group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[#181611] text-xl">map</span>
                </div>
                <span className="font-bold text-sm">Ver en Mapa</span>
                <span className="text-[11px] text-white/70 mt-0.5">Córdoba, Argentina</span>
              </div>
            </div>
          </aside>

          {/* ─── GRILLA DE CARDS DE PROVEEDORES ──────────────────────────────
              Muestra los providers filtrados en grilla 1 columna (mobile) / 2 columnas (md+).
              Cada card es un <Link> al perfil /taller/:id.
              La imagen se asigna por tipo usando Unsplash — no hay fotos reales todavía. */}
          <div className="flex-1">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center mb-6">
                <span className="material-symbols-outlined text-red-500 text-3xl mb-2 block">
                  error
                </span>
                <p className="text-red-600 dark:text-red-400 font-medium">
                  {error}
                </p>
              </div>
            )}

            {loading && (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              </div>
            )}

            {!loading && !error && displayedProviders.length === 0 && (
              <div className="bg-gray-50 dark:bg-card-dark rounded-xl p-12 text-center">
                <span className="material-symbols-outlined text-gray-400 text-5xl mb-3 block">
                  search_off
                </span>
                <h3 className="font-bold text-lg mb-1">
                  No se encontraron resultados
                </h3>
                <p className="text-gray-700 dark:text-gray-400 text-sm">
                  Intenta con otros filtros o terminos de busqueda.
                </p>
              </div>
            )}

            {!loading && !error && displayedProviders.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayedProviders.map((provider) => (
                  <Link
                    key={provider.id}
                    to={`/taller/${provider.id}`}
                    className="bg-white dark:bg-card-dark rounded-xl overflow-hidden border border-gray-100 dark:border-input-border-dark shadow-sm hover:shadow-md transition-all group flex flex-col"
                  >
                    {/* ── Imagen con badges y rating overlay ── */}
                    <div className="h-44 relative overflow-hidden bg-gray-200 dark:bg-elevated-dark shrink-0">
                      <img
                        src={
                          provider.type === "shop"
                            ? "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&h=400&fit=crop"
                            : provider.type === "mechanic"
                            ? "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&h=400&fit=crop"
                            : "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop"
                        }
                        alt={provider.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {/* Badges: tipo + verificado */}
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        <span
                          className={`${
                            TYPE_BADGE_STYLES[provider.type] || "bg-primary text-[#181611]"
                          } px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest shadow-sm`}
                        >
                          {TYPE_LABELS[provider.type] || provider.type}
                        </span>
                        {provider.is_verified && (
                          <span className="bg-green-500 text-white px-2 py-1 rounded text-[10px] font-bold shadow-sm flex items-center gap-1">
                            <span
                              className="material-symbols-outlined text-[11px]"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              verified
                            </span>
                            Verificado
                          </span>
                        )}
                      </div>
                      {/* Rating overlay bottom-left */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/65 to-transparent px-4 pt-6 pb-3">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="material-symbols-outlined text-[15px] text-yellow-400"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            star
                          </span>
                          <span className="text-white font-bold text-sm">
                            {Number(provider.average_rating).toFixed(1)}
                          </span>
                          <span className="text-white/70 text-xs">
                            ({provider.total_reviews}{" "}
                            {provider.total_reviews === 1 ? "reseña" : "reseñas"})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* ── Cuerpo de la card ── */}
                    <div className="p-4 flex flex-col flex-1">
                      {/* Nombre */}
                      <h3 className="font-bold text-base leading-tight group-hover:text-primary transition-colors line-clamp-1 mb-1">
                        {provider.name}
                      </h3>

                      {/* Descripción (2 líneas máx) */}
                      {provider.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2 leading-relaxed">
                          {provider.description}
                        </p>
                      )}

                      {/* Ubicación */}
                      {provider.location && (
                        <p className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 mb-1">
                          <span className="material-symbols-outlined text-[13px]">location_on</span>
                          {provider.location.city}, {provider.location.province}
                        </p>
                      )}

                      {/* Teléfono */}
                      {provider.phone && (
                        <p className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                          <span className="material-symbols-outlined text-[13px]">call</span>
                          {provider.phone}
                        </p>
                      )}

                      {/* Horarios con expand */}
                      <HorariosMini
                        horarios={provider.horarios}
                        override={provider.is_open_override}
                      />

                      {/* ── Acciones ── */}
                      <div className="flex gap-2 mt-4">
                        {/* Ver Perfil (primary) */}
                        <div className="flex-1 bg-primary hover:bg-primary-hover text-[#181611] font-bold py-2.5 rounded-lg text-sm text-center transition-colors cursor-pointer">
                          Ver Perfil
                        </div>
                        {/* Ver en Mapa */}
                        <button
                          type="button"
                          title="Ver en Mapa"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            navigate(`/mapa?taller=${provider.id}`);
                          }}
                          className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-gray-100 dark:bg-elevated-dark text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-[#181611] border border-gray-200 dark:border-input-border-dark transition-colors text-xs font-semibold"
                        >
                          <span className="material-symbols-outlined text-[17px]">map</span>
                          <span className="hidden sm:inline">Mapa</span>
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* ─── Paginación ────────────────────────────────────────────────── */}
            {!loading && !error && totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => { const p = currentPage - 1; setCurrentPage(p); fetchProviders(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-lg border border-gray-200 dark:border-input-border-dark bg-white dark:bg-card-dark flex items-center justify-center hover:border-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Página anterior"
                >
                  <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                  .reduce<(number | '...')[]>((acc, p, i, arr) => {
                    if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('...');
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === '...' ? (
                      <span key={`ellipsis-${i}`} className="w-10 h-10 flex items-center justify-center text-gray-400 text-sm">…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => { setCurrentPage(p as number); fetchProviders(p as number); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className={`w-10 h-10 rounded-lg text-sm font-semibold transition-colors ${
                          currentPage === p
                            ? 'bg-primary text-[#181611]'
                            : 'border border-gray-200 dark:border-input-border-dark bg-white dark:bg-card-dark hover:border-primary'
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}

                <button
                  onClick={() => { const p = currentPage + 1; setCurrentPage(p); fetchProviders(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-lg border border-gray-200 dark:border-input-border-dark bg-white dark:bg-card-dark flex items-center justify-center hover:border-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Página siguiente"
                >
                  <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Mobile Map Button */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 lg:hidden z-50">
        <button
          onClick={() => navigate('/mapa')}
          className="bg-primary text-[#181611] font-bold px-6 py-3 rounded-full shadow-xl flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <span className="material-symbols-outlined">map</span>
          Mapa
        </button>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .filled { font-variation-settings: 'FILL' 1; }
      `}</style>
    </div>
  );
}
