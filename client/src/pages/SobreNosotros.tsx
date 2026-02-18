import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function SobreNosotros() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light text-[#181611] font-display">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10">

          {/* ══════════════════════════════════════════════════════════════
              SECCIÓN: TÍTULO PRINCIPAL
              Editá el título y subtítulo de la página "Sobre nosotros"
              ══════════════════════════════════════════════════════════════ */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
              Sobre nosotros
            </h1>
            <p className="text-gray-500 text-base max-w-2xl">
              {/* EDITAR: Cambiá esta descripción por la de tu empresa */}
              Conocé la historia, misión y el equipo detrás de MotoFIX.
            </p>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              SECCIÓN: NUESTRA MISIÓN
              Editá el contenido de la misión de la empresa
              ══════════════════════════════════════════════════════════════ */}
          <section className="bg-white dark:bg-card-dark rounded-xl p-6 md:p-10 mb-8 shadow-sm border border-[#f4f3f0] dark:border-gray-800">
            <h2 className="text-xl font-bold mb-4">Nuestra misión</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {/* EDITAR: Escribí acá la misión de MotoFIX */}
              En MotoFIX creemos que cada motociclista merece acceso a talleres confiables y transparentes.
              Nuestra misión es conectar a la comunidad motera con los mejores mecánicos y repuestos del país.
            </p>
          </section>

          {/* ══════════════════════════════════════════════════════════════
              SECCIÓN: NUESTRA HISTORIA
              Editá el contenido de la historia de la empresa
              ══════════════════════════════════════════════════════════════ */}
          <section className="bg-white dark:bg-card-dark rounded-xl p-6 md:p-10 mb-8 shadow-sm border border-[#f4f3f0] dark:border-gray-800">
            <h2 className="text-xl font-bold mb-4">Nuestra historia</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {/* EDITAR: Escribí acá la historia de MotoFIX */}
              MotoFIX nació de la necesidad de encontrar talleres de confianza para motos.
              Desde nuestros inicios, trabajamos para construir una comunidad transparente y colaborativa.
            </p>
          </section>

          {/* ══════════════════════════════════════════════════════════════
              SECCIÓN: NUESTROS VALORES
              Editá los valores de la empresa. Podés agregar o quitar items.
              ══════════════════════════════════════════════════════════════ */}
          <section className="bg-white dark:bg-card-dark rounded-xl p-6 md:p-10 mb-8 shadow-sm border border-[#f4f3f0] dark:border-gray-800">
            <h2 className="text-xl font-bold mb-6">Nuestros valores</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* EDITAR: Cambiá el ícono, título y descripción de cada valor */}
              <div className="flex flex-col items-center text-center gap-3 p-4">
                <span className="material-symbols-outlined text-primary text-4xl">verified_user</span>
                <h3 className="font-bold text-lg">Confianza</h3>
                <p className="text-gray-500 text-sm">
                  {/* EDITAR: Descripción del valor */}
                  Talleres verificados y reseñas reales de la comunidad.
                </p>
              </div>
              <div className="flex flex-col items-center text-center gap-3 p-4">
                <span className="material-symbols-outlined text-primary text-4xl">groups</span>
                <h3 className="font-bold text-lg">Comunidad</h3>
                <p className="text-gray-500 text-sm">
                  {/* EDITAR: Descripción del valor */}
                  Una red de motociclistas que se ayudan entre sí.
                </p>
              </div>
              <div className="flex flex-col items-center text-center gap-3 p-4">
                <span className="material-symbols-outlined text-primary text-4xl">build</span>
                <h3 className="font-bold text-lg">Calidad</h3>
                <p className="text-gray-500 text-sm">
                  {/* EDITAR: Descripción del valor */}
                  Compromiso con el mejor servicio mecánico.
                </p>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════
              SECCIÓN: EQUIPO
              Editá los miembros del equipo. Podés agregar o quitar personas.
              ══════════════════════════════════════════════════════════════ */}
          <section className="bg-white dark:bg-card-dark rounded-xl p-6 md:p-10 shadow-sm border border-[#f4f3f0] dark:border-gray-800">
            <h2 className="text-xl font-bold mb-6">Nuestro equipo</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {/* EDITAR: Cambiá nombre, rol e imagen de cada miembro */}
              <div className="flex flex-col items-center text-center gap-3 p-4">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-3xl">person</span>
                </div>
                <h3 className="font-bold">Nombre Apellido</h3>
                <p className="text-gray-500 text-sm">CEO & Co-fundador</p>
              </div>
              <div className="flex flex-col items-center text-center gap-3 p-4">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-3xl">person</span>
                </div>
                <h3 className="font-bold">Nombre Apellido</h3>
                <p className="text-gray-500 text-sm">CTO & Co-fundador</p>
              </div>
              <div className="flex flex-col items-center text-center gap-3 p-4">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-3xl">person</span>
                </div>
                <h3 className="font-bold">Nombre Apellido</h3>
                <p className="text-gray-500 text-sm">Directora de Marketing</p>
              </div>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  )
}
