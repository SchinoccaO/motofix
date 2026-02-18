import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Carreras() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light text-[#181611] font-display">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10">

          {/* ══════════════════════════════════════════════════════════════
              SECCIÓN: TÍTULO PRINCIPAL
              Editá el título y subtítulo de la página de Carreras
              ══════════════════════════════════════════════════════════════ */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
              Carreras
            </h1>
            <p className="text-gray-500 text-base max-w-2xl">
              {/* EDITAR: Cambiá esta descripción introductoria */}
              Sumate al equipo de MotoFIX y ayudanos a transformar la experiencia de los motociclistas.
            </p>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              SECCIÓN: POR QUÉ TRABAJAR CON NOSOTROS
              Editá los beneficios de trabajar en la empresa
              ══════════════════════════════════════════════════════════════ */}
          <section className="bg-white dark:bg-card-dark rounded-xl p-6 md:p-10 mb-8 shadow-sm border border-[#f4f3f0] dark:border-gray-800">
            <h2 className="text-xl font-bold mb-6">¿Por qué trabajar en MotoFIX?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* EDITAR: Cambiá el ícono, título y descripción de cada beneficio */}
              <div className="flex flex-col gap-3 p-4 rounded-lg bg-background-light dark:bg-background-dark">
                <span className="material-symbols-outlined text-primary text-3xl">rocket_launch</span>
                <h3 className="font-bold">Crecimiento</h3>
                <p className="text-gray-500 text-sm">
                  {/* EDITAR: Descripción del beneficio */}
                  Oportunidades de desarrollo profesional y crecimiento dentro de la empresa.
                </p>
              </div>
              <div className="flex flex-col gap-3 p-4 rounded-lg bg-background-light dark:bg-background-dark">
                <span className="material-symbols-outlined text-primary text-3xl">diversity_3</span>
                <h3 className="font-bold">Equipo</h3>
                <p className="text-gray-500 text-sm">
                  {/* EDITAR: Descripción del beneficio */}
                  Un equipo apasionado y colaborativo que comparte la pasión por las motos.
                </p>
              </div>
              <div className="flex flex-col gap-3 p-4 rounded-lg bg-background-light dark:bg-background-dark">
                <span className="material-symbols-outlined text-primary text-3xl">work_history</span>
                <h3 className="font-bold">Flexibilidad</h3>
                <p className="text-gray-500 text-sm">
                  {/* EDITAR: Descripción del beneficio */}
                  Trabajo remoto y horarios flexibles para un mejor balance de vida.
                </p>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════
              SECCIÓN: POSICIONES ABIERTAS
              Editá, agregá o eliminá las posiciones abiertas.
              Cada posición tiene: título, ubicación, tipo y descripción.
              ══════════════════════════════════════════════════════════════ */}
          <section className="bg-white dark:bg-card-dark rounded-xl p-6 md:p-10 shadow-sm border border-[#f4f3f0] dark:border-gray-800">
            <h2 className="text-xl font-bold mb-6">Posiciones abiertas</h2>
            <div className="flex flex-col gap-4">
              {/* EDITAR: Cambiá los datos de cada posición o agregá más copiando este bloque */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-lg border border-[#f4f3f0] dark:border-gray-700 hover:border-primary/30 transition-colors gap-4">
                <div>
                  <h3 className="font-bold text-lg">Desarrollador Full Stack</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">Remoto</span>
                    <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">Full-time</span>
                  </div>
                  <p className="text-gray-500 text-sm mt-2">
                    {/* EDITAR: Descripción breve del puesto */}
                    Buscamos un desarrollador con experiencia en React y Node.js.
                  </p>
                </div>
                {/* EDITAR: Cambiá el enlace del botón "Aplicar" (mailto, link externo, etc.) */}
                <a href="mailto:carreras@motofix.com" className="shrink-0 inline-flex items-center justify-center px-5 py-2.5 bg-primary hover:bg-[#d6aa28] text-[#181611] text-sm font-bold rounded-lg transition-colors">
                  Aplicar
                </a>
              </div>

              {/* EDITAR: Otra posición - copiá este bloque para agregar más */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-lg border border-[#f4f3f0] dark:border-gray-700 hover:border-primary/30 transition-colors gap-4">
                <div>
                  <h3 className="font-bold text-lg">Diseñador UX/UI</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">Remoto</span>
                    <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">Part-time</span>
                  </div>
                  <p className="text-gray-500 text-sm mt-2">
                    {/* EDITAR: Descripción breve del puesto */}
                    Buscamos un diseñador con experiencia en diseño de producto digital.
                  </p>
                </div>
                <a href="mailto:carreras@motofix.com" className="shrink-0 inline-flex items-center justify-center px-5 py-2.5 bg-primary hover:bg-[#d6aa28] text-[#181611] text-sm font-bold rounded-lg transition-colors">
                  Aplicar
                </a>
              </div>

              {/* EDITAR: Para agregar más posiciones, copiá cualquiera de los bloques de arriba */}
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  )
}
