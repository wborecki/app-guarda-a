import { Package, Car } from "lucide-react";
import type { StorageMode } from "@/data/vehicleCategories";
import { cn } from "@/lib/utils";

interface StorageModeSelectorProps {
  value: StorageMode;
  onChange: (mode: StorageMode) => void;
  /** Compact variant for inline use */
  size?: "sm" | "md";
  className?: string;
}

const StorageModeSelector = ({
  value,
  onChange,
  size = "md",
  className,
}: StorageModeSelectorProps) => {
  const isSmall = size === "sm";

  return (
    <div
      className={cn(
        "inline-flex rounded-xl border border-border/60 bg-secondary/50 p-0.5",
        className
      )}
    >
      <button
        type="button"
        onClick={() => onChange("objects")}
        className={cn(
          "inline-flex items-center gap-1.5 font-semibold transition-all rounded-[10px]",
          isSmall ? "px-3 py-1.5 text-[11px]" : "px-4 py-2 text-xs",
          value === "objects"
            ? "bg-card text-foreground shadow-sm border border-border/40"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Package size={isSmall ? 12 : 14} />
        Objetos
      </button>
      <button
        type="button"
        onClick={() => onChange("vehicles")}
        className={cn(
          "inline-flex items-center gap-1.5 font-semibold transition-all rounded-[10px]",
          isSmall ? "px-3 py-1.5 text-[11px]" : "px-4 py-2 text-xs",
          value === "vehicles"
            ? "bg-card text-foreground shadow-sm border border-border/40"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Car size={isSmall ? 12 : 14} />
        Veículos
      </button>
    </div>
  );
};

export default StorageModeSelector;
