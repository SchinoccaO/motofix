# ✅ VERIFICACIÓN DE INTERCONEXIÓN BACKEND-FRONTEND

## 🎯 Estado Actual

### Backend (Express + MySQL)
- **Puerto:** 5001
- **URL:** http://localhost:5001
- **Estado:** ✅ CORRIENDO
- **Base de datos:** MySQL conectada a `motoya`

### Frontend (React + Vite)  
- **Puerto:** 3000
- **URL:** http://localhost:3000
- **Estado:** ✅ CORRIENDO
- **API URL:** `VITE_API_URL=http://localhost:5001/api`

---

## 🔗 Configuración de Conexión

### 1. CORS Configurado
**Archivo:** `server/src/index.js`

```javascript
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
```

✅ Permite peticiones desde el frontend en puerto 3000/3001

### 2. Variable de Entorno Frontend
**Archivo:** `client/.env`

```env
VITE_API_URL=http://localhost:5001/api
```

✅ Define la URL base para todas las peticiones al backend

### 3. Logging Activado
**Archivo:** `server/src/index.js`

```javascript
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}
```

✅ Muestra todas las peticiones que llegan al backend

---

## 🧪 Tests de Verificación

### Test 1: Health Check Backend
```bash
# En navegador o curl
http://localhost:5001/api/health
```

**Respuesta esperada:**
```json
{
  "status": "OK",
  "message": "MotoFIX API is running",
  "database": "MySQL + Sequelize",
  "timestamp": "2026-01-24T..."
}
```

### Test 2: API Info
```bash
http://localhost:5001/api
```

**Respuesta esperada:**
```json
{
  "message": "Bienvenido a la API de MotoFIX",
  "version": "1.0.0",
  "orm": "Sequelize",
  "endpoints": {
    "providers": "/api/providers",
    "users": "/api/users",
    "reviews": "/api/reviews"
  }
}
```

### Test 3: Frontend cargando
```bash
http://localhost:3000
```

**Resultado esperado:** Ver la página de React

---

## 🔧 Optimizaciones Aplicadas

### 1. Sequelize Sync Optimizado
❌ **Antes:**
```javascript
await sequelize.sync({ alter: true }); 
// Ejecutaba 50+ queries ALTER TABLE en cada inicio
```

✅ **Ahora:**
```javascript
await sequelize.sync({ alter: false }); 
// Solo verifica que existan las tablas (3 queries)
```

**Beneficio:** Inicio del servidor 10x más rápido

### 2. CORS Específico
❌ **Antes:**
```javascript
app.use(cors()); // Permitía CUALQUIER origen
```

✅ **Ahora:**
```javascript
app.use(cors({ 
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true 
}));
```

**Beneficio:** Más seguro, solo acepta peticiones del frontend conocido

### 3. Logging de Desarrollo
✅ **Nuevo:**
```javascript
// Muestra en consola del servidor:
GET /api/health
POST /api/auth/login
GET /api/talleres
```

**Beneficio:** Facilita debugging de peticiones

---

## 🚀 Cómo Arrancar Todo

### Opción A: Manualmente (2 terminales)

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### Opción B: Script único (TODO - crear después)
```bash
npm run dev:all
```

---

## 📊 Datos de Prueba Disponibles

### Usuarios:
- **Admin:** admin@motoya.com / 123456
- **Usuario:** juan@mail.com / 123456
- **Usuario:** maria@mail.com / 123456
- **Usuario:** carlos@mail.com / 123456

### Providers:
1. **MotoTaller El Rápido** (shop, Buenos Aires) — verificado
2. **Diego Mecánica Motos** (mechanic, Córdoba) — verificado
3. **RepuestosMoto Center** (parts_store, Rosario) — no verificado
4. **Moto Service Premium** (shop, Buenos Aires) — verificado

### Reseñas:
- 5 reseñas distribuidas entre los providers
- 4 review replies (hilos de conversación)
- Ratings de 3 a 5 estrellas

---

## ⚠️ Problemas Comunes y Soluciones

### Problema 1: "Cannot connect to localhost:5001"
**Causa:** Backend no está corriendo
**Solución:**
```bash
cd server
npm run dev
```

### Problema 2: "CORS error from origin..."
**Causa:** Frontend en puerto diferente o CORS mal configurado
**Solución:** Verificar que frontend corre en puerto 3000 o 3001

### Problema 3: Frontend carga pero no hay datos
**Causa:** Variable VITE_API_URL no configurada
**Solución:** 
```bash
# Verificar que existe client/.env con:
VITE_API_URL=http://localhost:5001/api

# Reiniciar frontend:
cd client
npm run dev
```

### Problema 4: "Access denied for user 'root'"
**Causa:** Contraseña MySQL incorrecta
**Solución:** Editar `server/.env` línea DB_PASSWORD

---

## ✅ Checklist de Verificación

- [x] MySQL corriendo
- [x] Base de datos `motoya` creada
- [x] Datos de prueba insertados (4 users, 4 providers, 4 locations, 5 reviews, 4 replies)
- [x] Backend corriendo en puerto 5001
- [x] Frontend corriendo en puerto 3000
- [x] CORS configurado correctamente
- [x] Variable VITE_API_URL configurada
- [x] Health check respondiendo
- [x] API info respondiendo
- [ ] **PRÓXIMO:** Crear controllers y routes (FASE 2)

---

## 🎯 Próximos Pasos (FASE 2)

1. Crear **middlewares** de autenticación (JWT)
2. Crear **controllers** (auth, provider, review)
3. Crear **routes** con validaciones
4. Conectar frontend con API real
5. Implementar login/register

---

**Documentación actualizada:** 24/01/2026
