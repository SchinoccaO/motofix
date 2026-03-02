// ─── HORARIOS EDITOR ─────────────────────────────────────────────────────────
// Componente reutilizable para RegistroTaller y EditarTaller.
// Renderiza una fila por día con toggle on/off e inputs de hora de apertura y cierre.
// El padre controla el state; este componente solo llama onChange.


// ─── Tipos públicos ───────────────────────────────────────────────────────────

export type HorarioDia = { activo: boolean; abre: string; cierra: string };
export type HorariosForm = Record<string, HorarioDia>;

// ─── Constantes públicas ──────────────────────────────────────────────────────

export const DIAS_SEMANA = [
  'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo',
] as const;

export type DiaSemana = typeof DIAS_SEMANA[number];

export const DIAS_LABEL: Record<string, string> = {
  lunes:     'Lunes',
  martes:    'Martes',
  miercoles: 'Miércoles',
  jueves:    'Jueves',
  viernes:   'Viernes',
  sabado:    'Sábado',
  domingo:   'Domingo',
};

export const DIAS_SHORT: Record<string, string> = {
  lunes: 'Lun', martes: 'Mar', miercoles: 'Mié',
  jueves: 'Jue', viernes: 'Vie', sabado: 'Sáb', domingo: 'Dom',
};

/** Estado inicial: todos los días cerrados */
export const HORARIOS_INIT: HorariosForm = Object.fromEntries(
  DIAS_SEMANA.map(d => [d, { activo: false, abre: '09:00', cierra: '18:00' }])
);

// ─── Helpers de conversión (backend ↔ form) ───────────────────────────────────

type BackendHorarios = Record<string, { abre: string; cierra: string } | null> | null | undefined;

/** Convierte el JSON del backend (null = cerrado) al estado del formulario */
export function horariosFromBackend(h: BackendHorarios): HorariosForm {
  const form: HorariosForm = JSON.parse(JSON.stringify(HORARIOS_INIT));
  if (!h) return form;
  for (const dia of DIAS_SEMANA) {
    const slot = h[dia];
    if (slot) form[dia] = { activo: true, abre: slot.abre, cierra: slot.cierra };
  }
  return form;
}

/** Convierte el estado del formulario al JSON que espera el backend */
export function horariosToBackend(form: HorariosForm): BackendHorarios {
  const result: Record<string, { abre: string; cierra: string } | null> = {};
  for (const dia of DIAS_SEMANA) {
    result[dia] = form[dia].activo ? { abre: form[dia].abre, cierra: form[dia].cierra } : null;
  }
  return result;
}

// ─── Presets ──────────────────────────────────────────────────────────────────

const PRESETS: { label: string; icon: string; build: () => HorariosForm }[] = [
  {
    label: 'L–V 9–18, Sáb 9–13',
    icon: 'work',
    build: () => Object.fromEntries(DIAS_SEMANA.map(d => {
      if (['lunes','martes','miercoles','jueves','viernes'].includes(d))
        return [d, { activo: true, abre: '09:00', cierra: '18:00' }];
      if (d === 'sabado')
        return [d, { activo: true, abre: '09:00', cierra: '13:00' }];
      return [d, { activo: false, abre: '09:00', cierra: '13:00' }];
    })),
  },
  {
    label: 'L–Sáb 8–18',
    icon: 'calendar_month',
    build: () => Object.fromEntries(DIAS_SEMANA.map(d => [
      d,
      d !== 'domingo'
        ? { activo: true, abre: '08:00', cierra: '18:00' }
        : { activo: false, abre: '08:00', cierra: '18:00' },
    ])),
  },
  {
    label: 'Todos 8–20',
    icon: 'brightness_5',
    build: () => Object.fromEntries(DIAS_SEMANA.map(d => [d, { activo: true, abre: '08:00', cierra: '20:00' }])),
  },
];

// ─── Props ───────────────────────────────────────────────────────────────────

interface Props {
  value: HorariosForm;
  onChange: (h: HorariosForm) => void;
}

// ─── Estilos compartidos ──────────────────────────────────────────────────────

const timeInputCls =
  'w-full rounded-lg border border-[#dbdce0] dark:border-input-border-dark ' +
  'bg-white dark:bg-elevated-dark text-[#181611] dark:text-white ' +
  'px-2 py-2 text-sm text-center tabular-nums ' +
  'focus:border-primary focus:ring-1 focus:ring-primary outline-none ' +
  'transition-colors disabled:opacity-0 disabled:pointer-events-none';

// ─── Component ────────────────────────────────────────────────────────────────

export default function HorariosEditor({ value, onChange }: Props) {
  const toggle = (dia: string) =>
    onChange({ ...value, [dia]: { ...value[dia], activo: !value[dia].activo } });

  const setTime = (dia: string, field: 'abre' | 'cierra', v: string) =>
    onChange({ ...value, [dia]: { ...value[dia], [field]: v } });

  const applyPreset = (build: () => HorariosForm) => onChange(build());

  return (
    <div className="space-y-4">

      {/* Presets */}
      <div>
        <p className="text-xs font-medium text-[#887f63] dark:text-gray-400 mb-2 uppercase tracking-wide">
          Carga rápida
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(p => (
            <button
              key={p.label}
              type="button"
              onClick={() => applyPreset(p.build)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                bg-[#f4f3f0] dark:bg-elevated-dark text-[#181611] dark:text-gray-200
                hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary
                border border-transparent hover:border-primary/30 transition-all"
            >
              <span className="material-symbols-outlined text-[14px]">{p.icon}</span>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grilla de días */}
      <div className="space-y-1.5">
        {DIAS_SEMANA.map(dia => {
          const { activo, abre, cierra } = value[dia];
          return (
            <div
              key={dia}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all
                ${activo
                  ? 'border-primary/25 bg-primary/5 dark:bg-primary/10 dark:border-primary/20'
                  : 'border-transparent bg-[#f8f7f6] dark:bg-surface-dark hover:bg-[#f4f3f0] dark:hover:bg-elevated-dark'
                }`}
            >
              {/* Toggle switch */}
              <button
                type="button"
                role="switch"
                aria-checked={activo}
                aria-label={`${activo ? 'Desactivar' : 'Activar'} ${DIAS_LABEL[dia]}`}
                onClick={() => toggle(dia)}
                className="flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full"
              >
                <div className={`relative w-11 h-6 rounded-full transition-colors duration-200
                  ${activo ? 'bg-primary' : 'bg-gray-200 dark:bg-elevated-dark border border-gray-300 dark:border-input-border-dark'}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200
                    ${activo ? 'left-5' : 'left-0.5'}`}
                  />
                </div>
              </button>

              {/* Nombre del día */}
              <span className={`flex-shrink-0 text-sm font-semibold w-20
                ${activo ? 'text-[#181611] dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}
              >
                <span className="hidden sm:inline">{DIAS_LABEL[dia]}</span>
                <span className="sm:hidden">{DIAS_SHORT[dia]}</span>
              </span>

              {/* Inputs de hora / texto "Cerrado" */}
              {activo ? (
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <input
                    type="time"
                    value={abre}
                    onChange={e => setTime(dia, 'abre', e.target.value)}
                    className={timeInputCls}
                    aria-label={`Apertura ${DIAS_LABEL[dia]}`}
                  />
                  <span className="flex-shrink-0 text-gray-400 dark:text-gray-500 text-xs font-medium select-none">→</span>
                  <input
                    type="time"
                    value={cierra}
                    onChange={e => setTime(dia, 'cierra', e.target.value)}
                    className={timeInputCls}
                    aria-label={`Cierre ${DIAS_LABEL[dia]}`}
                  />
                </div>
              ) : (
                <span className="text-sm text-gray-400 dark:text-gray-500 italic select-none">Cerrado</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Resumen de días activos */}
      {DIAS_SEMANA.some(d => value[d].activo) && (
        <p className="text-xs text-[#887f63] dark:text-gray-400 flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px] text-primary">check_circle</span>
          {DIAS_SEMANA.filter(d => value[d].activo).map(d => DIAS_SHORT[d]).join(' · ')}
        </p>
      )}
    </div>
  );
}
