import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import L from 'leaflet';
import 'leaflet.markercluster';
import { useEffect, useRef } from 'react';
import type { Provider } from '../services/api';
import { isOpenNow } from '../utils/horarios';

// ─── Tile URLs (Carto — gratis, sin API key) ──────────────────────────────────
const TILE_LIGHT = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
const TILE_DARK  = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const TILE_ATTR  = '© <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>';

const CORDOBA: [number, number] = [-31.4135, -64.181]; // [lat, lng]

const TYPE_COLORS: Record<string, string> = {
  shop:        '#FFB800',
  mechanic:    '#3B82F6',
  parts_store: '#9CA3AF',
};

const TYPE_EMOJI: Record<string, string> = {
  shop:        '🛠️',
  mechanic:    '🔧',
  parts_store: '🏪',
};

// ─── Custom DivIcon ───────────────────────────────────────────────────────────
function makeIcon(type: string): L.DivIcon {
  const color = TYPE_COLORS[type] ?? '#FFB800';
  const emoji = TYPE_EMOJI[type]  ?? '📍';
  return L.divIcon({
    className: '',
    html: `
      <div style="
        background:${color};width:36px;height:36px;border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);border:2px solid white;
        box-shadow:0 2px 8px rgba(0,0,0,0.35);
        display:flex;align-items:center;justify-content:center;
      ">
        <span style="transform:rotate(45deg);font-size:15px;line-height:1">${emoji}</span>
      </div>`,
    iconSize:    [36, 36],
    iconAnchor:  [18, 36],
    popupAnchor: [0, -38],
  });
}

// ─── HTML escape (XSS prevention) ────────────────────────────────────────────
function esc(v: string | number | null | undefined): string {
  if (v == null) return '';
  return String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

// ─── Popup HTML ───────────────────────────────────────────────────────────────
function makePopupHTML(p: Provider): string {
  const rating = Number(p.average_rating);
  const stars  = '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));

  let openBadge = '';
  if (p.horarios) {
    const { open, opensAt } = isOpenNow(p.horarios, p.is_open_override);
    const dot   = open ? '#22c55e' : '#ef4444';
    const label = open ? 'Abierto ahora' : opensAt ? `Abre a las ${opensAt}` : 'Cerrado hoy';
    openBadge = `<div style="display:flex;align-items:center;gap:5px;margin-bottom:6px">
      <span style="width:7px;height:7px;border-radius:50%;background:${dot};display:inline-block;flex-shrink:0"></span>
      <span style="font-size:11px;font-weight:600;color:${dot}">${label}</span>
    </div>`;
  }

  const safeId    = esc(p.id);
  const safeName  = esc(p.name);
  const safePhone = esc(p.phone);

  return `<div style="min-width:170px;font-family:Inter,sans-serif;line-height:1.4">
    <p style="font-weight:700;font-size:13px;margin:0 0 4px;line-height:1.3">${safeName}</p>
    <div style="display:flex;align-items:center;gap:4px;margin:0 0 5px">
      <span style="color:#FFB800;font-weight:700;font-size:12px">${stars}</span>
      <span style="font-size:12px;font-weight:600">${rating.toFixed(1)}</span>
    </div>
    ${openBadge}
    ${safePhone ? `<a href="tel:${safePhone}" style="display:flex;align-items:center;gap:4px;font-size:11px;color:#3B82F6;text-decoration:none;margin-bottom:6px">📞 ${safePhone}</a>` : ''}
    <a href="/taller/${safeId}" style="font-size:11px;font-weight:700;color:#FFB800;text-decoration:none">Ver perfil →</a>
  </div>`;
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props {
  providers: Provider[];
  onMarkerClick?: (provider: Provider) => void;
  fullScreen?: boolean;
  selectedId?: number | null;
  geocodeCenter?: { lat: number; lng: number };
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function MapaTalleres({ providers, onMarkerClick, fullScreen = false, selectedId, geocodeCenter }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<L.Map | null>(null);
  const tileRef      = useRef<L.TileLayer | null>(null);
  const clusterRef   = useRef<any>(null);
  const onClickRef   = useRef(onMarkerClick);

  useEffect(() => { onClickRef.current = onMarkerClick; }, [onMarkerClick]);

  // ── Init map (once) ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const isDark = document.documentElement.classList.contains('dark');

    const map = L.map(containerRef.current, {
      center: CORDOBA,
      zoom: 12,
      zoomControl: true,
    });

    const tile = L.tileLayer(isDark ? TILE_DARK : TILE_LIGHT, {
      attribution: TILE_ATTR,
      maxZoom: 19,
      subdomains: ['a', 'b', 'c', 'd'],
    }).addTo(map);

    const cluster = (L as any).markerClusterGroup({
      maxClusterRadius: 60,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
    });
    map.addLayer(cluster);

    mapRef.current     = map;
    tileRef.current    = tile;
    clusterRef.current = cluster;

    // Llama invalidateSize() cuando el contenedor cambia de tamaño (ej: sidebar que se abre/cierra)
    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(containerRef.current!);

    // Dark mode: swap tile URL on class change
    const observer = new MutationObserver(() => {
      const dark = document.documentElement.classList.contains('dark');
      tileRef.current?.setUrl(dark ? TILE_DARK : TILE_LIGHT);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      ro.disconnect();
      observer.disconnect();
      map.remove();
      mapRef.current = null;
      tileRef.current = null;
      clusterRef.current = null;
    };
  }, []);

  // ── Update markers when providers change ────────────────────────────────────
  useEffect(() => {
    const cluster = clusterRef.current;
    const map     = mapRef.current;
    if (!cluster || !map) return;

    cluster.clearLayers();

    const validProviders = providers.filter(p => p.location?.latitude && p.location?.longitude);

    validProviders.forEach((provider) => {
      const latlng: L.LatLngExpression = [provider.location!.latitude!, provider.location!.longitude!];
      const marker = L.marker(latlng, { icon: makeIcon(provider.type) });

      marker.on('click', () => {
        map.flyTo(latlng, Math.max(map.getZoom(), 14), { duration: 0.8 });
        if (onClickRef.current) {
          onClickRef.current(provider);
        } else {
          L.popup({ maxWidth: 220, offset: [0, -10] })
            .setLatLng(latlng)
            .setContent(makePopupHTML(provider))
            .openOn(map);
        }
      });

      cluster.addLayer(marker);
    });

    // Fit bounds only if no selectedId and we have valid providers
    if (validProviders.length > 0 && !selectedId) {
      const bounds = L.latLngBounds(
        validProviders.map(p => [p.location!.latitude!, p.location!.longitude!] as [number, number])
      );
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  }, [providers]);

  // ── Fly to selected ──────────────────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedId) return;
    const p = providers.find(x => x.id === selectedId);
    if (p?.location?.latitude && p?.location?.longitude) {
      map.flyTo([p.location.latitude, p.location.longitude], 15, { duration: 0.8 });
    }
  }, [selectedId, providers]);

  // ── Fly to geocode result ─────────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !geocodeCenter) return;
    map.flyTo([geocodeCenter.lat, geocodeCenter.lng], 14, { duration: 0.9 });
  }, [geocodeCenter?.lat, geocodeCenter?.lng]);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: fullScreen ? '100%' : '100%', minHeight: '300px' }}
      className="rounded-xl overflow-hidden"
    />
  );
}
