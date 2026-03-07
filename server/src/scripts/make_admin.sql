-- Ejecutar en la consola PostgreSQL de Render (o psql).
-- Promueve a Oriana como admin.
UPDATE users
SET    role = 'admin'
WHERE  email = 'orianaschinocca@gmail.com';

-- Verificación:
SELECT id, name, email, role, created_at
FROM   users
WHERE  email = 'orianaschinocca@gmail.com';
