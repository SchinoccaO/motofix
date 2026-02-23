import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const articles = [
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBy806Np7Nw4tRgOoQjq0C6o4O1mQvC2xjG3OyKhdcUxoRY70V9niEaTQZBEz6NE2rbSiwct511FwIQF5-KNP4ATb5XUCtTBiCSbrAEBInlkC-XzoBdm5zh_TeOulX8xk4jIfmawUNEQZK393wTrY2hxFnEIkwiaQOeDSNmsyCQ6Ti6R1KTHhxEkzq0nbzCvjDokXDadGAEO3QB8M7mGkI728ndzJH4k5a-l_fGZA3FXU5Feb6JStlh20WuZpjgVpYI54hQNbjdKzGI',
    imageAlt: 'Cambio de aceite de motor de moto',
    category: 'Mantenimiento',
    categoryColor: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
    title: 'Como elegir el aceite correcto para tu moto',
    summary: 'Una guia completa para entender las diferencias entre aceites sinteticos, semi-sinteticos y minerales, y cual es el mejor para tu motor segun el manual del fabricante.',
    date: '15 Feb 2026',
    link: '#',
  },
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9-jwAjE7ZYrC24m830BGJZRYvd8EvpBnedsixHiJ0kmAU0hTJE1CtU9yH65pqJ7AB-qsepOsBSQTHMi2HtLkNctxItu3tmJ3XSS2ON2KZaaMqnsSMaSRVWml74ISou-0eq9fU9Y-uIr5GQXKEDGkxepQSpXyP0QMk65JlBPoyR9pDUKYMGWzAQDWcwPYgFa_oqOBwXPbtFL7XY_r7tu-G_ejlydQ0he0iGwZFFB1Ps_X2ESrQbxDGHAc1OAVK6pajrC6BnVxRtPw0',
    imageAlt: 'Luces de alerta del tablero de moto',
    category: 'Consejos',
    categoryColor: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300',
    title: '5 senales de que tu moto necesita servicio urgente',
    summary: 'Aprende a identificar las senales de alerta auditivas y visuales antes de que se conviertan en problemas graves y costosos para tu bolsillo.',
    date: '10 Feb 2026',
    link: '#',
  },
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVoJVvySo1imCfnNnScdhM9lWrVYpAl6zi6-UTcpVRbZRgc9CMnriW7cJBrnxG-FFHJRzoQVx-nGyJfzixBX5N1TXHbDP-OnGMct54ZqQAL2xHctKTWL8ntLm3ZEc3yryNSyz35tL6Ws8N3vnz7TV4WDVrvjrT5szpL-NeSXyL4PPSbjD1DF3SMbRbAcZd1OfZzObhFdbS9r1KYtm0tTjOQfJsOnOE5b-LDF_dstkzY9TzZWCTuQOeZ2F_Nr1I8VMxy3wmw6N24ssN',
    imageAlt: 'Moto recorriendo una ruta de montana',
    category: 'Comunidad',
    categoryColor: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    title: 'Los mejores recorridos en moto del pais',
    summary: 'Descubri las rutas mas populares recomendadas por la comunidad MotoFIX. Paisajes increibles, paradas obligatorias y consejos de viaje.',
    date: '5 Feb 2026',
    link: '#',
  },
]

export default function Blog() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark text-[#181611] dark:text-gray-200 font-display">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto w-full">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Blog</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Consejos, novedades y guias para motociclistas y talleres.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, i) => (
            <article
              key={i}
              className="bg-white dark:bg-card-dark rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 dark:border-elevated-dark flex flex-col h-full group"
            >
              <div className="h-48 bg-gray-200 dark:bg-elevated-dark relative overflow-hidden">
                <img
                  src={article.image}
                  alt={article.imageAlt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all duration-300" />
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="mb-3">
                  <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-md ${article.categoryColor}`}>
                    {article.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
                  {article.summary}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-input-border-dark/50">
                  <span className="text-xs text-gray-400 dark:text-gray-500">{article.date}</span>
                  <Link
                    to={article.link}
                    className="text-sm font-semibold text-primary hover:text-[#d6aa28] dark:hover:text-yellow-400 flex items-center gap-1 transition-colors"
                  >
                    Leer mas
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <nav aria-label="Paginacion" className="flex items-center space-x-2">
            <button className="px-3 py-2 rounded-md border border-gray-300 dark:border-input-border-dark bg-white dark:bg-card-dark text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-elevated-dark transition-colors">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_left</span>
            </button>
            <button className="px-3 py-2 rounded-md bg-primary text-black text-sm font-medium">1</button>
            <button className="px-3 py-2 rounded-md border border-gray-300 dark:border-input-border-dark bg-white dark:bg-card-dark text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-elevated-dark transition-colors">2</button>
            <button className="px-3 py-2 rounded-md border border-gray-300 dark:border-input-border-dark bg-white dark:bg-card-dark text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-elevated-dark transition-colors">3</button>
            <button className="px-3 py-2 rounded-md border border-gray-300 dark:border-input-border-dark bg-white dark:bg-card-dark text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-elevated-dark transition-colors">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_right</span>
            </button>
          </nav>
        </div>
      </main>

      <Footer />
    </div>
  )
}
