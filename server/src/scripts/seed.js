import bcrypt from 'bcryptjs';
import { User, Taller, Resena } from '../models/index.js';
import sequelize from '../config/db.js';

/**
 * Script de Seed - Datos de prueba para MotoYA
 * Ejecutar con: npm run seed
 */
async function seed() {
  try {
    console.log('🌱 Iniciando seed de base de datos...\n');
    
    // Verificar conexión
    await sequelize.authenticate();
    console.log('✅ Conexión a MySQL exitosa');
    
    // Sincronizar modelos (crear tablas si no existen)
    await sequelize.sync({ alter: true });
    console.log('✅ Tablas sincronizadas\n');
    
    // Limpiar datos existentes (opcional - comentar si no quieres borrar)
    console.log('🗑️  Limpiando datos existentes...');
    
    // Desactivar temporalmente las foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    await Resena.destroy({ where: {}, truncate: true });
    await Taller.destroy({ where: {}, truncate: true });
    await User.destroy({ where: {}, truncate: true });
    
    // Reactivar foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('✅ Datos limpiados\n');
    
    // Password genérica para todos los usuarios (123456)
    const password = await bcrypt.hash('123456', 10);
    console.log('🔐 Contraseña hasheada: 123456\n');
    
    // ============================================================
    // USUARIOS
    // ============================================================
    console.log('👥 Creando usuarios...');
    
    const admin = await User.create({
      email: 'admin@motoya.com',
      password,
      nombre: 'Admin MotoYA',
      rol: 'admin'
    });
    console.log('  ✓ Admin creado: admin@motoya.com');
    
    const usuario1 = await User.create({
      email: 'juan@mail.com',
      password,
      nombre: 'Juan Pérez',
      rol: 'usuario'
    });
    console.log('  ✓ Usuario creado: juan@mail.com');
    
    const usuario2 = await User.create({
      email: 'maria@mail.com',
      password,
      nombre: 'María González',
      rol: 'usuario'
    });
    console.log('  ✓ Usuario creado: maria@mail.com');
    
    const tallerOwner1 = await User.create({
      email: 'taller1@mail.com',
      password,
      nombre: 'Carlos Rodríguez',
      rol: 'taller'
    });
    console.log('  ✓ Propietario taller creado: taller1@mail.com');
    
    const tallerOwner2 = await User.create({
      email: 'taller2@mail.com',
      password,
      nombre: 'Ana Martínez',
      rol: 'taller'
    });
    console.log('  ✓ Propietario taller creado: taller2@mail.com\n');
    
    // ============================================================
    // TALLERES
    // ============================================================
    console.log('🏪 Creando talleres...');
    
    const taller1 = await Taller.create({
      user_id: tallerOwner1.id,
      nombre: 'MotoTaller El Rápido',
      descripcion: 'Especialistas en mantenimiento preventivo y correctivo de motos. Más de 15 años de experiencia.',
      direccion: 'Av. Principal 123',
      ciudad: 'Buenos Aires',
      telefono: '+54 11 4567-8901',
      email: 'contacto@elrapido.com',
      servicios: 'mantenimiento,reparacion,repuestos,neumaticos',
      horario: 'Lun-Vie: 8:00-18:00, Sáb: 9:00-14:00'
    });
    console.log('  ✓ Taller creado: MotoTaller El Rápido');
    
    const taller2 = await Taller.create({
      user_id: tallerOwner2.id,
      nombre: 'Moto Service Premium',
      descripcion: 'Taller especializado en motos deportivas y de alta gama. Mecánicos certificados.',
      direccion: 'Calle Falsa 456',
      ciudad: 'Córdoba',
      telefono: '+54 351 555-1234',
      email: 'info@motoservicepremium.com',
      servicios: 'mantenimiento,reparacion,tunning,diagnostico',
      horario: 'Lun-Sáb: 9:00-19:00'
    });
    console.log('  ✓ Taller creado: Moto Service Premium');
    
    const taller3 = await Taller.create({
      user_id: tallerOwner1.id,
      nombre: 'TallerMoto Express',
      descripcion: 'Servicio rápido y económico. Ideal para mantenimientos básicos.',
      direccion: 'Ruta 9 Km 123',
      ciudad: 'Rosario',
      telefono: '+54 341 777-9999',
      email: 'express@tallermoto.com',
      servicios: 'mantenimiento,cambio-aceite,frenos',
      horario: 'Lun-Vie: 7:00-17:00'
    });
    console.log('  ✓ Taller creado: TallerMoto Express\n');
    
    // ============================================================
    // RESEÑAS
    // ============================================================
    console.log('⭐ Creando reseñas...');
    
    await Resena.create({
      user_id: usuario1.id,
      taller_id: taller1.id,
      rating: 5,
      comentario: 'Excelente servicio! Muy profesionales y rápidos. Cambio de aceite impecable.',
      servicio_usado: 'Cambio de aceite',
      votos_utiles: 5
    });
    console.log('  ✓ Reseña creada para MotoTaller El Rápido');
    
    await Resena.create({
      user_id: usuario2.id,
      taller_id: taller1.id,
      rating: 4,
      comentario: 'Buen taller, aunque tuve que esperar un poco más de lo previsto.',
      servicio_usado: 'Reparación de frenos',
      votos_utiles: 2
    });
    console.log('  ✓ Reseña creada para MotoTaller El Rápido');
    
    await Resena.create({
      user_id: usuario1.id,
      taller_id: taller2.id,
      rating: 5,
      comentario: 'Los mejores! Especialistas en motos deportivas. Muy recomendado.',
      servicio_usado: 'Mantenimiento completo',
      votos_utiles: 8
    });
    console.log('  ✓ Reseña creada para Moto Service Premium');
    
    await Resena.create({
      user_id: usuario2.id,
      taller_id: taller3.id,
      rating: 3,
      comentario: 'Servicio correcto y económico. Para trabajos básicos está bien.',
      servicio_usado: 'Cambio de aceite',
      votos_utiles: 1
    });
    console.log('  ✓ Reseña creada para TallerMoto Express');
    
    await Resena.create({
      user_id: usuario1.id,
      taller_id: taller3.id,
      rating: 4,
      comentario: 'Rápido y barato. Cumple con lo esperado.',
      servicio_usado: 'Cambio de filtro',
      votos_utiles: 3
    });
    console.log('  ✓ Reseña creada para TallerMoto Express\n');
    
    // ============================================================
    // RESUMEN
    // ============================================================
    console.log('═══════════════════════════════════════════');
    console.log('🎉 Seed completado exitosamente!\n');
    console.log('📊 Resumen de datos insertados:');
    console.log(`   • Usuarios: 5 (1 admin, 2 usuarios, 2 propietarios)`);
    console.log(`   • Talleres: 3`);
    console.log(`   • Reseñas: 5\n`);
    console.log('🔑 Credenciales de prueba:');
    console.log('   • Admin: admin@motoya.com / 123456');
    console.log('   • Usuario: juan@mail.com / 123456');
    console.log('   • Taller: taller1@mail.com / 123456');
    console.log('═══════════════════════════════════════════\n');
    
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Error en seed:', error);
    console.error('\nDetalles:', error.message);
    process.exit(1);
  }
}

// Ejecutar seed
seed();
