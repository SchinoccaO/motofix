import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useCallback, useEffect, useRef, useState } from 'react';

// ── Constants ─────────────────────────────────────────────────────────────────
const CORDOBA: [number, number] = [-31.4135, -64.181]; // [lat, lng]
const INIT_ZOOM = 13;
const NOMINATIM_EMAIL = 'hola@motofix.com.ar';

const TILE_LIGHT = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
const TILE_DARK  = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const TILE_ATTR  = '© <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>';

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

function truncateDisplayName(name: string): string {
  return name.split(', ').slice(0, 3).join(', ');
}

function buildShortAddress(addr: NominatimAddress, fallback: string): string {
  const street        = addr.road ? (addr.house_number ? `${addr.road} ${addr.house_number}` : addr.road) : null;
  const neighbourhood = addr.suburb ?? addr.neighbourhood ?? null;
  const city          = extractCity(addr);
  const parts         = [street, neighbourhood, city].filter(Boolean);
  return parts.length >= 2 ? parts.join(', ') : fallback.slice(0, 499);
}

// ── Custom pin icon ───────────────────────────────────────────────────────────
const PIN_ICON = L.divIcon({
  className: '',
  html: `<svg width="32" height="42" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 0C7.163 0 0 7.163 0 16C0 28 16 42 16 42C16 42 32 28 32 16C32 7.163 24.837 0 16 0Z" fill="#FFB800"/>
    <circle cx="16" cy="16" r="6" fill="#181611"/>
  </svg>`,
  iconSize:    [32, 42],
  iconAnchor:  [16, 42],
  popupAnchor: [0, -42],
});

// ── Types ─────────────────────────────────────────────────────────────────────
export interface LocationData {
  lat: number;
  lng: number;
  displayAddress: string;
  address: string;
  city: string;
  province: string;
}

interface Props {
  onLocationChange: (location: LocationData) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function SelectorUbicacion({ onLocationChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<L.Map | null>(null);
  const tileRef      = useRef<L.TileLayer | null>(null);
  const markerRef    = useRef<L.Marker | null>(null);
  const debounceRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onChangeRef  = useRef(onLocationChange);

  const [inputText,            setInputText]            = useState('');
  const [isSearching,          setIsSearching]          = useState(false);
  const [hasConfirmedLocation, setHasConfirmedLocation] = useState(false);

  useEffect(() => { onChangeRef.current = onLocationChange; }, [onLocationChange]);

  // ── Reverse geocoding ─────────────────────────────────────────────────────
  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    try {
      const res  = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&accept-language=es&email=${NOMINATIM_EMAIL}`
      );
      const data = (await res.json()) as NominatimReverseResult;
      const addr           = data.address ?? {};
      const rawDisplay     = data.display_name ?? `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      const displayAddress = truncateDisplayName(rawDisplay);
      setInputText(displayAddress);
      setHasConfirmedLocation(true);
      onChangeRef.current({
        lat, lng, displayAddress,
        address:  buildShortAddress(addr, rawDisplay),
        city:     extractCity(addr),
        province: extractProvince(addr),
      });
    } catch {
      const displayAddress = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      onChangeRef.current({ lat, lng, displayAddress, address: displayAddress, city: '', province: '' });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Place / move marker ───────────────────────────────────────────────────
  const placeMarker = useCallback((latlng: [number, number]) => {
    const map = mapRef.current;
    if (!map) return;

    if (markerRef.current) {
      markerRef.current.setLatLng(latlng);
      return;
    }

    const marker = L.marker(latlng, { icon: PIN_ICON, draggable: true }).addTo(map);

    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      reverseGeocode(pos.lat, pos.lng);
    });

    markerRef.current = marker;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Init map (once) ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const isDark = document.documentElement.classList.contains('dark');

    const map = L.map(containerRef.current, {
      center:      CORDOBA,
      zoom:        INIT_ZOOM,
      zoomControl: false,
      doubleClickZoom: false, // disable so dblclick places pin
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.control.attribution({ prefix: false }).addTo(map);

    const tile = L.tileLayer(isDark ? TILE_DARK : TILE_LIGHT, {
      attribution: TILE_ATTR,
      maxZoom: 19,
      subdomains: ['a', 'b', 'c', 'd'],
    }).addTo(map);
    tileRef.current = tile;

    // Dark mode swap
    const observer = new MutationObserver(() => {
      tileRef.current?.setUrl(
        document.documentElement.classList.contains('dark') ? TILE_DARK : TILE_LIGHT
      );
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // Default pin at Córdoba
    placeMarker(CORDOBA);

    // Double-click / double-tap → place pin
    map.on('dblclick', (e) => {
      placeMarker([e.latlng.lat, e.latlng.lng]);
      reverseGeocode(e.latlng.lat, e.latlng.lng);
    });

    mapRef.current = map;

    return () => {
      observer.disconnect();
      map.remove();
      mapRef.current  = null;
      tileRef.current = null;
      markerRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Geolocate handler ─────────────────────────────────────────────────────
  const handleGeolocate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude: lat, longitude: lng } = pos.coords;
      placeMarker([lat, lng]);
      mapRef.current?.flyTo([lat, lng], 16, { duration: 0.8 });
      reverseGeocode(lat, lng);
    });
  };

  // ── Address search with debounce ──────────────────────────────────────────
  const handleAddressChange = (value: string) => {
    setInputText(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value.trim()) return;

    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res  = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&limit=1&addressdetails=1&countrycodes=ar&accept-language=es&email=${NOMINATIM_EMAIL}`
        );
        const data = (await res.json()) as NominatimSearchResult[];
        if (data.length > 0) {
          const { lat, lon, display_name, address = {} } = data[0];
          const latlng: [number, number] = [parseFloat(lat), parseFloat(lon)];
          const shortDisplay = truncateDisplayName(display_name);
          mapRef.current?.flyTo(latlng, 16, { duration: 0.8 });
          placeMarker(latlng);
          setInputText(shortDisplay);
          setHasConfirmedLocation(true);
          onChangeRef.current({
            lat: parseFloat(lat), lng: parseFloat(lon),
            displayAddress: shortDisplay,
            address:  buildShortAddress(address, display_name),
            city:     extractCity(address),
            province: extractProvince(address),
          });
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
            isSearching ? 'text-primary animate-pulse' : hasConfirmedLocation ? 'text-green-500' : 'text-gray-400'
          }`}
        >
          {isSearching ? 'search' : hasConfirmedLocation ? 'check_circle' : 'location_on'}
        </span>
      </div>

      {/* Hint */}
      <p className="text-xs text-[#887f63] dark:text-gray-500 flex items-center gap-1">
        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>touch_app</span>
        Buscá, doble tap en el mapa, o arrastrá el pin para ubicarte
      </p>

      {/* Mapa */}
      <div className="relative rounded-xl overflow-hidden border border-[#dbdce0] dark:border-input-border-dark h-64 md:h-80">
        <div ref={containerRef} className="h-full w-full" />

        {/* Botón geolocate */}
        <button
          type="button"
          onClick={handleGeolocate}
          className="absolute bottom-14 right-2 z-[1000] w-8 h-8 bg-white dark:bg-card-dark border border-gray-300 dark:border-input-border-dark rounded shadow-md flex items-center justify-center hover:bg-gray-50 dark:hover:bg-elevated-dark transition-colors"
          title="Mi ubicación"
          aria-label="Usar mi ubicación actual"
        >
          <span className="material-symbols-outlined text-[18px] text-gray-600 dark:text-gray-300">my_location</span>
        </button>

        {/* Overlay hasta confirmar ubicación */}
        {!hasConfirmedLocation && (
          <div className="absolute inset-0 flex items-end justify-center pb-4 pointer-events-none z-[999]">
            <div className="bg-white/90 dark:bg-card-dark/90 backdrop-blur-sm border border-gray-200 dark:border-input-border-dark rounded-xl shadow-sm px-4 py-2.5 flex items-center gap-2 mx-4">
              <span className="material-symbols-outlined text-lg text-primary shrink-0">touch_app</span>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 leading-tight">
                Doble tap, arrastrá el pin o usá{' '}
                <span className="text-primary font-semibold">⊙</span> para tu ubicación
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
