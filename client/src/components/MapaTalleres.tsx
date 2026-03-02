import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl from 'maplibre-gl';
import { useEffect, useRef, useState } from 'react';
import type { Provider } from '../services/api';
import { isOpenNow } from '../utils/horarios';

// ─── Tile styles ──────────────────────────────────────────────────────────────
// STYLE_LIGHT → OpenFreeMap "positron" (vector tiles, rápido, sin costo)
// STYLE_DARK  → Carto Dark Matter (raster tiles, 3 servidores balanceados)
// ⚠️ No cambiar el formato de STYLE_DARK sin leer la doc de MapLibre StyleSpecification.
//    El estilo raster necesita sources + layers explícitos (no es una URL directa).

const STYLE_LIGHT = 'https://tiles.openfreemap.org/styles/positron';

const STYLE_DARK: maplibregl.StyleSpecification = {
  version: 8,
  glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
  sources: {
    'carto-dark': {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
    },
  },
  layers: [{ id: 'bg', type: 'raster', source: 'carto-dark' }],
};

// ─── Constants ───────────────────────────────────────────────────────────────

const CORDOBA: [number, number] = [-64.181, -31.4135]; // [lng, lat]

const TYPE_COLORS: Record<string, string> = {
  shop:        '#FFB800',
  mechanic:    '#3B82F6',
  parts_store: '#9CA3AF',
};

// ─── PIN_IMAGES ───────────────────────────────────────────────────────────────
// Define el color de fondo y el emoji para cada tipo de pin en el mapa.
// 🔧 Para cambiar la apariencia de los pines, editá color y/o emoji aquí.
//    El color también se usa para el borde del círculo del cluster.
//    Las claves deben coincidir exactamente con los valores del campo `type` en el backend.
const PIN_IMAGES: Record<string, { color: string; emoji: string }> = {
  shop:        { color: '#FFB800', emoji: '🛠️' },
  mechanic:    { color: '#3B82F6', emoji: '🔧' },
  parts_store: { color: '#8B5CF6', emoji: '⚙️' },
};

// ─── createPinCanvas ──────────────────────────────────────────────────────────
// Dibuja un pin personalizado usando canvas 2D y devuelve ImageData para map.addImage().
// El pin tiene: círculo de color + borde blanco + cola triangular inferior + emoji centrado.
// Se renderiza a 2x (DPR=2) para pantallas retina.
// Se llama una vez por tipo en el handler 'style.load' (después de cada cambio de estilo).
/** Dibuja un pin de mapa en canvas y devuelve ImageData lista para map.addImage(). */
function createPinCanvas(color: string, emoji: string): ImageData {
  const S  = 40; // tamaño lógico del círculo (px)
  const TL = 10; // longitud de la cola del pin
  const DPR = 2; // renderizar a 2x para retina
  const W = S * DPR;
  const H = (S + TL) * DPR;

  const canvas = document.createElement('canvas');
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(DPR, DPR);

  // Sombra del pin
  ctx.shadowColor   = 'rgba(0,0,0,0.30)';
  ctx.shadowBlur    = 6;
  ctx.shadowOffsetY = 3;

  // Círculo principal
  ctx.beginPath();
  ctx.arc(S / 2, S / 2, S / 2 - 3, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.85)';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Cola del pin
  ctx.shadowColor = 'transparent';
  ctx.beginPath();
  ctx.moveTo(S / 2 - 5, S - 6);
  ctx.lineTo(S / 2,     S + TL);
  ctx.lineTo(S / 2 + 5, S - 6);
  ctx.fillStyle = color;
  ctx.fill();

  // Emoji centrado
  ctx.font = `${Math.round(S * 0.42)}px serif`;
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, S / 2, S / 2 - 1);

  return ctx.getImageData(0, 0, W, H);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

interface ProviderProperties {
  id: number;
  type: string;
  name: string;
  phone: string;
  average_rating: number;
  total_reviews: number;
  _data: string;
}

function buildGeoJSON(providers: Provider[]) {
  return {
    type: 'FeatureCollection' as const,
    features: providers
      .filter((p) => p.location?.latitude != null && p.location?.longitude != null)
      .map((p) => ({
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [p.location!.longitude!, p.location!.latitude!] as [number, number],
        },
        properties: {
          id: p.id,
          type: p.type,
          name: p.name,
          phone: p.phone ?? '',
          average_rating: Number(p.average_rating),
          total_reviews: p.total_reviews,
          _data: JSON.stringify(p),
        } satisfies ProviderProperties,
      })),
  };
}

// ─── makePopupHTML ────────────────────────────────────────────────────────────
// Genera el HTML del popup de MapLibre que aparece al hacer clic en un marcador.
// ⚠️ Esta función SOLO se usa cuando la prop onMarkerClick NO está definida.
//    Si onMarkerClick existe (ej: MapaPage), el popup no se muestra — se usa el panel lateral.
//    El popup lee el objeto Provider completo desde props._data (JSON serializado en el GeoJSON).
function makePopupHTML(props: ProviderProperties): string {
  const rating = Number(props.average_rating);
  const stars  = '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));

  // Badge abierto/cerrado — parsea el provider completo de _data
  let openBadge = '';
  try {
    const full = JSON.parse(props._data) as Provider;
    if (full.horarios) {
      const { open, opensAt } = isOpenNow(full.horarios);
      const dot   = open ? '#22c55e' : '#ef4444';
      const label = open ? 'Abierto ahora' : opensAt ? `Abre a las ${opensAt}` : 'Cerrado hoy';
      openBadge = `<div style="display:flex;align-items:center;gap:5px;margin-bottom:6px">
        <span style="width:7px;height:7px;border-radius:50%;background:${dot};display:inline-block;flex-shrink:0"></span>
        <span style="font-size:11px;font-weight:600;color:${dot}">${label}</span>
      </div>`;
    }
  } catch { /* ignorar si _data no parsea */ }

  return `
    <div style="min-width:170px;font-family:Inter,sans-serif;line-height:1.4">
      <p style="font-weight:700;font-size:13px;margin:0 0 4px 0;line-height:1.3">${props.name}</p>
      <div style="display:flex;align-items:center;gap:4px;margin:0 0 5px 0">
        <span style="color:#FFB800;font-weight:700;font-size:12px">${stars}</span>
        <span style="font-size:12px;font-weight:600">${rating.toFixed(1)}</span>
      </div>
      ${openBadge}
      ${props.phone ? `<a href="tel:${props.phone}" style="display:flex;align-items:center;gap:4px;font-size:11px;color:#3B82F6;text-decoration:none;margin-bottom:6px">
        <span class="material-symbols-outlined" style="font-size:13px">call</span>${props.phone}</a>` : ''}
      <a href="/taller/${props.id}" style="font-size:11px;font-weight:700;color:#FFB800;text-decoration:none">
        Ver perfil →
      </a>
    </div>
  `;
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface Props {
  providers: Provider[];
  /** Si se pasa, clic en marcador llama esto (sin popup MapLibre) */
  onMarkerClick?: (provider: Provider) => void;
  /** Ocupa el 100% del contenedor padre */
  fullScreen?: boolean;
  /** Cuando cambia, el mapa vuela a la ubicación del provider con ese id */
  selectedId?: number | null;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function MapaTalleres({
  providers,
  onMarkerClick,
  fullScreen = false,
  selectedId,
}: Props) {
  const containerRef     = useRef<HTMLDivElement>(null);
  const mapRef           = useRef<maplibregl.Map | null>(null);
  const providersRef     = useRef<Provider[]>(providers);
  const onClickRef       = useRef(onMarkerClick);
  const listenersSetUp   = useRef(false);
  const darkEffectFirst  = useRef(true);

  const [isDark, setIsDark] = useState(
    () => document.documentElement.classList.contains('dark'),
  );

  // Keep refs fresh on every render
  useEffect(() => { onClickRef.current = onMarkerClick; }, [onMarkerClick]);

  // ── Dark mode observer ───────────────────────────────────────────────────
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setIsDark(document.documentElement.classList.contains('dark')),
    );
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  // ── Init map (once) ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: document.documentElement.classList.contains('dark') ? STYLE_DARK : STYLE_LIGHT,
      center: CORDOBA,
      zoom: 12,
      attributionControl: false,
    });

    // Controls — zoom only + geolocate
    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      'bottom-right',
    );
    map.addControl(
      new maplibregl.GeolocateControl({ positionOptions: { enableHighAccuracy: true } }),
      'bottom-right',
    );
    map.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      'bottom-left',
    );

    // ── style.load — re-registrar sources, layers e imágenes en cada cambio de estilo ──
    // MapLibre elimina todos los recursos cuando se cambia el estilo (setStyle).
    // Por eso, tanto en el mount inicial como en cada switch light↔dark,
    // hay que volver a agregar el source 'providers', los layers y las imágenes de pines.
    map.on('style.load', () => {
      const geoJSON = buildGeoJSON(providersRef.current);

      map.addSource('providers', {
        type:          'geojson',
        data:          geoJSON,
        cluster:       true,
        clusterMaxZoom: 14,
        clusterRadius:  50,
      });

      // Cluster circles
      map.addLayer({
        id:     'clusters',
        type:   'circle',
        source: 'providers',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color':        '#FFB800',
          'circle-radius':       ['step', ['get', 'point_count'], 20, 10, 28, 50, 36] as maplibregl.ExpressionSpecification,
          'circle-stroke-width': 2.5,
          'circle-stroke-color': 'rgba(0,0,0,0.45)',
        },
      });

      // Cluster count labels
      map.addLayer({
        id:     'cluster-count',
        type:   'symbol',
        source: 'providers',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font':  ['Open Sans Bold', 'Arial Unicode MS Bold'],
          'text-size':  13,
        },
        paint: { 'text-color': '#181611' },
      });

      // Pines SVG por tipo — registrar imágenes canvas para cada tipo
      for (const [type, { color, emoji }] of Object.entries(PIN_IMAGES)) {
        map.addImage(`pin-${type}`, createPinCanvas(color, emoji), { pixelRatio: 2 });
      }

      // Individual points — pines con emoji por tipo
      map.addLayer({
        id:     'unclustered-point',
        type:   'symbol',
        source: 'providers',
        filter: ['!', ['has', 'point_count']],
        layout: {
          'icon-image': ['match', ['get', 'type'],
            'shop',        'pin-shop',
            'mechanic',    'pin-mechanic',
            'parts_store', 'pin-parts_store',
            'pin-shop',
          ] as maplibregl.ExpressionSpecification,
          'icon-size':               1,
          'icon-anchor':             'bottom',
          'icon-allow-overlap':      true,
          'icon-ignore-placement':   true,
        },
      });

      // ── Event listeners — se registran UNA sola vez con el flag listenersSetUp ──
      // style.load se dispara en el mount Y en cada setStyle() (cambio light↔dark).
      // Sin el flag, se acumularían N listeners por cada switch, causando N disparos por clic.
      // La ref listenersSetUp persiste entre renders y entre style switches.
      if (!listenersSetUp.current) {
        listenersSetUp.current = true;

        // Cluster click → zoom in
        map.on('click', 'clusters', async (e) => {
          const feature = e.features?.[0];
          if (!feature) return;
          const clusterId = feature.properties?.cluster_id as number;
          const source    = map.getSource('providers') as maplibregl.GeoJSONSource;
          const zoom      = await source.getClusterExpansionZoom(clusterId);
          const coords    = (feature.geometry as GeoJSON.Point).coordinates as [number, number];
          map.flyTo({ center: coords, zoom, speed: 1.5, curve: 1 });
        });

        // Point click → flyTo + callback or popup
        map.on('click', 'unclustered-point', (e) => {
          const feature = e.features?.[0];
          if (!feature) return;
          const coords = (feature.geometry as GeoJSON.Point).coordinates as [number, number];
          const props  = feature.properties as ProviderProperties;

          map.flyTo({
            center: coords,
            zoom:   Math.max(map.getZoom(), 14),
            speed:  1.4,
            curve:  1,
          });

          if (onClickRef.current) {
            onClickRef.current(JSON.parse(props._data) as Provider);
          } else {
            new maplibregl.Popup({ offset: 14, closeButton: true })
              .setLngLat(coords)
              .setHTML(makePopupHTML(props))
              .addTo(map);
          }
        });

        // Cursor pointer on hover
        map.on('mouseenter', 'clusters',          () => { map.getCanvas().style.cursor = 'pointer'; });
        map.on('mouseleave', 'clusters',          () => { map.getCanvas().style.cursor = ''; });
        map.on('mouseenter', 'unclustered-point', () => { map.getCanvas().style.cursor = 'pointer'; });
        map.on('mouseleave', 'unclustered-point', () => { map.getCanvas().style.cursor = ''; });
      }
    });

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current      = null;
      listenersSetUp.current = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Switch style on dark mode change ────────────────────────────────────
  useEffect(() => {
    // Skip first run (map already inits with correct style)
    if (darkEffectFirst.current) { darkEffectFirst.current = false; return; }
    mapRef.current?.setStyle(isDark ? STYLE_DARK : STYLE_LIGHT);
  }, [isDark]);

  // ── Update GeoJSON source when providers change ──────────────────────────
  useEffect(() => {
    providersRef.current = providers;
    const src = mapRef.current?.getSource('providers') as maplibregl.GeoJSONSource | undefined;
    src?.setData(buildGeoJSON(providers));
  }, [providers]);

  // ── Fly to selected provider ─────────────────────────────────────────────
  useEffect(() => {
    if (selectedId == null) return;
    const map = mapRef.current;
    if (!map) return;
    const p = providersRef.current.find((x) => x.id === selectedId);
    if (!p?.location?.latitude || !p.location.longitude) return;
    map.flyTo({
      center: [p.location.longitude, p.location.latitude],
      zoom:   Math.max(map.getZoom(), 14),
      speed:  1.4,
      curve:  1,
    });
  }, [selectedId]);

  // ── Render ───────────────────────────────────────────────────────────────

  const locatedCount = providers.filter(
    (p) => p.location?.latitude != null,
  ).length;

  return (
    <div
      className={
        fullScreen
          ? 'absolute inset-0'
          : 'relative rounded-xl overflow-hidden border border-gray-100 dark:border-input-border-dark shadow-sm'
      }
      style={fullScreen ? undefined : { height: 'calc(100vh - 360px)', minHeight: '420px' }}
    >
      <div ref={containerRef} style={{ height: '100%', width: '100%' }} />

      {/* Overlay: sin ubicaciones */}
      {locatedCount === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[400]">
          <div className="bg-white dark:bg-card-dark border border-gray-200 dark:border-input-border-dark rounded-xl shadow-md px-5 py-4 text-center max-w-[220px]">
            <span className="material-symbols-outlined text-3xl text-gray-400 mb-1 block">location_off</span>
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {providers.length === 0
                ? 'No hay resultados para esta búsqueda.'
                : 'Los negocios aún no tienen ubicación registrada.'}
            </p>
          </div>
        </div>
      )}

      {/* Leyenda de tipos (solo en modo embebido) */}
      {!fullScreen && (
        <div className="absolute bottom-6 left-3 z-[400] flex flex-col gap-1 bg-white dark:bg-card-dark border border-gray-200 dark:border-input-border-dark rounded-lg shadow-md px-3 py-2 pointer-events-none">
          {[
            { type: 'shop',        label: 'Taller' },
            { type: 'mechanic',    label: 'Mecánico' },
            { type: 'parts_store', label: 'Repuestos' },
          ].map(({ type, label }) => (
            <div key={type} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full border border-black/30 shrink-0"
                style={{ background: TYPE_COLORS[type] }}
              />
              <span className="text-[11px] font-medium text-gray-600 dark:text-gray-300">{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
