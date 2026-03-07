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
  adminHardDeleteProvider,
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

// ─── Confirm Delete Modal ─────────────────────────────────────────────────────
function ConfirmDeleteModal({
  provider,
  onConfirm,
  onCancel,
  loading,
}: {
  provider: AdminProvider;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const reviewCount = provider.total_reviews ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-card-dark rounded-2xl border border-gray-200 dark:border-input-border-dark shadow-xl p-6">
        {/* Icon */}
        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-2xl text-red-600 dark:text-red-400">delete_forever</span>
        </div>

        {/* Title */}
        <h2 className="text-center text-lg font-black text-gray-900 dark:text-white mb-1">
          ¿Eliminar definitivamente?
        </h2>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-5">
          <span className="font-semibold text-gray-800 dark:text-gray-200">"{provider.name}"</span>
        </p>

        {/* Warning */}
        <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 px-4 py-3 mb-5 text-sm text-red-700 dark:text-red-300 space-y-1">
          <p className="font-semibold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">warning</span>
            Esta acción es irreversible
          </p>
          <ul className="list-disc list-inside text-xs space-y-0.5 opacity-90">
            <li>Se eliminará el taller y toda su información</li>
            {reviewCount > 0 && <li>{reviewCount} reseña{reviewCount !== 1 ? 's' : ''} y sus respuestas</li>}
            <li>Ubicación y tags vinculados</li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-input-border-dark text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-elevated-dark transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span className="material-symbols-outlined text-[16px]">delete_forever</span>
            )}
            {loading ? 'Eliminando…' : 'Eliminar definitivamente'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
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
  const [providers,     setProviders]     = useState<AdminProvider[]>([]);
  const [total,         setTotal]         = useState(0);
  const [loading,       setLoading]       = useState(true);
  const [fetchError,    setFetchError]    = useState<string | null>(null);
  const [search,        setSearch]        = useState('');
  const [typeFilter,    setTypeFilter]    = useState('all');
  const [activeFilter,  setActiveFilter]  = useState<'all' | 'true' | 'false'>('all');
  const [pendingOnly,   setPendingOnly]   = useState(false);
  const [page,          setPage]          = useState(1);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [feedback,      setFeedback]      = useState<{ id: number; msg: string; ok: boolean } | null>(null);
  const [deleteTarget,  setDeleteTarget]  = useState<AdminProvider | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const load = useCallback(async () => {
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
  }, [search, activeFilter, pendingOnly, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [search, typeFilter, activeFilter, pendingOnly]);

  const showFeedback = (id: number, msg: string, ok: boolean) => {
    setFeedback({ id, msg, ok });
    setTimeout(() => setFeedback(null), 2500);
  };

  const doVerify = async (p: AdminProvider) => {
    setActionLoading(p.id);
    try {
      await adminVerifyProvider(p.id, !p.is_verified);
      setProviders(prev => prev.map(x => x.id === p.id ? { ...x, is_verified: !p.is_verified } : x));
      showFeedback(p.id, p.is_verified ? 'Verificación removida' : 'Verificado', true);
    } catch {
      showFeedback(p.id, 'Error', false);
    } finally {
      setActionLoading(null);
    }
  };

  const doToggleActive = async (p: AdminProvider) => {
    setActionLoading(p.id);
    try {
      await adminSetProviderActive(p.id, !p.is_active);
      setProviders(prev => prev.map(x => x.id === p.id ? { ...x, is_active: !p.is_active } : x));
      showFeedback(p.id, p.is_active ? 'Desactivado' : 'Activado', true);
    } catch {
      showFeedback(p.id, 'Error', false);
    } finally {
      setActionLoading(null);
    }
  };

  const doHardDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await adminHardDeleteProvider(deleteTarget.id);
      setProviders(prev => prev.filter(x => x.id !== deleteTarget.id));
      setTotal(t => t - 1);
      setDeleteTarget(null);
    } catch (err: any) {
      showFeedback(deleteTarget.id, err?.response?.data?.error || 'Error al eliminar', false);
      setDeleteTarget(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  const selectCls = 'px-3 py-2 rounded-lg border border-gray-300 dark:border-input-border-dark bg-white dark:bg-elevated-dark text-sm text-gray-700 dark:text-gray-200 outline-none focus:border-primary transition-colors';

  return (
    <>
      {/* Confirm delete modal */}
      {deleteTarget && (
        <ConfirmDeleteModal
          provider={deleteTarget}
          onConfirm={doHardDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}

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
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-input-border-dark bg-white dark:bg-elevated-dark text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:border-primary transition-colors"
            />
          </div>

          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className={selectCls}>
            <option value="all">Todos los tipos</option>
            <option value="shop">Taller</option>
            <option value="mechanic">Mecánico</option>
            <option value="parts_store">Repuestos</option>
          </select>

          <select value={activeFilter} onChange={e => setActiveFilter(e.target.value as 'all' | 'true' | 'false')} className={selectCls}>
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
            <span className="text-sm text-gray-700 dark:text-gray-200">Solo pendientes</span>
          </label>
        </div>

        {/* Count */}
        <p className="text-xs text-gray-500 dark:text-gray-400">{total} resultado{total !== 1 ? 's' : ''}</p>

        {/* States */}
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
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {fb && (
                        <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${fb.ok ? 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20' : 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20'}`}>
                          {fb.msg}
                        </span>
                      )}

                      {/* Verificar */}
                      <button
                        onClick={() => doVerify(p)}
                        disabled={busy}
                        title={p.is_verified ? 'Quitar verificación' : 'Verificar'}
                        className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${
                          p.is_verified
                            ? 'text-green-700 dark:text-green-400 border-green-300 dark:border-green-700/60 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-600/40'
                            : 'text-gray-600 dark:text-gray-300 border-gray-300 dark:border-input-border-dark hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-400 hover:border-green-300 dark:hover:border-green-700/60'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: `'FILL' ${p.is_verified ? 1 : 0}` }}>verified</span>
                        {p.is_verified ? 'Verificado' : 'Verificar'}
                      </button>

                      {/* Activar/Desactivar */}
                      <button
                        onClick={() => doToggleActive(p)}
                        disabled={busy}
                        title={p.is_active ? 'Desactivar' : 'Activar'}
                        className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${
                          p.is_active
                            ? 'text-gray-600 dark:text-gray-300 border-gray-300 dark:border-input-border-dark hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-600/40'
                            : 'text-gray-500 dark:text-gray-400 border-gray-200 dark:border-input-border-dark hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-400 hover:border-green-300 dark:hover:border-green-700/60'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[15px]">{p.is_active ? 'toggle_on' : 'toggle_off'}</span>
                        {p.is_active ? 'Activo' : 'Inactivo'}
                      </button>

                      {/* Ver */}
                      <Link
                        to={`/taller/${p.id}`}
                        className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-300 dark:border-input-border-dark text-gray-600 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors"
                      >
                        <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                        Ver
                      </Link>

                      {/* Eliminar */}
                      <button
                        onClick={() => setDeleteTarget(p)}
                        disabled={busy}
                        title="Eliminar definitivamente"
                        className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-700/40 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-400 dark:hover:border-red-500/60 transition-colors disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-[15px]">delete</span>
                        Eliminar
                      </button>
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
              className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-input-border-dark text-sm text-gray-600 dark:text-gray-300 disabled:opacity-40 hover:border-primary hover:text-primary transition-colors"
            >
              ← Anterior
            </button>
            <span className="px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400">
              Pág. {page} / {Math.ceil(total / 20)}
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= Math.ceil(total / 20)}
              className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-input-border-dark text-sm text-gray-600 dark:text-gray-300 disabled:opacity-40 hover:border-primary hover:text-primary transition-colors"
            >
              Siguiente →
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Usuarios Tab ─────────────────────────────────────────────────────────────
function UsuariosTab({ currentUserId }: { currentUserId: number }) {
  const [users,         setUsers]         = useState<AdminUser[]>([]);
  const [total,         setTotal]         = useState(0);
  const [loading,       setLoading]       = useState(true);
  const [search,        setSearch]        = useState('');
  const [page,          setPage]          = useState(1);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [feedback,      setFeedback]      = useState<{ id: number; msg: string; ok: boolean } | null>(null);

  const load = useCallback(async () => {
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

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [search]);

  const doToggleRole = async (u: AdminUser) => {
    const newRole = u.role === 'admin' ? 'user' : 'admin';
    setActionLoading(u.id);
    try {
      await adminSetUserRole(u.id, newRole);
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, role: newRole } : x));
      setFeedback({ id: u.id, msg: newRole === 'admin' ? 'Ahora es admin' : 'Rol removido', ok: true });
      setTimeout(() => setFeedback(null), 2500);
    } catch {
      setFeedback({ id: u.id, msg: 'Error', ok: false });
      setTimeout(() => setFeedback(null), 2500);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
        <input
          type="text"
          placeholder="Buscar por nombre o email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-input-border-dark bg-white dark:bg-elevated-dark text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:border-primary transition-colors"
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
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                  style={{
                    background: u.role === 'admin' ? '#FFB800' : '#6B7280',
                    color: u.role === 'admin' ? '#181611' : '#fff',
                  }}
                >
                  {getInitials(u.name)}
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
                    {u.providers_count > 0 && <span>{u.providers_count} taller{u.providers_count !== 1 ? 'es' : ''}</span>}
                    <span>Desde {new Date(u.created_at).toLocaleDateString('es-AR', { month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {fb && (
                    <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${fb.ok ? 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20' : 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20'}`}>
                      {fb.msg}
                    </span>
                  )}
                  {!isSelf && (
                    <button
                      onClick={() => doToggleRole(u)}
                      disabled={busy}
                      className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${
                        u.role === 'admin'
                          ? 'border-orange-300 dark:border-orange-600/50 text-orange-600 dark:text-orange-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-600/40'
                          : 'border-gray-300 dark:border-input-border-dark text-gray-600 dark:text-gray-300 hover:bg-primary/10 dark:hover:bg-primary/10 hover:text-primary hover:border-primary/50'
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
                    className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-300 dark:border-input-border-dark text-gray-600 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors"
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

      {total > 30 && (
        <div className="flex justify-center gap-2 pt-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-input-border-dark text-sm text-gray-600 dark:text-gray-300 disabled:opacity-40 hover:border-primary hover:text-primary transition-colors"
          >
            ← Anterior
          </button>
          <span className="px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400">
            Pág. {page} / {Math.ceil(total / 30)}
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page >= Math.ceil(total / 30)}
            className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-input-border-dark text-sm text-gray-600 dark:text-gray-300 disabled:opacity-40 hover:border-primary hover:text-primary transition-colors"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Stats Row ────────────────────────────────────────────────────────────────
function StatsRow() {
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, users: 0 });

  useEffect(() => {
    Promise.all([
      adminGetProviders({ is_active: 'all',  limit: 1 }),
      adminGetProviders({ is_active: 'true', limit: 1 }),
      adminGetProviders({ is_active: 'all',  pending_validation: 'true', limit: 1 }),
      adminGetUsers({ limit: 1 }),
    ]).then(([all, active, pending, users]) => {
      setStats({ total: all.total, active: active.total, pending: pending.total, users: users.total });
    }).catch(() => {});
  }, []);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      <StatCard icon="storefront"      label="Total talleres"       value={stats.total}   color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" />
      <StatCard icon="check_circle"    label="Talleres activos"     value={stats.active}  color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" />
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

  useEffect(() => {
    if (!user || user.role !== 'admin') navigate('/', { replace: true });
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

        {tab === 'talleres' ? <TalleresTab /> : <UsuariosTab currentUserId={user.id} />}
      </div>

      <Footer />
    </div>
  );
}
