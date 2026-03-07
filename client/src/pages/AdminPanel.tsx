// ─── PANEL DE ADMINISTRACIÓN ──────────────────────────────────────────────────
// Ruta: /admin  — solo accesible con role='admin'
// Tabs: Talleres | Usuarios
import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  getStoredUser,
  adminGetProviders,
  adminVerifyProvider,
  adminSetProviderActive,
  adminGetUsers,
  adminSetUserRole,
  type AdminProvider,
  type AdminUser,
} from '../services/api';

// ─── Constants ────────────────────────────────────────────────────────────────
const TYPE_LABELS: Record<string, string> = {
  shop:        'Taller',
  mechanic:    'Mecánico',
  parts_store: 'Repuestos',
};

const TYPE_COLORS: Record<string, string> = {
  shop:        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  mechanic:    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  parts_store: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
};

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color }: { icon: string; label: string; value: number | string; color: string }) {
  return (
    <div className="bg-white dark:bg-card-dark rounded-xl border border-gray-200 dark:border-input-border-dark p-4 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
        <span className="material-symbols-outlined text-xl">{icon}</span>
      </div>
      <div>
        <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">{value}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ─── Talleres Tab ─────────────────────────────────────────────────────────────
function TalleresTab() {
  const [providers,    setProviders]    = useState<AdminProvider[]>([]);
  const [total,        setTotal]        = useState(0);
  const [loading,      setLoading]      = useState(true);
  const [fetchError,   setFetchError]   = useState<string | null>(null);
  const [search,       setSearch]       = useState('');
  const [typeFilter,   setTypeFilter]   = useState('all');
  const [activeFilter, setActiveFilter] = useState<'all' | 'true' | 'false'>('all');
  const [pendingOnly,  setPendingOnly]  = useState(false);
  const [page,         setPage]         = useState(1);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [feedback,     setFeedback]     = useState<{ id: number; msg: string; ok: boolean } | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await adminGetProviders({
        is_active: activeFilter,
        ...(pendingOnly && { pending_validation: 'true' }),
        ...(search.trim() && { search: search.trim() }),
        page,
        limit: 20,
      });
      setProviders(res.data);
      setTotal(res.total);
    } catch (err: any) {
      const status = err?.response?.status;
      const msg    = err?.response?.data?.error || err?.message || 'Error desconocido';
      setFetchError(`${status ? `[${status}] ` : ''}${msg}`);
    } finally {
      setLoading(false);
    }
  }, [search, typeFilter, activeFilter, pendingOnly, page]);

  useEffect(() => { fetch(); }, [fetch]);

  // Resetea a página 1 cuando cambian los filtros
  useEffect(() => { setPage(1); }, [search, typeFilter, activeFilter, pendingOnly]);

  const doVerify = async (p: AdminProvider) => {
    setActionLoading(p.id);
    try {
      await adminVerifyProvider(p.id, !p.is_verified);
      setFeedback({ id: p.id, msg: p.is_verified ? 'Verificación removida' : 'Verificado', ok: true });
      setProviders(prev => prev.map(x => x.id === p.id ? { ...x, is_verified: !p.is_verified } : x));
    } catch {
      setFeedback({ id: p.id, msg: 'Error', ok: false });
    } finally {
      setActionLoading(null);
      setTimeout(() => setFeedback(null), 2500);
    }
  };

  const doToggleActive = async (p: AdminProvider) => {
    setActionLoading(p.id);
    try {
      await adminSetProviderActive(p.id, !p.is_active);
      setFeedback({ id: p.id, msg: p.is_active ? 'Desactivado' : 'Activado', ok: true });
      setProviders(prev => prev.map(x => x.id === p.id ? { ...x, is_active: !p.is_active } : x));
    } catch {
      setFeedback({ id: p.id, msg: 'Error', ok: false });
    } finally {
      setActionLoading(null);
      setTimeout(() => setFeedback(null), 2500);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
          <input
            type="text"
            placeholder="Buscar por nombre…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-input-border-dark bg-white dark:bg-elevated-dark text-sm text-gray-900 dark:text-white outline-none focus:border-primary transition-colors"
          />
        </div>

        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-input-border-dark bg-white dark:bg-elevated-dark text-sm text-gray-700 dark:text-gray-300 outline-none focus:border-primary"
        >
          <option value="all">Todos los tipos</option>
          <option value="shop">Taller</option>
          <option value="mechanic">Mecánico</option>
          <option value="parts_store">Repuestos</option>
        </select>

        <select
          value={activeFilter}
          onChange={e => setActiveFilter(e.target.value as 'all' | 'true' | 'false')}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-input-border-dark bg-white dark:bg-elevated-dark text-sm text-gray-700 dark:text-gray-300 outline-none focus:border-primary"
        >
          <option value="all">Activos e inactivos</option>
          <option value="true">Solo activos</option>
          <option value="false">Solo inactivos</option>
        </select>

        <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-input-border-dark bg-white dark:bg-elevated-dark cursor-pointer select-none">
          <input
            type="checkbox"
            checked={pendingOnly}
            onChange={e => setPendingOnly(e.target.checked)}
            className="accent-primary w-3.5 h-3.5"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Solo pendientes</span>
        </label>
      </div>

      {/* Results count */}
      <p className="text-xs text-gray-500 dark:text-gray-400">{total} resultado{total !== 1 ? 's' : ''}</p>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : fetchError ? (
        <div className="rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-900/10 px-4 py-3 text-sm text-red-600 dark:text-red-400 flex items-start gap-2">
          <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">error</span>
          <div>
            <span className="font-bold">Error al cargar talleres:</span> {fetchError}
            {fetchError.includes('403') && (
              <p className="mt-1 text-xs opacity-80">Tu JWT puede tener el rol anterior. Cerrá sesión y volvé a entrar.</p>
            )}
            {(fetchError.includes('404') || fetchError.includes('Cannot GET')) && (
              <p className="mt-1 text-xs opacity-80">El backend nuevo no está desplegado aún. Hay que hacer push a main y esperar el redeploy en Render.</p>
            )}
          </div>
        </div>
      ) : providers.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400 text-sm">Sin resultados</div>
      ) : (
        <div className="space-y-3">
          {providers.map(p => {
            const busy = actionLoading === p.id;
            const fb   = feedback?.id === p.id ? feedback : null;
            return (
              <div
                key={p.id}
                className={`bg-white dark:bg-card-dark rounded-xl border transition-colors ${
                  !p.is_active
                    ? 'border-gray-200 dark:border-input-border-dark opacity-60'
                    : p.pending_validation
                    ? 'border-orange-300 dark:border-orange-500/40'
                    : 'border-gray-200 dark:border-input-border-dark'
                } p-4`}
              >
                <div className="flex flex-wrap items-start gap-3">
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TYPE_COLORS[p.type] || ''}`}>
                        {TYPE_LABELS[p.type] || p.type}
                      </span>
                      {p.is_verified && (
                        <span className="text-[10px] font-bold text-green-600 dark:text-green-400 flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                          Verificado
                        </span>
                      )}
                      {!p.is_active && (
                        <span className="text-[10px] font-bold bg-gray-100 dark:bg-elevated-dark text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">
                          Inactivo
                        </span>
                      )}
                      {p.pending_validation && (
                        <span className="text-[10px] font-bold bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-sm">hourglass_empty</span>
                          Pendiente revisión
                        </span>
                      )}
                    </div>

                    <Link
                      to={`/taller/${p.id}`}
                      className="font-bold text-gray-900 dark:text-white hover:text-primary transition-colors text-sm"
                    >
                      {p.name}
                    </Link>

                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {p.location?.city && (
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">location_on</span>
                          {p.location.city}, {p.location.province}
                        </span>
                      )}
                      {p.owner && (
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">person</span>
                          {p.owner.name} · {p.owner.email}
                        </span>
                      )}
                      {p.average_rating > 0 && (
                        <span className="flex items-center gap-1 text-primary font-semibold">
                          <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          {Number(p.average_rating).toFixed(1)} ({p.total_reviews})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {fb && (
                      <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${fb.ok ? 'text-green-600 bg-green-50 dark:bg-green-900/20' : 'text-red-600 bg-red-50 dark:bg-red-900/20'}`}>
                        {fb.msg}
                      </span>
                    )}

                    <button
                      onClick={() => doVerify(p)}
                      disabled={busy}
                      title={p.is_verified ? 'Quitar verificación' : 'Verificar taller'}
                      className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${
                        p.is_verified
                          ? 'text-green-700 dark:text-green-400 border-green-300 dark:border-green-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 hover:border-red-300'
                          : 'text-gray-600 dark:text-gray-400 border-gray-300 dark:border-input-border-dark hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 hover:border-green-300'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: `'FILL' ${p.is_verified ? 1 : 0}` }}>verified</span>
                      {p.is_verified ? 'Verificado' : 'Verificar'}
                    </button>

                    <button
                      onClick={() => doToggleActive(p)}
                      disabled={busy}
                      title={p.is_active ? 'Desactivar taller' : 'Activar taller'}
                      className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${
                        p.is_active
                          ? 'text-gray-600 dark:text-gray-400 border-gray-300 dark:border-input-border-dark hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 hover:border-red-300'
                          : 'text-gray-500 dark:text-gray-500 border-gray-200 dark:border-input-border-dark hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 hover:border-green-300'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">{p.is_active ? 'toggle_on' : 'toggle_off'}</span>
                      {p.is_active ? 'Activo' : 'Inactivo'}
                    </button>

                    <Link
                      to={`/taller/${p.id}`}
                      className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-300 dark:border-input-border-dark text-gray-600 dark:text-gray-400 hover:border-primary hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                      Ver
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {total > 20 && (
        <div className="flex justify-center gap-2 pt-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-input-border-dark text-sm text-gray-600 dark:text-gray-400 disabled:opacity-40 hover:border-primary hover:text-primary transition-colors"
          >
            ← Anterior
          </button>
          <span className="px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400">
            Pág. {page} / {Math.ceil(total / 20)}
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page >= Math.ceil(total / 20)}
            className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-input-border-dark text-sm text-gray-600 dark:text-gray-400 disabled:opacity-40 hover:border-primary hover:text-primary transition-colors"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Usuarios Tab ─────────────────────────────────────────────────────────────
function UsuariosTab({ currentUserId }: { currentUserId: number }) {
  const [users,    setUsers]    = useState<AdminUser[]>([]);
  const [total,    setTotal]    = useState(0);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [page,     setPage]     = useState(1);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ id: number; msg: string; ok: boolean } | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminGetUsers({ search: search.trim() || undefined, page, limit: 30 });
      setUsers(res.data);
      setTotal(res.total);
    } catch {
      // silencioso
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => { fetch(); }, [fetch]);
  useEffect(() => { setPage(1); }, [search]);

  const doToggleRole = async (u: AdminUser) => {
    const newRole = u.role === 'admin' ? 'user' : 'admin';
    setActionLoading(u.id);
    try {
      await adminSetUserRole(u.id, newRole);
      setFeedback({ id: u.id, msg: newRole === 'admin' ? 'Ahora es admin' : 'Rol removido', ok: true });
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, role: newRole } : x));
    } catch {
      setFeedback({ id: u.id, msg: 'Error', ok: false });
    } finally {
      setActionLoading(null);
      setTimeout(() => setFeedback(null), 2500);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-sm">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
        <input
          type="text"
          placeholder="Buscar por nombre o email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-input-border-dark bg-white dark:bg-elevated-dark text-sm text-gray-900 dark:text-white outline-none focus:border-primary transition-colors"
        />
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">{total} usuario{total !== 1 ? 's' : ''}</p>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400 text-sm">Sin resultados</div>
      ) : (
        <div className="space-y-2">
          {users.map(u => {
            const isSelf = u.id === currentUserId;
            const busy   = actionLoading === u.id;
            const fb     = feedback?.id === u.id ? feedback : null;
            return (
              <div
                key={u.id}
                className="bg-white dark:bg-card-dark rounded-xl border border-gray-200 dark:border-input-border-dark p-4 flex flex-wrap items-center gap-3"
              >
                {/* Avatar */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold"
                  style={{ background: u.role === 'admin' ? '#FFB800' : '#6B7280' }}
                >
                  <span className={u.role === 'admin' ? 'text-[#181611]' : ''}>{getInitials(u.name)}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">{u.name}</span>
                    {isSelf && (
                      <span className="text-[10px] font-bold bg-primary/15 text-yellow-700 dark:text-yellow-400 px-2 py-0.5 rounded-full">Vos</span>
                    )}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      u.role === 'admin'
                        ? 'bg-primary/15 text-yellow-700 dark:text-yellow-400'
                        : 'bg-gray-100 dark:bg-elevated-dark text-gray-500 dark:text-gray-400'
                    }`}>
                      {u.role === 'admin' ? 'Admin' : 'Usuario'}
                    </span>
                    {u.auth_provider === 'google' && (
                      <span className="text-[10px] text-gray-400 dark:text-gray-500">Google</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{u.email}</p>
                  <div className="flex gap-3 mt-0.5 text-[11px] text-gray-400 dark:text-gray-500 flex-wrap">
                    {u.city && <span>{u.city}</span>}
                    {u.providers_count > 0 && (
                      <span>{u.providers_count} taller{u.providers_count !== 1 ? 'es' : ''}</span>
                    )}
                    <span>Desde {new Date(u.created_at).toLocaleDateString('es-AR', { month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {fb && (
                    <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${fb.ok ? 'text-green-600 bg-green-50 dark:bg-green-900/20' : 'text-red-600 bg-red-50 dark:bg-red-900/20'}`}>
                      {fb.msg}
                    </span>
                  )}
                  {!isSelf && (
                    <button
                      onClick={() => doToggleRole(u)}
                      disabled={busy}
                      className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${
                        u.role === 'admin'
                          ? 'border-orange-300 dark:border-orange-600 text-orange-600 dark:text-orange-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 hover:border-red-300'
                          : 'border-gray-300 dark:border-input-border-dark text-gray-600 dark:text-gray-400 hover:bg-primary/10 hover:text-primary hover:border-primary/50 dark:hover:bg-primary/10'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {u.role === 'admin' ? 'person_remove' : 'admin_panel_settings'}
                      </span>
                      {u.role === 'admin' ? 'Quitar admin' : 'Hacer admin'}
                    </button>
                  )}

                  <Link
                    to={`/usuario/${u.id}`}
                    className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-300 dark:border-input-border-dark text-gray-600 dark:text-gray-400 hover:border-primary hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                    Ver
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {total > 30 && (
        <div className="flex justify-center gap-2 pt-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-input-border-dark text-sm text-gray-600 dark:text-gray-400 disabled:opacity-40 hover:border-primary hover:text-primary transition-colors"
          >
            ← Anterior
          </button>
          <span className="px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400">
            Pág. {page} / {Math.ceil(total / 30)}
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page >= Math.ceil(total / 30)}
            className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-input-border-dark text-sm text-gray-600 dark:text-gray-400 disabled:opacity-40 hover:border-primary hover:text-primary transition-colors"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Stats header ─────────────────────────────────────────────────────────────
function StatsRow() {
  const [stats, setStats] = useState({ total: 0, verified: 0, pending: 0, users: 0 });

  useEffect(() => {
    Promise.all([
      adminGetProviders({ is_active: 'all', limit: 1 }),
      adminGetProviders({ is_active: 'all', pending_validation: 'true', limit: 1 }),
      adminGetProviders({ is_active: 'true', limit: 1 }),
      adminGetUsers({ limit: 1 }),
    ]).then(([all, pending, active, users]) => {
      // Approximation: verified = active - not verified. Use separate call if needed.
      setStats({
        total: all.total,
        pending: pending.total,
        verified: active.total, // placeholder — we show "activos" here
        users: users.total,
      });
    }).catch(() => {});
  }, []);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      <StatCard icon="storefront"      label="Total talleres"       value={stats.total}   color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" />
      <StatCard icon="check_circle"    label="Talleres activos"     value={stats.verified} color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" />
      <StatCard icon="hourglass_empty" label="Pend. revisión"       value={stats.pending} color="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" />
      <StatCard icon="group"           label="Usuarios registrados" value={stats.users}   color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminPanel() {
  const navigate    = useNavigate();
  const [tab, setTab] = useState<'talleres' | 'usuarios'>('talleres');
  const user = getStoredUser();

  // Redirigir si no es admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') return null;

  const tabCls = (active: boolean) =>
    `px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
      active
        ? 'bg-primary text-[#181611]'
        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
    }`;

  return (
    <div className="bg-[#f8f7f6] dark:bg-background-dark min-h-screen text-[#181611] dark:text-gray-200">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-xl">admin_panel_settings</span>
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-white leading-tight">Panel de Administración</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Bienvenida, {user.name}</p>
          </div>
        </div>

        {/* Stats */}
        <StatsRow />

        {/* Tabs */}
        <div className="flex gap-1 mb-5 border-b border-gray-200 dark:border-input-border-dark pb-1">
          <button onClick={() => setTab('talleres')} className={tabCls(tab === 'talleres')}>
            <span className="material-symbols-outlined text-[15px] align-middle mr-1">storefront</span>
            Talleres
          </button>
          <button onClick={() => setTab('usuarios')} className={tabCls(tab === 'usuarios')}>
            <span className="material-symbols-outlined text-[15px] align-middle mr-1">group</span>
            Usuarios
          </button>
        </div>

        {/* Tab content */}
        {tab === 'talleres' ? <TalleresTab /> : <UsuariosTab currentUserId={user.id} />}
      </div>

      <Footer />
    </div>
  );
}
