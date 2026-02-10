-- Seed data for MotoFIX
-- All passwords are bcrypt hashes of "123456"

USE motoya;

-- Users (1 admin, 3 regular users)
INSERT INTO users (name, email, password_hash, role, is_active) VALUES
('Admin MotoYA', 'admin@motoya.com', '$2a$10$rQ8K7YXyKT6M0QrIx0YXFe8EzV8Eu6Y8Q3N3Pq6hJ3J6J8K0K0K0K', 'admin', TRUE),
('Juan Pérez', 'juan@mail.com', '$2a$10$rQ8K7YXyKT6M0QrIx0YXFe8EzV8Eu6Y8Q3N3Pq6hJ3J6J8K0K0K0K', 'user', TRUE),
('María González', 'maria@mail.com', '$2a$10$rQ8K7YXyKT6M0QrIx0YXFe8EzV8Eu6Y8Q3N3Pq6hJ3J6J8K0K0K0K', 'user', TRUE),
('Carlos Rodríguez', 'carlos@mail.com', '$2a$10$rQ8K7YXyKT6M0QrIx0YXFe8EzV8Eu6Y8Q3N3Pq6hJ3J6J8K0K0K0K', 'user', TRUE);

-- Providers (2 shops, 1 mechanic, 1 parts store)
INSERT INTO providers (type, name, description, phone, email, website, is_verified, is_active, average_rating, total_reviews) VALUES
('shop', 'MotoTaller El Rápido',
 'Especialistas en mantenimiento preventivo y correctivo de motos. Más de 15 años de experiencia.',
 '+54 11 4567-8901', 'contacto@elrapido.com', 'https://elrapido.com.ar',
 TRUE, TRUE, 4.50, 2),

('mechanic', 'Diego Mecánica Motos',
 'Mecánico independiente con 10 años de experiencia. Atención personalizada a domicilio.',
 '+54 351 555-1234', 'diego.mecanica@mail.com', NULL,
 TRUE, TRUE, 4.00, 2),

('parts_store', 'RepuestosMoto Center',
 'Venta de repuestos originales y alternativos para todas las marcas.',
 '+54 341 777-9999', 'ventas@repuestosmoto.com', 'https://repuestosmotocenter.com.ar',
 FALSE, TRUE, 4.00, 1),

('shop', 'Moto Service Premium',
 'Taller especializado en motos deportivas y de alta gama. Mecánicos certificados.',
 '+54 11 3333-4444', 'info@motoservicepremium.com', NULL,
 TRUE, TRUE, 0.00, 0);

-- Locations (1 per provider)
INSERT INTO locations (provider_id, address, city, province, country, latitude, longitude) VALUES
(1, 'Av. Principal 123', 'Buenos Aires', 'Buenos Aires', 'Argentina', -34.6037389, -58.3815704),
(2, 'Calle Falsa 456', 'Córdoba', 'Córdoba', 'Argentina', -31.4200833, -64.1887761),
(3, 'Ruta 9 Km 123', 'Rosario', 'Santa Fe', 'Argentina', -32.9442426, -60.6505388),
(4, 'Av. Libertador 789', 'Buenos Aires', 'Buenos Aires', 'Argentina', -34.5875140, -58.4299520);

-- Reviews (5 reviews across different provider types)
INSERT INTO reviews (user_id, provider_id, rating, comment) VALUES
(2, 1, 5, 'Excelente servicio! Muy profesionales y rápidos. Cambio de aceite impecable.'),
(3, 1, 4, 'Buen taller, aunque tuve que esperar un poco más de lo previsto.'),
(2, 2, 5, 'Diego es un genio. Vino a casa y me arregló la moto en una hora.'),
(3, 2, 3, 'Buen mecánico pero tarda en responder los mensajes.'),
(2, 3, 4, 'Tienen de todo, buenos precios y envío rápido.');

-- Review replies (conversation examples)
INSERT INTO review_replies (review_id, user_id, content) VALUES
(1, 1, 'Muchas gracias Juan! Nos alegra que hayas quedado satisfecho.'),
(2, 1, 'Gracias por el feedback María. Estamos mejorando los tiempos de espera.'),
(2, 3, 'Bueno saberlo, voy a volver a probar entonces!'),
(3, 1, 'Gracias por la confianza! A disposición siempre.');
