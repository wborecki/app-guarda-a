import { useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons for Leaflet + bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ─── Pin design system ─────────────────────────────────────────────
const PIN_ORANGE = "#F97316";
const PIN_ORANGE_DARK = "#EA580C";
const PIN_ORANGE_LIGHT = "#FB923C";

function createPinIcon(isHighlighted: boolean, price?: string) {
  const label = price || "";

  // SVG map pin shape — classic teardrop/location marker
  const w = isHighlighted ? 36 : 30;
  const h = isHighlighted ? 46 : 38;
  const fill = isHighlighted ? PIN_ORANGE_DARK : PIN_ORANGE;
  const stroke = isHighlighted ? "#fff" : "rgba(255,255,255,0.85)";
  const shadow = isHighlighted
    ? "filter: drop-shadow(0 4px 8px rgba(234,88,12,0.45));"
    : "filter: drop-shadow(0 3px 6px rgba(0,0,0,0.25));";
  const anim = "transition: all 0.2s ease;";

  // Pin with price label below
  if (label) {
    return L.divIcon({
      className: "custom-map-pin",
      html: `<div style="display:flex;flex-direction:column;align-items:center;${anim}${isHighlighted ? 'transform:scale(1.12);' : ''}">
        <svg width="${w}" height="${h}" viewBox="0 0 30 38" fill="none" xmlns="http://www.w3.org/2000/svg" style="${shadow}${anim}">
          <path d="M15 38S30 24.27 30 15C30 6.716 23.284 0 15 0S0 6.716 0 15C0 24.27 15 38 15 38Z" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
          <circle cx="15" cy="14" r="5.5" fill="white" opacity="0.95"/>
        </svg>
        <span style="
          margin-top: 2px;
          background: hsl(0 0% 100% / 0.95);
          color: hsl(210 25% 12%);
          border: 1px solid hsl(210 20% 88%);
          border-radius: 6px;
          padding: 2px 6px;
          font-size: 10px;
          font-weight: 700;
          font-family: Inter, system-ui, sans-serif;
          white-space: nowrap;
          box-shadow: 0 1px 4px rgba(0,0,0,0.1);
          line-height: 1.3;
        ">${label}</span>
      </div>`,
      iconSize: [w, h + 18],
      iconAnchor: [w / 2, h],
      popupAnchor: [0, -h],
    });
  }

  // Pin without label
  return L.divIcon({
    className: "custom-map-pin",
    html: `<div style="${anim}${isHighlighted ? 'transform:scale(1.12);' : ''}">
      <svg width="${w}" height="${h}" viewBox="0 0 30 38" fill="none" xmlns="http://www.w3.org/2000/svg" style="${shadow}${anim}">
        <path d="M15 38S30 24.27 30 15C30 6.716 23.284 0 15 0S0 6.716 0 15C0 24.27 15 38 15 38Z" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
        <circle cx="15" cy="14" r="5.5" fill="white" opacity="0.95"/>
      </svg>
    </div>`,
    iconSize: [w, h],
    iconAnchor: [w / 2, h],
    popupAnchor: [0, -h],
  });
}

export interface MapSpace {
  id: number | string;
  name: string;
  type: string;
  neighborhood: string;
  city: string;
  distance: string;
  rating: number;
  reviews: number;
  price: string;
  photo: string;
  lat: number;
  lng: number;
}

interface SpaceMapProps {
  spaces: MapSpace[];
  highlightedId: number | string | null;
  onPinHover: (id: number | string | null) => void;
  onPinClick: (id: number | string) => void;
  className?: string;
}

// ─── Clean, desaturated tile layer ─────────────────────────────────
// CartoDB Positron — minimal, light, premium feel
const TILE_URL = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>';

export default function SpaceMap({ spaces, highlightedId, onPinHover, onPinClick, className }: SpaceMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<number | string, L.Marker>>(new Map());
  const spacePricesRef = useRef<Map<number | string, string>>(new Map());

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (spaces.length === 0) return;

    const map = L.map(containerRef.current, {
      center: [spaces[0].lat, spaces[0].lng],
      zoom: 13,
      scrollWheelZoom: true,
      zoomControl: false,
    });

    L.tileLayer(TILE_URL, {
      attribution: TILE_ATTRIBUTION,
      maxZoom: 19,
    }).addTo(map);

    // Zoom control on top-right
    L.control.zoom({ position: "topright" }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current.clear();
      spacePricesRef.current.clear();
    };
  }, []);

  // Update markers when spaces change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || spaces.length === 0) return;

    // Remove old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();
    spacePricesRef.current.clear();

    // Add new markers with price labels
    spaces.forEach((space) => {
      spacePricesRef.current.set(space.id, space.price);

      const marker = L.marker([space.lat, space.lng], {
        icon: createPinIcon(false, space.price),
      }).addTo(map);

      marker.bindPopup(
        `<div class="p-0" style="margin: -14px -20px -14px -20px">
          <img src="${space.photo}" alt="${space.name}" style="width:100%;height:100px;object-fit:cover;border-radius:10px 10px 0 0;" />
          <div style="padding:10px 12px 12px">
            <p style="font-weight:700;font-size:13px;margin:0 0 2px 0;color:hsl(210 25% 12%);">${space.name}</p>
            <p style="font-size:11px;color:hsl(210 10% 50%);margin:0 0 6px 0;">${space.type} · ${space.neighborhood}</p>
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-size:11px;color:hsl(210 10% 50%);">★ ${space.rating} (${space.reviews})</span>
              <span style="font-weight:800;font-size:13px;color:hsl(210 25% 12%);">${space.price}</span>
            </div>
          </div>
        </div>`,
        { closeButton: false, maxWidth: 220, minWidth: 180, className: "space-popup" }
      );

      marker.on("mouseover", () => onPinHover(space.id));
      marker.on("mouseout", () => onPinHover(null));
      marker.on("click", () => onPinClick(space.id));

      markersRef.current.set(space.id, marker);
    });

    // Fit bounds
    const bounds = L.latLngBounds(spaces.map((s) => [s.lat, s.lng]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
  }, [spaces, onPinHover, onPinClick]);

  // Update highlighted marker icon
  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      const isHighlighted = id === highlightedId;
      const price = spacePricesRef.current.get(id);
      marker.setIcon(createPinIcon(isHighlighted, price));
      marker.setZIndexOffset(isHighlighted ? 1000 : 0);
    });
  }, [highlightedId]);

  if (spaces.length === 0) {
    return (
      <div className={`flex items-center justify-center bg-muted rounded-xl ${className}`}>
        <p className="text-sm text-muted-foreground">Nenhum espaço para exibir no mapa</p>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      <div ref={containerRef} style={{ height: "100%", width: "100%", minHeight: "400px" }} />
    </div>
  );
}
