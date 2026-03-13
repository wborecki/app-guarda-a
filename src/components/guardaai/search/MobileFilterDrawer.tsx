import { motion, AnimatePresence } from "framer-motion";
import { Star, X, Package, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type Filters,
  spaceTypesList, distanceOptions, ratingOptions, allFeatures, spaceUseOptions,
} from "@/data/searchMockData";

interface MobileFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  clearAll: () => void;
  resultCount: number;
}

const FilterContent = ({ filters, setFilters }: { filters: Filters; setFilters: React.Dispatch<React.SetStateAction<Filters>> }) => {
  const toggleType = (t: string) => setFilters(f => ({ ...f, types: f.types.includes(t) ? f.types.filter(x => x !== t) : [...f.types, t] }));
  const toggleFeature = (feat: string) => setFilters(f => ({ ...f, features: f.features.includes(feat) ? f.features.filter(x => x !== feat) : [...f.features, feat] }));

  return (
    <div className="space-y-5">
      <div>
        <h4 className="text-xs font-semibold text-foreground mb-2">Tipo de espaço</h4>
        <div className="flex flex-wrap gap-1.5">
          {spaceTypesList.map(t => (
            <button key={t} onClick={() => toggleType(t)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${filters.types.includes(t) ? "bg-primary/10 border-primary/30 text-primary font-semibold" : "border-border/60 text-muted-foreground hover:border-primary/20"}`}
            >{t}</button>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-xs font-semibold text-foreground mb-2">Distância máxima</h4>
        <div className="flex flex-wrap gap-1.5">
          {distanceOptions.map(d => (
            <button key={d.value} onClick={() => setFilters(f => ({ ...f, maxDistance: f.maxDistance === d.value ? null : d.value }))}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${filters.maxDistance === d.value ? "bg-primary/10 border-primary/30 text-primary font-semibold" : "border-border/60 text-muted-foreground hover:border-primary/20"}`}
            >{d.label}</button>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-xs font-semibold text-foreground mb-2">Avaliação mínima</h4>
        <div className="flex flex-wrap gap-1.5">
          {ratingOptions.map(r => (
            <button key={r.value} onClick={() => setFilters(f => ({ ...f, minRating: f.minRating === r.value ? null : r.value }))}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors flex items-center gap-1 ${filters.minRating === r.value ? "bg-primary/10 border-primary/30 text-primary font-semibold" : "border-border/60 text-muted-foreground hover:border-primary/20"}`}
            ><Star size={10} className="text-accent fill-accent" />{r.label}</button>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-xs font-semibold text-foreground mb-2">Preço máximo (total)</h4>
        <div className="flex flex-wrap gap-1.5">
          {[30, 60, 100, 200].map(p => (
            <button key={p} onClick={() => setFilters(f => ({ ...f, maxPrice: f.maxPrice === p ? null : p }))}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${filters.maxPrice === p ? "bg-primary/10 border-primary/30 text-primary font-semibold" : "border-border/60 text-muted-foreground hover:border-primary/20"}`}
            >Até R${p}</button>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-xs font-semibold text-foreground mb-2">Comodidades</h4>
        <div className="flex flex-wrap gap-1.5">
          {allFeatures.map(feat => (
            <button key={feat} onClick={() => toggleFeature(feat)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${filters.features.includes(feat) ? "bg-primary/10 border-primary/30 text-primary font-semibold" : "border-border/60 text-muted-foreground hover:border-primary/20"}`}
            >{feat}</button>
          ))}
        </div>
      </div>
    </div>
  );
};

const MobileFilterDrawer = ({ open, onClose, filters, setFilters, clearAll, resultCount }: MobileFilterDrawerProps) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-foreground/40 z-40" onClick={onClose} />
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-2xl border-t max-h-[85vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-card z-10 p-4 pb-2 border-b border-border/40 flex items-center justify-between">
            <h3 className="font-bold text-foreground">Filtros</h3>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-secondary"><X size={18} className="text-muted-foreground" /></button>
          </div>
          <div className="p-4 pt-3">
            <FilterContent filters={filters} setFilters={setFilters} />
            <div className="flex gap-3 mt-6 pt-4 border-t border-border/40">
              <Button variant="outline" className="flex-1" onClick={() => { clearAll(); onClose(); }}>Limpar</Button>
              <Button className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold" onClick={onClose}>
                Ver {resultCount} resultado{resultCount !== 1 ? "s" : ""}
              </Button>
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export default MobileFilterDrawer;
