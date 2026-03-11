import { useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Star, MapPin } from "lucide-react";

// Fix default marker icons for Leaflet + bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function createPinIcon(isHighlighted: boolean) {
  const color = isHighlighted ? "#16a34a" : "#1e40af";
  const size = isHighlighted ? 38 : 30;
  return L.divIcon({
    className: "custom-map-pin",
    html: `<div style="
      width: ${size}px; height: ${size}px;
      background: ${color};
      border: 3px solid white;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s ease;
      ${isHighlighted ? "z-index: 1000;" : ""}
    "><span style="transform: rotate(45deg); color: white; font-weight: bold; font-size: ${isHighlighted ? 13 : 11}px;">●</span></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
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

export default function SpaceMap({ spaces, highlightedId, onPinHover, onPinClick, className }: SpaceMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<number, L.Marker>>(new Map());

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

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current.clear();
    };
  }, []);

  // Update markers when spaces change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || spaces.length === 0) return;

    // Remove old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();

    // Add new markers
    spaces.forEach((space) => {
      const marker = L.marker([space.lat, space.lng], {
        icon: createPinIcon(false),
      }).addTo(map);

      marker.bindPopup(
        `<div class="p-0" style="margin: -14px -20px -14px -20px">
          <img src="${space.photo}" alt="${space.name}" style="width:100%;height:112px;object-fit:cover;border-radius:8px 8px 0 0;" />
          <div style="padding:12px">
            <p style="font-weight:bold;font-size:14px;margin:0 0 2px 0;">${space.name}</p>
            <p style="font-size:12px;color:#888;margin:0 0 8px 0;">${space.type} · ${space.neighborhood}</p>
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-size:12px;">⭐ ${space.rating} (${space.reviews})</span>
              <span style="font-size:12px;color:#1e40af;">📍 ${space.distance}</span>
            </div>
            <p style="font-weight:800;font-size:14px;margin:8px 0 0 0;">${space.price}</p>
          </div>
        </div>`,
        { closeButton: false, maxWidth: 240, minWidth: 200, className: "space-popup" }
      );

      marker.on("mouseover", () => onPinHover(space.id));
      marker.on("mouseout", () => onPinHover(null));
      marker.on("click", () => onPinClick(space.id));

      markersRef.current.set(space.id, marker);
    });

    // Fit bounds
    const bounds = L.latLngBounds(spaces.map((s) => [s.lat, s.lng]));
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
  }, [spaces, onPinHover, onPinClick]);

  // Update highlighted marker icon
  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      const isHighlighted = id === highlightedId;
      marker.setIcon(createPinIcon(isHighlighted));
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
    <div className={`rounded-xl overflow-hidden border border-border/60 shadow-sm ${className}`}>
      <div ref={containerRef} style={{ height: "100%", width: "100%", minHeight: "400px" }} />
    </div>
  );
}
