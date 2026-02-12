import sequelize from './src/config/db.js';

const migrate = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS tags (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);
    console.log('tags table created');

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS provider_tags (
        provider_id INT UNSIGNED NOT NULL,
        tag_id INT UNSIGNED NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (provider_id, tag_id)
      );
    `);
    console.log('provider_tags table created');

    // Insert seed tags (ignore duplicates)
    const seedTags = [
      'Yamaha', 'Honda', 'Kawasaki', 'Suzuki', 'KTM',
      'Frenos', 'Aceite', 'Embrague', 'Suspension', 'Electricidad',
      'Inyeccion', 'Carburador', 'Neumaticos', 'Cadena', 'Escape'
    ];

    for (const tag of seedTags) {
      await sequelize.query(
        `INSERT IGNORE INTO tags (name) VALUES (:name)`,
        { replacements: { name: tag } }
      );
    }
    console.log('Seed tags inserted');

    console.log('Migration complete!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();
