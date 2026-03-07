// ─── CLIENTE HTTP (axios) ─────────────────────────────────────────────────────
// Todas las funciones de este archivo usan esta instancia configurada.
// La URL base viene de la variable de entorno VITE_API_URL (ver .env / Vercel).
// 🔧 Cambiar la URL fallback si el puerto del backend cambia en desarrollo.
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
});

// Interceptor de autenticación:
// Antes de CADA request, lee el token JWT del localStorage y lo adjunta
// como header "Authorization: Bearer <token>". Si no hay token, el request
// se envía sin header (el backend decide si requiere auth o no).
api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      logout();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ─── AUTH — TIPOS Y HELPERS ───────────────────────────────────────────────────
// Funciones de login/register guardan el token y el usuario en localStorage.
// Para leer el usuario logueado desde cualquier componente: getStoredUser().

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  city: string | null;
  province: string | null;
  role: string;
  created_at?: string;
}

export interface AuthResponse {
  mensaje: string;
  usuario: AuthUser;
  token: string;
}

export function getStoredToken(): string | null {
  return localStorage.getItem('token');
}

export function getStoredUser(): AuthUser | null {
  const raw = localStorage.getItem('usuario');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
  localStorage.setItem('token', data.token);
  localStorage.setItem('usuario', JSON.stringify(data.usuario));
  return data;
}

export async function registerUser(name: string, email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/register', { name, email, password });
  localStorage.setItem('token', data.token);
  localStorage.setItem('usuario', JSON.stringify(data.usuario));
  return data;
}

export async function googleLogin(credential: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/google', { credential });
  localStorage.setItem('token', data.token);
  localStorage.setItem('usuario', JSON.stringify(data.usuario));
  return data;
}

// ─── PERFIL DE USUARIO ────────────────────────────────────────────────────────
// getMyProfile()      → perfil propio (requiere token)
// updateMyProfile()   → edita nombre, teléfono, avatar, ciudad, provincia
// getPublicProfile()  → perfil público de otro usuario (por ID)

export interface UserProfile extends AuthUser {
  reviews?: (ReviewData & { provider?: { id: number; name: string; type: string; location?: { city: string; province: string } } })[];
}

export async function getMyProfile(): Promise<UserProfile> {
  const { data } = await api.get<{ success: boolean; data: UserProfile }>('/auth/perfil');
  return data.data;
}

export async function updateMyProfile(fields: {
  name?: string;
  phone?: string | null;
  avatar_url?: string | null;
  city?: string | null;
  province?: string | null;
}): Promise<UserProfile> {
  const { data } = await api.put<{ success: boolean; data: UserProfile }>('/auth/perfil', fields);
  return data.data;
}

export async function getPublicProfile(userId: number): Promise<UserProfile> {
  const { data } = await api.get<{ success: boolean; data: UserProfile }>(`/auth/users/${userId}`);
  return data.data;
}

// ─── RESEÑAS — TIPOS ─────────────────────────────────────────────────────────
// ReviewData es el objeto que devuelve el backend al listar o crear una reseña.
// estimated_time y actual_time están en horas (enteros). null = no informado.

export interface ReviewData {
  id: number;
  rating: number;
  comment: string;
  estimated_time: number | null;
  actual_time: number | null;
  created_at: string;
  user: { id: number; name: string; email: string };
}

// ─── TAGS (ESPECIALIDADES) — TIPOS ───────────────────────────────────────────
// Los tags representan especialidades del taller (ej. "Frenos", "Motor 4T").
// Se gestionan desde el backend; el frontend solo los lee y los envía al crear.

export interface Tag {
  id: number;
  name: string;
}

// ─── PROVIDERS (TALLERES/MECÁNICOS) — TIPOS Y FUNCIONES ─────────────────────
// Provider es la entidad central de la app. Tiene location, reviews, tags y horarios opcionales.
// 🔧 Si el backend agrega un campo nuevo, agregarlo aquí en la interfaz Provider.
// Los campos con ? son opcionales: el backend no siempre los incluye en el listado general.

export interface Provider {
  id: number;
  owner_id?: number;
  type: 'shop' | 'mechanic' | 'parts_store';
  name: string;
  description: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  is_verified: boolean;
  is_active: boolean;
  average_rating: number;
  total_reviews: number;
  // Estado manual (override del horario): null=usar horario | true=abierto | false=cerrado
  is_open_override?: boolean | null;
  // Rate limiting de ediciones
  profile_edit_count?: number;
  pending_validation?: boolean;
  location?: {
    id: number;
    address: string;
    city: string;
    province: string;
    country: string;
    latitude: number | null;
    longitude: number | null;
  };
  reviews?: ReviewData[];
  tags?: Tag[];
  horarios?: {
    lunes?:     { abre: string; cierra: string } | null;
    martes?:    { abre: string; cierra: string } | null;
    miercoles?: { abre: string; cierra: string } | null;
    jueves?:    { abre: string; cierra: string } | null;
    viernes?:   { abre: string; cierra: string } | null;
    sabado?:    { abre: string; cierra: string } | null;
    domingo?:   { abre: string; cierra: string } | null;
  } | null;
}

interface ProvidersResponse {
  success: boolean;
  count: number;
  data: Provider[];
}

interface ProviderResponse {
  success: boolean;
  data: Provider;
}

interface TagsResponse {
  success: boolean;
  data: Tag[];
}

export interface CreateProviderPayload {
  type: 'shop' | 'mechanic' | 'parts_store';
  name: string;
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  city?: string;
  province?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  tags?: string[];
  horarios?: Record<string, { abre: string; cierra: string } | null> | null;
}

export interface UpdateProviderPayload {
  type?: string;
  name?: string;
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  horarios?: Provider['horarios'];
}

export async function createProvider(payload: CreateProviderPayload): Promise<Provider> {
  const { data } = await api.post<ProviderResponse>('/providers', payload);
  return data.data;
}

export async function updateProvider(id: number, payload: UpdateProviderPayload): Promise<Provider> {
  const { data } = await api.put<ProviderResponse>(`/providers/${id}`, payload);
  return data.data;
}

export async function requestLocationChange(
  id: number,
  payload: { newLat: number; newLng: number; newAddress: string; newCity: string; newProvince: string }
): Promise<{ success: boolean; message: string }> {
  const { data } = await api.post(`/providers/${id}/request-location-change`, payload);
  return data;
}

export async function getMyProviders(): Promise<Provider[]> {
  const { data } = await api.get<ProvidersResponse>('/providers/mine');
  return data.data;
}

export interface ProvidersPage {
  data: Provider[];
  total: number;
  page: number;
  totalPages: number;
}

export async function getProviders(params?: {
  type?: string;
  city?: string;
  search?: string;
  is_verified?: string;
  page?: number;
  limit?: number;
}): Promise<ProvidersPage> {
  const { data } = await api.get<ProvidersResponse & { total: number; page: number; totalPages: number }>(
    '/providers',
    { params }
  );
  return { data: data.data, total: data.total, page: data.page, totalPages: data.totalPages };
}

export async function getProviderById(id: number): Promise<Provider> {
  const { data } = await api.get<ProviderResponse>(`/providers/${id}`);
  return data.data;
}

// Cambiar estado manual abierto/cerrado (override del horario programado).
// override: true=forzar abierto | false=forzar cerrado | null=volver al horario
export async function updateProviderStatus(
  id: number,
  override: boolean | null,
): Promise<{ is_open_override: boolean | null }> {
  const { data } = await api.put<{ success: boolean; data: { is_open_override: boolean | null } }>(
    `/providers/${id}/status`,
    { override },
  );
  return data.data;
}

// ─── TAGS — FUNCIONES ────────────────────────────────────────────────────────

export async function getTags(): Promise<Tag[]> {
  const { data } = await api.get<TagsResponse>('/providers/tags');
  return data.data;
}

// ─── RESEÑAS — FUNCIONES ─────────────────────────────────────────────────────
// createReview() requiere token JWT. Si el usuario no está logueado, redirigir a /login.

export async function createReview(
  providerId: number,
  rating: number,
  comment: string,
  estimated_time?: number | null,
  actual_time?: number | null
): Promise<ReviewData> {
  const { data } = await api.post(`/providers/${providerId}/reviews`, {
    rating,
    comment,
    estimated_time: estimated_time || null,
    actual_time: actual_time || null,
  });
  return data.data;
}

// ─── ADMIN — PROVIDERS ────────────────────────────────────────────────────────

export interface AdminProvider extends Provider {
  owner?: { id: number; name: string; email: string } | null;
}

export interface AdminProvidersPage {
  data: AdminProvider[];
  total: number;
  page: number;
  totalPages: number;
}

export async function adminGetProviders(params?: {
  is_active?: 'all' | 'true' | 'false';
  pending_validation?: 'true' | 'false';
  search?: string;
  page?: number;
  limit?: number;
}): Promise<AdminProvidersPage> {
  const { data } = await api.get<{ success: boolean; data: AdminProvider[]; total: number; page: number; totalPages: number }>(
    '/providers/admin',
    { params }
  );
  return { data: data.data, total: data.total, page: data.page, totalPages: data.totalPages };
}

export async function adminVerifyProvider(id: number, verified: boolean): Promise<void> {
  await api.put(`/providers/${id}/verify`, { verified });
}

export async function adminSetProviderActive(id: number, is_active: boolean): Promise<void> {
  await api.put(`/providers/${id}/active`, { is_active });
}

// ─── ADMIN — USUARIOS ─────────────────────────────────────────────────────────

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  city: string | null;
  province: string | null;
  avatar_url: string | null;
  auth_provider: 'local' | 'google';
  is_active: boolean;
  created_at: string;
  providers_count: number;
}

export interface AdminUsersPage {
  data: AdminUser[];
  total: number;
  page: number;
  totalPages: number;
}

export async function adminGetUsers(params?: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<AdminUsersPage> {
  const { data } = await api.get<{ success: boolean; data: AdminUser[]; total: number; page: number; totalPages: number }>(
    '/auth/admin/users',
    { params }
  );
  return { data: data.data, total: data.total, page: data.page, totalPages: data.totalPages };
}

export async function adminSetUserRole(id: number, role: 'admin' | 'user'): Promise<void> {
  await api.put(`/auth/admin/users/${id}/role`, { role });
}

// ─── CONTRASEÑA ───────────────────────────────────────────────────────────────

export async function changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; mensaje: string }> {
  const { data } = await api.put('/auth/cambiar-contrasena', { currentPassword, newPassword });
  return data;
}

export async function forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
  const { data } = await api.post('/auth/forgot-password', { email });
  return data;
}

export async function resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
  const { data } = await api.post('/auth/reset-password', { token, newPassword });
  return data;
}

export default api;
