import { useState, useRef, useEffect, useMemo } from "react";
import { Car, X } from "lucide-react";
import {
  vehicleCategories,
  popularVehicleIds,
  vehicleSizeLabel,
  vehicleFootprint,
  type VehicleCategory,
} from "@/data/vehicleCategories";

interface VehicleAutocompleteProps {
  value: VehicleCategory | null;
  onChange: (v: VehicleCategory | null) => void;
  placeholder?: string;
  className?: string;
  compact?: boolean;
}

const VehicleAutocomplete = ({
  value,
  onChange,
  placeholder = "Ex: carro, moto, SUV…",
  className = "",
  compact = false,
}: VehicleAutocompleteProps) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) {
      return vehicleCategories.filter((v) => popularVehicleIds.includes(v.id));
    }
    const q = query.toLowerCase();
    return vehicleCategories
      .filter(
        (v) =>
          v.nome.toLowerCase().includes(q) ||
          v.grupo.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectItem = (v: VehicleCategory) => {
    onChange(v);
    setQuery("");
    setOpen(false);
  };

  const clear = () => {
    onChange(null);
    setQuery("");
  };

  if (value) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <span className="text-sm">{value.icon}</span>
          <span className="text-[15px] font-medium text-foreground truncate">
            {value.nome}
          </span>
          <span className="text-[11px] text-muted-foreground shrink-0">
            ~{vehicleFootprint(value)} m²
          </span>
        </div>
        <button
          onClick={clear}
          className="p-0.5 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Limpar veículo"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className={
          compact
            ? "h-9 w-full bg-transparent text-[15px] font-medium placeholder:text-muted-foreground/50 focus:outline-none"
            : "flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-[14px] ring-offset-background placeholder:text-muted-foreground/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
        }
      />

      {open && filtered.length > 0 && (
        <div className="absolute left-0 top-full mt-1.5 z-[100] bg-card border border-border rounded-xl shadow-2xl shadow-foreground/[0.14] overflow-hidden max-h-[240px] overflow-y-auto w-[280px] md:w-[300px] max-md:w-full ring-1 ring-foreground/[0.04] backdrop-blur-sm">
          {!query.trim() && (
            <div className="px-3 pt-2.5 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
              Veículos populares
            </div>
          )}
          {filtered.map((v) => (
            <button
              key={v.id}
              onClick={() => selectItem(v)}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-muted/60 transition-colors"
            >
              <span className="text-base shrink-0">{v.icon}</span>
              <div className="min-w-0 flex-1">
                <div className="text-[13.5px] font-medium text-foreground truncate">
                  {v.nome}
                </div>
                <div className="text-[11px] text-muted-foreground/60">
                  {v.grupo} · {vehicleSizeLabel(v)}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default VehicleAutocomplete;
