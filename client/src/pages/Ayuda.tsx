import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Ayuda() {
  /* ══════════════════════════════════════════════════════════════
     EDITAR: Preguntas frecuentes (FAQ)
     Cambiá, agregá o eliminá preguntas y respuestas en este array.
     ══════════════════════════════════════════════════════════════ */
  const faqs = [
    {
      question: '¿Cómo busco un taller?',
      answer: 'Podés usar la barra de búsqueda en la página principal o ir a "Talleres y Repuestos" en el menú de navegación. Filtrá por ubicación, tipo de servicio o marca.',
    },
    {
      question: '¿Cómo registro mi taller en MotoFIX?',
      answer: 'Hacé clic en "Registrar taller" en el menú de navegación y completá el formulario con los datos de tu taller. Una vez registrado, los motociclistas podrán encontrarte.',
    },
    {
      question: '¿Cómo dejo una reseña?',
      answer: 'Entrá al perfil del taller que querés reseñar y hacé clic en el botón "Escribir reseña". Necesitás tener una cuenta para dejar reseñas.',
    },
    {
      question: '¿Es gratis usar MotoFIX?',
      answer: 'Sí, MotoFIX es completamente gratuito para motociclistas. Los talleres pueden registrarse sin costo.',
    },
    {
      question: '¿Cómo contacto al soporte?',
      answer: 'Podés escribirnos a soporte@motofix.com o usar el formulario de contacto más abajo.',
    },
    // EDITAR: Agregá más preguntas copiando el formato { question: '...', answer: '...' }
  ]

  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light text-[#181611] font-display">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10">

          {/* ══════════════════════════════════════════════════════════════
              SECCIÓN: TÍTULO PRINCIPAL
              Editá el título y subtítulo de la página de ayuda
              ══════════════════════════════════════════════════════════════ */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
              Centro de ayuda
            </h1>
            <p className="text-gray-500 text-base max-w-2xl">
              {/* EDITAR: Cambiá esta descripción introductoria */}
              ¿Tenés dudas? Encontrá respuestas a las preguntas más frecuentes o contactanos.
            </p>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              SECCIÓN: PREGUNTAS FRECUENTES (FAQ)
              Las preguntas se editan en el array "faqs" de arriba.
              ══════════════════════════════════════════════════════════════ */}
          <section className="bg-white dark:bg-card-dark rounded-xl p-6 md:p-10 mb-8 shadow-sm border border-[#f4f3f0] dark:border-gray-800">
            <h2 className="text-xl font-bold mb-6">Preguntas frecuentes</h2>
            <div className="flex flex-col divide-y divide-[#f4f3f0] dark:divide-gray-700">
              {faqs.map((faq, index) => (
                <div key={index} className="py-4">
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="flex items-center justify-between w-full text-left gap-4"
                  >
                    <span className="font-medium">{faq.question}</span>
                    <span className="material-symbols-outlined text-gray-400 shrink-0 transition-transform duration-200" style={{ transform: openIndex === index ? 'rotate(180deg)' : '' }}>
                      expand_more
                    </span>
                  </button>
                  {openIndex === index && (
                    <p className="text-gray-500 text-sm mt-3 leading-relaxed">
                      {faq.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════
              SECCIÓN: FORMULARIO DE CONTACTO
              Editá los campos, el email de destino y el texto del botón.
              Nota: Este formulario es solo visual (front-end).
              Necesitás conectarlo a tu backend o servicio de email.
              ══════════════════════════════════════════════════════════════ */}
          <section className="bg-white dark:bg-card-dark rounded-xl p-6 md:p-10 shadow-sm border border-[#f4f3f0] dark:border-gray-800">
            <h2 className="text-xl font-bold mb-6">¿No encontraste lo que buscabas?</h2>
            <p className="text-gray-500 text-sm mb-6">
              {/* EDITAR: Cambiá este texto */}
              Escribinos y te respondemos a la brevedad.
            </p>
            <form className="flex flex-col gap-4 max-w-lg" onSubmit={(e) => e.preventDefault()}>
              {/* EDITAR: Podés agregar o quitar campos del formulario */}
              <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  className="w-full px-4 py-2.5 rounded-lg border border-input-border dark:border-input-border-dark bg-transparent text-sm focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-input-border dark:border-input-border-dark bg-transparent text-sm focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mensaje</label>
                <textarea
                  rows={4}
                  placeholder="¿En qué podemos ayudarte?"
                  className="w-full px-4 py-2.5 rounded-lg border border-input-border dark:border-input-border-dark bg-transparent text-sm focus:outline-none focus:border-primary/50 transition-colors resize-none"
                />
              </div>
              {/* EDITAR: Conectá este botón a tu backend para enviar el formulario */}
              <button
                type="submit"
                className="self-start px-6 py-2.5 bg-primary hover:bg-[#d6aa28] text-[#181611] text-sm font-bold rounded-lg transition-colors"
              >
                Enviar mensaje
              </button>
            </form>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  )
}
