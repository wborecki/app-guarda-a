import { useState, useRef, useEffect, useMemo } from "react";
import { Package, X } from "lucide-react";
import { itemDimensions, type ItemDimension } from "@/data/itemDimensions";

interface ItemAutocompleteProps {
  value: ItemDimension | null;
  onChange: (item: ItemDimension | null) => void;
  placeholder?: string;
  className?: string;
  compact?: boolean;
}

const popularIds = [
  "caixa-media",
  "mala-viagem",
  "bicicleta",
  "cama-casal",
  "geladeira-duplex",
  "sofa-3-lugares",
];

const ItemAutocomplete = ({
  value,
  onChange,
  placeholder = "Ex: caixa, mala, sofá…",
  className = "",
  compact = false,
}: ItemAutocompleteProps) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) {
      return itemDimensions.filter((i) => popularIds.includes(i.id));
    }
    const q = query.toLowerCase();
    return itemDimensions
      .filter(
        (i) =>
          i.nome.toLowerCase().includes(q) ||
          i.categoria.toLowerCase().includes(q)
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

  const volumeM3 = (item: ItemDimension) =>
    ((item.altura * item.largura * item.comprimento) / 1_000_000).toFixed(1);

  const selectItem = (item: ItemDimension) => {
    onChange(item);
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
          <Package size={14} className="text-primary shrink-0" />
          <span className="text-[15px] font-medium text-foreground truncate">
            {value.nome}
          </span>
          <span className="text-[11px] text-muted-foreground shrink-0">
            ~{volumeM3(value)} m³
          </span>
        </div>
        <button
          onClick={clear}
          className="p-0.5 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Limpar item"
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
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-popover border border-border rounded-xl shadow-xl shadow-foreground/[0.08] overflow-hidden max-h-[280px] overflow-y-auto">
          {!query.trim() && (
            <div className="px-3 pt-2.5 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
              Itens populares
            </div>
          )}
          {filtered.map((item) => (
            <button
              key={item.id}
              onClick={() => selectItem(item)}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-muted/60 transition-colors"
            >
              <Package size={14} className="text-primary/70 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-[13.5px] font-medium text-foreground truncate">
                  {item.nome}
                </div>
                <div className="text-[11px] text-muted-foreground/60">
                  {item.categoria} · ~{volumeM3(item)} m³
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemAutocomplete;
