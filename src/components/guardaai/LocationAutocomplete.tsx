import { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { MapPin, Loader2, LocateFixed } from "lucide-react";
import { toast } from "sonner";

interface NominatimResult {
  place_id: number;
  display_name: string;
}

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  /** Hide the GPS locate button for compact layouts */
  hideGps?: boolean;
}

const LocationAutocomplete = ({ value, onChange, placeholder = "Ex: Rua Augusta, 1200, São Paulo", className, hideGps = false }: LocationAutocompleteProps) => {
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeolocating, setIsGeolocating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&countrycodes=br&limit=5&addressdetails=0`,
        { headers: { "Accept-Language": "pt-BR" } }
      );
      const data: NominatimResult[] = await res.json();
      setSuggestions(data);
      setIsOpen(data.length > 0);
    } catch {
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleChange = (val: string) => {
    onChange(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 300);
  };

  const handleSelect = (name: string) => {
    onChange(name);
    setIsOpen(false);
    setSuggestions([]);
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      toast.error("Seu navegador não suporta geolocalização.");
      return;
    }

    setIsGeolocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { "Accept-Language": "pt-BR" } }
          );
          const data = await res.json();
          if (data.display_name) {
            onChange(data.display_name);
          } else {
            toast.error("Não foi possível obter o endereço.");
          }
        } catch {
          toast.error("Erro ao buscar endereço pela localização.");
        } finally {
          setIsGeolocating(false);
        }
      },
      (error) => {
        setIsGeolocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          toast.error("Permissão de localização negada. Ative nas configurações do navegador.");
        } else {
          toast.error("Não foi possível obter sua localização.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            className={className}
          />
          {isLoading && (
            <Loader2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-muted-foreground" />
          )}
        </div>
        <button
          type="button"
          onClick={handleGeolocate}
          disabled={isGeolocating}
          className="flex items-center gap-1.5 px-3 py-2 h-10 rounded-md border border-input bg-background text-sm text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors disabled:opacity-50 shrink-0"
          title="Usar minha localização"
        >
          {isGeolocating ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <LocateFixed size={16} />
          )}
          <span className="hidden sm:inline">Localização</span>
        </button>
      </div>
      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 rounded-md border bg-popover shadow-md overflow-hidden">
          {suggestions.map((s) => (
            <button
              key={s.place_id}
              type="button"
              className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-left hover:bg-accent/10 transition-colors cursor-pointer"
              onClick={() => handleSelect(s.display_name)}
            >
              <MapPin size={14} className="shrink-0 text-muted-foreground" />
              <span className="truncate">{s.display_name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationAutocomplete;
