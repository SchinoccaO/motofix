import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function TallerProfile() {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-text-main dark:text-white overflow-x-hidden min-h-screen">
      <Navbar />
      
      {/* Main Content */}
      <main className="w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-text-secondary mb-6">
          <a className="hover:text-primary transition-colors" href="#">Inicio</a>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <a className="hover:text-primary transition-colors" href="#">Talleres</a>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-text-main font-medium dark:text-white">MotoTaller El Rápido</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN (Profile Info) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image */}
            <div className="w-full aspect-video md:aspect-[21/9] bg-gray-200 rounded-xl overflow-hidden relative group">
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all"></div>
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBKGkaPdamBvs1x2BDKnqfK8cAlF5XUOKVIDMDaI3h4k0PKOz6esPo6Dipp8xqzTrH_gxr5FNjfvnkmiceJ_dgRqR4IR6PozsIupaLKdzg93FCThqrwlD8jKyc9A68JmdzYN8Na19NyXDAytaFt5lXUg6nChjcz1MrIybfSxBniOboWUTQ3DnCoSrkYLc4-OxdQxx1UGcvnqr-Xse-jOBE-aq3njLbRAO4YGIm3sH41IFsvPQlzYc47rtxdvUVMacAUNdcvgfsB1jYk')" }}
              ></div>
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold shadow-sm text-text-main flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">photo_camera</span> Ver 12 fotos
              </div>
            </div>

            {/* Header Info */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-primary/20 text-yellow-700 dark:text-yellow-400 text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                      Taller Mecánico
                    </span>
                    <span className="flex items-center text-green-600 dark:text-green-400 text-xs font-bold gap-1">
                      <span className="material-symbols-outlined text-sm">check_circle</span> Verificado
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-black tracking-tight text-text-main dark:text-white mb-2">
                    MotoTaller El Rápido
                  </h1>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-primary">
                      <span className="material-symbols-outlined text-xl filled" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="font-bold text-lg text-text-main dark:text-white">4.8</span>
                      <span className="text-text-secondary underline decoration-dotted cursor-pointer hover:text-primary">
                        (124 reseñas)
                      </span>
                    </div>
                    <span className="text-gray-300">|</span>
                    <span className="text-text-secondary flex items-center gap-1">
                      <span className="material-symbols-outlined text-lg">location_on</span>
                      Palermo, CABA
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-sm font-semibold">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Abierto ahora
                  </span>
                  <span className="text-xs text-text-secondary mt-1">Cierra a las 19:00 hs</span>
                </div>
              </div>

              {/* Chips */}
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                  <span className="material-symbols-outlined text-primary text-sm">build</span>
                  <span className="text-sm font-medium">Mecánica Ligera</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                  <span className="material-symbols-outlined text-primary text-sm">oil_barrel</span>
                  <span className="text-sm font-medium">Cambio de Aceite</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                  <span className="material-symbols-outlined text-primary text-sm">verified</span>
                  <span className="text-sm font-medium">Service Oficial</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                  <span className="material-symbols-outlined text-primary text-sm">credit_card</span>
                  <span className="text-sm font-medium">Acepta Tarjeta</span>
                </div>
              </div>
            </div>

            <hr className="border-gray-200 dark:border-gray-800" />

            {/* Transparency Metrics Grid */}
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">visibility</span>
                Métricas de Transparencia
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <span className="material-symbols-outlined">schedule</span>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary uppercase font-semibold">Tiempo Promedio</p>
                    <p className="text-xl font-bold text-text-main dark:text-white">24 - 48 hs</p>
                    <p className="text-xs text-gray-500">Para service simple</p>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center">
                    <span className="material-symbols-outlined">verified_user</span>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary uppercase font-semibold">Garantía</p>
                    <p className="text-xl font-bold text-text-main dark:text-white">3 Meses</p>
                    <p className="text-xs text-gray-500">En mano de obra</p>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <span className="material-symbols-outlined">handyman</span>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary uppercase font-semibold">Especialidad</p>
                    <p className="text-xl font-bold text-text-main dark:text-white">Japonesas</p>
                    <p className="text-xs text-gray-500">Honda, Yamaha, Kawa</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-bold mb-2">Sobre el taller</h3>
              <p className="text-text-secondary leading-relaxed text-base">
                Somos un taller familiar con más de 15 años de experiencia en el barrio de Palermo. Nos especializamos
                en mecánica ligera, inyección electrónica y service oficial de marcas líderes. Contamos con scanner de
                última generación y stock permanente de repuestos originales para garantizar reparaciones rápidas y
                confiables. Nuestro compromiso es la transparencia: te mostramos los repuestos cambiados y explicamos
                cada paso del proceso.
              </p>
            </div>

            {/* Gallery Grid */}
            <div>
              <h3 className="text-lg font-bold mb-4">Galería de trabajos</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="aspect-square rounded-lg bg-gray-200 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCS4AgwaeRGpW8DfbNOke1Hz3syjrGYW3QaU309m-VRDHi6OUeEHsoQBAHUA7MX89r9PP4VZ84o84KQBdoMkcVqCzMbDCnZPXsnBI1uvN6YltrcBjpZJANayBhppGXcCR3rqua6vFRIA78oTgFMrzx35eLyZj34Uqn-wzX2UytI5A5tTsm77T_A-5dZhHHPCi673vRv8io-WnDAymBeHnEs0OKxS2L1q9nqYkrmqdCskp1Z-Aa_KTeE7QnY9-3OP2kxdDRKmgrCl-Rq')" }}
                  ></div>
                </div>
                <div className="aspect-square rounded-lg bg-gray-200 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCMOZaro7yOcB25c40v3Lu19Aot8-Xll3ZN7WjvwDPC82afpjU6vTfRFDDHXhv7XFI1ADUAWH5tEDzbvloZm8yRd7DsSfVVQbuGGm4WXvLCY3zfzfnv2WxTzB3Rcx8s1APQsfqx4PiWGMaOHoivf5Zy-G5UmKwjdW04D_YnbdCaIez_cEZjDvv1LHR0EhpdoNeZPuZoHsU3fMbKtiKh0mWrt_PaYngSJV_dpWemNHpT1n8UTmVZ_D9vFFlIMpjJdgK2NENtd4HQ6cuW')" }}
                  ></div>
                </div>
                <div className="aspect-square rounded-lg bg-gray-200 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC8K4G__33Cgb-xMQ0qmXSVK5KGrKIJVv40QHVMaiJi38RXm9pFckCe_vHVNeQupIQns4gLOURcq1rZ0DQpYDNyMfW_xpOusuG0w2lqb31Dx-75f4brkxX2LrcF54bQX-F6jl2mYNEhSmEehSWgU8-JzBMUiI6P-lLJqAMLd1B3WGXVor5tbgI9ZTDM_fvDePSKWDKCzVJl0VCBWd_xbkHf0h7AGY-m1nLj6kM912OvJZZEpefUI_C8VIlri8DAeg99QoT45gHPgD8v')" }}
                  ></div>
                </div>
                <div className="aspect-square rounded-lg bg-gray-200 overflow-hidden relative cursor-pointer hover:opacity-90 transition-opacity">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCUteo0zD4DKUlyGnNxifAcGIrHibMB63Tmh9CfhiJzVi0aeednLXGwwUY_zFOlGtjHCISr_DAdT48IOP-HQugi0IsjsztRfwukuOQT2akIgiismYeyvZOCJZWe86_QUXdPLBkdEOyD_eabIQlgFcSgIxTxN5f7rNNXy2WrE-FzvQULByWGU5YxM6Tl4kmHaOPJXUy2HceS_daFouBU0TjY9Ug7mv3RQMpvqEdvErpfuSXRKtg402jK822svoF7Ig1pyb5eYf-Gni3n')" }}
                  ></div>
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">+8</span>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-gray-200 dark:border-gray-800" />

            {/* Reviews Section */}
            <div id="reviews">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Reseñas y Opiniones</h3>
                <button className="bg-primary hover:bg-yellow-500 text-text-main font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined">rate_review</span>
                  Dejar reseña
                </button>
              </div>

              {/* Ratings Summary */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 mb-8">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex flex-col items-center justify-center min-w-[140px]">
                    <span className="text-6xl font-black text-text-main dark:text-white">4.8</span>
                    <div className="flex text-primary my-2">
                      <span className="material-symbols-outlined filled" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined filled" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined filled" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined filled" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined filled" style={{ fontVariationSettings: "'FILL' 0.5" }}>star_half</span>
                    </div>
                    <span className="text-sm text-text-secondary">Basado en 124 opiniones</span>
                  </div>
                  {/* Progress Bars */}
                  <div className="flex-1 w-full space-y-2">
                    {[
                      { stars: 5, percentage: 85 },
                      { stars: 4, percentage: 10 },
                      { stars: 3, percentage: 3 },
                      { stars: 2, percentage: 1 },
                      { stars: 1, percentage: 1 },
                    ].map((item) => (
                      <div key={item.stars} className="flex items-center gap-3 text-sm">
                        <span className="font-bold w-3">{item.stars}</span>
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-text-secondary w-8 text-right">{item.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Individual Reviews */}
              <div className="space-y-6">
                {/* Review 1 */}
                <div className="border-b border-gray-100 dark:border-gray-800 pb-6">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full bg-gray-300 bg-cover bg-center"
                        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBkZzOgV85tpD12APsLHOFqpZAONLDk_AY_7mcw_uDxPggB_aWXNaZPnW2DrCnsSq-e-FShA41XKLuwKwg2r9iEC0gG65xNJPAjxbMrltLHn_qC8iKMcaaL5FYxwNCaPAqOtKsAxxat6zcwSxt7QosDYWOwx0I0sPMKGxx4LbkR-J6mUGPMFsfdmOyWDjZfIIsLS32yR8y92i51xTEKydhA1WcGK9gLPTqEWH7HhoSSOdKollBLq2JpEpdLVTfju7zPMsM_WLPgZpVl')" }}
                      ></div>
                      <div>
                        <h4 className="font-bold text-sm">Martín Gomez</h4>
                        <span className="text-xs text-text-secondary">Hace 2 días</span>
                      </div>
                    </div>
                    <div className="flex text-primary text-sm">
                      <span className="material-symbols-outlined filled text-[18px]">star</span>
                      <span className="material-symbols-outlined filled text-[18px]">star</span>
                      <span className="material-symbols-outlined filled text-[18px]">star</span>
                      <span className="material-symbols-outlined filled text-[18px]">star</span>
                      <span className="material-symbols-outlined filled text-[18px]">star</span>
                    </div>
                  </div>
                  <p className="text-text-main dark:text-gray-300 text-sm mt-2">
                    Excelente atención. Fui por un problema de carburación en mi GN125 y me lo solucionaron en el día.
                    El precio me pareció justo y me mostraron las piezas que cambiaron. Muy recomendable.
                  </p>
                  <div className="mt-3 flex items-center gap-4">
                    <button className="text-xs font-medium text-text-secondary hover:text-primary flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">thumb_up</span> Útil (4)
                    </button>
                  </div>
                </div>

                {/* Review 2 */}
                <div className="border-b border-gray-100 dark:border-gray-800 pb-6">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full bg-gray-300 bg-cover bg-center"
                        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBnWHCinIyZfy1fAkrUjo4M-zEcda86NQdLnBgHM-C6gIMyATN8_Y_PcuLR7vnpfr-yG5P6lJz6yCffDyA-u4Z7Jw-X508wwu8YGOR-4Vj3ZskRpXqtJauWrqaqsed26ASp7ccm50uosCt-jrPeRZrNZRkggN6NxS4depFW6PM1dFsunExDwacBtEjupIoveotnsa6aMHwB01H7wM0whwnl-jtmwHK5WSCDCzl04wRnthX_5MleHk7qBmHx9pNR3pBccvKhSQc3R9qr')" }}
                      ></div>
                      <div>
                        <h4 className="font-bold text-sm">Sofia Lopez</h4>
                        <span className="text-xs text-text-secondary">Hace 1 semana</span>
                      </div>
                    </div>
                    <div className="flex text-primary text-sm">
                      <span className="material-symbols-outlined filled text-[18px]">star</span>
                      <span className="material-symbols-outlined filled text-[18px]">star</span>
                      <span className="material-symbols-outlined filled text-[18px]">star</span>
                      <span className="material-symbols-outlined filled text-[18px]">star</span>
                      <span className="material-symbols-outlined text-[18px]">star</span>
                    </div>
                  </div>
                  <p className="text-text-main dark:text-gray-300 text-sm mt-2">
                    Buena atención, pero demoraron un poco más de lo prometido en entregar la moto. El trabajo quedó
                    impecable, eso sí. Volvería a ir pero iría con más tiempo.
                  </p>
                  <div className="mt-3 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border-l-4 border-primary">
                    <p className="text-xs font-bold mb-1">Respuesta del taller:</p>
                    <p className="text-xs text-text-secondary dark:text-gray-400">
                      Hola Sofía, lamentamos la demora. Tuvimos un retraso en la entrega del repuesto original. Gracias
                      por destacar la calidad del trabajo, te esperamos para el próximo service con un descuento
                      especial.
                    </p>
                  </div>
                </div>
              </div>

              <button className="w-full mt-4 py-2 text-sm font-semibold text-primary hover:text-yellow-600 transition-colors border border-primary/30 rounded-lg">
                Ver todas las reseñas
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN (Sidebar) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Contact Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                {/* Map Preview */}
                <div className="h-40 w-full bg-gray-200 relative">
                  <div
                    className="w-full h-full bg-cover bg-center grayscale opacity-80"
                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCntUo1dA1VvxPQ_IJlxP82xFXPhikr0dmSlGZTDtzG41CJ20LtgNmESit3hhpYXcO8bTbkCNKd9hVNgSqa43eDXI_AN6xGa9X-df0NVwAJp_Y3-EtlLPWgihugZZq7RCY-j9FNtGtv5p697x5ZGmRPD6UDmJQPEI9NLLnZOKTcRkHt0ODtQNjcO6x0ylHcF5OdWkn3S93m_zaEzxe2-yVth8DEvVg5Ag2x4HlexMejjj_eus4ot_8t4Ez-ZErjUBmx3-VNVC5tEsPU')" }}
                  ></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span className="material-symbols-outlined text-4xl text-primary drop-shadow-md">location_on</span>
                  </div>
                  <a
                    className="absolute bottom-2 right-2 bg-white dark:bg-black text-xs font-bold px-2 py-1 rounded shadow hover:bg-gray-50"
                    href="#"
                  >
                    Ver mapa
                  </a>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-4">Contacto</h3>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 bg-gray-100 dark:bg-gray-700 p-1.5 rounded text-gray-600 dark:text-gray-300">
                        <span className="material-symbols-outlined text-sm">location_on</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Dirección</p>
                        <p className="text-sm text-text-secondary">Av. Corrientes 4532, Almagro, CABA.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 bg-gray-100 dark:bg-gray-700 p-1.5 rounded text-gray-600 dark:text-gray-300">
                        <span className="material-symbols-outlined text-sm">call</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Teléfono</p>
                        <p className="text-sm text-text-secondary">+54 11 4567-8901</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 bg-gray-100 dark:bg-gray-700 p-1.5 rounded text-gray-600 dark:text-gray-300">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                      </div>
                      <div className="w-full">
                        <p className="text-sm font-semibold mb-1">Horarios</p>
                        <div className="text-sm text-text-secondary grid grid-cols-2 gap-x-2 gap-y-1">
                          <span>Lun - Vie:</span> <span className="text-right">09:00 - 19:00</span>
                          <span>Sábados:</span> <span className="text-right">09:00 - 14:00</span>
                          <span className="text-red-500">Domingos:</span>{' '}
                          <span className="text-right text-red-500">Cerrado</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-xl">chat</span>
                      Enviar WhatsApp
                    </button>
                    <button className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-text-main dark:text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-xl">call</span>
                      Llamar
                    </button>
                  </div>
                </div>
              </div>

              {/* Promo/Ad Space */}
              <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-3xl">verified</span>
                  <div>
                    <h4 className="font-bold text-sm mb-1">Certificado MotoFIX</h4>
                    <p className="text-xs text-text-secondary mb-2">
                      Este taller cumple con nuestros estándares de calidad y transparencia.
                    </p>
                    <a className="text-xs font-bold text-primary hover:underline" href="#">
                      Saber más
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
