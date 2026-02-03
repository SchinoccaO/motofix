-- Datos de prueba para MotoYA
-- NOTA: Las contraseñas están en texto plano aquí. 
-- En la aplicación real se debe usar bcrypt antes de insertar.

USE motoya;

-- Usuarios de prueba (password: "123456" - debe hashearse con bcrypt)
INSERT INTO users (email, password, nombre, rol) VALUES
('admin@motoya.com', '$2a$10$rQ8K7YXyKT6M0QrIx0YXFe8EzV8Eu6Y8Q3N3Pq6hJ3J6J8K0K0K0K', 'Admin MotoYA', 'admin'),
('juanperez@mail.com', '$2a$10$rQ8K7YXyKT6M0QrIx0YXFe8EzV8Eu6Y8Q3N3Pq6hJ3J6J8K0K0K0K', 'Juan Pérez', 'usuario'),
('mariagonzalez@mail.com', '$2a$10$rQ8K7YXyKT6M0QrIx0YXFe8EzV8Eu6Y8Q3N3Pq6hJ3J6J8K0K0K0K', 'María González', 'usuario'),
('taller.elrapido@mail.com', '$2a$10$rQ8K7YXyKT6M0QrIx0YXFe8EzV8Eu6Y8Q3N3Pq6hJ3J6J8K0K0K0K', 'Carlos Rodríguez', 'taller'),
('motoservice@mail.com', '$2a$10$rQ8K7YXyKT6M0QrIx0YXFe8EzV8Eu6Y8Q3N3Pq6hJ3J6J8K0K0K0K', 'Pedro Martínez', 'taller'),
('tallercentro@mail.com', '$2a$10$rQ8K7YXyKT6M0QrIx0YXFe8EzV8Eu6Y8Q3N3Pq6hJ3J6J8K0K0K0K', 'Laura Sánchez', 'taller');

-- Talleres de prueba
INSERT INTO talleres (user_id, nombre, descripcion, direccion, ciudad, telefono, email, servicios, horario) VALUES
(4, 'MotoTaller El Rápido', 
 'Taller especializado en mantenimiento preventivo y correctivo de motocicletas de todas las marcas. Más de 15 años de experiencia.', 
 'Av. Principal #123', 
 'Buenos Aires', 
 '+54 11 4567-8901', 
 'contacto@elrapido.com',
 'mantenimiento,reparacion,repuestos,diagnostico',
 'Lun-Vie: 8:00-18:00, Sáb: 9:00-13:00'),

(5, 'MotoService Pro', 
 'Reparación especializada en motos deportivas y de alta cilindrada. Técnicos certificados.', 
 'Calle 45 #67-89', 
 'Córdoba', 
 '+54 351 456-7890', 
 'info@motoservicepro.com',
 'reparacion,repuestos,diagnostico,pintura',
 'Lun-Sáb: 9:00-19:00'),

(6, 'Taller Centro', 
 'Mantenimiento general y venta de repuestos originales. Atención personalizada.', 
 'Av. Libertador 456', 
 'Rosario', 
 '+54 341 234-5678', 
 'tallercentro@mail.com',
 'mantenimiento,repuestos,revision',
 'Lun-Vie: 8:30-17:30');

-- Reseñas de prueba
INSERT INTO resenas (user_id, taller_id, rating, comentario, servicio_usado) VALUES
(2, 1, 5, 
 'Excelente atención y servicio rápido. Solucionaron el problema de mi moto en menos de 2 horas. Muy recomendado!', 
 'Reparación de motor'),

(3, 1, 4, 
 'Buen servicio, aunque tuve que esperar un poco más de lo previsto. Los precios son justos y el trabajo quedó bien.', 
 'Mantenimiento general'),

(2, 2, 5, 
 'Los mejores! Mi moto deportiva quedó como nueva. Conocen muy bien las motos de alta gama.', 
 'Reparación especializada'),

(3, 2, 3, 
 'El servicio es bueno pero un poco caro. La atención podría mejorar.', 
 'Cambio de aceite'),

(2, 3, 4, 
 'Buen taller de barrio, precios accesibles y atención amable. Volvería sin dudas.', 
 'Revisión general');

-- Respuestas de talleres a reseñas
UPDATE resenas SET 
  respuesta_taller = 'Muchas gracias por tu confianza! Nos alegra que hayas quedado satisfecho con nuestro servicio.',
  fecha_respuesta = NOW()
WHERE id = 1;

UPDATE resenas SET 
  respuesta_taller = 'Agradecemos tu comentario. Estamos trabajando para mejorar nuestros tiempos de espera. Esperamos verte pronto!',
  fecha_respuesta = NOW()
WHERE id = 2;

-- Actualizar votos útiles en algunas reseñas
UPDATE resenas SET votos_utiles = 5 WHERE id = 1;
UPDATE resenas SET votos_utiles = 2 WHERE id = 2;
UPDATE resenas SET votos_utiles = 3 WHERE id = 3;
