import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
import Footer from '../components/Footer'

export default function BuscarTalleres() {
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
            <div className="hidden md:flex w-80">
              <label className="relative w-full">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="material-symbols-outlined text-gray-400">search</span>
                </span>
                <input
                  className="block w-full rounded-lg border-none bg-[#f4f3f0] dark:bg-gray-800 py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="Buscar talleres o repuestos..."
                  type="text"
                />
              </label>
            </div>
          </div>
          <nav className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-6">
              <a className="text-sm font-medium hover:text-primary transition-colors" href="#">Talleres</a>
              <a className="text-sm font-medium hover:text-primary transition-colors" href="#">Repuestos</a>
              <Link to="/registro-taller" className="text-sm font-medium hover:text-primary transition-colors">Registrar taller</Link>
            </div>
          </nav>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Encuentra los mejores especialistas</h1>
          <p className="text-gray-500 dark:text-gray-400">Explora 124 negocios de confianza cerca de tu ubicación actual.</p>
        </div>

        {/* Popular Brands */}
        <div className="mb-8 overflow-hidden">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Marcas Populares</h3>
          <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
            {['Honda', 'Yamaha', 'Kawasaki', 'Suzuki', 'BMW', 'Ducati', 'KTM', 'Bajaj'].map((brand) => (
              <div key={brand} className="flex flex-col items-center gap-2 min-w-[72px] cursor-pointer group">
                <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center group-hover:border-primary group-hover:shadow-md transition-all">
                  <span className="text-xs font-bold text-gray-400">{brand.substring(0, 3)}</span>
                </div>
                <span className="text-xs font-medium">{brand}</span>
              </div>
            ))}
            <div className="flex flex-col items-center gap-2 min-w-[72px] cursor-pointer group">
              <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center group-hover:border-primary group-hover:shadow-md transition-all">
                <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">add</span>
              </div>
              <span className="text-xs font-medium">Más</span>
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex items-center gap-3 overflow-x-auto pb-6 no-scrollbar border-b border-gray-100 dark:border-gray-800 mb-8">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-[#181611] font-semibold text-sm shadow-sm transition-all hover:bg-[#c09923]">
            <span className="material-symbols-outlined text-[18px]">location_on</span>
            Cerca de mí
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium hover:border-primary transition-all">
            Abierto ahora
            <span className="material-symbols-outlined text-[18px]">expand_more</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium hover:border-primary transition-all">
            Más valorados
            <span className="material-symbols-outlined text-[18px]">expand_more</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium hover:border-primary transition-all">
            Económicos
            <span className="material-symbols-outlined text-[18px]">expand_more</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium hover:border-primary transition-all">
            Oficiales
          </button>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 shrink-0 space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">Filtros</h3>
                <button className="text-xs text-primary font-bold hover:underline">Limpiar</button>
              </div>

              {/* Business Type Filter */}
              <div className="space-y-4 mb-8">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Tipo de Negocio</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-5 h-5 rounded border-2 border-primary bg-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-[16px] font-bold">check</span>
                    </div>
                    <span className="text-sm font-medium">Todos</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 group-hover:border-primary transition-colors"></div>
                    <span className="text-sm font-medium">Talleres Mecánicos</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 group-hover:border-primary transition-colors"></div>
                    <span className="text-sm font-medium">Casas de Repuestos</span>
                  </label>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="space-y-4 mb-8">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Calificación Mínima</h4>
                <div className="space-y-2">
                  {[
                    { label: 'Todas', value: 'all' },
                    { label: '4.5 o más', value: '4.5' },
                    { label: '4.0 o más', value: '4.0' },
                    { label: '3.5 o más', value: '3.5' },
                  ].map((rating, idx) => (
                    <label key={rating.value} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        defaultChecked={idx === 0}
                        className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 text-primary focus:ring-primary rounded-full cursor-pointer"
                        name="rating"
                        type="radio"
                      />
                      <span className="text-sm font-medium">{rating.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Distance Filter */}
              <div className="space-y-4 mb-8">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Distancia (km)</h4>
                <input
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                  type="range"
                  min="1"
                  max="20"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>1 km</span>
                  <span>+20 km</span>
                </div>
              </div>

              {/* Services Filter */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Servicios</h4>
                <div className="space-y-1">
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-primary/10 text-primary cursor-pointer">
                    <span className="material-symbols-outlined text-[20px] filled">home_repair_service</span>
                    <span className="text-sm font-bold">Mecánica General</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[20px] text-gray-400">tire_repair</span>
                    <span className="text-sm font-medium">Gomería</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[20px] text-gray-400">bolt</span>
                    <span className="text-sm font-medium">Electricidad</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[20px] text-gray-400">shopping_bag</span>
                    <span className="text-sm font-medium">Accesorios</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Preview */}
            <div className="rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 h-48 relative group cursor-pointer">
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700"></div>
              <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-white">
                <span className="material-symbols-outlined text-3xl mb-1">map</span>
                <span className="font-bold text-sm">Ver en Mapa</span>
              </div>
            </div>
          </aside>

          {/* Talleres Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Taller Card 1 */}
              <Link to="/taller" className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group">
                <div className="h-48 relative overflow-hidden bg-gray-200 dark:bg-gray-700">
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-primary text-[#181611] px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest shadow-sm">
                      Taller
                    </span>
                    <span className="bg-white/90 dark:bg-black/90 px-2 py-1 rounded text-[10px] font-bold shadow-sm">
                      Oficial Honda
                    </span>
                  </div>
                  <button className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-red-500 transition-all">
                    <span className="material-symbols-outlined text-[20px]">favorite</span>
                  </button>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                      MotoService Center Pro
                    </h3>
                    <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/30 text-green-600 px-2 py-0.5 rounded-lg">
                      <span className="text-sm font-bold">4.9</span>
                      <span className="material-symbols-outlined text-[14px] filled">star</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                    Especialistas en alta cilindrada y service oficial de las marcas líderes en el mercado.
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400 mb-6 border-y border-gray-50 dark:border-gray-700 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">location_on</span>
                      <span>A 1.2 km de ti</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">schedule</span>
                      <span className="text-green-500 font-semibold">Abierto ahora</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">chat</span>
                      <span>124 reseñas</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-primary text-[#181611] font-bold py-2.5 rounded-lg text-sm transition-all hover:bg-[#c09923]">
                      Ver Perfil
                    </button>
                    <button className="p-2.5 rounded-lg bg-[#f4f3f0] dark:bg-gray-700 text-[#181611] dark:text-gray-100 hover:bg-gray-200 transition-colors">
                      <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
                    </button>
                  </div>
                </div>
              </Link>

              {/* Taller Card 2 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group">
                <div className="h-48 relative overflow-hidden bg-gray-200 dark:bg-gray-700">
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-[#181611] text-white px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest shadow-sm">
                      Repuestos
                    </span>
                    <span className="bg-white/90 dark:bg-black/90 px-2 py-1 rounded text-[10px] font-bold shadow-sm">
                      Multimarca
                    </span>
                  </div>
                  <button className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-red-500 transition-all">
                    <span className="material-symbols-outlined text-[20px]">favorite</span>
                  </button>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">Repuestos "El Rayo"</h3>
                    <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/30 text-green-600 px-2 py-0.5 rounded-lg">
                      <span className="text-sm font-bold">4.7</span>
                      <span className="material-symbols-outlined text-[14px] filled">star</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                    Todo en transmisión, frenos y lubricantes. Envíos en el día a toda la zona metropolitana.
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400 mb-6 border-y border-gray-50 dark:border-gray-700 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">location_on</span>
                      <span>A 2.5 km de ti</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">schedule</span>
                      <span className="text-gray-400 font-semibold">Cierra a las 19:00</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">chat</span>
                      <span>89 reseñas</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-primary text-[#181611] font-bold py-2.5 rounded-lg text-sm transition-all hover:bg-[#c09923]">
                      Ver Catálogo
                    </button>
                    <button className="p-2.5 rounded-lg bg-[#f4f3f0] dark:bg-gray-700 text-[#181611] dark:text-gray-100 hover:bg-gray-200 transition-colors">
                      <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Taller Card 3 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group">
                <div className="h-48 relative overflow-hidden bg-gray-200 dark:bg-gray-700">
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-primary text-[#181611] px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest shadow-sm">
                      Taller
                    </span>
                    <span className="bg-white/90 dark:bg-black/90 px-2 py-1 rounded text-[10px] font-bold shadow-sm">
                      Premium
                    </span>
                  </div>
                  <button className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-red-500 transition-all">
                    <span className="material-symbols-outlined text-[20px]">favorite</span>
                  </button>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">Custom Garage 88</h3>
                    <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/30 text-green-600 px-2 py-0.5 rounded-lg">
                      <span className="text-sm font-bold">5.0</span>
                      <span className="material-symbols-outlined text-[14px] filled">star</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                    Restauración de clásicas y personalización. Un taller hecho por apasionados para apasionados.
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400 mb-6 border-y border-gray-50 dark:border-gray-700 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">location_on</span>
                      <span>A 4.8 km de ti</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">schedule</span>
                      <span className="text-green-500 font-semibold">Abierto ahora</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">chat</span>
                      <span>45 reseñas</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-primary text-[#181611] font-bold py-2.5 rounded-lg text-sm transition-all hover:bg-[#c09923]">
                      Ver Galería
                    </button>
                    <button className="p-2.5 rounded-lg bg-[#f4f3f0] dark:bg-gray-700 text-[#181611] dark:text-gray-100 hover:bg-gray-200 transition-colors">
                      <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Taller Card 4 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group">
                <div className="h-48 relative overflow-hidden bg-gray-200 dark:bg-gray-700">
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-[#181611] text-white px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest shadow-sm">
                      Repuestos
                    </span>
                    <span className="bg-white/90 dark:bg-black/90 px-2 py-1 rounded text-[10px] font-bold shadow-sm">
                      Outlet
                    </span>
                  </div>
                  <button className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-red-500 transition-all">
                    <span className="material-symbols-outlined text-[20px]">favorite</span>
                  </button>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                      Motos Express Repuestos
                    </h3>
                    <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 px-2 py-0.5 rounded-lg">
                      <span className="text-sm font-bold">4.2</span>
                      <span className="material-symbols-outlined text-[14px] filled">star</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                    Los mejores precios en cubiertas y repuestos básicos. Atención rápida y eficiente.
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400 mb-6 border-y border-gray-50 dark:border-gray-700 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">location_on</span>
                      <span>A 3.1 km de ti</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">schedule</span>
                      <span className="text-red-500 font-semibold">Cerrado ahora</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">chat</span>
                      <span>210 reseñas</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-primary text-[#181611] font-bold py-2.5 rounded-lg text-sm transition-all hover:bg-[#c09923]">
                      Ver Más
                    </button>
                    <button className="p-2.5 rounded-lg bg-[#f4f3f0] dark:bg-gray-700 text-[#181611] dark:text-gray-100 hover:bg-gray-200 transition-colors">
                      <span className="material-symbols-outlined text-[20px]">directions</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Pagination */}
            <div className="mt-12 flex items-center justify-center gap-2">
              <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-400 hover:border-primary hover:text-primary transition-all">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-[#181611] font-bold shadow-sm">
                1
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 font-medium hover:border-primary transition-all">
                2
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 font-medium hover:border-primary transition-all">
                3
              </button>
              <span className="px-2 text-gray-400">...</span>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 font-medium hover:border-primary transition-all">
                12
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-400 hover:border-primary hover:text-primary transition-all">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
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
  )
}
