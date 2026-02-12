import dotenv from 'dotenv';
dotenv.config();

import sequelize from '../src/config/db.js';

async function migrate() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');

    // Add google_id column
    await sequelize.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE DEFAULT NULL
    `).catch(e => {
      if (e.message.includes('Duplicate column')) {
        console.log('google_id column already exists');
      } else {
        throw e;
      }
    });
    console.log('Added google_id column');

    // Add auth_provider column
    await sequelize.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(10) NOT NULL DEFAULT 'local'
    `).catch(e => {
      if (e.message.includes('Duplicate column')) {
        console.log('auth_provider column already exists');
      } else {
        throw e;
      }
    });
    console.log('Added auth_provider column');

    // Make password_hash nullable
    await sequelize.query(`
      ALTER TABLE users MODIFY COLUMN password_hash VARCHAR(255) NULL
    `);
    console.log('Made password_hash nullable');

    console.log('\nMigration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
