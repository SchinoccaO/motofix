import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import Logo from '../components/Logo'
import Footer from '../components/Footer'

export default function Home() {
    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light text-[#181611] font-display">
            {/* Top Navigation Bar */}
            <header className="bg-white border-b border-solid border-b-[#f4f3f0]">
                <div className="px-4 md:px-10 py-3 flex items-center justify-between max-w-[1280px] mx-auto w-full">
                    <Link to="/" className="flex items-center gap-3 text-[#181611]">
                        <Logo />
                        <h2 className="text-[#181611] text-xl font-bold leading-tight tracking-tight">MotoFIX</h2>
                    </Link>
                    <div className="hidden md:flex flex-1 justify-end gap-8">
                        <div className="flex items-center gap-9">
                            <Link to="/talleres" className="text-[#181611] text-sm font-medium leading-normal hover:text-primary transition-colors">Talleres</Link>
                            <a className="text-[#181611] text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">Repuestos</a>
                            <Link to="/resena" className="text-[#181611] text-sm font-medium leading-normal hover:text-primary transition-colors">Dejar reseña</Link>
                            <a className="text-[#181611] text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">Cómo funciona</a>
                        </div>
                        <Link
                            to="/talleres"
                            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary hover:bg-[#d6aa28] transition-colors text-[#181611] text-sm font-bold leading-normal tracking-[0.015em]"
                        >
                            <span className="truncate">Buscar talleres</span>
                        </Link>
                    </div>
                    <div className="md:hidden">
                        <button className="text-[#181611]">
                            <Icon name="menu" size={24} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <div className="flex-1 justify-center py-5 bg-white">
                <div className="layout-content-container flex flex-col max-w-[1280px] mx-auto flex-1">
                    <div className="@container">
                        <div className="flex flex-col-reverse lg:flex-row gap-8 px-4 py-10 md:px-10 items-center">
                            <div className="flex flex-col gap-4 text-left flex-1">
                                <div className="flex flex-col gap-3">
                                    <h1 className="text-[#181611] text-3xl font-black leading-tight tracking-tight @[480px]:text-4xl">
                                        El taller de confianza, <span className="text-primary">más cerca.</span>
                                    </h1>
                                    <p className="text-[#181611] text-base font-normal leading-normal">
                                        Encontrá mecánicos y repuestos calificados por la comunidad motera. Transparencia y rapidez para que vuelvas a rodar.
                                    </p>
                                </div>
                                <label className="flex flex-col w-full max-w-[500px]">
                                    <div className="flex w-full items-stretch rounded-lg h-12">
                                        <div className="flex items-center flex-1 bg-[#f4f3f0] rounded-l-lg border border-transparent focus-within:border-primary/50 transition-colors">
                                            <div className="text-[#887f63] flex items-center justify-center pl-3">
                                                <Icon name="search" size={20} />
                                            </div>
                                            <input
                                                className="flex w-full min-w-0 flex-1 resize-none overflow-hidden text-[#181611] text-sm focus:outline-0 bg-transparent border-none placeholder:text-[#887f63] px-3 h-full font-normal"
                                                placeholder="Ej: Cambio de aceite, Frenos..."
                                            />
                                        </div>
                                        <button className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-r-lg px-5 bg-primary hover:bg-[#d6aa28] transition-colors text-[#181611] text-sm font-bold">
                                            <span className="truncate">Buscar</span>
                                        </button>
                                    </div>
                                    <span className="text-xs text-gray-500 mt-2">Ej: Palermo, Belgrano, Centro...</span>
                                </label>
                                {/* Trust badges */}
                                <div className="flex items-center gap-3">
                                    <div className="flex -space-x-2">
                                        <img
                                            alt="User avatar"
                                            className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCk9LG2c7_8npsPaImWPeYYLpRXmUk6uXcoDt8elvjKLk2Y2fXAoS7azFR-YQbe9PxYo_CW9zjJbPtfyiinMMVMqqrgBF-EkRj8VrZpDFTqdaiXue181fvgOhpcXqlhXN63jc5unhGWxglBt0whKjoM5doeNW0nGpiWg1yvh33UvNEAdEIFETofkm91c8oGt2vtWvji0Pz_u7zbuUv8xnqkph1tuvm9-udRxGCGvMRD_Vt9kwf7WADwswQsVTRXon60-4keDicgue7p"
                                        />
                                        <img
                                            alt="User avatar"
                                            className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAT6pOXv2GGiQFyRyDsRobweumF46j9DMxAG22RVaVy-MdC6cO1PqtDWSrk8F9bUeualHQvJ01Iv7SqqJym0N-sbxajLgkk7BpVHBACCGcwwDfdyOB-Aticcb2-fhumoY2vi3uyLc15aZMgzfXgUA4ayo4vDjzP8T4FVmhxYQm-WSpKnGNUIqGydKnEf21Fd5ffxIOjv0G5gdHvgproGyjY6ej7foi8_xrQ445zaea8L1EqbnzDegd8VBNZ9iE2Wk1-f3eId6BITyRE"
                                        />
                                        <img
                                            alt="User avatar"
                                            className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXgMMit5f3R6hl4f2hHX__INpDfAG_7gfQzHd9ArqE2TkmrGkUpKkyfNLrs5B4MMdCJNVCTI5F7S4h89kvlQL7Du-eE4wLIRf282iMSOfap43U2A2vWbIKDKL9P5hiUK8m-qa9CDfBBJPMtvegzxaTwi34tVyJOtVnNsxmgmY--HfvARVETE_xSVYv8Y1hg9uc2TiPYkjTrrRbI4A-8fQYbW04Pq6-B9CMNKXvwtKwBmenTBNwaqzexr1q3wgryuAEq68wTpAYJyJF"
                                        />
                                    </div>
                                    <p className="text-xs font-medium text-gray-600">+1000 moteros confían en nosotros</p>
                                </div>
                            </div>
                            <div
                                className="w-full bg-center bg-no-repeat bg-cover rounded-xl shadow-lg flex-1 max-w-[480px]"
                                style={{
                                    backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCwL1G3THtpq6QwJ4058HyUXlDZPghOx_Zc3gpu8zBATUstkbsY26GQHRJmHwrXloT7_ZW8SPDv6xw6iQfRddzlM1QsXtZyhz4kNvML96Sp49SIyo3AyOnkLuS3ChpEWjne1jwcGE4eWNqpPjfqiRwWEC8rhuzNS5IYxisAi6ubmbY2NqoqzCP9xx8gPk-HQ7mR6WD62erbENPr_UqIGkRCJG8WYiliCmExV9FpGDVZ8VEcj-0cgk69o_r_-niquovmSdeNwhWZAcZR")',
                                    aspectRatio: '16/10',
                                    minHeight: '280px'
                                }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="flex-1 justify-center py-5 bg-[#fcfbf9]">
                <div className="layout-content-container flex flex-col max-w-[1280px] mx-auto flex-1">
                    <div className="flex flex-col gap-10 px-4 py-16 md:px-10 @container">
                        <div className="flex flex-col gap-4 text-center items-center">
                            <h1 className="text-[#181611] tracking-tight text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black max-w-[720px]">
                                Cómo funciona
                            </h1>
                            <p className="text-gray-600 text-lg font-normal leading-normal max-w-[720px]">
                                Encontrá lo que necesitás en 3 simples pasos.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-0">
                            <div className="flex flex-1 gap-6 rounded-xl border border-[#e5e3dc] bg-white p-8 flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
                                <div className="text-[#181611] bg-primary/20 p-4 rounded-full flex items-center justify-center size-16">
                                    <Icon name="location_on" size={36} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h2 className="text-[#181611] text-xl font-bold leading-tight">1. Elegí tu zona</h2>
                                    <p className="text-gray-600 text-base font-normal leading-relaxed">
                                        Filtrá por ubicación y encontrá las opciones más cercanas a vos, ya sea taller o casa de repuestos.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-1 gap-6 rounded-xl border border-[#e5e3dc] bg-white p-8 flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
                                <div className="text-[#181611] bg-primary/20 p-4 rounded-full flex items-center justify-center size-16">
                                    <Icon name="star" size={36} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h2 className="text-[#181611] text-xl font-bold leading-tight">2. Compará reseñas</h2>
                                    <p className="text-gray-600 text-base font-normal leading-relaxed">
                                        Lee opiniones 100% reales de otros motociclistas sobre el servicio, precios y atención.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-1 gap-6 rounded-xl border border-[#e5e3dc] bg-white p-8 flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
                                <div className="text-[#181611] bg-primary/20 p-4 rounded-full flex items-center justify-center size-16">
                                    <Icon name="build" size={36} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h2 className="text-[#181611] text-xl font-bold leading-tight">3. Repará tu moto</h2>
                                    <p className="text-gray-600 text-base font-normal leading-relaxed">
                                        Contactá al taller directamente a través de WhatsApp o llamada y solucioná tu problema.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Value Props Section */}
            {/* Value Props Section */}
            <div className="flex-1 justify-center py-5 bg-white">
                <div className="layout-content-container max-w-[1280px] mx-auto px-4 md:px-10 py-16">

                    {/* Layout principal */}
                    <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-12 items-start">

                        {/* Columna izquierda */}
                        <div className="flex flex-col gap-4">
                            <h1 className="text-[#181611] tracking-tight text-[32px] font-bold leading-tight">
                                Por qué elegir MotoFIX
                            </h1>

                            <p className="text-gray-600 text-lg">
                                Transparencia y confianza para tu moto.
                            </p>

                            <button className="text-primary font-bold hover:underline flex items-center gap-1 mt-2 w-fit">
                                Ver todos los beneficios
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </button>
                        </div>

                        {/* Columna derecha: cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                            {/* Card 1 */}
                            <div className="flex gap-4 rounded-lg bg-[#f8f7f6] p-6 hover:bg-[#f0efec] transition-colors">
                                <div className="bg-white p-1 rounded-lg shadow-sm flex-shrink-0">
                                    <Icon name="verified_user" size={20} />
                                </div>
                                <div>
                                    <h2 className="text-[#181611] text-lg font-bold">Reseñas Reales</h2>
                                    <p className="text-gray-600 text-sm">
                                        Opiniones verificadas de usuarios reales. Adiós a las sorpresas.
                                    </p>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="flex gap-4 rounded-lg bg-[#f8f7f6] p-6 hover:bg-[#f0efec] transition-colors">
                                <div className="bg-white p-1 rounded-lg shadow-sm flex-shrink-0">
                                    <Icon name="schedule" size={20} />
                                </div>
                                <div>
                                    <h2 className="text-[#181611] text-lg font-bold">Tiempos Claros</h2>
                                    <p className="text-gray-600 text-sm">
                                        Información sobre disponibilidad y demoras promedio del taller.
                                    </p>
                                </div>
                            </div>

                            {/* Card 3 */}
                            <div className="flex gap-4 rounded-lg bg-[#f8f7f6] p-6 hover:bg-[#f0efec] transition-colors">
                                <div className="bg-white p-1 rounded-lg shadow-sm flex-shrink-0">
                                    <Icon name="near_me" size={20} />
                                </div>
                                <div>
                                    <h2 className="text-[#181611] text-lg font-bold">Cercanía</h2>
                                    <p className="text-gray-600 text-sm">
                                        Geolocalización precisa para urgencias en la ruta o ciudad.
                                    </p>
                                </div>
                            </div>

                            {/* Card 4 */}
                            <div className="flex gap-4 rounded-lg bg-[#f8f7f6] p-6 hover:bg-[#f0efec] transition-colors">
                                <div className="bg-white p-1 rounded-lg shadow-sm flex-shrink-0">
                                    <Icon name="attach_money" size={20} />
                                </div>
                                <div>
                                    <h2 className="text-[#181611] text-lg font-bold">Precios Transparentes</h2>
                                    <p className="text-gray-600 text-sm">
                                        Rangos de precios estimados por tipo de servicio.
                                    </p>
                                </div>
                            </div>

                            {/* Card 5 */}
                            <div className="flex gap-4 rounded-lg bg-[#f8f7f6] p-6 hover:bg-[#f0efec] transition-colors">
                                <div className="bg-white p-1 rounded-lg shadow-sm flex-shrink-0">
                                    <Icon name="groups" size={20} />
                                </div>
                                <div>
                                    <h2 className="text-[#181611] text-lg font-bold">Comunidad</h2>
                                    <p className="text-gray-600 text-sm">
                                        Foros y preguntas frecuentes respondidas por expertos.
                                    </p>
                                </div>
                            </div>

                            {/* Card 6 */}
                            <div className="flex gap-4 rounded-lg bg-[#f8f7f6] p-6 hover:bg-[#f0efec] transition-colors">
                                <div className="bg-white p-1 rounded-lg shadow-sm flex-shrink-0">
                                    <Icon name="motorcycle" size={20} />
                                </div>
                                <div>
                                    <h2 className="text-[#181611] text-lg font-bold">Especialistas</h2>
                                    <p className="text-gray-600 text-sm">
                                        Filtrá por marca y modelo de tu moto.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* CTA Section */}
            <div className="flex-1 justify-center py-5 bg-[#181611] text-white">
                <div className="layout-content-container flex flex-col max-w-[1280px] mx-auto flex-1">
                    <div className="@container">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-4 py-16 md:px-10">
                            <div className="flex flex-col gap-4 text-center md:text-left max-w-[600px]">
                                <h1 className="text-white tracking-tight text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black">
                                    ¿Tenés un taller mecánico?
                                </h1>
                                <p className="text-gray-300 text-lg font-normal leading-normal">
                                    Sumate a MotoFIX y llegá a más clientes en tu zona. Gestioná tus turnos y construí tu reputación online.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    to="/registro-taller"
                                    className="flex min-w-[160px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary hover:bg-[#d6aa28] transition-colors text-[#181611] text-base font-bold leading-normal tracking-[0.015em]"
                                >
                                    <span className="truncate">Registrar mi taller</span>
                                </Link>
                                <button className="flex min-w-[160px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 border border-white/20 hover:bg-white/10 transition-colors text-white text-base font-bold leading-normal tracking-[0.015em]">
                                    <span className="truncate">Más información</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
