// ─────────────────────────────────────────────────────────────────────────────
// MotoFIX — Constantes centralizadas
// Todos los límites numéricos y valores de dominio van aquí.
// Si necesitás cambiar un límite, cambialo acá: se propaga a validaciones,
// modelos y lógica de negocio automáticamente.
// ─────────────────────────────────────────────────────────────────────────────

// ── Longitudes de campos de texto ─────────────────────────────────────────────
export const NAME_MAX        = 255;
export const EMAIL_MAX       = 255;
export const PHONE_MAX       = 30;
export const URL_MAX         = 500;   // avatar_url, website, photo_url
export const CITY_MAX        = 100;
export const PROVINCE_MAX    = 100;
export const COUNTRY_MAX     = 100;
export const ADDRESS_MAX     = 500;
export const DESCRIPTION_MAX = 2000;  // campo TEXT — sin límite en DB, se valida en API
export const COMMENT_MAX     = 2000;  // campo TEXT — sin límite en DB, se valida en API
export const TAG_NAME_MIN    = 1;
export const TAG_NAME_MAX    = 50;    // largo máximo de un tag individual (validación)
export const TAG_DB_MAX      = 100;   // tamaño de la columna tags.name en DB

// ── Contraseña ────────────────────────────────────────────────────────────────
export const PASSWORD_MIN  = 8;
export const BCRYPT_ROUNDS = 10;

// ── Coordenadas geográficas ───────────────────────────────────────────────────
export const LAT_MIN = -90;
export const LAT_MAX =  90;
export const LNG_MIN = -180;
export const LNG_MAX =  180;

// ── Rating / reseñas ─────────────────────────────────────────────────────────
export const RATING_MIN = 1;
export const RATING_MAX = 5;

// Tiempo de cooldown entre reseñas al mismo provider (en ms)
export const REVIEW_COOLDOWN_MS = 60 * 60 * 1000;  // 1 hora

// ── Tags por provider ─────────────────────────────────────────────────────────
export const TAGS_PER_PROVIDER_MAX = 20;

// ── Tipos de provider válidos ─────────────────────────────────────────────────
export const PROVIDER_TYPES = ['shop', 'mechanic', 'parts_store'];

// ── Rate limiting — rutas de auth ─────────────────────────────────────────────
export const LOGIN_WINDOW_MS       = 15 * 60 * 1000;  // 15 min
export const LOGIN_MAX_ATTEMPTS    = 10;

export const REGISTER_WINDOW_MS    = 60 * 60 * 1000;  // 1 hora
export const REGISTER_MAX_ATTEMPTS = 5;

export const PASSWORD_WINDOW_MS    = 15 * 60 * 1000;  // 15 min
export const PASSWORD_MAX_ATTEMPTS = 5;

// ── Ediciones de perfil de provider (rate limiting de negocio) ────────────────
export const PROFILE_EDIT_MAX       = 2;                          // ediciones permitidas por ventana
export const PROFILE_EDIT_WINDOW_MS = 14 * 24 * 60 * 60 * 1000; // 14 días

// ── Búsqueda ──────────────────────────────────────────────────────────────────
export const SEARCH_TERMS_MAX = 10;  // máximo de palabras a procesar en una búsqueda

// ── Tokens JWT ────────────────────────────────────────────────────────────────
export const JWT_EXPIRES_IN               = '7d';
export const LOCATION_TOKEN_EXPIRES       = '7d';  // token de aprobación de cambio de ubicación
export const RESET_PASSWORD_TOKEN_EXPIRES = '1h';  // token de reset de contraseña

// ── Rate limiting — forgot password ──────────────────────────────────────────
export const FORGOT_PASSWORD_WINDOW_MS    = 15 * 60 * 1000;  // 15 min
export const FORGOT_PASSWORD_MAX_ATTEMPTS = 3;
