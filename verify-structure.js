#!/usr/bin/env node

/**
 * Script de verificación de la estructura del proyecto MotoYA
 * Ejecutar con: node verify-structure.js
 */

const fs = require('fs');
const path = require('path');

const requiredStructure = {
    directories: [
        'client',
        'client/public',
        'client/public/assets',
        'client/public/assets/css',
        'client/public/assets/images',
        'client/src',
        'client/src/components',
        'client/src/pages',
        'client/src/services',
        'client/src/utils',
        'server',
        'server/src',
        'server/src/config',
        'server/src/controllers',
        'server/src/middlewares',
        'server/src/models',
        'server/src/routes',
        'database',
        'database/migrations',
        'database/seeds',
        'docs'
    ],
    files: [
        'README.md',
        'SETUP.md',
        'TODO.md',
        'ESTRUCTURA.md',
        'COMANDOS.md',
        'CHANGELOG.md',
        '.gitignore',
        'package.json',
        'client/package.json',
        'client/vite.config.js',
        'client/tailwind.config.js',
        'client/public/index.html',
        'client/public/registromecanico.html',
        'client/public/resena.html',
        'client/public/assets/css/index.css',
        'client/public/assets/css/registromecanico.css',
        'client/public/assets/css/resena.css',
        'server/package.json',
        'server/.env.example',
        'server/src/index.js',
        'docs/ARQUITECTURA.md'
    ]
};

console.log('🔍 Verificando estructura del proyecto MotoYA...\n');

let allPassed = true;
let missingCount = 0;
let foundCount = 0;

// Verificar directorios
console.log('📁 Verificando directorios:\n');
requiredStructure.directories.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    const exists = fs.existsSync(dirPath);

    if (exists) {
        console.log(`  ✅ ${dir}`);
        foundCount++;
    } else {
        console.log(`  ❌ ${dir} (NO ENCONTRADO)`);
        allPassed = false;
        missingCount++;
    }
});

console.log(`\n📄 Verificando archivos:\n`);
requiredStructure.files.forEach(file => {
    const filePath = path.join(__dirname, file);
    const exists = fs.existsSync(filePath);

    if (exists) {
        console.log(`  ✅ ${file}`);
        foundCount++;
    } else {
        console.log(`  ❌ ${file} (NO ENCONTRADO)`);
        allPassed = false;
        missingCount++;
    }
});

// Resumen
console.log('\n' + '='.repeat(60));
console.log('📊 Resumen de Verificación:\n');
console.log(`  Total verificado: ${requiredStructure.directories.length + requiredStructure.files.length}`);
console.log(`  ✅ Encontrados: ${foundCount}`);
console.log(`  ❌ Faltantes: ${missingCount}`);

if (allPassed) {
    console.log('\n🎉 ¡Estructura del proyecto verificada correctamente!');
    console.log('✅ Todos los archivos y carpetas requeridos están presentes.');
    console.log('\n📚 Próximos pasos:');
    console.log('   1. Ejecuta: npm install');
    console.log('   2. Lee: SETUP.md para configuración');
    console.log('   3. Revisa: TODO.md para tareas pendientes');
    process.exit(0);
} else {
    console.log('\n⚠️  Estructura incompleta');
    console.log(`   Faltan ${missingCount} elementos.`);
    console.log('   Revisa los elementos marcados con ❌ arriba.');
    process.exit(1);
}
