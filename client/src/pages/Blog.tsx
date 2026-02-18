import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Blog() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light text-[#181611] font-display">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10">

          {/* ══════════════════════════════════════════════════════════════
              SECCIÓN: TÍTULO PRINCIPAL
              Editá el título y subtítulo del blog
              ══════════════════════════════════════════════════════════════ */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
              Blog
            </h1>
            <p className="text-gray-500 text-base max-w-2xl">
              {/* EDITAR: Cambiá esta descripción introductoria */}
              Consejos, novedades y guías para motociclistas y talleres.
            </p>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              SECCIÓN: ARTÍCULOS DEL BLOG
              Cada artículo tiene: imagen, categoría, título, resumen y fecha.
              Para agregar más artículos, copiá uno de los bloques <article>.
              ══════════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* EDITAR: Artículo 1 - Cambiá imagen, categoría, título, resumen y fecha */}
            <article className="bg-white dark:bg-card-dark rounded-xl overflow-hidden shadow-sm border border-[#f4f3f0] dark:border-gray-800 hover:shadow-md transition-shadow">
              {/* EDITAR: Cambiá la imagen del artículo (src) */}
              <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-gray-400 text-5xl">image</span>
              </div>
              <div className="p-5">
                {/* EDITAR: Cambiá la categoría */}
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">Mantenimiento</span>
                {/* EDITAR: Cambiá el título del artículo */}
                <h2 className="font-bold text-lg mt-3 mb-2">Cómo elegir el aceite correcto para tu moto</h2>
                {/* EDITAR: Cambiá el resumen del artículo */}
                <p className="text-gray-500 text-sm line-clamp-3">
                  Una guía completa para entender las diferencias entre aceites y cuál es el mejor para tu motor.
                </p>
                <div className="flex items-center justify-between mt-4">
                  {/* EDITAR: Cambiá la fecha */}
                  <span className="text-xs text-gray-400">15 Feb 2026</span>
                  {/* EDITAR: Cambiá el link cuando tengas la página del artículo */}
                  <Link to="#" className="text-sm font-medium text-primary hover:underline">Leer más</Link>
                </div>
              </div>
            </article>

            {/* EDITAR: Artículo 2 - Copiá este bloque para agregar más artículos */}
            <article className="bg-white dark:bg-card-dark rounded-xl overflow-hidden shadow-sm border border-[#f4f3f0] dark:border-gray-800 hover:shadow-md transition-shadow">
              <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-gray-400 text-5xl">image</span>
              </div>
              <div className="p-5">
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">Consejos</span>
                <h2 className="font-bold text-lg mt-3 mb-2">5 señales de que tu moto necesita servicio</h2>
                <p className="text-gray-500 text-sm line-clamp-3">
                  Aprendé a identificar las señales de alerta antes de que se conviertan en problemas graves.
                </p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-gray-400">10 Feb 2026</span>
                  <Link to="#" className="text-sm font-medium text-primary hover:underline">Leer más</Link>
                </div>
              </div>
            </article>

            {/* EDITAR: Artículo 3 - Copiá este bloque para agregar más artículos */}
            <article className="bg-white dark:bg-card-dark rounded-xl overflow-hidden shadow-sm border border-[#f4f3f0] dark:border-gray-800 hover:shadow-md transition-shadow">
              <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-gray-400 text-5xl">image</span>
              </div>
              <div className="p-5">
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">Comunidad</span>
                <h2 className="font-bold text-lg mt-3 mb-2">Los mejores recorridos en moto del país</h2>
                <p className="text-gray-500 text-sm line-clamp-3">
                  Descubrí las rutas más populares recomendadas por la comunidad MotoFIX.
                </p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-gray-400">5 Feb 2026</span>
                  <Link to="#" className="text-sm font-medium text-primary hover:underline">Leer más</Link>
                </div>
              </div>
            </article>

            {/* EDITAR: Para agregar más artículos, copiá cualquiera de los bloques <article> de arriba */}

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
