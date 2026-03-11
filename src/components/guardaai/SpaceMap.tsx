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
// Primary color from design tokens: hsl(174 62% 38%) ≈ #249E8F
const PIN_COLOR_DEFAULT = "#249E8F";
const PIN_COLOR_HIGHLIGHTED = "#F97316"; // accent orange

function createPinIcon(isHighlighted: boolean, price?: string) {
  const color = isHighlighted ? PIN_COLOR_HIGHLIGHTED : PIN_COLOR_DEFAULT;
  const label = price || "";

  // Price-label pin (pill shape)
  if (label) {
    const bg = isHighlighted ? PIN_COLOR_HIGHLIGHTED : "hsl(0 0% 100%)";
    const fg = isHighlighted ? "#fff" : "hsl(210 25% 12%)";
    const border = isHighlighted ? PIN_COLOR_HIGHLIGHTED : "hsl(210 20% 85%)";
    const shadow = isHighlighted
      ? "0 3px 12px rgba(249,115,22,0.35)"
      : "0 2px 8px rgba(0,0,0,0.12)";
    const scale = isHighlighted ? "scale(1.08)" : "scale(1)";

    return L.divIcon({
      className: "custom-map-pin",
      html: `<div style="
        background: ${bg};
        color: ${fg};
        border: 1.5px solid ${border};
        border-radius: 20px;
        padding: 4px 10px;
        font-size: 12px;
        font-weight: 700;
        font-family: Inter, system-ui, sans-serif;
        white-space: nowrap;
        box-shadow: ${shadow};
        transform: ${scale};
        transition: all 0.2s ease;
        cursor: pointer;
        line-height: 1.3;
      ">${label}</div>`,
      iconSize: [0, 0],
      iconAnchor: [0, 14],
      popupAnchor: [0, -20],
    });
  }

  // Fallback dot pin
  const size = isHighlighted ? 16 : 12;
  return L.divIcon({
    className: "custom-map-pin",
    html: `<div style="
      width: ${size}px; height: ${size}px;
      background: ${color};
      border: 2px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
      transition: all 0.2s ease;
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

export interface MapSpace {
  id: number;
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
  highlightedId: number | null;
  onPinHover: (id: number | null) => void;
  onPinClick: (id: number) => void;
  className?: string;
}

// ─── Clean, desaturated tile layer ─────────────────────────────────
// CartoDB Positron — minimal, light, premium feel
const TILE_URL = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>';

export default function SpaceMap({ spaces, highlightedId, onPinHover, onPinClick, className }: SpaceMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<number, L.Marker>>(new Map());
  const spacePricesRef = useRef<Map<number, string>>(new Map());

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
