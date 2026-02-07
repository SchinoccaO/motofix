-- Datos de prueba adicionales para motoya_db
-- Estructura actual: usuarios, talleres, resenas

USE motoya_db;

-- Insertar usuarios adicionales solo si no existen
INSERT IGNORE INTO usuarios (nombre, email, password, rol, telefono, created_at, updated_at) VALUES
('María González', 'maria@mail.com', '$2a$10$rQ8K7YXyKT6M0QrIx0YXFe8EzV8Eu6Y8Q3N3Pq6hJ3J6J8K0K0K0K', 'cliente', '1145678901', NOW(), NOW()),
('Carlos Rodríguez', 'carlos@mail.com', '$2a$10$rQ8K7YXyKT6M0QrIx0YXFe8EzV8Eu6Y8Q3N3Pq6hJ3J6J8K0K0K0K', 'mecanico', '1156789012', NOW(), NOW()),
('Pedro Martínez', 'pedro@mail.com', '$2a$10$rQ8K7YXyKT6M0QrIx0YXFe8EzV8Eu6Y8Q3N3Pq6hJ3J6J8K0K0K0K', 'mecanico', '1167890123', NOW(), NOW()),
('Laura Sánchez', 'laura@mail.com', '$2a$10$rQ8K7YXyKT6M0QrIx0YXFe8EzV8Eu6Y8Q3N3Pq6hJ3J6J8K0K0K0K', 'mecanico', '1178901234', NOW(), NOW()),
('Admin MotoYA', 'admin@motoya.com', '$2a$10$rQ8K7YXyKT6M0QrIx0YXFe8EzV8Eu6Y8Q3N3Pq6hJ3J6J8K0K0K0K', 'admin', '1189012345', NOW(), NOW());

-- Insertar talleres de prueba
INSERT INTO talleres (usuario_id, nombre, descripcion, direccion, ciudad, provincia, codigo_postal, telefono, email, calificacion_promedio, foto_principal, verificado, activo, created_at, updated_at) VALUES
(3, 'MotoTaller El Rápido', 
 'Taller especializado en mantenimiento preventivo y correctivo de motocicletas de todas las marcas. Más de 15 años de experiencia en el rubro.', 
 'Av. Corrientes 4532', 
 'Almagro', 
 'CABA', 
 'C1195', 
 '+54 11 4567-8901',
 'contacto@elrapido.com',
 4.8,
 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800',
 1,
 1,
 NOW(),
 NOW()),

(4, 'MotoService Center Pro', 
 'Especialistas en alta cilindrada y service oficial de las marcas líderes en el mercado. Scanner de última generación.', 
 'Av. del Libertador 1234', 
 'Palermo', 
 'CABA', 
 'C1426', 
 '+54 11 5678-9012',
 'info@motoservicepro.com',
 4.9,
 'https://images.unsplash.com/photo-1558980664-769d59546b3d?w=800',
 1,
 1,
 NOW(),
 NOW()),

(5, 'Taller Centro Rápido', 
 'Mantenimiento general y venta de repuestos originales. Atención personalizada y presupuestos sin cargo.', 
 'Av. Rivadavia 5678', 
 'Caballito', 
 'CABA', 
 'C1406', 
 '+54 11 6789-0123',
 'tallercentro@mail.com',
 4.5,
 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800',
 1,
 1,
 NOW(),
 NOW());

-- Insertar reseñas de prueba
INSERT INTO resenas (usuario_id, taller_id, calificacion, comentario, servicio, verificada, created_at, updated_at) VALUES
(1, 1, 5, 
 'Excelente atención. Fui por un problema de carburación en mi GN125 y me lo solucionaron en el día. El precio me pareció justo y me mostraron las piezas que cambiaron. Muy recomendable.',
 'Reparación de motor',
 1,
 DATE_SUB(NOW(), INTERVAL 2 DAY),
 DATE_SUB(NOW(), INTERVAL 2 DAY)),

(2, 1, 4, 
 'Buena atención, aunque demoraron un poco más de lo prometido en entregar la moto. El trabajo quedó impecable, eso sí. Volvería a ir pero iría con más tiempo.',
 'Mantenimiento general',
 1,
 DATE_SUB(NOW(), INTERVAL 7 DAY),
 DATE_SUB(NOW(), INTERVAL 7 DAY)),

(1, 2, 5, 
 'Los mejores! Mi moto deportiva quedó como nueva. Conocen muy bien las motos de alta gama y tienen repuestos originales.',
 'Service completo',
 1,
 DATE_SUB(NOW(), INTERVAL 15 DAY),
 DATE_SUB(NOW(), INTERVAL 15 DAY)),

(2, 2, 4, 
 'Buen servicio profesional. Precios acordes a la calidad del trabajo. El único detalle es que hay que pedir turno con anticipación.',
 'Cambio de aceite',
 1,
 DATE_SUB(NOW(), INTERVAL 20 DAY),
 DATE_SUB(NOW(), INTERVAL 20 DAY)),

(1, 3, 4, 
 'Buen taller de barrio, precios accesibles y atención amable. Perfecto para mantenimientos rutinarios.',
 'Revisión general',
 1,
 DATE_SUB(NOW(), INTERVAL 30 DAY),
 DATE_SUB(NOW(), INTERVAL 30 DAY));

SELECT * FROM USUARIUOS;

UPDATE usuarios SET nombre = 'Nuevo nombre' WHERE id = 1;



-- Verificar los datos insertados
SELECT 'Usuarios creados:' as Info;
SELECT COUNT(*) as Total FROM usuarios;

SELECT 'Talleres creados:' as Info;
SELECT COUNT(*) as Total FROM talleres;

SELECT 'Reseñas creadas:' as Info;
SELECT COUNT(*) as Total FROM resenas;

SELECT 'Detalle de talleres:' as Info;
SELECT id, nombre, ciudad, calificacion_promedio FROM talleres;
