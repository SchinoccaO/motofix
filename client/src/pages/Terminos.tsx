import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Terminos() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark text-[#181611] dark:text-gray-200 font-display">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10">

          {/* ══════════════════════════════════════════════════════════════
              SECCIÓN: TÍTULO PRINCIPAL
              Editá el título y fecha de última actualización
              ══════════════════════════════════════════════════════════════ */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
              Términos y condiciones
            </h1>
            {/* EDITAR: Cambiá la fecha de última actualización */}
            <p className="text-gray-500 dark:text-gray-400 text-sm">Última actualización: 17 de febrero de 2026</p>
          </div>

          <div className="bg-white dark:bg-card-dark rounded-xl p-6 md:p-10 shadow-sm border border-[#f4f3f0] dark:border-elevated-dark">
            <div className="prose prose-sm max-w-none text-gray-600 dark:text-gray-400 space-y-6">

              {/* ══════════════════════════════════════════════════════════════
                  SECCIÓN 1: ACEPTACIÓN DE LOS TÉRMINOS
                  Editá el contenido de esta sección
                  ══════════════════════════════════════════════════════════════ */}
              <section>
                <h2 className="text-lg font-bold text-[#181611] dark:text-white mb-3">1. Aceptación de los términos</h2>
                <p className="leading-relaxed">
                  {/* EDITAR: Reemplazá este texto con tus términos reales */}
                  Al acceder y utilizar la plataforma MotoFIX, aceptás cumplir con estos términos y condiciones.
                  Si no estás de acuerdo con alguno de estos términos, te pedimos que no utilices nuestros servicios.
                </p>
              </section>

              {/* ══════════════════════════════════════════════════════════════
                  SECCIÓN 2: DESCRIPCIÓN DEL SERVICIO
                  Editá el contenido de esta sección
                  ══════════════════════════════════════════════════════════════ */}
              <section>
                <h2 className="text-lg font-bold text-[#181611] dark:text-white mb-3">2. Descripción del servicio</h2>
                <p className="leading-relaxed">
                  {/* EDITAR: Reemplazá este texto con tu descripción del servicio */}
                  MotoFIX es una plataforma que conecta motociclistas con talleres mecánicos y proveedores de repuestos.
                  Facilitamos la búsqueda, comparación y evaluación de servicios mecánicos.
                </p>
              </section>

              {/* ══════════════════════════════════════════════════════════════
                  SECCIÓN 3: CUENTAS DE USUARIO
                  Editá el contenido de esta sección
                  ══════════════════════════════════════════════════════════════ */}
              <section>
                <h2 className="text-lg font-bold text-[#181611] dark:text-white mb-3">3. Cuentas de usuario</h2>
                <p className="leading-relaxed">
                  {/* EDITAR: Reemplazá este texto con tus políticas de cuentas */}
                  Para utilizar ciertas funciones de la plataforma, es necesario crear una cuenta.
                  Sos responsable de mantener la confidencialidad de tu contraseña y de toda la actividad en tu cuenta.
                </p>
              </section>

              {/* ══════════════════════════════════════════════════════════════
                  SECCIÓN 4: USO ACEPTABLE
                  Editá el contenido de esta sección
                  ══════════════════════════════════════════════════════════════ */}
              <section>
                <h2 className="text-lg font-bold text-[#181611] dark:text-white mb-3">4. Uso aceptable</h2>
                <p className="leading-relaxed">
                  {/* EDITAR: Reemplazá este texto con tus políticas de uso */}
                  Te comprometés a utilizar la plataforma de forma responsable y legal.
                  No está permitido publicar contenido falso, ofensivo o que viole los derechos de terceros.
                </p>
              </section>

              {/* ══════════════════════════════════════════════════════════════
                  SECCIÓN 5: RESEÑAS Y CONTENIDO
                  Editá el contenido de esta sección
                  ══════════════════════════════════════════════════════════════ */}
              <section>
                <h2 className="text-lg font-bold text-[#181611] dark:text-white mb-3">5. Reseñas y contenido del usuario</h2>
                <p className="leading-relaxed">
                  {/* EDITAR: Reemplazá este texto con tus políticas de contenido */}
                  Las reseñas deben reflejar experiencias reales. Nos reservamos el derecho de moderar
                  y eliminar contenido que no cumpla con nuestras políticas.
                </p>
              </section>

              {/* ══════════════════════════════════════════════════════════════
                  SECCIÓN 6: LIMITACIÓN DE RESPONSABILIDAD
                  Editá el contenido de esta sección
                  ══════════════════════════════════════════════════════════════ */}
              <section>
                <h2 className="text-lg font-bold text-[#181611] dark:text-white mb-3">6. Limitación de responsabilidad</h2>
                <p className="leading-relaxed">
                  {/* EDITAR: Reemplazá este texto con tus limitaciones legales */}
                  MotoFIX actúa como intermediario entre motociclistas y talleres. No somos responsables
                  por la calidad de los servicios prestados por los talleres registrados en la plataforma.
                </p>
              </section>

              {/* ══════════════════════════════════════════════════════════════
                  SECCIÓN 7: CONTACTO
                  Editá el email de contacto
                  ══════════════════════════════════════════════════════════════ */}
              <section>
                <h2 className="text-lg font-bold text-[#181611] dark:text-white mb-3">7. Contacto</h2>
                <p className="leading-relaxed">
                  {/* EDITAR: Cambiá el email de contacto */}
                  Para consultas sobre estos términos, escribinos a{' '}
                  <a href="mailto:legal@motofix.com" className="text-primary hover:underline">legal@motofix.com</a>.
                </p>
              </section>

              {/* EDITAR: Agregá más secciones copiando el formato <section> de arriba */}

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
