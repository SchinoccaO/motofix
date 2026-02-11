import { Link, useSearchParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Logo from "../components/Logo";
import Footer from "../components/Footer";
import { getProviders, getStoredUser, logout, type Provider, type AuthUser } from "../services/api";

const TYPE_LABELS: Record<string, string> = {
  shop: "Taller",
  mechanic: "Mecanico",
  parts_store: "Repuestos",
};

const TYPE_BADGE_STYLES: Record<string, string> = {
  shop: "bg-primary text-[#181611]",
  mechanic: "bg-blue-500 text-white",
  parts_store: "bg-[#181611] text-white",
};

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

export default function BuscarTalleres() {
  const [searchParams] = useSearchParams();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || "");
  const [typeFilter, setTypeFilter] = useState<string>(searchParams.get('type') || "");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [failedLogos, setFailedLogos] = useState<Set<string>>(new Set());
  const brandScrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragScrollLeft, setDragScrollLeft] = useState(0);
  const [wasDragging, setWasDragging] = useState(false);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  const fetchProviders = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: Record<string, string> = {};
      if (typeFilter) params.type = typeFilter;
      if (searchTerm) params.search = searchTerm;
      const data = await getProviders(params);
      setProviders(data);
    } catch (err) {
      setError("No se pudieron cargar los negocios. Verifica que el servidor este corriendo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, [typeFilter, selectedBrand]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProviders();
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

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "bg-green-50 dark:bg-green-900/30 text-green-600";
    if (rating >= 3.5) return "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600";
    return "bg-red-50 dark:bg-red-900/30 text-red-600";
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-[#181611] dark:text-gray-100 min-h-screen font-display">
      {/* Simple Navbar */}
      <header className="sticky top-0 z-50 bg-background-light dark:bg-background-dark border-b border-[#f4f3f0] dark:border-gray-800">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3">
              <Logo />
              <h2 className="text-xl font-bold tracking-tight">MotoFIX</h2>
            </Link>
            <form onSubmit={handleSearch} className="hidden md:flex w-80">
              <label className="relative w-full">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="material-symbols-outlined text-gray-400">
                    search
                  </span>
                </span>
                <input
                  className="block w-full rounded-lg border-none bg-[#f4f3f0] dark:bg-gray-800 py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="Buscar talleres o repuestos..."
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </label>
            </form>
          </div>
          <nav className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-6">
              <Link
                to="/registro-taller"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Registrar taller
              </Link>
              <Link
                to="/talleres"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Dejar resena
              </Link>
            </div>
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm font-bold px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-bold px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Ingresar
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-bold px-4 py-2 rounded-lg bg-primary hover:bg-[#d6aa28] text-[#181611] transition-colors"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Encuentra los mejores especialistas
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {loading
              ? "Cargando negocios..."
              : `Explora ${providers.length} negocios de confianza.`}
          </p>
        </div>

        {/* Popular Brands */}
        <div className="mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">
            Marcas Populares
          </h3>
          <div className="relative group/carousel">
            {/* Left Arrow */}
            <button
              onClick={() => scrollBrands("left")}
              className="absolute left-0 top-[32px] -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 -translate-x-2"
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
                        ? "shadow-lg ring-2 ring-offset-2 bg-white dark:bg-gray-700"
                        : "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-md"
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
              {/* "Más" button */}
              <div className="flex flex-col items-center gap-2 min-w-[80px] cursor-pointer group/more">
                <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center group-hover/more:border-primary group-hover/more:shadow-md transition-all">
                  <span className="material-symbols-outlined text-gray-400 group-hover/more:text-primary transition-colors">
                    add
                  </span>
                </div>
                <span className="text-xs font-medium">Más</span>
              </div>
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => scrollBrands("right")}
              className="absolute right-0 top-[32px] -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 translate-x-2"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>

          {/* Selected brand indicator */}
          {selectedBrand && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-gray-500">Filtrando por:</span>
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

        {/* Filters Bar */}
        <div className="flex items-center gap-3 overflow-x-auto pb-6 no-scrollbar border-b border-gray-100 dark:border-gray-800 mb-8">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-[#181611] font-semibold text-sm shadow-sm transition-all hover:bg-[#c09923]">
            <span className="material-symbols-outlined text-[18px]">
              location_on
            </span>
            Cerca de mi
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium hover:border-primary transition-all">
            Abierto ahora
            <span className="material-symbols-outlined text-[18px]">
              expand_more
            </span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium hover:border-primary transition-all">
            Mas valorados
            <span className="material-symbols-outlined text-[18px]">
              expand_more
            </span>
          </button>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 shrink-0 space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">Filtros</h3>
                <button
                  className="text-xs text-primary font-bold hover:underline"
                  onClick={() => {
                    setTypeFilter("");
                    setSearchTerm("");
                    setSelectedBrand(null);
                  }}
                >
                  Limpiar
                </button>
              </div>

              {/* Business Type Filter */}
              <div className="space-y-4 mb-8">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
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
                            : "border-gray-300 dark:border-gray-600 group-hover:border-primary"
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
              <div className="space-y-4 mb-8">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Calificacion Minima
                </h4>
                <div className="space-y-2">
                  {[
                    { label: "Todas", value: "all" },
                    { label: "4.5 o mas", value: "4.5" },
                    { label: "4.0 o mas", value: "4.0" },
                    { label: "3.5 o mas", value: "3.5" },
                  ].map((rating, idx) => (
                    <label
                      key={rating.value}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        defaultChecked={idx === 0}
                        className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 text-primary focus:ring-primary rounded-full cursor-pointer"
                        name="rating"
                        type="radio"
                      />
                      <span className="text-sm font-medium">
                        {rating.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Map Preview */}
            <div className="rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 h-48 relative group cursor-pointer">
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700"></div>
              <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-white">
                <span className="material-symbols-outlined text-3xl mb-1">
                  map
                </span>
                <span className="font-bold text-sm">Ver en Mapa</span>
              </div>
            </div>
          </aside>

          {/* Providers Grid */}
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

            {!loading && !error && providers.length === 0 && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-12 text-center">
                <span className="material-symbols-outlined text-gray-400 text-5xl mb-3 block">
                  search_off
                </span>
                <h3 className="font-bold text-lg mb-1">
                  No se encontraron resultados
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Intenta con otros filtros o terminos de busqueda.
                </p>
              </div>
            )}

            {!loading && !error && providers.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {providers.map((provider) => (
                  <Link
                    key={provider.id}
                    to={`/taller/${provider.id}`}
                    className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="h-48 relative overflow-hidden bg-gray-200 dark:bg-gray-700">
                      <img
                        src={
                          provider.type === 'shop'
                            ? 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&h=400&fit=crop'
                            : provider.type === 'mechanic'
                            ? 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&h=400&fit=crop'
                            : 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop'
                        }
                        alt={provider.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span
                          className={`${
                            TYPE_BADGE_STYLES[provider.type] ||
                            "bg-primary text-[#181611]"
                          } px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest shadow-sm`}
                        >
                          {TYPE_LABELS[provider.type] || provider.type}
                        </span>
                        {provider.is_verified && (
                          <span className="bg-white/90 dark:bg-black/90 px-2 py-1 rounded text-[10px] font-bold shadow-sm">
                            Verificado
                          </span>
                        )}
                      </div>
                      <button className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-red-500 transition-all">
                        <span className="material-symbols-outlined text-[20px]">
                          favorite
                        </span>
                      </button>
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                          {provider.name}
                        </h3>
                        <div
                          className={`flex items-center gap-1 ${getRatingColor(
                            Number(provider.average_rating)
                          )} px-2 py-0.5 rounded-lg`}
                        >
                          <span className="text-sm font-bold">
                            {Number(provider.average_rating).toFixed(1)}
                          </span>
                          <span className="material-symbols-outlined text-[14px] filled">
                            star
                          </span>
                        </div>
                      </div>
                      {provider.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                          {provider.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400 mb-6 border-y border-gray-50 dark:border-gray-700 py-3">
                        {provider.location && (
                          <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[16px]">
                              location_on
                            </span>
                            <span>
                              {provider.location.city},{" "}
                              {provider.location.province}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px]">
                            chat
                          </span>
                          <span>{provider.total_reviews} resenas</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1 bg-primary text-[#181611] font-bold py-2.5 rounded-lg text-sm transition-all hover:bg-[#c09923] text-center cursor-pointer">
                          Ver Perfil
                        </div>
                        <button
                          className="p-2.5 rounded-lg bg-[#f4f3f0] dark:bg-gray-700 text-[#181611] dark:text-gray-100 hover:bg-gray-200 transition-colors"
                          onClick={(e) => e.preventDefault()}
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            chat_bubble
                          </span>
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Mobile Map Button */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 lg:hidden">
        <button className="bg-primary text-[#181611] font-bold px-6 py-3 rounded-full shadow-xl flex items-center gap-2 hover:scale-105 transition-transform">
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
