import bcrypt from 'bcryptjs';
import { User, Provider, Location, Review, ReviewReply } from '../models/index.js';
import sequelize from '../config/db.js';

async function seed() {
  try {
    console.log('Iniciando seed de base de datos...\n');

    await sequelize.authenticate();
    console.log('Conexion a MySQL exitosa');

    await sequelize.sync({ alter: true });
    console.log('Tablas sincronizadas\n');

    // Limpiar datos existentes
    console.log('Limpiando datos existentes...');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await ReviewReply.destroy({ where: {}, truncate: true });
    await Review.destroy({ where: {}, truncate: true });
    await Location.destroy({ where: {}, truncate: true });
    await Provider.destroy({ where: {}, truncate: true });
    await User.destroy({ where: {}, truncate: true });
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('Datos limpiados\n');

    const password_hash = await bcrypt.hash('123456', 10);

    // ============================================================
    // USERS
    // ============================================================
    console.log('Creando usuarios...');

    const admin = await User.create({
      name: 'Admin MotoYA',
      email: 'admin@motoya.com',
      password_hash,
      role: 'admin'
    });
    console.log('  - Admin: admin@motoya.com');

    const juan = await User.create({
      name: 'Juan Pérez',
      email: 'juan@mail.com',
      password_hash,
      role: 'user'
    });
    console.log('  - User: juan@mail.com');

    const maria = await User.create({
      name: 'María González',
      email: 'maria@mail.com',
      password_hash,
      role: 'user'
    });
    console.log('  - User: maria@mail.com');

    const carlos = await User.create({
      name: 'Carlos Rodríguez',
      email: 'carlos@mail.com',
      password_hash,
      role: 'user'
    });
    console.log('  - User: carlos@mail.com\n');

    // ============================================================
    // PROVIDERS
    // ============================================================
    console.log('Creando providers...');

    const shop1 = await Provider.create({
      type: 'shop',
      name: 'MotoTaller El Rápido',
      description: 'Especialistas en mantenimiento preventivo y correctivo de motos. Más de 15 años de experiencia.',
      phone: '+54 11 4567-8901',
      email: 'contacto@elrapido.com',
      website: 'https://elrapido.com.ar',
      is_verified: true,
      average_rating: 4.50,
      total_reviews: 2
    });
    console.log('  - [shop] MotoTaller El Rápido (verified)');

    const mechanic1 = await Provider.create({
      type: 'mechanic',
      name: 'Diego Mecánica Motos',
      description: 'Mecánico independiente con 10 años de experiencia. Atención personalizada a domicilio.',
      phone: '+54 351 555-1234',
      email: 'diego.mecanica@mail.com',
      is_verified: true,
      average_rating: 4.00,
      total_reviews: 2
    });
    console.log('  - [mechanic] Diego Mecánica Motos (verified)');

    const partsStore1 = await Provider.create({
      type: 'parts_store',
      name: 'RepuestosMoto Center',
      description: 'Venta de repuestos originales y alternativos para todas las marcas.',
      phone: '+54 341 777-9999',
      email: 'ventas@repuestosmoto.com',
      website: 'https://repuestosmotocenter.com.ar',
      is_verified: false,
      average_rating: 4.00,
      total_reviews: 1
    });
    console.log('  - [parts_store] RepuestosMoto Center (not verified)');

    const shop2 = await Provider.create({
      type: 'shop',
      name: 'Moto Service Premium',
      description: 'Taller especializado en motos deportivas y de alta gama. Mecánicos certificados.',
      phone: '+54 11 3333-4444',
      email: 'info@motoservicepremium.com',
      is_verified: true
    });
    console.log('  - [shop] Moto Service Premium (verified, sin reviews)\n');

    // ============================================================
    // LOCATIONS
    // ============================================================
    console.log('Creando locations...');

    await Location.create({
      provider_id: shop1.id,
      address: 'Av. Principal 123',
      city: 'Buenos Aires',
      province: 'Buenos Aires',
      country: 'Argentina',
      latitude: -34.6037389,
      longitude: -58.3815704
    });
    console.log('  - Buenos Aires (El Rápido)');

    await Location.create({
      provider_id: mechanic1.id,
      address: 'Calle Falsa 456',
      city: 'Córdoba',
      province: 'Córdoba',
      country: 'Argentina',
      latitude: -31.4200833,
      longitude: -64.1887761
    });
    console.log('  - Córdoba (Diego Mecánica)');

    await Location.create({
      provider_id: partsStore1.id,
      address: 'Ruta 9 Km 123',
      city: 'Rosario',
      province: 'Santa Fe',
      country: 'Argentina',
      latitude: -32.9442426,
      longitude: -60.6505388
    });
    console.log('  - Rosario (RepuestosMoto)');

    await Location.create({
      provider_id: shop2.id,
      address: 'Av. Libertador 789',
      city: 'Buenos Aires',
      province: 'Buenos Aires',
      country: 'Argentina',
      latitude: -34.5875140,
      longitude: -58.4299520
    });
    console.log('  - Buenos Aires (Moto Service Premium)\n');

    // ============================================================
    // REVIEWS
    // ============================================================
    console.log('Creando reviews...');

    const review1 = await Review.create({
      user_id: juan.id,
      provider_id: shop1.id,
      rating: 5,
      comment: 'Excelente servicio! Muy profesionales y rápidos. Cambio de aceite impecable.'
    });

    const review2 = await Review.create({
      user_id: maria.id,
      provider_id: shop1.id,
      rating: 4,
      comment: 'Buen taller, aunque tuve que esperar un poco más de lo previsto.'
    });

    const review3 = await Review.create({
      user_id: juan.id,
      provider_id: mechanic1.id,
      rating: 5,
      comment: 'Diego es un genio. Vino a casa y me arregló la moto en una hora.'
    });

    await Review.create({
      user_id: maria.id,
      provider_id: mechanic1.id,
      rating: 3,
      comment: 'Buen mecánico pero tarda en responder los mensajes.'
    });

    await Review.create({
      user_id: juan.id,
      provider_id: partsStore1.id,
      rating: 4,
      comment: 'Tienen de todo, buenos precios y envío rápido.'
    });

    console.log('  - 5 reviews creadas\n');

    // ============================================================
    // REVIEW REPLIES
    // ============================================================
    console.log('Creando review replies...');

    await ReviewReply.create({
      review_id: review1.id,
      user_id: admin.id,
      content: 'Muchas gracias Juan! Nos alegra que hayas quedado satisfecho.'
    });

    await ReviewReply.create({
      review_id: review2.id,
      user_id: admin.id,
      content: 'Gracias por el feedback María. Estamos mejorando los tiempos de espera.'
    });

    await ReviewReply.create({
      review_id: review2.id,
      user_id: maria.id,
      content: 'Bueno saberlo, voy a volver a probar entonces!'
    });

    await ReviewReply.create({
      review_id: review3.id,
      user_id: admin.id,
      content: 'Gracias por la confianza! A disposición siempre.'
    });

    console.log('  - 4 replies creadas\n');

    // ============================================================
    // SUMMARY
    // ============================================================
    console.log('===================================');
    console.log('Seed completado exitosamente!\n');
    console.log('Datos insertados:');
    console.log('  Users: 4 (1 admin, 3 users)');
    console.log('  Providers: 4 (2 shops, 1 mechanic, 1 parts_store)');
    console.log('  Locations: 4');
    console.log('  Reviews: 5');
    console.log('  Review Replies: 4\n');
    console.log('Credenciales (password: 123456):');
    console.log('  Admin: admin@motoya.com');
    console.log('  User:  juan@mail.com');
    console.log('  User:  maria@mail.com');
    console.log('  User:  carlos@mail.com');
    console.log('===================================\n');

    process.exit(0);
  } catch (error) {
    console.error('\nError en seed:', error);
    console.error('\nDetalles:', error.message);
    process.exit(1);
  }
}

seed();
