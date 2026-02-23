import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function RegistroTaller() {
  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-[#181611] dark:text-white transition-colors duration-200 min-h-screen">
      <Navbar activePage="registro-taller" />

      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 md:px-20 lg:px-40 flex flex-1 justify-center py-10">
          <div className="layout-content-container flex flex-col max-w-[800px] flex-1 bg-white dark:bg-card-dark rounded-xl shadow-sm border border-[#f4f3f0] dark:border-input-border-dark overflow-hidden">
            {/* Page Heading */}
            <div className="p-8 pb-4">
              <div className="flex flex-col gap-3">
                <p className="text-[#181611] dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
                  Únete a MotoFIX
                </p>
                <p className="text-[#887f63] dark:text-gray-400 text-base font-normal leading-normal">
                  Registra tu taller o tienda y conecta con miles de motociclistas en tu zona.
                </p>
              </div>
            </div>

            <form className="flex flex-col gap-6 p-8 pt-2">
              {/* Section: Tipo de Negocio */}
              <div>
                <h3 className="text-[#181611] dark:text-white tracking-light text-xl font-bold leading-tight text-left pb-4">
                  Tipo de Negocio
                </h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Radio Card 1 */}
                  <label className="flex-1 cursor-pointer relative">
                    <input className="peer sr-only" name="business_type" type="radio" value="taller" defaultChecked />
                    <div className="p-4 rounded-xl border-2 border-transparent bg-[#f4f3f0] dark:bg-elevated-dark hover:bg-gray-200 dark:hover:bg-elevated-dark peer-checked:border-primary peer-checked:bg-primary/5 transition-all flex flex-col items-center gap-2 text-center h-full justify-center">
                      <span className="material-symbols-outlined text-3xl text-[#887f63] dark:text-gray-400">build</span>
                      <span className="text-sm font-medium text-[#181611] dark:text-gray-200">Taller Mecánico</span>
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 peer-checked:opacity-100 text-primary transition-opacity">
                      <span className="material-symbols-outlined text-xl filled">check_circle</span>
                    </div>
                  </label>
                  {/* Radio Card 2 */}
                  <label className="flex-1 cursor-pointer relative">
                    <input className="peer sr-only" name="business_type" type="radio" value="mecanico" />
                    <div className="p-4 rounded-xl border-2 border-transparent bg-[#f4f3f0] dark:bg-elevated-dark hover:bg-gray-200 dark:hover:bg-elevated-dark peer-checked:border-primary peer-checked:bg-primary/5 transition-all flex flex-col items-center gap-2 text-center h-full justify-center">
                      <span className="material-symbols-outlined text-3xl text-[#887f63] dark:text-gray-400">person</span>
                      <span className="text-sm font-medium text-[#181611] dark:text-gray-200">Mecánico Indep.</span>
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 peer-checked:opacity-100 text-primary transition-opacity">
                      <span className="material-symbols-outlined text-xl filled">check_circle</span>
                    </div>
                  </label>
                  {/* Radio Card 3 */}
                  <label className="flex-1 cursor-pointer relative">
                    <input className="peer sr-only" name="business_type" type="radio" value="repuestos" />
                    <div className="p-4 rounded-xl border-2 border-transparent bg-[#f4f3f0] dark:bg-elevated-dark hover:bg-gray-200 dark:hover:bg-elevated-dark peer-checked:border-primary peer-checked:bg-primary/5 transition-all flex flex-col items-center gap-2 text-center h-full justify-center">
                      <span className="material-symbols-outlined text-3xl text-[#887f63] dark:text-gray-400">store</span>
                      <span className="text-sm font-medium text-[#181611] dark:text-gray-200">Casa de Repuestos</span>
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 peer-checked:opacity-100 text-primary transition-opacity">
                      <span className="material-symbols-outlined text-xl filled">check_circle</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="w-full h-px bg-[#f4f3f0] dark:bg-elevated-dark my-2"></div>

              {/* Section: Datos Básicos */}
              <div className="grid gap-6">
                <h3 className="text-[#181611] dark:text-white tracking-light text-xl font-bold leading-tight">
                  Datos del Negocio
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-[#181611] dark:text-gray-300">Nombre del Negocio</label>
                    <input
                      className="w-full rounded-lg border border-[#dbdce0] dark:border-input-border-dark bg-white dark:bg-elevated-dark px-4 py-3 text-sm text-[#181611] dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400"
                      placeholder="Ej. MotoTaller Express"
                      type="text"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-[#181611] dark:text-gray-300">Teléfono de Contacto</label>
                    <input
                      className="w-full rounded-lg border border-[#dbdce0] dark:border-input-border-dark bg-white dark:bg-elevated-dark px-4 py-3 text-sm text-[#181611] dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400"
                      placeholder="+54 11 1234 5678"
                      type="tel"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[#181611] dark:text-gray-300">Dirección Completa</label>
                  <div className="relative">
                    <input
                      className="w-full rounded-lg border border-[#dbdce0] dark:border-input-border-dark bg-white dark:bg-elevated-dark pl-4 pr-10 py-3 text-sm text-[#181611] dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400"
                      placeholder="Calle, Número, Ciudad, Provincia"
                      type="text"
                    />
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      location_on
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[#181611] dark:text-gray-300">Correo Electrónico</label>
                  <input
                    className="w-full rounded-lg border border-[#dbdce0] dark:border-input-border-dark bg-white dark:bg-elevated-dark px-4 py-3 text-sm text-[#181611] dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400"
                    placeholder="contacto@tuempresa.com"
                    type="email"
                  />
                </div>
              </div>

              <div className="w-full h-px bg-[#f4f3f0] dark:bg-elevated-dark my-2"></div>

              {/* Section: Detalles y Horarios */}
              <div className="grid gap-6">
                <h3 className="text-[#181611] dark:text-white tracking-light text-xl font-bold leading-tight">
                  Detalles y Horarios
                </h3>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[#181611] dark:text-gray-300">Descripción del Negocio</label>
                  <textarea
                    className="w-full rounded-lg border border-[#dbdce0] dark:border-input-border-dark bg-white dark:bg-elevated-dark px-4 py-3 text-sm text-[#181611] dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400 resize-y min-h-[120px]"
                    placeholder="Describe brevemente tus servicios, especialidades y años de experiencia..."
                    rows={6}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2 p-4 rounded-lg bg-[#f8f7f6] dark:bg-surface-dark border border-[#f4f3f0] dark:border-input-border-dark">
                    <span className="text-sm font-semibold text-[#181611] dark:text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg">calendar_today</span> Lunes a Viernes
                    </span>
                    <div className="flex gap-2 items-center mt-2">
                      <input
                        className="flex-1 rounded-md border border-gray-300 dark:border-input-border-dark bg-white dark:bg-elevated-dark p-2 text-sm dark:text-white"
                        type="time"
                        defaultValue="09:00"
                      />
                      <span className="text-gray-400">-</span>
                      <input
                        className="flex-1 rounded-md border border-gray-300 dark:border-input-border-dark bg-white dark:bg-elevated-dark p-2 text-sm dark:text-white"
                        type="time"
                        defaultValue="18:00"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 p-4 rounded-lg bg-[#f8f7f6] dark:bg-surface-dark border border-[#f4f3f0] dark:border-input-border-dark">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-[#181611] dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">weekend</span> Sábados
                      </span>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          className="rounded text-primary focus:ring-primary bg-white dark:bg-elevated-dark border-gray-300 dark:border-input-border-dark"
                          type="checkbox"
                          defaultChecked
                        />
                        <span className="text-xs text-gray-500">Abierto</span>
                      </label>
                    </div>
                    <div className="flex gap-2 items-center mt-2">
                      <input
                        className="flex-1 rounded-md border border-gray-300 dark:border-input-border-dark bg-white dark:bg-elevated-dark p-2 text-sm dark:text-white"
                        type="time"
                        defaultValue="09:00"
                      />
                      <span className="text-gray-400">-</span>
                      <input
                        className="flex-1 rounded-md border border-gray-300 dark:border-input-border-dark bg-white dark:bg-elevated-dark p-2 text-sm dark:text-white"
                        type="time"
                        defaultValue="13:00"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full h-px bg-[#f4f3f0] dark:bg-elevated-dark my-2"></div>

              {/* Section: Fotos */}
              <div>
                <h3 className="text-[#181611] dark:text-white tracking-light text-xl font-bold leading-tight mb-4">
                  Fotos del Local
                </h3>
                <div className="border-2 border-dashed border-[#dbdce0] dark:border-input-border-dark rounded-xl p-8 flex flex-col items-center justify-center bg-[#f8f7f6] dark:bg-surface-dark hover:bg-[#f4f3f0] dark:hover:bg-elevated-dark transition-colors cursor-pointer group">
                  <div className="size-12 rounded-full bg-white dark:bg-elevated-dark shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-2xl text-primary">add_a_photo</span>
                  </div>
                  <p className="text-sm font-medium text-[#181611] dark:text-white mb-1">
                    Haz clic o arrastra fotos aquí
                  </p>
                  <p className="text-xs text-[#887f63] dark:text-gray-400">
                    JPG, PNG hasta 5MB (Mínimo 1 foto de fachada)
                  </p>
                </div>
              </div>

              {/* Submit Actions */}
              <div className="pt-4">
                <label className="flex items-start gap-3 mb-6 cursor-pointer">
                  <input
                    className="mt-1 rounded border-gray-300 text-primary focus:ring-primary bg-white dark:bg-elevated-dark"
                    type="checkbox"
                  />
                  <span className="text-sm text-[#887f63] dark:text-gray-400 leading-normal">
                    Confirmo que la información proporcionada es real y acepto los{' '}
                    <a className="text-[#181611] dark:text-white underline font-medium hover:text-primary" href="#">
                      Términos y Condiciones
                    </a>{' '}
                    de MotoFIX.
                  </span>
                </label>
                <button className="w-full rounded-xl bg-primary hover:bg-[#d9ae2b] text-[#181611] text-base font-bold text-center py-4 px-6 transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-[0.99]">
                  Registrar Mi Negocio
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
