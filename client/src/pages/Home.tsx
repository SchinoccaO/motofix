import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { scrollToId } from '../utils/scroll'

import imgNinja  from '../assets/icons/inicioninja.jpg'
import imgCorven from '../assets/icons/44bce802-0a36-4bfc-890a-ca215930e348.jpg'
import imgHonda  from '../assets/icons/c5ebd90e-c50c-4500-906b-357bcd04d748.jpg'
import imgCafe   from '../assets/icons/711dc29f-034c-4efa-8f53-3c799a79eb36.jpg'

const SLIDES = [
    { src: imgNinja,  alt: 'Kawasaki Ninja en taller MotoFIX' },
    { src: imgCorven, alt: 'Corven Triax 250 en garaje' },
    { src: imgHonda,  alt: 'Honda CB en calle de Córdoba' },
    { src: imgCafe,   alt: 'Moto clásica en taller especializado' },
]

const STEPS = [
    { icon: 'location_on', title: 'Elegí tu zona',   desc: 'Filtrá por ubicación y encontrá las opciones más cercanas a vos, ya sea taller o casa de repuestos.' },
    { icon: 'star',        title: 'Compará reseñas', desc: 'Lee opiniones 100% reales de otros motociclistas sobre el servicio, precios y atención.' },
    { icon: 'build',       title: 'Repará tu moto',  desc: 'Contactá al taller directamente por WhatsApp o llamada y solucioná tu problema.' },
]

const FEATURES = [
    { icon: 'verified',   title: 'Reseñas Reales',        desc: 'Opiniones verificadas de usuarios reales. Adiós a las sorpresas.' },
    { icon: 'schedule',   title: 'Tiempos Claros',        desc: 'Información sobre disponibilidad y demoras promedio del taller.' },
    { icon: 'near_me',    title: 'Cercanía',              desc: 'Geolocalización precisa para urgencias en la ruta o ciudad.' },
    { icon: 'payments',   title: 'Precios Transparentes', desc: 'Rangos de precios estimados por tipo de servicio.' },
    { icon: 'groups',     title: 'Comunidad',             desc: 'Foros y preguntas frecuentes respondidas por expertos.' },
    { icon: 'motorcycle', title: 'Especialistas',         desc: 'Filtrá por marca y modelo de tu moto.' },
]

const AVATAR_IDS = [
    'AB6AXuCk9LG2c7_8npsPaImWPeYYLpRXmUk6uXcoDt8elvjKLk2Y2fXAoS7azFR-YQbe9PxYo_CW9zjJbPtfyiinMMVMqqrgBF-EkRj8VrZpDFTqdaiXue181fvgOhpcXqlhXN63jc5unhGWxglBt0whKjoM5doeNW0nGpiWg1yvh33UvNEAdEIFETofkm91c8oGt2vtWvji0Pz_u7zbuUv8xnqkph1tuvm9-udRxGCGvMRD_Vt9kwf7WADwswQsVTRXon60-4keDicgue7p',
    'AB6AXuAT6pOXv2GGiQFyRyDsRobweumF46j9DMxAG22RVaVy-MdC6cO1PqtDWSrk8F9bUeualHQvJ01Iv7SqqJym0N-sbxajLgkk7BpVHBACCGcwwDfdyOB-Aticcb2-fhumoY2vi3uyLc15aZMgzfXgUA4ayo4vDjzP8T4FVmhxYQm-WSpKnGNUIqGydKnEf21Fd5ffxIOjv0G5gdHvgproGyjY6ej7foi8_xrQ445zaea8L1EqbnzDegd8VBNZ9iE2Wk1-f3eId6BITyRE',
    'AB6AXuAXgMMit5f3R6hl4f2hHX__INpDfAG_7gfQzHd9ArqE2TkmrGkUpKkyfNLrs5B4MMdCJNVCTI5F7S4h89kvlQL7Du-eE4wLIRf282iMSOfap43U2A2pvWbIKDKL9P5hiUK8m-qa9CDfBBJPMtvegzxaTwi34tVyJOtVnNsxmgmY--HfvARVETE_xSVYv8Y1hg9uc2TiPYkjTrrRbI4A-8fQYbW04Pq6-B9CMNKXvwtKwBmenTBNwaqzexr1q3wgryuAEq68wTpAYJyJF',
]

export default function Home() {
    const [searchTerm, setSearchTerm] = useState('')
    const [slide, setSlide] = useState(0)
    const navigate = useNavigate()

    useEffect(() => {
        const t = setInterval(() => setSlide(p => (p + 1) % SLIDES.length), 4500)
        return () => clearInterval(t)
    }, [])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        const q = searchTerm.trim()
        navigate(q ? `/talleres?search=${encodeURIComponent(q)}` : '/talleres')
    }

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark text-[#181611] dark:text-gray-200 font-display">
            <Navbar activePage="home" />

            {/* ── HERO ──────────────────────────────────────────────────────── */}
            <section className="bg-white dark:bg-background-dark">
                <div className="max-w-[1280px] mx-auto px-4 py-12 md:px-10 md:py-16 lg:py-20">
                    <div className="flex flex-col-reverse lg:flex-row gap-10 xl:gap-16 items-center">

                        {/* Left ─ copy + search */}
                        <div className="flex flex-col gap-7 flex-1 text-left">
                            <div className="flex flex-col gap-3 animate-fade-up [animation-delay:0ms]">
                                <h1 className="text-[#181611] dark:text-white text-3xl sm:text-4xl font-black leading-tight tracking-tight">
                                    Tu taller de confianza,{' '}
                                    <span className="text-primary">más cerca.</span>
                                </h1>
                                <p className="text-gray-700 dark:text-gray-400 text-base leading-relaxed max-w-[440px]">
                                    Encontrá mecánicos y repuestos calificados por la comunidad
                                    motoquera. Transparencia y rapidez para que vuelvas a rodar.
                                </p>
                            </div>

                            {/* Search */}
                            <form onSubmit={handleSearch} className="flex flex-col gap-2 w-full max-w-[480px] animate-fade-up [animation-delay:120ms]">
                                <div className="flex w-full items-stretch h-12 rounded-lg overflow-hidden border border-[#b8b3aa] dark:border-input-border-dark focus-within:border-primary/60 dark:focus-within:border-primary/50 transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.10)]">
                                    <div className="flex items-center flex-1 bg-[#edeae5] dark:bg-card-dark px-4 gap-3">
                                        <span className="material-symbols-outlined text-gray-400 flex-shrink-0" style={{ fontSize: '18px' }}>
                                            search
                                        </span>
                                        <input
                                            className="w-full bg-transparent border-none text-[#181611] dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none"
                                            placeholder="Ej: Cambio de aceite, frenos, cadena..."
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="px-5 bg-primary hover:bg-primary-hover transition-colors text-[#181611] text-sm font-bold whitespace-nowrap cursor-pointer"
                                    >
                                        Buscar
                                    </button>
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-500 pl-1">
                                    Ej: Argüello, Villa Allende, Maipú...
                                </span>
                            </form>

                            {/* Trust badges */}
                            <div className="flex items-center gap-3 animate-fade-up [animation-delay:200ms]">
                                <div className="flex -space-x-2">
                                    {AVATAR_IDS.map((id, i) => (
                                        <img
                                            key={i}
                                            alt="Motero"
                                            className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-card-dark object-cover"
                                            src={`https://lh3.googleusercontent.com/aida-public/${id}`}
                                        />
                                    ))}
                                </div>
                                <p className="text-xs font-medium text-gray-700 dark:text-gray-400">
                                    +1000 moteros confían en nosotros
                                </p>
                            </div>

                        </div>

                        {/* Right ─ carousel */}
                        <div className="w-full flex-1 max-w-[520px] animate-fade-up [animation-delay:80ms]">
                            <div
                                className="relative rounded-xl overflow-hidden shadow-2xl dark:shadow-[0_24px_64px_rgba(0,0,0,0.75)] ring-1 ring-black/10 dark:ring-white/[0.06]"
                                style={{ aspectRatio: '16/10' }}
                            >
                                {SLIDES.map((img, i) => (
                                    <img
                                        key={i}
                                        src={img.src}
                                        alt={img.alt}
                                        loading={i === 0 ? "eager" : "lazy"}
                                        fetchPriority={i === 0 ? "high" : "low"}
                                        decoding={i === 0 ? "sync" : "async"}
                                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                                            i === slide ? 'opacity-100' : 'opacity-0'
                                        }`}
                                    />
                                ))}

                                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/55 to-transparent pointer-events-none" />

                                {/* Arrow prev */}
                                <button
                                    onClick={() => setSlide(p => (p - 1 + SLIDES.length) % SLIDES.length)}
                                    aria-label="Imagen anterior"
                                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/35 hover:bg-black/55 backdrop-blur-sm flex items-center justify-center text-white transition-all"
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: '20px', lineHeight: 1 }}>chevron_left</span>
                                </button>

                                {/* Arrow next */}
                                <button
                                    onClick={() => setSlide(p => (p + 1) % SLIDES.length)}
                                    aria-label="Siguiente imagen"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/35 hover:bg-black/55 backdrop-blur-sm flex items-center justify-center text-white transition-all"
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: '20px', lineHeight: 1 }}>chevron_right</span>
                                </button>

                                {/* Dots */}
                                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-10">
                                    {SLIDES.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSlide(i)}
                                            aria-label={`Imagen ${i + 1}`}
                                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                                i === slide ? 'bg-primary w-5' : 'bg-white/50 hover:bg-white/75 w-1.5'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                {/* Scroll indicator — sin texto, solo ícono animado */}
                <div className="flex justify-center pb-4 md:pb-6 mt-2">
                    <button
                        onClick={() => scrollToId('como-funciona')}
                        aria-label="Ver cómo funciona"
                        className="animate-bounce text-gray-300 dark:text-gray-600 hover:text-primary dark:hover:text-primary transition-colors"
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>keyboard_arrow_down</span>
                    </button>
                </div>
            </section>

            {/* ── CÓMO FUNCIONA ─────────────────────────────────────────────── */}
            <section id="como-funciona" className="bg-[#fcfbf9] dark:bg-surface-dark">
                <div className="max-w-[1280px] mx-auto px-4 py-16 md:px-10 md:py-24">
                    <div className="flex flex-col gap-12">
                        <div className="flex flex-col gap-2">
                            <h2 className="text-[#181611] dark:text-white text-3xl sm:text-4xl font-black leading-tight tracking-tight">
                                Cómo funciona
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-[480px]">
                                Encontrá lo que necesitás en 3 simples pasos.
                            </p>
                        </div>

                        {/*
                          Mobile: horizontal (ícono izq, texto der) — compacto y escaneable.
                          Desktop md+: 3 columnas verticales.
                        */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                            {STEPS.map((step, i) => (
                                <div
                                    key={step.title}
                                    className="flex flex-col gap-4 p-5 md:p-6 rounded-xl bg-white dark:bg-card-dark border border-[#e5e3dc] dark:border-input-border-dark"
                                >
                                    {/* Número grande + ícono en la misma fila */}
                                    <div className="flex items-start justify-between">
                                        <span className="text-6xl font-black leading-none text-primary/20 dark:text-primary/15 tabular-nums select-none">
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        <div className="bg-primary/10 dark:bg-primary/15 rounded-xl p-3 flex items-center justify-center">
                                            <span
                                                className="material-symbols-outlined text-primary"
                                                style={{ fontSize: '26px', fontVariationSettings: "'FILL' 1" }}
                                            >
                                                {step.icon}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <h3 className="text-[#181611] dark:text-white text-lg font-bold leading-tight">
                                            {step.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── POR QUÉ ELEGIRNOS ─────────────────────────────────────────── */}
            <section className="bg-white dark:bg-background-dark">
                <div className="max-w-[1280px] mx-auto px-4 py-16 md:px-10 md:py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 lg:gap-16 items-start">

                        {/* Left */}
                        <div className="flex flex-col items-start gap-4">
                            <h2 className="text-[#181611] dark:text-white text-3xl sm:text-4xl font-black leading-tight tracking-tight">
                                Por qué elegir <span className="text-primary">MotoFIX</span>
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 text-lg">
                                Transparencia y confianza para tu moto.
                            </p>
                            <Link
                                to="/talleres"
                                className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline underline-offset-2 mt-1"
                            >
                                Ver talleres disponibles
                                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
                            </Link>
                        </div>

                        {/*
                          Mobile: 2 columnas desde el principio — 6 features = 3 filas de 2.
                          Desktop lg: 3 columnas.
                        */}
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                            {FEATURES.map(f => (
                                <div key={f.title} className="flex gap-3">
                                    <span
                                        className="material-symbols-outlined text-primary shrink-0 mt-0.5"
                                        style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}
                                    >
                                        {f.icon}
                                    </span>
                                    <div className="flex flex-col gap-1">
                                        <h3 className="text-[#181611] dark:text-white text-xs sm:text-sm font-bold">
                                            {f.title}
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">
                                            {f.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA TALLER ────────────────────────────────────────────────── */}
            <section className="bg-[#0F1621] dark:bg-surface-dark border-y border-white/[0.06] dark:border-primary/15">
                <div className="max-w-[1280px] mx-auto px-4 py-16 md:px-10 md:py-20">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">

                        <div className="flex flex-col gap-4 text-center md:text-left max-w-[580px]">
                            <h2 className="text-white text-3xl sm:text-4xl font-black leading-tight tracking-tight">
                                ¿Tenés un taller mecánico?
                            </h2>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                Sumate a <strong className="text-primary font-semibold">MotoFIX</strong> y llegá a más
                                clientes en tu zona. Gestioná tu reputación y construí confianza online.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                            <Link
                                to="/registro-taller"
                                className="flex min-w-[160px] items-center justify-center rounded-lg h-12 px-6 bg-primary hover:bg-primary-hover transition-colors text-[#181611] text-base font-bold"
                            >
                                Registrar mi taller
                            </Link>
                            <Link
                                to="/sobre-nosotros"
                                className="flex min-w-[160px] items-center justify-center rounded-lg h-12 px-6 border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all text-white text-base font-semibold"
                            >
                                Más información
                            </Link>
                        </div>

                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
