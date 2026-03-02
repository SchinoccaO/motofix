# MOTOYA_CONTEXT.md — Single Source of Truth (SSOT)
> Versión: 1.3 | Última actualización: 2026-03-01
> Protocolo: Este archivo DEBE actualizarse al final de cada sesión de cambios.

---

## 0. REGLAS DE SESIÓN (leer siempre primero)

1. **Antes de tocar cualquier componente**, verificar tokens de color en `tailwind.config.js`.
2. **Toda clase hardcodeada** de color dark mode se considera deuda técnica. Reemplazar por token.
3. **Cambios de diseño** → actualizar la sección correspondiente en este archivo al finalizar.
4. **Cambios de API/modelo** → actualizar sección 8 (Endpoints) y sección 10 (Modelos).
5. **No inventar rutas ni endpoints** — todas las rutas existentes están en la sección 7.

---

## 1. IDENTIDAD DE MARCA

### Nombre
- **Marca**: MotoFIX
- **Tagline**: *"El taller de confianza, más cerca."*
- **Contexto geográfico**: Córdoba, Argentina (aunque la plataforma es nacional)

### Tono de comunicación
- **Profesional pero cercano**: Sin tecnicismos innecesarios, lenguaje de comunidad motera.
- **Localizado**: Vocabulario rioplatense. Siempre "vos/te/tu" nunca "tú/usted".
- **Directo**: El usuario es un motociclista con un problema que resolver. Frases cortas, CTAs claros.
- **Confiable**: Hablar de transparencia, comunidad real, reseñas verificadas.

### Ejemplos de copy correcto
- ✅ "Encontrá mecánicos calificados por la comunidad motera."
- ✅ "¿Tenés un taller? Registrate y llegá a más clientes."
- ❌ "Encuentre mecánicos certificados." (muy formal)
- ❌ "Find your mechanic." (inglés)

---

## 2. SISTEMA DE DISEÑO — PALETA DE COLORES

### Dark Mode (primario, diseño principal)

| Token Tailwind        | Hex       | Uso                                                  |
|-----------------------|-----------|------------------------------------------------------|
| `background-dark`     | `#121418` | Fondo principal de todas las páginas                 |
| `surface-dark`        | `#1C1F26` | Fondos de secciones (Footer, "Cómo Funciona")        |
| `card-dark`           | `#22262E` | Cards individuales (talleres, steps, items de lista) |
| `elevated-dark`       | `#2A303C` | Íconos contenedores, estados activos, overlays       |
| `input-border-dark`   | `#2D3748` | Bordes de inputs, divisores, separadores             |
| `border-subtle`       | `#2D3748` | Alias para divisores visuales                        |
| `primary`             | `#FFB800` | Botones CTA, badges activos, acentos de marca        |
| `primary-hover`       | `#E6A700` | Hover de elementos primarios                         |
| `text-body-dark`      | `#E2E8F0` | Texto de cuerpo en modo oscuro                       |

> **Jerarquía visual (dark)**: `#121418` → `#1C1F26` → `#22262E` → `#2A303C`
> Cada nivel "flota" sobre el anterior gracias a las sombras definidas en `index.css`.

### Light Mode

| Token / Clase Tailwind | Hex / Valor    | Uso                          |
|------------------------|----------------|------------------------------|
| `background-light`     | `#f8f7f6`      | Fondo principal              |
| `bg-white`             | `#FFFFFF`       | Cards y secciones elevadas   |
| `bg-[#fcfbf9]`         | `#fcfbf9`      | Sección "Cómo funciona"      |
| `bg-[#f8f7f6]`         | `#f8f7f6`      | Cards de "Diferenciales"     |
| `text-main`            | `#181611`      | Texto principal light mode   |
| `text-secondary`       | `#887f63`      | Texto secundario             |
| `input-border`         | `#e5e7eb`      | Bordes en light mode         |

### Color primario (amarillo dorado) — reglas de uso
- Fondo `#FFB800` siempre lleva texto `#181611` (nunca blanco) → contraste WCAG AA.
- Usar como acento, nunca como fondo de sección completa.
- Reservado para: botones primarios, badges activos, texto enfatizado en títulos dark.

---

## 3. SISTEMA DE DISEÑO — TIPOGRAFÍA Y ESPACIADO

### Fuentes
- **Display / Títulos**: `Inter` (font-display en Tailwind)
- **Cuerpo**: `Noto Sans` (font-body en Tailwind)
- Cargadas vía Google Fonts en `index.html`

### Border Radius
| Clase Tailwind | Valor  | Aplicación                          |
|----------------|--------|-------------------------------------|
| `rounded`      | 4px    | Badges, chips pequeños              |
| `rounded-lg`   | 8px    | **Botones, inputs, cards** (default)|
| `rounded-xl`   | 12px   | Cards grandes, modales              |
| `rounded-full` | 9999px | Avatares, pills, sliders            |

> **Regla**: Todo botón interactivo usa `rounded-lg` (8px). Sin excepciones.

### Sombras en Dark Mode (definidas en `index.css`)
```css
/* Sobreescriben Tailwind's shadow-sm/md/lg solo en .dark */
.dark .shadow-sm  → 0 2px 8px rgba(0,0,0,.50)  + 0 1px 3px rgba(0,0,0,.35)
.dark .shadow-md  → 0 4px 20px rgba(0,0,0,.60) + 0 2px 6px rgba(0,0,0,.40)
.dark .shadow-lg  → 0 8px 32px rgba(0,0,0,.65) + 0 4px 10px rgba(0,0,0,.45)
```
> Las cards usan `shadow-sm` por defecto y `hover:shadow-md` en hover. El efecto "flotante" es automático en dark mode.

---

## 4. ESTRUCTURA DE RUTAS (React Router v6)

```
/                    → Home.tsx               (pública)
/login               → Login.tsx              (pública, redirige si hay token)
/register            → Register.tsx           (pública, redirige si hay token)
/talleres            → BuscarTalleres.tsx     (pública)
/mapa                → MapaPage.tsx           (pública) ← NUEVO: mapa full-screen
/taller/:id          → TallerProfile.tsx      (pública)
/taller/:id/resena   → ResenaForm.tsx         (protegida, requiere token)
/registro-taller     → RegistroTaller.tsx     (protegida)
/mi-perfil           → MiPerfil.tsx           (protegida)
/mi-perfil/seguridad → Seguridad.tsx          (protegida)
/usuario/:id         → PerfilPublico.tsx      (pública)
/sobre-nosotros      → SobreNosotros.tsx      (pública)
/blog                → Blog.tsx               (pública)
/ayuda               → Ayuda.tsx              (pública)
/terminos            → Terminos.tsx           (pública)
/privacidad          → Privacidad.tsx         (pública)
```

---

## 5. ANATOMÍA DE LA HOME (secciones)

### 5.1 Navbar (sticky, z-50)
- **Light**: `bg-white`, borde bottom `#f4f3f0`
- **Dark**: `bg-background-dark`, borde `elevated-dark`
- Links: Talleres y Repuestos | Registrar taller
- CTA derecha: Ingresar (outline) | Registrarse (primary)
- Toggle dark mode + hamburger móvil

### 5.2 Hero Section
- **Layout**: Texto izquierda + imagen derecha (16:10 aspect ratio)
- **Título**: `text-3xl → 4xl`, `font-black`, span con `text-primary`
- **Buscador**: Input + botón `bg-primary` con `rounded-l-lg` + `rounded-r-lg`
- **Trust badges**: 3 avatars apilados + "+1000 moteros confían en nosotros"
- **Dark bg**: `bg-background-dark`

### 5.3 Cómo Funciona (`#como-funciona`)
- **Dark bg**: `bg-surface-dark` (`#1C1F26`)
- **3 cards** en grid: Elegí tu zona | Compará reseñas | Repará tu moto
- **Cards**: `bg-card-dark`, `rounded-xl`, `shadow-sm hover:shadow-md`
- **Íconos**: `bg-primary/20` contenedor circular, Material Symbols
- **Borde**: `dark:border-input-border-dark`

### 5.4 Por Qué Elegirnos (Diferenciales)
- **Dark bg**: `bg-background-dark`
- **Layout**: 2 columnas (título izq. + grid 3x2 cards der.)
- **6 cards**: Reseñas Reales | Tiempos Claros | Cercanía | Precios Transparentes | Comunidad | Especialistas
- **Cards**: `bg-card-dark`, `rounded-lg`, ícono elevado con `bg-elevated-dark`

### 5.5 CTA Taller (Banner oscuro permanente)
- **Bg siempre oscuro**: `bg-[#121418]` (independiente del modo)
- **Botón primario**: `bg-primary hover:bg-primary-hover rounded-lg text-[#181611]`
- **Botón secundario**: `border border-white/20 hover:bg-white/10 rounded-lg`

### 5.6 Footer
- **Dark bg**: `bg-surface-dark` (`#1C1F26`)
- **Borde top**: `dark:border-elevated-dark`
- 4 columnas: Logo + desc | Compañía | Soporte | Redes
- Links: `hover:text-primary`

---

## 6. COMPONENTES REUTILIZABLES

| Componente        | Archivo                         | Descripción                                                    |
|-------------------|---------------------------------|----------------------------------------------------------------|
| `<Navbar>`        | `components/Navbar.tsx`         | Prop: `activePage` (string para estado activo)                 |
| `<Footer>`        | `components/Footer.tsx`         | Sin props, autónomo                                            |
| `<Logo>`          | `components/Logo.tsx`           | Prop: `size` (number, default implícito)                       |
| `<Icon>`          | `components/Icon.tsx`           | Props: `name` (string), `size` (number)                        |
| `<UserAvatar>`    | `components/UserAvatar.tsx`     | Avatar con fallback a iniciales de color                       |
| `<ScrollToTop>`   | `components/ScrollToTop.tsx`    | Utility: scrollea al top en cambio de ruta                     |
| `<MapaTalleres>`  | `components/MapaTalleres.tsx`   | Mapa MapLibre GL JS. Props: `providers`, `onMarkerClick?`, `fullScreen?`, `selectedId?`. Pines SVG con emoji por tipo (canvas 2x). Popup con badge abierto/cerrado. |
| `<SelectorUbicacion>` | `components/SelectorUbicacion.tsx` | Selector de ubicación con mapa + geocoding. Prop: `onLocationChange(LocationData)`. **Lazy-load obligatorio** (ver nota abajo) |

---

## 7. STACK TECNOLÓGICO

### Frontend (`client/`)
```
React 18.2        │ Framework UI
Vite 5.4          │ Bundler (dev: puerto 5173)
TypeScript 5.9    │ Lenguaje
React Router 6.22 │ Navegación SPA
TailwindCSS 3.4   │ Estilos (darkMode: 'class')
Axios 1.6         │ HTTP client
maplibre-gl 4.7   │ Mapa interactivo (reemplaza Leaflet — lazy loaded en /mapa y /registro-taller)
@react-oauth/google 0.13 │ Google OAuth
@tailwindcss/forms 0.5   │ Plugin forms
Material Symbols  │ Iconografía (via CDN en index.html)
```

> **REGLA CRÍTICA — maplibre-gl**: Siempre importar componentes que usen maplibre-gl con
> `React.lazy()` + `<Suspense>`. El motivo es **code splitting** (el chunk pesa ~800KB), NO
> compatibilidad con Web Workers.
>
> **⚠️ NO usar `optimizeDeps: { exclude: ['maplibre-gl'] }`**: maplibre-gl v4 distribuye
> un bundle **UMD** (`dist/maplibre-gl.js`). Sin pre-bundling, Vite lo sirve raw y el browser
> falla con `SyntaxError: does not provide an export named 'default'`. Dejar que Vite
> pre-bundlee (esbuild convierte UMD→ESM automáticamente, el worker viene inline en el bundle).
> El `vite.config.ts` solo necesita `build.rollupOptions.manualChunks` para producción.
>
> **Patrón correcto**:
> ```tsx
> import type { LocationData } from '../components/SelectorUbicacion' // type-only: OK eager
> const SelectorUbicacion = lazy(() => import('../components/SelectorUbicacion'))
> // …
> <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-[#f4f3f0] dark:bg-elevated-dark" />}>
>   <SelectorUbicacion onLocationChange={setLocation} />
> </Suspense>
> ```
>
> Chunks en producción: `maplibre-gl` (~800KB), `MapaTalleres` (~7KB), `SelectorUbicacion` (~6KB).
> Bundle principal: ~370KB min / ~103KB gzip.

### Backend (`server/`)
```
Express 4.18      │ Framework web (puerto 5001)
Sequelize 6.37    │ ORM
MySQL2 3.16       │ Driver (TiDB Cloud compatibe)
bcryptjs 2.4      │ Hash de contraseñas
jsonwebtoken 9.0  │ Auth JWT
helmet 8.1        │ Security headers
cors 2.8          │ CORS middleware
express-rate-limit│ Rate limiting en auth (v8 — NO usar keyGenerator: req.ip manual, ver §14)
express-validator │ Validación de inputs
google-auth-lib   │ Verificación OAuth
```

### Base de Datos
```
Motor:    TiDB Cloud (compatible MySQL)
Puerto:   4000
SSL:      Sí (isrgrootx1.pem)
ORM:      Sequelize (sync automático al iniciar)
Pool:     max 10, min 0
```

### Deploy
```
Frontend: Vercel  (vercel.json presente)
Backend:  Render  (variables de entorno en platform)
```

---

## 8. API ENDPOINTS

**Base URL**: `VITE_API_URL/api` (default: `http://localhost:5001/api`)
**Auth**: `Authorization: Bearer <token>` en headers

### Auth (`/api/auth`)
```
POST /auth/register          → Registrar usuario
POST /auth/login             → Login email+password
POST /auth/google            → Google OAuth login
POST /auth/google/link       → Vincular cuenta Google
GET  /auth/users/:id         → Perfil público de usuario
GET  /auth/perfil            → Mi perfil [token]
PUT  /auth/perfil            → Actualizar mi perfil [token]
PUT  /auth/cambiar-contrasena→ Cambiar contraseña [token]
```

### Providers/Talleres (`/api/providers`)
```
GET  /providers              → Listar/buscar (query: type, city, search, is_verified)
GET  /providers/tags         → Listar todos los tags
GET  /providers/mine         → Mis talleres [token]
GET  /providers/:id          → Detalle de taller
POST /providers              → Crear taller [token]
PUT  /providers/:id          → Editar taller [token, owner]
DELETE /providers/:id        → Eliminar taller [token, owner]
POST /providers/:id/reviews  → Crear reseña [token]
POST /providers/:id/tags     → Agregar tags [token]
DELETE /providers/:id/tags/:tagId → Quitar tag [token]
```

### Health
```
GET  /api                    → Info de la API
GET  /api/health             → Estado del servidor y BD
```

---

## 9. MODELOS DE DATOS (Sequelize)

### User
```typescript
id, name, email, password_hash, google_id, auth_provider,
phone, avatar_url, city, province,
role: 'user' | 'admin',
is_active: boolean
```

### Provider (Taller/Mecánico/Repuestos)
```typescript
id, owner_id → User,
type: 'shop' | 'mechanic' | 'parts_store',
name, description, phone, email, website, photo_url,
is_verified: boolean, is_active: boolean,
average_rating: float, total_reviews: int,
horarios: JSON | null   // ← NUEVO (migrado 2026-03-01)
```

**Formato `horarios`:**
```json
{
  "lunes":     { "abre": "09:00", "cierra": "19:00" },
  "martes":    { "abre": "09:00", "cierra": "19:00" },
  "miercoles": { "abre": "09:00", "cierra": "19:00" },
  "jueves":    { "abre": "09:00", "cierra": "19:00" },
  "viernes":   { "abre": "09:00", "cierra": "18:00" },
  "sabado":    { "abre": "10:00", "cierra": "14:00" },
  "domingo":   null
}
```
> `null` en un día = cerrado ese día. Campo global `null` = sin horarios cargados (no muestra badge).
> Días SIN tilde: `miercoles`, `sabado`. Los keys son exactamente así en DB y en la función `isOpenNow()`.

### Location
```typescript
id, provider_id → Provider,
address, city, province, country,
latitude: float, longitude: float
```

### Review
```typescript
id, provider_id → Provider, user_id → User,
rating: 1-5, comment,
estimated_time, actual_time
```

### Tag & ProviderTag
```typescript
Tag: { id, name }
ProviderTag: { provider_id, tag_id }  // pivot many-to-many
```

---

## 10. AUTENTICACIÓN — FLUJO

1. Login/Register → `POST /api/auth/login` o `/register`
2. Respuesta: `{ token, usuario }` → guardados en `localStorage`
3. Axios interceptor: agrega `Authorization: Bearer <token>` a todos los requests
4. Backend: `verificarToken` middleware valida JWT y agrega `req.user`
5. Frontend: `getStoredUser()` / `getStoredToken()` desde `services/api.ts`
6. Logout: `logout()` elimina localStorage y reload

---

## 11. DARK MODE — IMPLEMENTACIÓN

- **Estrategia**: `darkMode: 'class'` en Tailwind → clase `.dark` en `<html>`
- **Toggle**: En `Navbar.tsx` → `localStorage.setItem('theme', 'dark'|'light')`
- **Inicialización**: Lee `localStorage` → fallback a `prefers-color-scheme`
- **Patrón en JSX**: `className="bg-white dark:bg-card-dark"`
- **NO usar** clases hardcodeadas de color dark → siempre usar tokens del config

---

## 12. ESTADO DEL PROYECTO

| Feature                          | Estado      |
|----------------------------------|-------------|
| Autenticación (local + Google)   | ✅ Completo |
| Búsqueda de talleres con filtros | ✅ Completo |
| Perfil de taller con reseñas     | ✅ Completo |
| Perfil de usuario                | ✅ Completo |
| Seguridad (contraseña, datos)    | ✅ Completo |
| Dark mode                        | ✅ Completo |
| Responsive design                | ✅ Completo |
| Mapa interactivo (MapLibre)      | ✅ Completo |
| Pines SVG diferenciados por tipo | ✅ Completo (canvas 2x retina, emoji 🛠️🔧⚙️, clustering intacto) |
| Badge "Abierto ahora / Cerrado"  | ✅ Completo (MapaPage, BuscarTalleres, TallerProfile, popup mapa) |
| Horarios en perfil de taller     | ✅ Completo (tarjeta en sidebar derecho de TallerProfile) |
| Registro de taller (formulario)  | ✅ Completo (form controlado + submit → POST /providers) |
| Campo `horarios` en DB           | ✅ Migrado (columna JSON en providers) |
| Selector lat/lng en RegistroTaller | ✅ Completo (SelectorUbicacion con MapLibre + Nominatim) |
| Rediseño mobile MapaPage (FAB)   | ⏳ Próximo |
| Upload de fotos de taller        | ❌ Pendiente |
| Notificaciones                   | ❌ Pendiente |
| Chat / mensajería                | ❌ Pendiente |
| Analytics / estadísticas         | ❌ Pendiente |

---

## 13. ARCHIVOS CLAVE — MAPA RÁPIDO

```
client/
├── tailwind.config.js          ← TOKENS DE COLOR (modificar siempre aquí primero)
├── src/index.css               ← Sombras dark, scrollbar, utilidades globales
├── src/App.tsx                 ← Rutas
├── src/services/api.ts         ← Todas las llamadas HTTP + auth helpers + createProvider()
├── src/components/
│   ├── Navbar.tsx              ← Dark mode toggle, navegación, auth state
│   ├── Footer.tsx              ← Links, redes sociales
│   ├── MapaTalleres.tsx        ← Mapa de talleres (lazy, clustering, pines SVG, popup con horarios)
│   └── SelectorUbicacion.tsx   ← Selector lat/lng con pin draggable (lazy — ver nota maplibre)
└── src/pages/
    ├── Home.tsx                ← Landing page principal
    ├── BuscarTalleres.tsx      ← Búsqueda + filtros + lista (badge abierto/cerrado en cards)
    ├── TallerProfile.tsx       ← Detalle + reseñas + tarjeta horarios en sidebar
    ├── MapaPage.tsx            ← Mapa full-screen con sidebar/drawer
    ├── RegistroTaller.tsx      ← Formulario registro completo (conectado al backend)
    ├── MiPerfil.tsx            ← Perfil del user logueado
    └── Seguridad.tsx           ← Cambio contraseña/datos

server/
├── src/index.js                ← Entry point Express
├── src/routes/
│   ├── authRoutes.js           ← /api/auth/* (rate limiters sin keyGenerator manual)
│   └── tallerRoutes.js         ← /api/providers/*
├── src/controllers/
│   ├── authController.js       ← Lógica auth
│   └── tallerController.js     ← Lógica talleres/reseñas
└── src/models/                 ← Sequelize models (Provider tiene campo horarios JSON)

client/src/utils/
└── horarios.ts                 ← isOpenNow(), getHorariosSemana(), getDiaArgentina(), tipos Horarios/HorarioDia
```

### Pines del mapa — implementación (MapaTalleres.tsx)

| Tipo          | Color     | Emoji | imagen MapLibre |
|---------------|-----------|-------|-----------------|
| `shop`        | `#FFB800` | 🛠️   | `pin-shop`      |
| `mechanic`    | `#3B82F6` | 🔧   | `pin-mechanic`  |
| `parts_store` | `#8B5CF6` | ⚙️   | `pin-parts_store`|

- Pines dibujados en `<canvas>` a **2× (retina)** con `createPinCanvas(color, emoji)` → `ImageData`
- Registrados en cada `style.load` via `map.addImage(id, imageData, { pixelRatio: 2 })`
- Layer `unclustered-point`: tipo `symbol` con `icon-image` match por `type`
- Clusters siguen siendo `circle` layer amarillo (no se rompe el clustering nativo de MapLibre)
- Popup (solo en modo embebido sin `onMarkerClick`): parsea `_data` → badge abierto/cerrado via `isOpenNow()`

---

## 14. CHANGELOG DE SESIONES

### 2026-03-01 — Sesión 6: Fix maplibre-gl UMD + UI/UX MapaPage + horarios en BuscarTalleres

**Fix crítico — maplibre-gl no cargaba en /mapa:**
- **Síntoma**: `SyntaxError: does not provide an export named 'default'` al lazy-cargar `MapaTalleres`
- **Causa**: `vite.config.ts` tenía `optimizeDeps: { exclude: ['maplibre-gl'] }`. maplibre-gl v4 es un bundle **UMD**, no ESM. Sin pre-bundling, Vite sirve el UMD raw y el browser no puede importarlo como módulo ES.
- **Fix**: Eliminado `optimizeDeps.exclude`. Vite pre-bundlea el UMD→ESM, el worker viene inline. Solo se mantiene `build.rollupOptions.manualChunks` para separar el chunk en producción.

**UI/UX MapaPage.tsx:**
- Badge "Verificado" → `bg-green-500 text-white` (antes `bg-white/90`), consistente light y dark
- Solapa toggle del sidebar → ícono `text-primary` + borde `border-primary/40` (antes gris invisible en light)
- Indicador verificado en items de la lista → ícono `verified` verde junto al nombre

**BuscarTalleres.tsx:**
- Badge "Verificado" → `bg-green-500 text-white` (mismo estilo que MapaPage)
- Agregado badge "Abierto ahora / Cerrado" en cards usando `isOpenNow()` de `utils/horarios`
- Import: `isOpenNow` desde `../utils/horarios`

**Archivos modificados:**
- `client/vite.config.ts` — eliminado `optimizeDeps.exclude`
- `client/src/pages/MapaPage.tsx` — verificado verde, toggle visible, verified en lista
- `client/src/pages/BuscarTalleres.tsx` — verificado verde, badge abierto/cerrado

---

### 2026-03-01 — Sesión 5: SelectorUbicacion + RegistroTaller conectado al backend

**Archivos creados:**
- `client/src/components/SelectorUbicacion.tsx` — componente de ubicación precisa

**Archivos modificados:**
- `client/src/pages/RegistroTaller.tsx` — form controlado + submit → backend
- `client/src/services/api.ts` — agregado `createProvider()` + `CreateProviderPayload`
- `server/src/routes/authRoutes.js` — fix breaking change express-rate-limit v8

---

**`SelectorUbicacion.tsx` — detalles técnicos:**
- MapLibre GL con mismos tiles que `MapaTalleres` (OpenFreeMap positron / Carto Dark Matter)
- Nominatim geocoding con `addressdetails=1` → extrae `city` y `province` del objeto estructurado
- Debounce 500ms en el input → `GET nominatim/search?countrycodes=ar` → `flyTo` + pin
- Pin SVG amarillo (`#FFB800`) draggable con `anchor: 'bottom'`
- Al soltar el pin → `nominatim/reverse` → actualiza el input de texto automáticamente
- Centrado en Córdoba `[-64.181, -31.4135]` por defecto
- Exporta `LocationData { lat, lng, address, displayAddress, city, province }`
- `address` = dirección compacta para DB (ej: "Av. Colón 1234, General Paz, Córdoba")
- `displayAddress` = `display_name` completo de Nominatim (para mostrar en el input)
- Alturas: `h-64` (256px mobile) / `md:h-80` (320px desktop)
- Dark mode: MutationObserver + `darkEffectFirst` ref (mismo patrón que MapaTalleres)

**`RegistroTaller.tsx` — form controlado:**
- Estado: `formType`, `name`, `phone`, `email`, `description`, `sabOpen`, `location`, `terms`
- `handleSubmit`: valida cliente → llama `createProvider()` → redirect a `/taller/:id`
- Banner de advertencia si el usuario no está logueado
- Error banner muestra detalles del middleware `express-validator` del backend
- Botón con spinner `progress_activity` durante loading
- `SelectorUbicacion` importado con `React.lazy()` + `<Suspense>` con skeleton animado

**`api.ts` — `createProvider()`:**
- Envía: `type`, `name`, `phone`, `email`, `description`, `address`, `city`, `province`, `latitude`, `longitude`
- Responde con el `Provider` completo (incluye `id` para el redirect)

**Fix backend — `express-rate-limit` v8:**
- **Síntoma**: backend crasheaba al iniciar con `ERR_ERL_KEY_GEN_IPV6`
- **Causa**: v8 prohíbe `keyGenerator: (req) => req.ip` sin el helper `ipKeyGenerator`
- **Fix**: eliminado `keyGenerator` de los 3 rate limiters en `authRoutes.js`
  (el comportamiento por defecto de v8 ya usa `req.ip` con soporte IPv6 correcto)

**Fix frontend — maplibre-gl en bundle principal:**
- **Síntoma**: app se congelaba al cargar porque maplibre-gl sin pre-bundling
  genera cientos de requests HTTP individuales en dev mode
- **Causa**: `optimizeDeps.exclude: ['maplibre-gl']` en vite.config.ts + import eager
- **Fix**: `SelectorUbicacion` importado con `React.lazy()` en `RegistroTaller`
- Bundle principal volvió a ~103KB gzip (vs 324KB con import directo)

---

### 2026-02-28 — Sesión 4: Home — Full UX cleanup + CTA sin gradiente
**Cambios realizados:**
- **CTA**: eliminados TODOS los overlays, glows y gradientes. Sección flat `bg-[#0F1621] dark:bg-surface-dark` con solo `border-t border-white/[0.07]`. La tipografía hace el trabajo.
- **CTA**: agregado eyebrow badge ("Para propietarios de talleres") con ícono `storefront`. Copy levemente refinado.
- **Hero**: eyebrow badge "Córdoba, Argentina" con `location_on`. Trust badges rediseñados con 2 líneas de texto. Gap reducido de 7→6. `xl:text-5xl` eliminado (excesivo). Search bar unificada con `border` + `focus-within:border-primary/60` en lugar de `ring-1` + `shadow-sm` separados. Carousel `aspectRatio: 4/3` (más cuadrado, mejor en desktop).
- **"Cómo funciona"**: fondo `#f7f6f4` (más neutro). Heading más compacto `text-2xl sm:text-3xl`. Cards sin `gap-5 → gap-4`. Ícono `size-14` (más chico que el anterior `size-16`). Padding `p-7` (vs `p-8`). Border explícito siempre visible.
- **"Por qué elegirnos"**: título sticky en desktop (`lg:sticky lg:top-24`). Cards con border siempre visible `border-[#ece9e3]` (sin hover-border-shift). Texto de cards `text-sm / text-xs` (más compacto). Gap `gap-4`. Columna izquierda `300px` (vs `340px`).
- **Datos extraídos a constantes**: `SLIDES`, `STEPS`, `FEATURES`, `AVATAR_IDS` — código limpio.

**Principio aplicado**: Sin decoraciones que no sirvan a la jerarquía visual. La solidez del color y la tipografía hacen el trabajo.

---

### 2026-02-28 — Sesión 3: Home — Carousel arrows + Icon consistency + CTA glow
**Cambios realizados:**
- **Carousel**: Agregadas flechas `chevron_left` / `chevron_right` con `backdrop-blur-sm bg-black/40`, posición absoluta, z-20
- **"Por qué elegirnos"**: Íconos migrados de `<Icon>` (SVG sprite) a `material-symbols-outlined`, mismo `bg-primary/15 dark:bg-primary/20 rounded-xl` que "Cómo funciona" → sistema único de iconografía en toda la Home. Íconos: `verified`, `schedule`, `near_me`, `payments`, `groups`, `motorcycle`
- **CTA "¿Tenés un taller?"**: Glows de `bg-primary/5` → `bg-primary/[0.12]` y `bg-primary/[0.07]`; tamaño de 80/64 → `420px`/`72`. Agregado gradiente horizontal base `bg-gradient-to-r from-primary/[0.07] via-transparent to-primary/[0.04]` para visibilidad en light mode
- `Home.tsx`: Import `Icon` eliminado (ya no se usa). Ícono de búsqueda también migrado a `material-symbols-outlined`

**Regla de diseño grabada:** Un solo sistema de íconos en toda la app → `material-symbols-outlined` (CDN, ya cargado en index.html). El componente `<Icon>` solo para sprite SVG custom si es necesario.

---

### 2026-02-28 — Sesión 2: Home Page Refinement

**Cambios realizados:**
- `Home.tsx` — Reescritura completa del componente:
  - **Carousel propio** (sin dependencias externas): crossfade entre 4 imágenes locales, autoplay 4.5s, dots de navegación clickeables en primary/blanco, sombra flotante `shadow-2xl dark:shadow-[0_24px_64px_rgba(0,0,0,0.75)]`
  - **Imágenes**: 4 fotos reales de motos de `assets/icons/` importadas por Vite (con hashing en prod)
  - **Barra de búsqueda**: padding corregido, gap consistente con hint text
  - **Sección CTA "¿Tenés un taller?"**: `bg-[#0F1621] dark:bg-surface-dark` + `border-y border-primary/15` + glows decorativos con `blur-3xl` → ya no se funde con el fondo en dark mode
  - **Botón "Más información"**: ahora navega a `/sobre-nosotros` (era `<button>` sin acción)
  - **Botón "Ver talleres disponibles"**: `<Link to="/talleres">` (antes sin ruta)
  - **Branding**: "MotoFIX" → "MotoFIX" en copy de la sección CTA y Diferenciales
  - Secciones refactorizadas a `<section>` semántico, cards de pasos y diferenciales en array (DRY)
- `vite-env.d.ts` — Agregadas declaraciones de tipos para `.jpg`, `.jpeg`, `.png`, `.webp`

**Imágenes del carousel (assets/icons/):**
- `inicioninja.jpg` — Kawasaki Ninja
- `44bce802...jpg` — Corven Triax 250 enduro
- `c5ebd90e...jpg` — Honda CB roja
- `711dc29f...jpg` — Café racer/clásica

**Dependencia eliminada:** `react-responsive-carousel` (no estaba instalada, removida del import)

---

### 2026-02-28 — Sesión 1: Dark Mode Redesign
**Cambios realizados:**
- `tailwind.config.js`: Actualización completa de paleta dark mode
  - `primary` `#e8ba30` → `#FFB800`
  - `background-dark` `#1a1a1e` → `#121418`
  - `surface-dark` `#212126` → `#1C1F26`
  - `card-dark` `#2c2c33` → `#22262E`
  - `elevated-dark` `#38383f` → `#2A303C`
  - `input-border-dark` `#3e3e46` → `#2D3748`
  - Agregados: `text-body-dark` (`#E2E8F0`), `border-subtle` (`#2D3748`)
- `index.css`: Sombras flotantes para `.dark .shadow-sm/md/lg`, scrollbar dark mode
- `Home.tsx`: CTA section `bg-[#181611]` → `bg-[#121418]`, hovers a `hover:bg-primary-hover`
- `Navbar.tsx`: Hovers hardcodeados → `hover:bg-primary-hover`
- `BuscarTalleres.tsx`: Hovers hardcodeados → `hover:bg-primary-hover`
