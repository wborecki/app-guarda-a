import { useEffect, useRef, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
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

// Custom pin icons
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

// Sub-component to fit bounds
function FitBounds({ spaces }: { spaces: MapSpace[] }) {
  const map = useMap();
  useEffect(() => {
    if (spaces.length === 0) return;
    const bounds = L.latLngBounds(spaces.map((s) => [s.lat, s.lng]));
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
  }, [spaces, map]);
  return null;
}

// Highlighted marker needs to update its icon
function SpaceMarker({
  space,
  isHighlighted,
  onHover,
  onClick,
}: {
  space: MapSpace;
  isHighlighted: boolean;
  onHover: (id: number | null) => void;
  onClick: (id: number) => void;
}) {
  const markerRef = useRef<L.Marker>(null);

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;
    marker.setIcon(createPinIcon(isHighlighted));
    if (isHighlighted) {
      marker.setZIndexOffset(1000);
    } else {
      marker.setZIndexOffset(0);
    }
  }, [isHighlighted]);

  return (
    <Marker
      ref={markerRef}
      position={[space.lat, space.lng]}
      icon={createPinIcon(isHighlighted)}
      eventHandlers={{
        mouseover: () => onHover(space.id),
        mouseout: () => onHover(null),
        click: () => onClick(space.id),
      }}
    >
      <Popup closeButton={false} className="space-popup" maxWidth={240} minWidth={200}>
        <div className="p-0" style={{ margin: "-14px -20px -14px -20px" }}>
          <img
            src={space.photo}
            alt={space.name}
            className="w-full h-28 object-cover rounded-t-lg"
          />
          <div className="p-3">
            <p className="font-bold text-sm text-foreground leading-tight mb-0.5">{space.name}</p>
            <p className="text-xs text-muted-foreground mb-1.5">{space.type} · {space.neighborhood}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Star size={11} className="text-amber-500 fill-amber-500" />
                <span className="text-xs font-bold">{space.rating}</span>
                <span className="text-[10px] text-muted-foreground">({space.reviews})</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin size={10} className="text-primary" />
                <span className="text-xs font-semibold text-primary">{space.distance}</span>
              </div>
            </div>
            <p className="text-sm font-extrabold text-foreground mt-2">{space.price}</p>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default function SpaceMap({ spaces, highlightedId, onPinHover, onPinClick, className }: SpaceMapProps) {
  if (spaces.length === 0) {
    return (
      <div className={`flex items-center justify-center bg-muted rounded-xl ${className}`}>
        <p className="text-sm text-muted-foreground">Nenhum espaço para exibir no mapa</p>
      </div>
    );
  }

  const center: [number, number] = [spaces[0].lat, spaces[0].lng];

  return (
    <div className={`rounded-xl overflow-hidden border border-border/60 shadow-sm ${className}`}>
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", minHeight: "400px" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds spaces={spaces} />
        {spaces.map((space) => (
          <SpaceMarker
            key={space.id}
            space={space}
            isHighlighted={highlightedId === space.id}
            onHover={onPinHover}
            onClick={onPinClick}
          />
        ))}
      </MapContainer>
    </div>
  );
}
