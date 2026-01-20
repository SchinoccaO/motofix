import { Link } from 'react-router-dom'
import Logo from '../components/Logo'

export default function ResenaForm() {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-[#181611] dark:text-gray-100 min-h-screen flex flex-col">
      {/* TopNavBar */}
      <div className="w-full bg-white dark:bg-card-dark border-b border-[#f4f3f0] dark:border-[#3f3b2e]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-10 py-3">
          <header className="flex items-center justify-between whitespace-nowrap">
            <Link to="/" className="flex items-center gap-4">
              <Logo className="text-primary" size={32} />
              <h2 className="text-[#181611] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">MotoYA</h2>
            </Link>
            <div className="hidden md:flex flex-1 justify-end gap-8">
              <div className="flex items-center gap-9">
                <a className="text-[#181611] dark:text-gray-200 text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">
                  Talleres
                </a>
                <a className="text-[#181611] dark:text-gray-200 text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">
                  Repuestos
                </a>
                <a className="text-[#181611] dark:text-gray-200 text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">
                  Comunidad
                </a>
                <Link
                  to="/registro-taller"
                  className="text-[#181611] dark:text-gray-200 text-sm font-medium leading-normal hover:text-primary transition-colors"
                >
                  Registrar taller
                </Link>
              </div>
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-primary/20"
                style={{
                  backgroundImage:
                    'url("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100")',
                }}
              ></div>
            </div>
            <div className="flex md:hidden">
              <span className="material-symbols-outlined text-[#181611] dark:text-white cursor-pointer">menu</span>
            </div>
          </header>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex justify-center py-8 px-4 sm:px-6">
        <div className="w-full max-w-[640px]">
          {/* Breadcrumbs / Back button */}
          <div className="mb-6 flex items-center gap-2">
            <Link
              to="/"
              className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-primary transition-colors dark:text-gray-400"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              Volver al taller
            </Link>
          </div>

          {/* Main Form Card */}
          <main className="bg-white dark:bg-card-dark rounded-xl shadow-sm border border-[#f4f3f0] dark:border-[#3f3b2e] overflow-hidden">
            {/* PageHeading */}
            <div className="p-6 md:p-8 pb-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-[#181611] dark:text-white tracking-tight text-[32px] font-bold leading-tight">
                  Escribe tu reseña
                </h1>
                <p className="text-[#887f63] dark:text-gray-400 text-sm font-normal leading-normal flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">storefront</span>
                  Estás calificando a{' '}
                  <span className="font-semibold text-[#181611] dark:text-gray-200">MotoRepuestos Central</span>
                </p>
              </div>
            </div>

            <form className="flex flex-col">
              {/* Rating Section */}
              <div className="px-6 md:px-8 py-4">
                <h2 className="text-[#181611] dark:text-gray-100 text-lg font-bold leading-tight tracking-[-0.015em] pb-3">
                  ¿Qué tal fue tu experiencia?
                </h2>
                <div className="flex gap-2 items-center">
                  {/* Interactive Stars (simulated state) */}
                  {[1, 2, 3, 4].map((star) => (
                    <button key={star} className="group focus:outline-none transition-transform active:scale-95" type="button">
                      <span className="material-symbols-outlined text-primary text-4xl filled">star</span>
                    </button>
                  ))}
                  <button className="group focus:outline-none transition-transform active:scale-95" type="button">
                    <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 text-4xl hover:text-primary/50 transition-colors">
                      star
                    </span>
                  </button>
                  <span className="ml-3 text-sm font-medium text-primary">Muy buena</span>
                </div>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-800 mx-8 my-2"></div>

              {/* Service Type Section */}
              <div className="px-6 md:px-8 py-4">
                <h2 className="text-[#181611] dark:text-gray-100 text-lg font-bold leading-tight tracking-[-0.015em] pb-4">
                  ¿Qué servicio realizaste?
                </h2>
                <div className="flex flex-wrap gap-3">
                  <label className="cursor-pointer">
                    <input className="peer sr-only" name="service" type="radio" defaultChecked />
                    <span className="inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-medium border border-primary bg-primary/10 text-primary-dark dark:text-primary peer-checked:bg-primary peer-checked:text-black peer-checked:border-primary transition-all">
                      Mantenimiento
                    </span>
                  </label>
                  <label className="cursor-pointer">
                    <input className="peer sr-only" name="service" type="radio" />
                    <span className="inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-medium border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent text-gray-600 dark:text-gray-400 peer-checked:bg-primary peer-checked:text-black peer-checked:border-primary hover:border-primary/50 transition-all">
                      Reparación
                    </span>
                  </label>
                  <label className="cursor-pointer">
                    <input className="peer sr-only" name="service" type="radio" />
                    <span className="inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-medium border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent text-gray-600 dark:text-gray-400 peer-checked:bg-primary peer-checked:text-black peer-checked:border-primary hover:border-primary/50 transition-all">
                      Compra de Repuestos
                    </span>
                  </label>
                  <label className="cursor-pointer">
                    <input className="peer sr-only" name="service" type="radio" />
                    <span className="inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-medium border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent text-gray-600 dark:text-gray-400 peer-checked:bg-primary peer-checked:text-black peer-checked:border-primary hover:border-primary/50 transition-all">
                      Otro
                    </span>
                  </label>
                </div>
              </div>

              {/* Time Transparency Section */}
              <div className="px-6 md:px-8 py-4">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-[#181611] dark:text-gray-100 text-lg font-bold leading-tight tracking-[-0.015em]">
                    Cumplimiento de plazos
                  </h2>
                  <span
                    className="material-symbols-outlined text-gray-400 text-[20px]"
                    title="Ayuda a otros usuarios a saber si cumplen con los tiempos"
                  >
                    info
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-background-light dark:bg-background-dark/50 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                  {/* Promised Time */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tiempo Prometido</label>
                    <div className="relative">
                      <input
                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-card-dark text-gray-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary text-sm py-2.5 pl-3 pr-10"
                        placeholder="Ej: 2 días"
                        type="text"
                      />
                      <span className="material-symbols-outlined absolute right-3 top-2.5 text-gray-400 text-[20px]">
                        calendar_clock
                      </span>
                    </div>
                  </div>
                  {/* Actual Time */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tiempo Real</label>
                    <div className="relative">
                      <input
                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-card-dark text-gray-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary text-sm py-2.5 pl-3 pr-10"
                        placeholder="Ej: 3 días"
                        type="text"
                      />
                      <span className="material-symbols-outlined absolute right-3 top-2.5 text-gray-400 text-[20px]">
                        history
                      </span>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Comparte si el taller cumplió con el tiempo estimado inicial.
                    </p>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div className="px-6 md:px-8 py-4 pb-6">
                <h2 className="text-[#181611] dark:text-gray-100 text-lg font-bold leading-tight tracking-[-0.015em] pb-3">
                  Tu opinión en breve
                </h2>
                <div className="relative">
                  <textarea
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-card-dark text-gray-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary text-sm p-3 resize-y min-h-[120px]"
                    placeholder="Cuéntanos más detalles sobre el servicio, la atención y el precio..."
                    rows={6}
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-400">0/280</div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="px-6 md:px-8 py-6 bg-gray-50 dark:bg-[#252015] border-t border-[#f4f3f0] dark:border-[#3f3b2e] flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
                <button
                  className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-4 py-2"
                  type="button"
                >
                  Cancelar
                </button>
                <button className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-[#181611] font-bold text-sm px-8 py-3 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2" type="button">
                  <span>Publicar Reseña</span>
                  <span className="material-symbols-outlined text-[18px] font-bold">send</span>
                </button>
              </div>
            </form>
          </main>

          {/* Trust Indicator */}
          <div className="mt-6 flex justify-center items-center gap-2 text-xs text-gray-400">
            <span className="material-symbols-outlined text-[16px]">verified_user</span>
            <span>Tu reseña ayuda a miles de motociclistas a elegir mejor.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
