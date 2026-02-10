# Base de Datos MotoFIX

## Configuración de MySQL

### 1. Requisitos
- MySQL 8.0+ instalado y corriendo
- Cliente MySQL (mysql-cli, MySQL Workbench, phpMyAdmin, etc.)

### 2. Crear la base de datos

**Opción A: Desde la línea de comandos**
```bash
# Conectar a MySQL
mysql -u root -p

# Ejecutar el script de creación
source database/schema.sql

# Ejecutar datos de prueba (opcional)
source database/seeds.sql
```

**Opción B: Desde el seed de Sequelize (recomendado)**
```bash
cd server
npm run seed
```

### 3. Configurar variables de entorno

Editar el archivo `server/.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password_mysql
DB_NAME=motoya
DB_PORT=3306
```

### 4. Verificar la conexión

Iniciar el servidor:
```bash
cd server
npm run dev
```

Deberías ver:
```
Conexión a MySQL exitosa
Servidor corriendo en http://localhost:5001
```

## Estructura de Tablas (Schema v3)

### `users`
- Usuarios de la plataforma (clientes y administradores)
- Roles: `user`, `admin`
- Borrado suave via `is_active`

### `providers`
- Proveedores de servicios: talleres, mecánicos independientes, casas de repuestos
- Tipos: `shop`, `mechanic`, `parts_store`
- Campos de reputación: `average_rating`, `total_reviews`
- Verificación: `is_verified`, borrado suave: `is_active`
- Índice FULLTEXT en name+description para búsquedas

### `locations`
- Ubicación de cada provider (relación 1:1 via `provider_id` único)
- Campos: address, city, province, country, latitude, longitude

### `reviews`
- Reseñas de usuarios sobre providers
- Rating: 1-5 estrellas
- Un usuario puede dejar múltiples reseñas al mismo provider

### `review_replies`
- Respuestas/conversación en cada reseña
- Permite ida y vuelta entre usuario y provider

## Relaciones

```
users ──────┐
            │ 1 usuario → N reseñas
            ▼
         reviews ──── review_replies (conversación)
            ▲
            │ 1 provider → N reseñas
            │
providers ──┘
    │
    │ 1 provider → 1 ubicación
    ▼
locations
```

Todas las foreign keys usan `ON DELETE RESTRICT`.

## Datos de Prueba

El seed incluye:
- 4 usuarios (1 admin, 3 users)
- 4 providers (2 shops, 1 mechanic, 1 parts_store)
- 4 locations (Buenos Aires, Córdoba, Rosario)
- 5 reseñas distribuidas entre providers
- 4 review replies (hilos de conversación)

**Credenciales de prueba** (todas con password: `123456`):
- `admin@motoya.com` — Administrador
- `juan@mail.com` — Usuario
- `maria@mail.com` — Usuario
- `carlos@mail.com` — Usuario

## Comandos Útiles MySQL

```sql
-- Ver todas las tablas
SHOW TABLES;

-- Ver estructura de una tabla
DESCRIBE users;
DESCRIBE providers;
DESCRIBE reviews;

-- Contar registros
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM providers;
SELECT COUNT(*) FROM reviews;

-- Ver providers con su rating promedio
SELECT p.name, p.type,
       AVG(r.rating) as rating_promedio,
       COUNT(r.id) as total_resenas
FROM providers p
LEFT JOIN reviews r ON p.id = r.provider_id
GROUP BY p.id;

-- Borrar todos los datos (cuidado!)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE review_replies;
TRUNCATE TABLE reviews;
TRUNCATE TABLE locations;
TRUNCATE TABLE providers;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- Eliminar la base de datos completa (cuidado!)
DROP DATABASE motoya;
```

## Notas Importantes

- Las contraseñas se hashean con bcrypt (salt rounds: 10)
- Los índices están optimizados para las queries más comunes
- Se usa `ON DELETE RESTRICT` para prevenir borrado accidental de datos relacionados
- Se usa `utf8mb4` para soportar emojis y caracteres especiales
- Todas las tablas usan `InnoDB` para soporte de transacciones y foreign keys
