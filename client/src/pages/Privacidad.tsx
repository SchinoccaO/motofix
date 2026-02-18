import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Privacidad() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light text-[#181611] font-display">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10">

          {/* ══════════════════════════════════════════════════════════════
              SECCIÓN: TÍTULO PRINCIPAL
              Editá el título y fecha de última actualización
              ══════════════════════════════════════════════════════════════ */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
              Política de privacidad
            </h1>
            {/* EDITAR: Cambiá la fecha de última actualización */}
            <p className="text-gray-500 text-sm">Última actualización: 17 de febrero de 2026</p>
          </div>

          <div className="bg-white dark:bg-card-dark rounded-xl p-6 md:p-10 shadow-sm border border-[#f4f3f0] dark:border-gray-800">
            <div className="prose prose-sm max-w-none text-gray-600 dark:text-gray-400 space-y-6">

              {/* ══════════════════════════════════════════════════════════════
                  SECCIÓN 1: INFORMACIÓN QUE RECOPILAMOS
                  Editá el contenido de esta sección
                  ══════════════════════════════════════════════════════════════ */}
              <section>
                <h2 className="text-lg font-bold text-[#181611] dark:text-white mb-3">1. Información que recopilamos</h2>
                <p className="leading-relaxed">
                  {/* EDITAR: Reemplazá este texto con tu política real */}
                  Recopilamos información que nos proporcionás directamente al crear una cuenta,
                  como tu nombre, dirección de email y foto de perfil. También recopilamos datos
                  de uso de la plataforma para mejorar nuestros servicios.
                </p>
              </section>

              {/* ══════════════════════════════════════════════════════════════
                  SECCIÓN 2: CÓMO USAMOS TU INFORMACIÓN
                  Editá el contenido de esta sección
                  ══════════════════════════════════════════════════════════════ */}
              <section>
                <h2 className="text-lg font-bold text-[#181611] dark:text-white mb-3">2. Cómo usamos tu información</h2>
                <p className="leading-relaxed mb-3">
                  {/* EDITAR: Reemplazá este texto con tus usos reales */}
                  Utilizamos tu información personal para:
                </p>
                {/* EDITAR: Cambiá o agregá items a esta lista */}
                <ul className="list-disc pl-5 space-y-2">
                  <li>Proveer y mantener nuestros servicios</li>
                  <li>Personalizar tu experiencia en la plataforma</li>
                  <li>Comunicarnos contigo sobre actualizaciones y novedades</li>
                  <li>Mejorar la seguridad de la plataforma</li>
                </ul>
              </section>

              {/* ══════════════════════════════════════════════════════════════
                  SECCIÓN 3: COMPARTIR INFORMACIÓN
                  Editá el contenido de esta sección
                  ══════════════════════════════════════════════════════════════ */}
              <section>
                <h2 className="text-lg font-bold text-[#181611] dark:text-white mb-3">3. Compartir información</h2>
                <p className="leading-relaxed">
                  {/* EDITAR: Reemplazá este texto con tu política real */}
                  No vendemos ni compartimos tu información personal con terceros, excepto cuando
                  sea necesario para proveer nuestros servicios o cuando lo requiera la ley.
                </p>
              </section>

              {/* ══════════════════════════════════════════════════════════════
                  SECCIÓN 4: COOKIES
                  Editá el contenido de esta sección
                  ══════════════════════════════════════════════════════════════ */}
              <section>
                <h2 className="text-lg font-bold text-[#181611] dark:text-white mb-3">4. Cookies y tecnologías similares</h2>
                <p className="leading-relaxed">
                  {/* EDITAR: Reemplazá este texto con tu política de cookies */}
                  Usamos cookies y tecnologías similares para mejorar tu experiencia de navegación,
                  analizar el tráfico del sitio y personalizar contenido.
                </p>
              </section>

              {/* ══════════════════════════════════════════════════════════════
                  SECCIÓN 5: SEGURIDAD DE DATOS
                  Editá el contenido de esta sección
                  ══════════════════════════════════════════════════════════════ */}
              <section>
                <h2 className="text-lg font-bold text-[#181611] dark:text-white mb-3">5. Seguridad de los datos</h2>
                <p className="leading-relaxed">
                  {/* EDITAR: Reemplazá este texto con tus medidas de seguridad */}
                  Implementamos medidas de seguridad técnicas y organizativas para proteger
                  tu información personal contra acceso no autorizado, alteración o destrucción.
                </p>
              </section>

              {/* ══════════════════════════════════════════════════════════════
                  SECCIÓN 6: TUS DERECHOS
                  Editá el contenido de esta sección
                  ══════════════════════════════════════════════════════════════ */}
              <section>
                <h2 className="text-lg font-bold text-[#181611] dark:text-white mb-3">6. Tus derechos</h2>
                <p className="leading-relaxed mb-3">
                  {/* EDITAR: Reemplazá este texto con los derechos del usuario */}
                  Tenés derecho a:
                </p>
                {/* EDITAR: Cambiá o agregá items a esta lista */}
                <ul className="list-disc pl-5 space-y-2">
                  <li>Acceder a tu información personal</li>
                  <li>Corregir datos inexactos</li>
                  <li>Solicitar la eliminación de tu cuenta y datos</li>
                  <li>Oponerte al procesamiento de tu información</li>
                </ul>
              </section>

              {/* ══════════════════════════════════════════════════════════════
                  SECCIÓN 7: CONTACTO
                  Editá el email de contacto
                  ══════════════════════════════════════════════════════════════ */}
              <section>
                <h2 className="text-lg font-bold text-[#181611] dark:text-white mb-3">7. Contacto</h2>
                <p className="leading-relaxed">
                  {/* EDITAR: Cambiá el email de contacto */}
                  Para consultas sobre esta política de privacidad, escribinos a{' '}
                  <a href="mailto:privacidad@motofix.com" className="text-primary hover:underline">privacidad@motofix.com</a>.
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
