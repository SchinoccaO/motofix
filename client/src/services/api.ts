import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
});

// Interceptor: attach token to every request
api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Auth types & helpers ---

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
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

// --- Provider types & functions ---

export interface Provider {
  id: number;
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
  location?: {
    id: number;
    address: string;
    city: string;
    province: string;
    country: string;
    latitude: number | null;
    longitude: number | null;
  };
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

export async function getProviders(params?: {
  type?: string;
  city?: string;
  search?: string;
  is_verified?: string;
}): Promise<Provider[]> {
  const { data } = await api.get<ProvidersResponse>('/providers', { params });
  return data.data;
}

export async function getProviderById(id: number): Promise<Provider> {
  const { data } = await api.get<ProviderResponse>(`/providers/${id}`);
  return data.data;
}

// --- Review functions ---

export interface ReviewData {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  user: { id: number; name: string; email: string };
}

export async function createReview(
  providerId: number,
  rating: number,
  comment: string
): Promise<ReviewData> {
  const { data } = await api.post(`/providers/${providerId}/reviews`, { rating, comment });
  return data.data;
}

export default api;
