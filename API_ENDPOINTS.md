# API Endpoints - MotoYA Backend

Base URL: `http://localhost:5000/api`

## 🏥 Health Check

### GET /api/health

Verificar estado del servidor

```json
{
  "status": "OK",
  "message": "MotoYA API is running",
  "database": "MySQL + Sequelize",
  "timestamp": "2026-02-03T..."
}
```

## 🔐 Autenticación

### POST /api/auth/register

Registrar nuevo usuario

```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "123456",
  "rol": "cliente"
}
```

### POST /api/auth/login

Iniciar sesión

```json
{
  "email": "juan@example.com",
  "password": "123456"
}
```

### GET /api/auth/perfil

Obtener perfil del usuario (requiere token)
Headers: `Authorization: Bearer <token>`

## 🏪 Talleres

### GET /api/talleres

Listar todos los talleres
Query params opcionales:

- `ciudad` - Filtrar por ciudad
- `servicio` - Filtrar por servicio
- `verificado` - true/false
- `activo` - true/false (default: true)

Ejemplo: `/api/talleres?ciudad=Palermo&verificado=true`

### GET /api/talleres/:id

Obtener un taller por ID (incluye reseñas)

### POST /api/talleres

Crear nuevo taller (requiere autenticación)
Headers: `Authorization: Bearer <token>`

```json
{
  "nombre": "Mi Taller",
  "descripcion": "Descripción del taller",
  "direccion": "Av. Corrientes 1234",
  "ciudad": "Buenos Aires",
  "telefono": "011-1234-5678",
  "whatsapp": "5491112345678",
  "email": "taller@example.com",
  "servicios": "mantenimiento,reparacion,repuestos",
  "horarios": "Lun-Vie: 9-18hs, Sáb: 9-13hs",
  "marcas_atendidas": "Honda,Yamaha,Suzuki",
  "latitud": -34.603722,
  "longitud": -58.381592
}
```

### PUT /api/talleres/:id

Actualizar taller (requiere autenticación y ser propietario)
Headers: `Authorization: Bearer <token>`

### DELETE /api/talleres/:id

Desactivar taller (soft delete - requiere autenticación y ser propietario)
Headers: `Authorization: Bearer <token>`

## ⭐ Reseñas

### GET /api/resenas/taller/:tallerId

Obtener todas las reseñas de un taller

### POST /api/resenas

Crear nueva reseña (requiere autenticación)
Headers: `Authorization: Bearer <token>`

```json
{
  "taller_id": 1,
  "rating": 5,
  "comentario": "Excelente servicio!",
  "servicio_usado": "Cambio de aceite"
}
```

### PUT /api/resenas/:id/responder

Responder a una reseña (solo propietario del taller)
Headers: `Authorization: Bearer <token>`

```json
{
  "respuesta_mecanico": "Gracias por tu comentario!"
}
```

### POST /api/resenas/:id/votar

Marcar reseña como útil (no requiere autenticación)

### POST /api/resenas/:id/reportar

Reportar reseña inapropiada (no requiere autenticación)

## 🔒 Autenticación

Para endpoints protegidos, incluir el token JWT en el header:

```
Authorization: Bearer <tu_token_aquí>
```

El token se obtiene al hacer login o registro exitoso.

## 📊 Códigos de Estado

- `200` - OK
- `201` - Creado
- `400` - Error en la solicitud
- `401` - No autenticado
- `403` - No autorizado
- `404` - No encontrado
- `500` - Error del servidor

## 🧪 Probar Endpoints

### Con curl:

```bash
# Listar talleres
curl http://localhost:5000/api/talleres

# Obtener taller específico
curl http://localhost:5000/api/talleres/1

# Obtener reseñas de un taller
curl http://localhost:5000/api/resenas/taller/1

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ana@gmail.com","password":"123456"}'
```

### Con Postman o Thunder Client:

1. Importar la colección de endpoints
2. Configurar variables de entorno
3. Probar cada endpoint

## 📝 Notas

- Los talleres tienen calificación promedio automática
- Solo se puede dejar una reseña por usuario por taller
- Los propietarios pueden responder a las reseñas de su taller
- Los admins tienen permisos totales
