# 🔧 ANÁLISIS COMPLETO DE PROBLEMAS Y SOLUCIONES

## 📋 ÍNDICE

1. [Problemas de Configuración](#problemas-de-configuración)
2. [Problemas del Backend](#problemas-del-backend)
3. [Problemas del Frontend](#problemas-del-frontend)
4. [Flujo de Trabajo Recomendado](#flujo-de-trabajo-recomendado)
5. [Checklist de Verificación](#checklist-de-verificación)

---

## 🚨 PROBLEMAS DE CONFIGURACIÓN

### ❌ Problema 1: Puertos inconsistentes

**Descripción:** El proxy de Vite apuntaba al puerto 3000, pero el backend corre en 5000.

**Ubicación:** `client/vite.config.ts`

**Estado:** ✅ CORREGIDO

**Configuración actual:**

```typescript
// vite.config.ts - línea 23
proxy: {
  "/api": {
    target: "http://localhost:5000",  // ✅ Ahora apunta al puerto correcto
    changeOrigin: true,
  },
}
```

### ❌ Problema 2: Variables de entorno

**Descripción:** Las variables en `.env` están configuradas correctamente.

**Ubicación:** `server/.env`

**Estado:** ✅ CORRECTO

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=motoya_db
DB_USER=root
DB_PASSWORD=
JWT_SECRET=cambia_esto_por_algo_super_secreto_y_aleatorio_12345
JWT_EXPIRES_IN=7d
```

**⚠️ IMPORTANTE:** Cambia `JWT_SECRET` por algo más seguro en producción.

---

## 🔴 PROBLEMAS DEL BACKEND

### ❌ Problema 3: El servidor se cae después de arrancar

**Descripción:** El servidor se inicia correctamente, conecta a MySQL, pero luego se cierra.

**Evidencia:**

```
✅ Servidor corriendo en http://localhost:5000
✅ Backend listo para recibir peticiones
GET /
GET /
[El proceso termina]
```

**Diagnóstico:**

- El servidor arranca correctamente
- Las peticiones GET llegan pero no se procesan
- No hay un manejador de errores apropiado para rutas no definidas

**Solución:**

**Archivo:** `server/src/index.js` (agregar ANTES del `startServer()`)

```javascript
// ============================================
// MANEJADOR DE RUTAS NO ENCONTRADAS (404)
// ============================================
// Si ninguna ruta coincide, devuelve error 404
app.use((req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada",
    path: req.path,
    method: req.method,
  });
});

// ============================================
// MANEJADOR GLOBAL DE ERRORES
// ============================================
// Este middleware captura todos los errores de la aplicación
app.use((err, req, res, next) => {
  console.error("❌ Error no manejado:", err);

  res.status(err.status || 500).json({
    error: err.message || "Error interno del servidor",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});
```

### ❌ Problema 4: CORS Configuration

**Descripción:** El CORS está configurado pero puede estar bloqueando peticiones.

**Ubicación:** `server/src/index.js` - línea 66-74

**Estado:** ⚠️ REVISAR

**Configuración actual:**

```javascript
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : ["http://localhost:5173", "http://localhost:3001"],
  credentials: true,
  optionsSuccessStatus: 200,
};
```

**Problema detectado:** El frontend puede correr en puerto 5174, pero CORS solo permite 5173.

**Solución recomendada:**

```javascript
// OPCIÓN 1: Durante desarrollo, permitir todos los orígenes
const corsOptions = {
  origin:
    process.env.NODE_ENV === "development"
      ? true // Permite cualquier origen en desarrollo
      : process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:5173"],
  credentials: true,
  optionsSuccessStatus: 200,
};

// OPCIÓN 2: Agregar 5174 al .env
// En server/.env agregar:
// ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
```

---

## 🟡 PROBLEMAS DEL FRONTEND

### ❌ Problema 5: URLs hardcodeadas en fetch

**Descripción:** Las peticiones tienen URLs hardcodeadas en lugar de usar variables de entorno.

**Ubicación:**

- `client/src/pages/Login.tsx` - línea 35
- `client/src/pages/Register.tsx` - línea 41

**Estado:** ⚠️ MEJORABLE

**Código actual:**

```typescript
const response = await fetch("http://localhost:5000/api/auth/login", {
```

**Problema:**

- Si cambias el puerto del backend, debes editar todos los archivos
- No funcionará en producción

**Solución recomendada:**

**Paso 1:** Crear archivo de configuración `client/src/config/api.ts`:

```typescript
// client/src/config/api.ts
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const API_ENDPOINTS = {
  auth: {
    register: `${API_URL}/api/auth/register`,
    login: `${API_URL}/api/auth/login`,
    perfil: `${API_URL}/api/auth/perfil`,
  },
  talleres: {
    listar: `${API_URL}/api/talleres`,
    crear: `${API_URL}/api/talleres`,
    obtener: (id: number) => `${API_URL}/api/talleres/${id}`,
  },
  resenas: {
    crear: `${API_URL}/api/resenas`,
    porTaller: (tallerId: number) =>
      `${API_URL}/api/resenas/taller/${tallerId}`,
  },
};

// Helper para hacer peticiones con token
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");

  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });
};
```

**Paso 2:** Crear archivo `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

**Paso 3:** Actualizar Login.tsx:

```typescript
// ANTES:
const response = await fetch("http://localhost:5000/api/auth/login", {

// DESPUÉS:
import { API_ENDPOINTS, fetchWithAuth } from "../config/api";

const response = await fetchWithAuth(API_ENDPOINTS.auth.login, {
  method: "POST",
  body: JSON.stringify(formData),
});
```

### ❌ Problema 6: Sin manejo de token en peticiones protegidas

**Descripción:** No hay código para enviar el token JWT en peticiones que requieren autenticación.

**Estado:** 🔴 FALTA IMPLEMENTAR

**Solución:** Usar el helper `fetchWithAuth` mencionado arriba.

### ❌ Problema 7: Sin verificación de autenticación en rutas

**Descripción:** Cualquier usuario puede acceder a `/talleres`, `/registro-taller`, etc.

**Ubicación:** `client/src/App.tsx`

**Estado:** 🔴 FALTA IMPLEMENTAR

**Solución:**

**Paso 1:** Crear componente `ProtectedRoute`:

```typescript
// client/src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');

  // Si no hay token, redirigir a login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si se requiere un rol específico, verificarlo
  if (requiredRole && usuario?.rol !== requiredRole) {
    return <Navigate to="/talleres" replace />;
  }

  return <>{children}</>;
}
```

**Paso 2:** Usar en App.tsx:

```typescript
import ProtectedRoute from "./components/ProtectedRoute";

function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rutas protegidas */}
      <Route
        path="/talleres"
        element={
          <ProtectedRoute>
            <BuscarTalleres />
          </ProtectedRoute>
        }
      />

      {/* Solo mecánicos pueden registrar talleres */}
      <Route
        path="/registro-taller"
        element={
          <ProtectedRoute requiredRole="mecanico">
            <RegistroTaller />
          </ProtectedRoute>
        }
      />

      <Route path="/taller/:id" element={<TallerProfile />} />
      <Route path="/resena" element={<ResenaForm />} />
    </Routes>
  );
}
```

---

## 🟢 FLUJO DE TRABAJO RECOMENDADO

### 1. Verificar que MySQL esté corriendo

```powershell
# Abrir XAMPP Control Panel
# Verificar que MySQL esté en estado "Running"
```

### 2. Iniciar el Backend

```powershell
# Terminal 1
cd D:\orian\Documents\MOTOYA\server
node src/index.js
# O con nodemon (recarga automática):
npm run dev
```

**Verificar que se vea:**

```
✅ Conexión a MySQL exitosa (Sequelize)
✅ Usando tablas existentes en la base de datos
🚀 Servidor corriendo en http://localhost:5000
✅ Backend listo para recibir peticiones
```

### 3. Iniciar el Frontend

```powershell
# Terminal 2
cd D:\orian\Documents\MOTOYA\client
npm run dev
```

**Verificar que se vea:**

```
VITE v5.4.21  ready in XXX ms

➜  Local:   http://localhost:5173/
```

### 4. Probar la aplicación

**Opción A: Desde el navegador**

1. Abrir http://localhost:5173
2. Ir a "Registrarse"
3. Crear una cuenta de prueba
4. Verificar en phpMyAdmin que el usuario se creó

**Opción B: Desde Postman**

1. POST http://localhost:5000/api/auth/register
2. Body (JSON):

```json
{
  "nombre": "Juan Test",
  "email": "juan@test.com",
  "password": "123456",
  "rol": "cliente"
}
```

---

## ✅ CHECKLIST DE VERIFICACIÓN

### Backend

- [ ] MySQL corriendo en XAMPP
- [ ] Base de datos `motoya_db` existe
- [ ] Archivo `.env` configurado con credenciales correctas
- [ ] `npm install` ejecutado en carpeta `server/`
- [ ] Servidor arranca sin errores
- [ ] Puerto 5000 libre (o el que configures)
- [ ] Manejador de errores 404 agregado
- [ ] CORS configurado para desarrollo

### Frontend

- [ ] `npm install` ejecutado en carpeta `client/`
- [ ] Archivo `.env` creado (opcional pero recomendado)
- [ ] Vite config apunta al puerto correcto del backend
- [ ] Componente `ProtectedRoute` creado (opcional)
- [ ] Helper `fetchWithAuth` implementado (opcional)
- [ ] Puerto 5173 libre (o configurar otro)

### Base de Datos

- [ ] Tabla `usuarios` existe
- [ ] Tabla `talleres` existe
- [ ] Tabla `resenas` existe
- [ ] Seeds ejecutados (datos de prueba)

---

## 🎯 PRIORIDADES DE CORRECCIÓN

### Urgente (Hazlo ahora)

1. ✅ Corregir puerto en vite.config.ts (YA HECHO)
2. 🔴 Agregar manejador 404 y de errores en index.js
3. 🔴 Verificar que el servidor no se caiga

### Importante (Hazlo pronto)

4. Crear archivo `client/src/config/api.ts`
5. Implementar `fetchWithAuth`
6. Actualizar Login.tsx y Register.tsx para usar la config

### Mejoras (Hazlo cuando puedas)

7. Crear componente `ProtectedRoute`
8. Proteger rutas en App.tsx
9. Cambiar JWT_SECRET en .env
10. Agregar validaciones en formularios

---

## 📝 COMANDOS ÚTILES

### Verificar puerto ocupado

```powershell
# Ver qué proceso usa el puerto 5000
netstat -ano | findstr ":5000"

# Matar proceso por PID (reemplaza XXXX con el PID)
taskkill /PID XXXX /F
```

### Ver procesos Node.js

```powershell
Get-Process | Where-Object {$_.ProcessName -eq "node"}
```

### Reiniciar servidores

```powershell
# Matar todos los procesos Node
taskkill /IM node.exe /F

# Luego reiniciar backend y frontend
```

---

## 🐛 DEBUG: Si algo no funciona

### Backend no arranca

1. Verificar MySQL corriendo
2. Verificar credenciales en `.env`
3. Ver logs en la terminal
4. Verificar puerto 5000 libre

### Frontend no puede conectar

1. Verificar backend corriendo
2. Abrir consola del navegador (F12)
3. Ver errores de CORS o conexión
4. Verificar URL en `vite.config.ts`

### Error "Cannot GET /api/auth/login"

- Estás usando GET en lugar de POST
- Cambia el método en Postman o en el código

### Error "Credenciales inválidas"

- Verificar email y contraseña correctos
- Ver en phpMyAdmin si el usuario existe
- Verificar que el password se haya encriptado

---

## 📚 RECURSOS ADICIONALES

- [Express.js Docs](https://expressjs.com/)
- [Sequelize Docs](https://sequelize.org/)
- [React Router Docs](https://reactrouter.com/)
- [Vite Docs](https://vitejs.dev/)
- [JWT.io](https://jwt.io/)

---

**Creado:** 5 de febrero de 2026  
**Proyecto:** MotoYA - Plataforma de talleres de motos  
**Autor:** GitHub Copilot
