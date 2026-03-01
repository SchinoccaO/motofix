import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl from 'maplibre-gl';
import { useCallback, useEffect, useRef, useState } from 'react';

// ── Constants ─────────────────────────────────────────────────────────────────

// MapLibre usa [lng, lat] — invertido respecto a Leaflet/Google Maps
const CORDOBA: [number, number] = [-64.181, -31.4135];
const INIT_ZOOM = 13;
// Nominatim exige identificación del cliente en el parámetro email
const NOMINATIM_EMAIL = 'hola@motofix.com.ar';

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
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
    },
  },
  layers: [{ id: 'bg', type: 'raster', source: 'carto-dark' }],
};

// ── Nominatim types ───────────────────────────────────────────────────────────

interface NominatimAddress {
  road?: string;
  house_number?: string;
  suburb?: string;
  neighbourhood?: string;
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  state?: string;
  county?: string;
  country?: string;
}

interface NominatimSearchResult {
  lat: string;
  lon: string;
  display_name: string;
  address?: NominatimAddress;
}

interface NominatimReverseResult {
  display_name?: string;
  error?: string;
  address?: NominatimAddress;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function extractCity(addr: NominatimAddress): string {
  return addr.city ?? addr.town ?? addr.village ?? addr.municipality ?? '';
}

function extractProvince(addr: NominatimAddress): string {
  return addr.state ?? addr.county ?? '';
}

// Construye una dirección legible y compacta para guardar en la DB
function buildShortAddress(addr: NominatimAddress, fallback: string): string {
  const street = addr.road
    ? addr.house_number
      ? `${addr.road} ${addr.house_number}`
      : addr.road
    : null;
  const neighbourhood = addr.suburb ?? addr.neighbourhood ?? null;
  const city = extractCity(addr);
  const parts = [street, neighbourhood, city].filter(Boolean);
  return parts.length >= 2 ? parts.join(', ') : fallback.slice(0, 499);
}

// ── Pin SVG ───────────────────────────────────────────────────────────────────

function createPinElement(): HTMLElement {
  const el = document.createElement('div');
  el.style.cssText =
    'cursor:grab;width:32px;height:42px;filter:drop-shadow(0 2px 6px rgba(0,0,0,.5));';
  el.innerHTML = `<svg width="32" height="42" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 0C7.163 0 0 7.163 0 16C0 28 16 42 16 42C16 42 32 28 32 16C32 7.163 24.837 0 16 0Z" fill="#FFB800"/>
    <circle cx="16" cy="16" r="6" fill="#181611"/>
  </svg>`;
  return el;
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface LocationData {
  lat: number;
  lng: number;
  /** Texto mostrado en el input (display_name de Nominatim) */
  displayAddress: string;
  /** Dirección compacta guardada en DB (máx 500 chars) */
  address: string;
  city: string;
  province: string;
}

interface Props {
  onLocationChange: (location: LocationData) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function SelectorUbicacion({ onLocationChange }: Props) {
  const containerRef    = useRef<HTMLDivElement>(null);
  const mapRef          = useRef<maplibregl.Map | null>(null);
  const markerRef       = useRef<maplibregl.Marker | null>(null);
  const debounceRef     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const darkEffectFirst = useRef(true);
  // Ref para que el handler de dragend siempre use la última versión del callback
  const onChangeRef     = useRef(onLocationChange);

  const [inputText,   setInputText]   = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [pinPlaced,   setPinPlaced]   = useState(false);
  const [isDark,      setIsDark]      = useState(
    () => document.documentElement.classList.contains('dark'),
  );

  useEffect(() => { onChangeRef.current = onLocationChange; }, [onLocationChange]);

  // ── Dark mode observer ────────────────────────────────────────────────────
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setIsDark(document.documentElement.classList.contains('dark')),
    );
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  // ── Cambiar estilo cuando cambia el modo oscuro ───────────────────────────
  useEffect(() => {
    if (darkEffectFirst.current) { darkEffectFirst.current = false; return; }
    mapRef.current?.setStyle(isDark ? STYLE_DARK : STYLE_LIGHT);
  }, [isDark]);

  // ── Colocar o mover el pin ────────────────────────────────────────────────
  const placeMarker = useCallback((lngLat: [number, number]) => {
    const map = mapRef.current;
    if (!map) return;

    if (markerRef.current) {
      markerRef.current.setLngLat(lngLat);
      setPinPlaced(true);
      return;
    }

    const el     = createPinElement();
    const marker = new maplibregl.Marker({ element: el, draggable: true, anchor: 'bottom' })
      .setLngLat(lngLat)
      .addTo(map);

    // Al soltar el pin → reverse geocoding → actualiza el input
    marker.on('dragend', async () => {
      const pos = marker.getLngLat();
      try {
        const res  = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${pos.lat}&lon=${pos.lng}&format=json&addressdetails=1&accept-language=es&email=${NOMINATIM_EMAIL}`,
        );
        const data = (await res.json()) as NominatimReverseResult;
        const addr = data.address ?? {};
        const displayAddress = data.display_name ?? `${pos.lat.toFixed(6)}, ${pos.lng.toFixed(6)}`;
        const location: LocationData = {
          lat:            pos.lat,
          lng:            pos.lng,
          displayAddress,
          address:        buildShortAddress(addr, displayAddress),
          city:           extractCity(addr),
          province:       extractProvince(addr),
        };
        setInputText(displayAddress);
        onChangeRef.current(location);
      } catch {
        const displayAddress = `${pos.lat.toFixed(6)}, ${pos.lng.toFixed(6)}`;
        onChangeRef.current({ lat: pos.lat, lng: pos.lng, displayAddress, address: displayAddress, city: '', province: '' });
      }
    });

    markerRef.current = marker;
    setPinPlaced(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Inicializar mapa (una sola vez) ───────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style:     document.documentElement.classList.contains('dark') ? STYLE_DARK : STYLE_LIGHT,
      center:    CORDOBA,
      zoom:      INIT_ZOOM,
      attributionControl: false,
    });

    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      'bottom-right',
    );
    map.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      'bottom-left',
    );

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current    = null;
      markerRef.current = null;
    };
  }, []);

  // ── Input de dirección con debounce 500ms → geocoding ────────────────────
  const handleAddressChange = (value: string) => {
    setInputText(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value.trim()) return;

    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res  = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&limit=1&addressdetails=1&countrycodes=ar&accept-language=es&email=${NOMINATIM_EMAIL}`,
        );
        const data = (await res.json()) as NominatimSearchResult[];

        if (data.length > 0) {
          const { lat, lon, display_name, address = {} } = data[0];
          const lngLat: [number, number] = [parseFloat(lon), parseFloat(lat)];
          const location: LocationData = {
            lat:            parseFloat(lat),
            lng:            parseFloat(lon),
            displayAddress: display_name,
            address:        buildShortAddress(address, display_name),
            city:           extractCity(address),
            province:       extractProvince(address),
          };
          mapRef.current?.flyTo({ center: lngLat, zoom: 16, speed: 1.6, curve: 1 });
          placeMarker(lngLat);
          onChangeRef.current(location);
        }
      } finally {
        setIsSearching(false);
      }
    }, 500);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-[#181611] dark:text-gray-300">
        Ubicación del Negocio
      </label>

      {/* Input de dirección */}
      <div className="relative">
        <input
          type="text"
          value={inputText}
          onChange={(e) => handleAddressChange(e.target.value)}
          placeholder="Ej. Av. Colón 1234, Córdoba Capital"
          className="w-full rounded-lg border border-[#dbdce0] dark:border-input-border-dark bg-white dark:bg-elevated-dark pl-4 pr-10 py-3 text-sm text-[#181611] dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400"
        />
        <span
          className={`material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-base transition-colors ${
            isSearching
              ? 'text-primary animate-pulse'
              : pinPlaced
              ? 'text-green-500'
              : 'text-gray-400'
          }`}
        >
          {isSearching ? 'search' : pinPlaced ? 'check_circle' : 'location_on'}
        </span>
      </div>

      {/* Hint */}
      <p className="text-xs text-[#887f63] dark:text-gray-500 flex items-center gap-1">
        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>drag_pan</span>
        Arrastrá el pin para ajustar la ubicación exacta
      </p>

      {/* Mapa — 256px mobile, 320px desktop */}
      <div className="relative rounded-xl overflow-hidden border border-[#dbdce0] dark:border-input-border-dark h-64 md:h-80">
        <div ref={containerRef} className="h-full w-full" />

        {/* Overlay mientras no hay pin */}
        {!pinPlaced && (
          <div className="absolute inset-0 flex items-end justify-center pb-5 pointer-events-none z-10">
            <div className="bg-white/90 dark:bg-card-dark/90 backdrop-blur-sm border border-gray-200 dark:border-input-border-dark rounded-xl shadow-sm px-4 py-2.5 flex items-center gap-2 mx-4">
              <span className="material-symbols-outlined text-xl text-primary shrink-0">
                travel_explore
              </span>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 leading-tight">
                Escribí tu dirección para ubicarte en el mapa
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
