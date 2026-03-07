import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useRef } from 'react';

const TILE_LIGHT = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
const TILE_DARK  = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const TILE_ATTR  = '© <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/attributions">CARTO</a>';

interface Props {
  lat: number;
  lng: number;
  name: string;
  height?: number;
}

export default function MiniMapa({ lat, lng, name, height = 200 }: Props) {
  const ref      = useRef<HTMLDivElement>(null);
  const mapRef   = useRef<L.Map | null>(null);
  const tileRef  = useRef<L.TileLayer | null>(null);

  useEffect(() => {
    if (!ref.current || mapRef.current) return;
    const isDark = document.documentElement.classList.contains('dark');

    const map = L.map(ref.current, {
      center: [lat, lng],
      zoom: 15,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    const tile = L.tileLayer(isDark ? TILE_DARK : TILE_LIGHT, {
      attribution: TILE_ATTR,
      maxZoom: 19,
      subdomains: ['a', 'b', 'c', 'd'],
    }).addTo(map);

    const icon = L.divIcon({
      className: '',
      html: `<div style="background:#FFB800;width:32px;height:32px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;"><span style="transform:rotate(45deg);font-size:13px;line-height:1">🔧</span></div>`,
      iconSize:    [32, 32],
      iconAnchor:  [16, 32],
      popupAnchor: [0, -38],
    });

    const safeName = String(name)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    L.marker([lat, lng], { icon })
      .addTo(map)
      .bindPopup(`<span style="font-size:12px;font-weight:700;font-family:Inter,sans-serif">${safeName}</span>`, { maxWidth: 180 })
      .openPopup();

    mapRef.current  = map;
    tileRef.current = tile;

    // Swap tiles on dark-mode toggle
    const mo = new MutationObserver(() => {
      const dark = document.documentElement.classList.contains('dark');
      tileRef.current?.setUrl(dark ? TILE_DARK : TILE_LIGHT);
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      mo.disconnect();
      map.remove();
      mapRef.current  = null;
      tileRef.current = null;
    };
  }, []);

  return (
    <div
      ref={ref}
      className="w-full rounded-xl overflow-hidden border border-gray-200 dark:border-input-border-dark"
      style={{ height }}
    />
  );
}
