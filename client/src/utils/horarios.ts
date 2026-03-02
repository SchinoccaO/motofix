/**
 * ─── UTILIDADES DE HORARIOS ────────────────────────────────────────────────────
 *
 * Funciones exportadas:
 *
 *   isOpenNow(horarios)
 *     Recibe el objeto horarios de un Provider y devuelve { open: boolean, opensAt?: string }.
 *     Usa la hora real de Argentina (timezone America/Argentina/Buenos_Aires).
 *     Uso en JSX:
 *       const { open, opensAt } = isOpenNow(provider.horarios);
 *       <span>{open ? 'Abierto' : opensAt ? `Abre a las ${opensAt}` : 'Cerrado hoy'}</span>
 *
 *   getHorariosSemana(horarios)
 *     Devuelve un array ordenado lunes→domingo con { dia, label, horario }.
 *     Uso en JSX:
 *       {getHorariosSemana(provider.horarios).map(({ dia, label, horario }) => (
 *         <div key={dia}>{label}: {horario?.abre ?? 'Cerrado'} – {horario?.cierra}</div>
 *       ))}
 *
 *   getDiaArgentina()
 *     Devuelve el día actual en Argentina sin tildes, en minúsculas.
 *     Ej: 'lunes', 'miercoles'. Útil para resaltar el día de hoy en la tabla.
 *
 * Formato esperado del objeto Horarios:
 *   {
 *     lunes:     { abre: '09:00', cierra: '18:00' },
 *     sabado:    { abre: '09:00', cierra: '13:00' },
 *     domingo:   null,   // null o ausente = cerrado ese día
 *   }
 *
 * ⚠️ Los horarios se almacenan en la BD como JSONB. Si se cambia el formato,
 *    actualizar también el modelo ProviderModel.js en el servidor.
 */

// ─── Tipos ────────────────────────────────────────────────────────────────────

type DiaSemana = 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo';

export type HorarioDia = { abre: string; cierra: string } | null;

export type Horarios = Partial<Record<DiaSemana, HorarioDia>>;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const DIAS_ORDENADOS: DiaSemana[] = [
  'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo',
];

export const DIA_LABELS: Record<DiaSemana, string> = {
  lunes:     'Lunes',
  martes:    'Martes',
  miercoles: 'Miércoles',
  jueves:    'Jueves',
  viernes:   'Viernes',
  sabado:    'Sábado',
  domingo:   'Domingo',
};

/** Devuelve el nombre del día actual en hora Argentina (sin tildes). */
export function getDiaArgentina(): DiaSemana {
  const parts = new Intl.DateTimeFormat('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    weekday: 'long',
  }).formatToParts(new Date());

  const raw = parts.find((p) => p.type === 'weekday')?.value ?? '';
  return raw
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') as DiaSemana;
}

/** "HH:MM" → minutos desde medianoche. */
function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

/** Hora actual en Argentina como "HH:MM". */
function getHoraArgentina(): string {
  const parts = new Intl.DateTimeFormat('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    hour:   '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date());

  const h = parts.find((p) => p.type === 'hour')?.value   ?? '00';
  const m = parts.find((p) => p.type === 'minute')?.value ?? '00';
  return `${h}:${m}`;
}

// ─── API pública ─────────────────────────────────────────────────────────────

export interface OpenStatus {
  /** ¿Está abierto ahora mismo? */
  open: boolean;
  /** Si cerrado y tiene horario hoy, hora de apertura ("09:00"). */
  opensAt?: string;
}

/**
 * Compara la hora del sistema (en zona Argentina) con los horarios del negocio.
 * Retorna { open, opensAt? }.
 */
export function isOpenNow(horarios: Horarios | null | undefined): OpenStatus {
  if (!horarios) return { open: false };

  const dia  = getDiaArgentina();
  const hora = getHoraArgentina();
  const sched = horarios[dia];

  if (!sched?.abre || !sched?.cierra) return { open: false };

  const now    = toMinutes(hora);
  const opens  = toMinutes(sched.abre);
  const closes = toMinutes(sched.cierra);

  if (now >= opens && now < closes) return { open: true };
  return { open: false, opensAt: sched.abre };
}

/** Lista los días en orden con sus horarios (para mostrar en detalle). */
export function getHorariosSemana(
  horarios: Horarios | null | undefined,
): Array<{ dia: DiaSemana; label: string; horario: HorarioDia | undefined }> {
  return DIAS_ORDENADOS.map((dia) => ({
    dia,
    label: DIA_LABELS[dia],
    horario: horarios?.[dia] ?? null,
  }));
}
