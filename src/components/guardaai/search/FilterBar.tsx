import { motion, AnimatePresence } from "framer-motion";
import { Star, Navigation, SlidersHorizontal, X, Check, Package, Car } from "lucide-react";
import Dropdown from "./Dropdown";
import {
  type SortOption, type Filters, type SpaceUseFilter,
  sortLabels, spaceTypesList, distanceOptions, ratingOptions, allFeatures, spaceUseOptions,
} from "@/data/searchMockData";
import { vehicleCategories, vehicleGroups } from "@/data/vehicleCategories";

interface FilterBarProps {
  sortBy: SortOption;
  setSortBy: (s: SortOption) => void;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  activeFilterChips: { label: string; clear: () => void }[];
  hasActiveFilters: boolean;
  clearAll: () => void;
  onOpenMobileFilters: () => void;
}

const FilterBar = ({
  sortBy, setSortBy, filters, setFilters,
  activeFilterChips, hasActiveFilters, clearAll, onOpenMobileFilters,
}: FilterBarProps) => {
  const toggleType = (t: string) => setFilters(f => ({ ...f, types: f.types.includes(t) ? f.types.filter(x => x !== t) : [...f.types, t] }));
  const toggleFeature = (feat: string) => setFilters(f => ({ ...f, features: f.features.includes(feat) ? f.features.filter(x => x !== feat) : [...f.features, feat] }));
  const toggleVehicleType = (id: string) => setFilters(f => ({ ...f, vehicleTypes: f.vehicleTypes.includes(id) ? f.vehicleTypes.filter(x => x !== id) : [...f.vehicleTypes, id] }));
  const showVehicleFilter = filters.spaceUse === "vehicles" || filters.spaceUse === "all";

  return (
    <div className="bg-background border-b">
      <div className="container py-2.5 space-y-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-hide overscroll-x-contain">
          {/* Space use toggle */}
          <div className="flex items-center bg-secondary rounded-full p-0.5 flex-shrink-0">
            {spaceUseOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setFilters(f => ({ ...f, spaceUse: opt.value }))}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap transition-colors flex items-center gap-1 ${
                  filters.spaceUse === opt.value
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {opt.value === "objects" && <Package size={10} />}
                {opt.value === "vehicles" && <Car size={10} />}
                {opt.label}
              </button>
            ))}
          </div>

          <div className="w-px h-5 bg-border/60 flex-shrink-0 mx-0.5" />

          {(Object.keys(sortLabels) as SortOption[]).map(key => (
            <button
              key={key}
              onClick={() => setSortBy(key)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border whitespace-nowrap transition-colors ${
                sortBy === key
                  ? "bg-foreground text-background border-foreground"
                  : "bg-card border-border/60 text-muted-foreground hover:border-primary/30 hover:text-foreground"
              }`}
            >
              {key === "proximity" && <Navigation size={10} className="inline mr-1" />}
              {sortLabels[key]}
            </button>
          ))}

          <div className="w-px h-5 bg-border/60 flex-shrink-0 mx-1 hidden sm:block" />

          {/* Desktop filter dropdowns */}
          <div className="hidden sm:flex items-center gap-2">
            <Dropdown label="Tipo" isActive={filters.types.length > 0}>
              <div className="space-y-0.5">
                {spaceTypesList.map(t => (
                  <button key={t} onClick={() => toggleType(t)} className={`w-full text-left text-xs px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${filters.types.includes(t) ? "bg-primary/10 text-primary font-semibold" : "hover:bg-secondary text-foreground"}`}>
                    {t} {filters.types.includes(t) && <Check size={12} />}
                  </button>
                ))}
              </div>
            </Dropdown>

            <Dropdown label="Distância" isActive={filters.maxDistance !== null}>
              <div className="space-y-0.5">
                {distanceOptions.map(d => (
                  <button key={d.value} onClick={() => setFilters(f => ({ ...f, maxDistance: f.maxDistance === d.value ? null : d.value }))} className={`w-full text-left text-xs px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${filters.maxDistance === d.value ? "bg-primary/10 text-primary font-semibold" : "hover:bg-secondary text-foreground"}`}>
                    {d.label} {filters.maxDistance === d.value && <Check size={12} />}
                  </button>
                ))}
              </div>
            </Dropdown>

            <Dropdown label="Avaliação" isActive={filters.minRating !== null}>
              <div className="space-y-0.5">
                {ratingOptions.map(r => (
                  <button key={r.value} onClick={() => setFilters(f => ({ ...f, minRating: f.minRating === r.value ? null : r.value }))} className={`w-full text-left text-xs px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${filters.minRating === r.value ? "bg-primary/10 text-primary font-semibold" : "hover:bg-secondary text-foreground"}`}>
                    <span className="flex items-center gap-1"><Star size={10} className="text-accent fill-accent" />{r.label}</span>
                    {filters.minRating === r.value && <Check size={12} />}
                  </button>
                ))}
              </div>
            </Dropdown>

            <Dropdown label="Preço" isActive={filters.maxPrice !== null}>
              <div className="space-y-0.5">
                {[30, 60, 100, 200].map(p => (
                  <button key={p} onClick={() => setFilters(f => ({ ...f, maxPrice: f.maxPrice === p ? null : p }))} className={`w-full text-left text-xs px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${filters.maxPrice === p ? "bg-primary/10 text-primary font-semibold" : "hover:bg-secondary text-foreground"}`}>
                    Até R${p} {filters.maxPrice === p && <Check size={12} />}
                  </button>
                ))}
              </div>
            </Dropdown>

            <Dropdown label="Comodidades" isActive={filters.features.length > 0}>
              <div className="space-y-0.5 max-h-52 overflow-y-auto">
                {allFeatures.map(feat => (
                  <button key={feat} onClick={() => toggleFeature(feat)} className={`w-full text-left text-xs px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${filters.features.includes(feat) ? "bg-primary/10 text-primary font-semibold" : "hover:bg-secondary text-foreground"}`}>
                    {feat} {filters.features.includes(feat) && <Check size={12} />}
                  </button>
                ))}
              </div>
            </Dropdown>
          </div>

          {/* Mobile filter button */}
          <button
            onClick={onOpenMobileFilters}
            className={`sm:hidden flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border whitespace-nowrap transition-colors ${
              hasActiveFilters ? "bg-primary/10 border-primary/30 text-primary" : "bg-card border-border/60 text-foreground"
            }`}
          >
            <SlidersHorizontal size={12} />
            Filtros{hasActiveFilters ? ` (${activeFilterChips.length})` : ""}
          </button>
        </div>

        {/* Active filter chips */}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex flex-wrap items-center gap-1.5">
              {activeFilterChips.map((chip) => (
                <span key={chip.label} className="inline-flex items-center gap-1 text-[11px] font-medium bg-primary/10 text-primary rounded-full pl-2.5 pr-1.5 py-1">
                  {chip.label}
                  <button onClick={chip.clear} className="hover:bg-primary/20 rounded-full p-0.5"><X size={10} /></button>
                </span>
              ))}
              <button onClick={clearAll} className="text-[11px] text-muted-foreground hover:text-foreground font-medium ml-1">Limpar tudo</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FilterBar;
