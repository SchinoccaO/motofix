import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
  host: 'gateway01.eu-central-1.prod.aws.tidbcloud.com',
  port: 4000,
  user: '3WDZGVQ4fYyFRSb.root',
  password: 'z7aIjUsc7UAUtKX4',
  ssl: {
    ca: fs.readFileSync(path.resolve(__dirname, '../isrgrootx1.pem')),
    minVersion: 'TLSv1.2'
  },
  multipleStatements: true
};

async function setup() {
  let conn;
  try {
    conn = await mysql.createConnection(config);
    console.log('✅ Conectado a TiDB Cloud');

    // 1. Create database
    await conn.execute('CREATE DATABASE IF NOT EXISTS motoya');
    await conn.execute('USE motoya');
    console.log('✅ Base de datos motoya creada/seleccionada');

    // 2. Create tables
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('user','admin') NOT NULL DEFAULT 'user',
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_role (role)
      )
    `);
    console.log('✅ Tabla users creada');

    await conn.query(`
      CREATE TABLE IF NOT EXISTS providers (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        type ENUM('shop','mechanic','parts_store') NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        phone VARCHAR(20),
        email VARCHAR(255),
        website VARCHAR(500),
        is_verified BOOLEAN NOT NULL DEFAULT FALSE,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        average_rating DECIMAL(3,2) NOT NULL DEFAULT 0.00,
        total_reviews INT UNSIGNED NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_type (type)
      )
    `);
    console.log('✅ Tabla providers creada');

    await conn.query(`
      CREATE TABLE IF NOT EXISTS locations (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        provider_id INT UNSIGNED NOT NULL UNIQUE,
        address VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        province VARCHAR(100) NOT NULL,
        country VARCHAR(100) NOT NULL DEFAULT 'Argentina',
        latitude DECIMAL(10,7),
        longitude DECIMAL(10,7),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE RESTRICT,
        INDEX idx_city (city),
        INDEX idx_province (province)
      )
    `);
    console.log('✅ Tabla locations creada');

    await conn.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNSIGNED NOT NULL,
        provider_id INT UNSIGNED NOT NULL,
        rating TINYINT UNSIGNED NOT NULL,
        comment TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
        FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE RESTRICT,
        INDEX idx_user_id (user_id),
        INDEX idx_provider_id (provider_id),
        INDEX idx_rating (rating)
      )
    `);
    console.log('✅ Tabla reviews creada');

    await conn.query(`
      CREATE TABLE IF NOT EXISTS review_replies (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        review_id INT UNSIGNED NOT NULL,
        user_id INT UNSIGNED NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE RESTRICT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
        INDEX idx_review_id (review_id)
      )
    `);
    console.log('✅ Tabla review_replies creada');

    // 3. Seed data
    console.log('\n📦 Insertando datos de prueba...');

    const passwordHash = await bcrypt.hash('123456', 10);

    // Check if data already exists
    const [existingUsers] = await conn.execute('SELECT COUNT(*) as count FROM users');
    if (existingUsers[0].count > 0) {
      console.log('⚠️  Ya hay datos en la BD, saltando seeds...');
    } else {
      // Users
      await conn.query(`
        INSERT INTO users (name, email, password_hash, role, is_active) VALUES
        ('Admin MotoFIX', 'admin@motoya.com', ?, 'admin', TRUE),
        ('Juan Pérez', 'juan@mail.com', ?, 'user', TRUE),
        ('María González', 'maria@mail.com', ?, 'user', TRUE),
        ('Carlos Rodríguez', 'carlos@mail.com', ?, 'user', TRUE)
      `, [passwordHash, passwordHash, passwordHash, passwordHash]);
      console.log('✅ 4 usuarios insertados');

      // Providers
      await conn.query(`
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
         TRUE, TRUE, 0.00, 0)
      `);
      console.log('✅ 4 proveedores insertados');

      // Locations
      await conn.query(`
        INSERT INTO locations (provider_id, address, city, province, country, latitude, longitude) VALUES
        (1, 'Av. Principal 123', 'Buenos Aires', 'Buenos Aires', 'Argentina', -34.6037389, -58.3815704),
        (2, 'Calle Falsa 456', 'Córdoba', 'Córdoba', 'Argentina', -31.4200833, -64.1887761),
        (3, 'Ruta 9 Km 123', 'Rosario', 'Santa Fe', 'Argentina', -32.9442426, -60.6505388),
        (4, 'Av. Libertador 789', 'Buenos Aires', 'Buenos Aires', 'Argentina', -34.5875140, -58.4299520)
      `);
      console.log('✅ 4 ubicaciones insertadas');

      // Reviews
      await conn.query(`
        INSERT INTO reviews (user_id, provider_id, rating, comment) VALUES
        (2, 1, 5, 'Excelente servicio! Muy profesionales y rápidos. Cambio de aceite impecable.'),
        (3, 1, 4, 'Buen taller, aunque tuve que esperar un poco más de lo previsto.'),
        (2, 2, 5, 'Diego es un genio. Vino a casa y me arregló la moto en una hora.'),
        (3, 2, 3, 'Buen mecánico pero tarda en responder los mensajes.'),
        (2, 3, 4, 'Tienen de todo, buenos precios y envío rápido.')
      `);
      console.log('✅ 5 reseñas insertadas');

      // Review replies
      await conn.query(`
        INSERT INTO review_replies (review_id, user_id, content) VALUES
        (1, 1, 'Muchas gracias Juan! Nos alegra que hayas quedado satisfecho.'),
        (2, 1, 'Gracias por el feedback María. Estamos mejorando los tiempos de espera.'),
        (2, 3, 'Bueno saberlo, voy a volver a probar entonces!'),
        (3, 1, 'Gracias por la confianza! A disposición siempre.')
      `);
      console.log('✅ 4 respuestas a reseñas insertadas');
    }

    // Verify
    console.log('\n📊 Verificando datos...');
    const [users] = await conn.execute('SELECT id, name, email, role FROM users');
    console.log('Usuarios:', users);
    const [providers] = await conn.execute('SELECT id, name, type FROM providers');
    console.log('Proveedores:', providers);

    console.log('\n🎉 ¡Setup completo! TiDB Cloud está listo.');
    await conn.end();
  } catch (e) {
    console.error('❌ Error:', e.message);
    if (conn) await conn.end();
    process.exit(1);
  }
}

setup();
