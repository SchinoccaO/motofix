# 💻 EJEMPLOS PRÁCTICOS DE CÓDIGO

Esta guía contiene ejemplos paso a paso que puedes seguir para entender cómo funciona cada parte.

---

## 📝 EJEMPLO 1: CREAR UN NUEVO ENDPOINT

Vamos a crear un endpoint para que un usuario pueda actualizar su contraseña.

### PASO 1: Crear la función en el controlador

**Archivo:** `server/src/controllers/authController.js`

```javascript
// ============================================
// ENDPOINT: CAMBIAR CONTRASEÑA
// ============================================
export const cambiarPassword = async (req, res) => {
  try {
    // 1. Obtener datos del body
    const { passwordActual, passwordNueva } = req.body;

    // 2. Validar que existan ambos campos
    if (!passwordActual || !passwordNueva) {
      return res.status(400).json({
        error: "Debes proporcionar la contraseña actual y la nueva",
      });
    }

    // 3. Validar que la nueva contraseña sea segura
    if (passwordNueva.length < 6) {
      return res.status(400).json({
        error: "La nueva contraseña debe tener al menos 6 caracteres",
      });
    }

    // 4. Buscar al usuario (req.usuario viene del middleware)
    const usuario = await User.findByPk(req.usuario.id);

    // 5. Verificar que la contraseña actual sea correcta
    const passwordCorrecta = await usuario.compararPassword(passwordActual);
    if (!passwordCorrecta) {
      return res.status(401).json({
        error: "La contraseña actual es incorrecta",
      });
    }

    // 6. Actualizar la contraseña
    usuario.password = passwordNueva;
    await usuario.save(); // El hook beforeUpdate encriptará la contraseña

    // 7. Responder con éxito
    res.json({
      mensaje: "Contraseña actualizada exitosamente",
    });
  } catch (error) {
    console.error("Error al cambiar contraseña:", error);
    res.status(500).json({
      error: "Error al cambiar contraseña",
    });
  }
};
```

### PASO 2: Agregar la ruta

**Archivo:** `server/src/routes/authRoutes.js`

```javascript
import {
  registrar,
  login,
  obtenerPerfil,
  actualizarPerfil,
  cambiarPassword, // ← Importamos la nueva función
} from "../controllers/authController.js";

// ... código existente ...

// Nueva ruta protegida
router.put("/cambiar-password", verificarToken, cambiarPassword);
```

### PASO 3: Usar el endpoint desde el frontend

**Ejemplo en React:**

```javascript
const cambiarPassword = async (passwordActual, passwordNueva) => {
  try {
    // Obtener el token del localStorage
    const token = localStorage.getItem("token");

    // Hacer la petición
    const response = await fetch(
      "http://localhost:3000/api/auth/cambiar-password",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ← Incluir token
        },
        body: JSON.stringify({
          passwordActual,
          passwordNueva,
        }),
      },
    );

    const data = await response.json();

    if (response.ok) {
      alert("Contraseña actualizada exitosamente");
    } else {
      alert("Error: " + data.error);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error de conexión");
  }
};
```

---

## 📝 EJEMPLO 2: AGREGAR RELACIÓN A UN MODELO

Vamos a agregar que los talleres puedan tener fotos (relación 1:N).

### PASO 1: Crear el nuevo modelo

**Archivo:** `server/src/models/FotoModel.js`

```javascript
// ============================================
// MODELO DE FOTO (FotoModel)
// ============================================
// Este modelo representa fotos de un taller

import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";

class Foto extends Model {}

Foto.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    // Relación con el taller (FOREIGN KEY)
    taller_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: "talleres",
        key: "id",
      },
      onDelete: "CASCADE", // Si se elimina el taller, se eliminan sus fotos
    },

    // URL de la foto
    url: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },

    // Descripción opcional
    descripcion: {
      type: DataTypes.STRING(255),
    },

    // Es la foto principal?
    es_principal: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Foto",
    tableName: "fotos",
    timestamps: true,
    underscored: true,
  },
);

export default Foto;
```

### PASO 2: Definir la relación

**Archivo:** `server/src/models/index.js`

```javascript
import User from "./UserModel.js";
import Taller from "./TallerModel.js";
import Resena from "./ResenaModel.js";
import Foto from "./FotoModel.js"; // ← Importar nuevo modelo

// ===== RELACIONES EXISTENTES =====
User.hasMany(Taller, { foreignKey: "usuario_id" });
Taller.belongsTo(User, { foreignKey: "usuario_id" });

User.hasMany(Resena, { foreignKey: "usuario_id" });
Resena.belongsTo(User, { foreignKey: "usuario_id" });

Taller.hasMany(Resena, { foreignKey: "taller_id" });
Resena.belongsTo(Taller, { foreignKey: "taller_id" });

// ===== NUEVA RELACIÓN =====
// Un taller tiene muchas fotos
Taller.hasMany(Foto, {
  foreignKey: "taller_id",
  as: "fotos", // Alias para acceder: taller.fotos
});

// Una foto pertenece a un taller
Foto.belongsTo(Taller, {
  foreignKey: "taller_id",
});

// Exportar todos los modelos
export { User, Taller, Resena, Foto };
```

### PASO 3: Usar la relación en consultas

```javascript
// Obtener un taller CON sus fotos
const taller = await Taller.findByPk(1, {
  include: [
    {
      model: Foto,
      as: "fotos", // Debe coincidir con el alias definido en la relación
    },
  ],
});

// Resultado:
// {
//   id: 1,
//   nombre: "Taller Raúl",
//   fotos: [
//     { id: 1, url: "foto1.jpg", descripcion: "Fachada" },
//     { id: 2, url: "foto2.jpg", descripcion: "Interior" }
//   ]
// }
```

---

## 📝 EJEMPLO 3: CREAR UN COMPONENTE REACT REUTILIZABLE

Vamos a crear un componente de tarjeta de taller.

### PASO 1: Crear el componente

**Archivo:** `client/src/components/TallerCard.tsx`

```tsx
// ============================================
// COMPONENTE: TallerCard
// ============================================
// Tarjeta para mostrar información resumida de un taller

import { Link } from "react-router-dom";

// ===== INTERFACE: Define el tipo de datos que recibe el componente =====
interface TallerCardProps {
  taller: {
    id: number;
    nombre: string;
    ciudad: string;
    calificacion_promedio: number;
    total_resenas: number;
    foto_url?: string;
  };
}

// ===== COMPONENTE =====
export default function TallerCard({ taller }: TallerCardProps) {
  // Función para renderizar las estrellas según la calificación
  const renderEstrellas = (calificacion: number) => {
    // Array de 5 elementos
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <span
          key={index}
          className={index < calificacion ? "text-yellow-400" : "text-gray-300"}
        >
          ★
        </span>
      ));
  };

  return (
    // Tarjeta con hover effect
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-4">
      {/* Foto del taller */}
      <div className="w-full h-48 bg-gray-200 rounded-lg mb-3 overflow-hidden">
        {taller.foto_url ? (
          <img
            src={taller.foto_url}
            alt={taller.nombre}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Sin foto
          </div>
        )}
      </div>

      {/* Información del taller */}
      <h3 className="text-lg font-bold text-gray-800 mb-1">{taller.nombre}</h3>

      <p className="text-sm text-gray-600 mb-2">📍 {taller.ciudad}</p>

      {/* Calificación */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex">
          {renderEstrellas(Math.round(taller.calificacion_promedio))}
        </div>
        <span className="text-sm text-gray-600">
          ({taller.total_resenas} reseñas)
        </span>
      </div>

      {/* Botón para ver más */}
      <Link
        to={`/taller/${taller.id}`}
        className="block w-full text-center bg-primary hover:bg-yellow-500 text-white font-medium py-2 rounded transition-colors"
      >
        Ver detalles
      </Link>
    </div>
  );
}
```

### PASO 2: Usar el componente

**Archivo:** `client/src/pages/BuscarTalleres.tsx`

```tsx
import { useState, useEffect } from "react";
import TallerCard from "../components/TallerCard";

export default function BuscarTalleres() {
  // Estado para guardar la lista de talleres
  const [talleres, setTalleres] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect se ejecuta cuando el componente se monta
  useEffect(() => {
    // Función para obtener talleres
    const fetchTalleres = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/talleres");
        const data = await response.json();
        setTalleres(data);
      } catch (error) {
        console.error("Error al cargar talleres:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTalleres();
  }, []); // [] significa "ejecutar solo una vez al montar"

  // Mientras carga, mostrar mensaje
  if (loading) {
    return <div className="p-8 text-center">Cargando talleres...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Talleres Disponibles</h1>

      {/* Grid de tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {talleres.map((taller) => (
          <TallerCard key={taller.id} taller={taller} />
        ))}
      </div>
    </div>
  );
}
```

---

## 📝 EJEMPLO 4: MANEJO DE ERRORES COMPLETO

### En el Backend

```javascript
// ============================================
// EJEMPLO: Endpoint con manejo completo de errores
// ============================================

export const crearTaller = async (req, res) => {
  try {
    // 1. Validar que el usuario sea mecánico
    if (req.usuario.rol !== "mecanico") {
      return res.status(403).json({
        error: "Solo los mecánicos pueden crear talleres",
      });
    }

    // 2. Extraer y validar datos
    const { nombre, ciudad, direccion } = req.body;

    if (!nombre || !ciudad || !direccion) {
      return res.status(400).json({
        error: "Nombre, ciudad y dirección son obligatorios",
        campos_faltantes: {
          nombre: !nombre,
          ciudad: !ciudad,
          direccion: !direccion,
        },
      });
    }

    // 3. Validar longitud de los campos
    if (nombre.length < 3) {
      return res.status(400).json({
        error: "El nombre debe tener al menos 3 caracteres",
      });
    }

    // 4. Verificar que el mecánico no tenga ya un taller
    const tallerExistente = await Taller.findOne({
      where: { usuario_id: req.usuario.id },
    });

    if (tallerExistente) {
      return res.status(400).json({
        error: "Ya tienes un taller registrado",
        taller_id: tallerExistente.id,
      });
    }

    // 5. Crear el taller
    const nuevoTaller = await Taller.create({
      usuario_id: req.usuario.id,
      nombre,
      ciudad,
      direccion,
    });

    // 6. Responder con éxito
    res.status(201).json({
      mensaje: "Taller creado exitosamente",
      taller: nuevoTaller,
    });
  } catch (error) {
    // Errores de Sequelize (validaciones del modelo)
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Error de validación",
        detalles: error.errors.map((e) => ({
          campo: e.path,
          mensaje: e.message,
        })),
      });
    }

    // Errores de base de datos (duplicados, etc.)
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        error: "Ya existe un registro con esos datos",
        campo: error.errors[0].path,
      });
    }

    // Error genérico
    console.error("Error al crear taller:", error);
    res.status(500).json({
      error: "Error interno del servidor",
      // Solo en desarrollo mostramos el mensaje real
      detalle:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
```

### En el Frontend

```typescript
// ============================================
// EJEMPLO: Formulario con manejo completo de errores
// ============================================

import { useState } from 'react';

export default function FormularioTaller() {
    const [formData, setFormData] = useState({
        nombre: '',
        ciudad: '',
        direccion: ''
    });

    const [errores, setErrores] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [mensajeExito, setMensajeExito] = useState('');

    // Validación en el cliente (antes de enviar)
    const validarFormulario = () => {
        const nuevosErrores: Record<string, string> = {};

        if (!formData.nombre.trim()) {
            nuevosErrores.nombre = 'El nombre es obligatorio';
        } else if (formData.nombre.length < 3) {
            nuevosErrores.nombre = 'El nombre debe tener al menos 3 caracteres';
        }

        if (!formData.ciudad.trim()) {
            nuevosErrores.ciudad = 'La ciudad es obligatoria';
        }

        if (!formData.direccion.trim()) {
            nuevosErrores.direccion = 'La dirección es obligatoria';
        }

        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Limpiar mensajes anteriores
        setMensajeExito('');
        setErrores({});

        // Validar antes de enviar
        if (!validarFormulario()) {
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:3000/api/talleres', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                // Éxito
                setMensajeExito('¡Taller creado exitosamente!');
                // Limpiar formulario
                setFormData({ nombre: '', ciudad: '', direccion: '' });
            } else {
                // Error del servidor
                if (data.campos_faltantes) {
                    // Marcar campos específicos con error
                    const nuevosErrores: Record<string, string> = {};
                    Object.keys(data.campos_faltantes).forEach(campo => {
                        if (data.campos_faltantes[campo]) {
                            nuevosErrores[campo] = `Este campo es obligatorio`;
                        }
                    });
                    setErrores(nuevosErrores);
                } else {
                    // Error genérico
                    setErrores({ general: data.error || 'Error desconocido' });
                }
            }
        } catch (error) {
            // Error de conexión
            setErrores({
                general: 'Error de conexión. Verifica tu internet.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Registrar Taller</h2>

            {/* Mensaje de éxito */}
            {mensajeExito && (
                <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
                    {mensajeExito}
                </div>
            )}

            {/* Error general */}
            {errores.general && (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                    {errores.general}
                </div>
            )}

            {/* Campo: Nombre */}
            <div className="mb-4">
                <label className="block font-medium mb-2">Nombre del Taller</label>
                <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className={`w-full p-2 border rounded ${
                        errores.nombre ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {errores.nombre && (
                    <p className="text-red-500 text-sm mt-1">{errores.nombre}</p>
                )}
            </div>

            {/* Campo: Ciudad */}
            <div className="mb-4">
                <label className="block font-medium mb-2">Ciudad</label>
                <input
                    type="text"
                    value={formData.ciudad}
                    onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                    className={`w-full p-2 border rounded ${
                        errores.ciudad ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {errores.ciudad && (
                    <p className="text-red-500 text-sm mt-1">{errores.ciudad}</p>
                )}
            </div>

            {/* Campo: Dirección */}
            <div className="mb-4">
                <label className="block font-medium mb-2">Dirección</label>
                <input
                    type="text"
                    value={formData.direccion}
                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                    className={`w-full p-2 border rounded ${
                        errores.direccion ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {errores.direccion && (
                    <p className="text-red-500 text-sm mt-1">{errores.direccion}</p>
                )}
            </div>

            {/* Botón Submit */}
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-yellow-500 text-white font-bold py-3 rounded transition-colors disabled:bg-gray-400"
            >
                {loading ? 'Creando...' : 'Crear Taller'}
            </button>
        </form>
    );
}
```

---

¡Con estos ejemplos prácticos puedes empezar a crear tus propias funcionalidades! 🚀
