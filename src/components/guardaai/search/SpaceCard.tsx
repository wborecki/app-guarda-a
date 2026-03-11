import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Ruler, Shield } from "lucide-react";
import CardCarousel from "./CardCarousel";
import { calculatePrice } from "@/lib/pricing";
import { computePrimaryBadge, getUseCaseHint } from "@/data/searchMockData";

interface SpaceCardProps {
  space: any;
  allSpaces: any[];
  totalVol: number;
  days: number;
  index: number;
  isHighlighted: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  onSelect: (e: React.MouseEvent) => void;
  cardRef: (el: HTMLDivElement | null) => void;
}

const SpaceCard = ({
  space, allSpaces, totalVol, days, index,
  isHighlighted, onMouseEnter, onMouseLeave, onClick, onSelect, cardRef,
}: SpaceCardProps) => {
  const reservedVol = Math.max(totalVol, 1);
  const bp = calculatePrice(reservedVol, days);
  const primaryBadge = computePrimaryBadge(space, allSpaces);
  const useHint = getUseCaseHint(space.type);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Card
        className={`overflow-hidden transition-all cursor-pointer ${
          isHighlighted
            ? "shadow-lg ring-2 ring-primary/30 border-primary/40"
            : "hover:shadow-md border-border/60"
        }`}
        onClick={onClick}
      >
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row">
            {/* Photo — taller on mobile for visual impact */}
            <div className="sm:w-52 lg:w-48 xl:w-52 h-52 sm:h-auto bg-muted flex-shrink-0 relative">
              <CardCarousel photos={space.photos} name={space.name} />
              <div className="absolute top-2.5 left-2.5 bg-background/90 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1">
                <MapPin size={10} className="text-primary" />
                <span className="text-[11px] font-semibold text-foreground">{space.distance}</span>
              </div>
              {primaryBadge && (
                <div className="absolute bottom-2.5 left-2.5">
                  <span className="text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-md bg-foreground/80 text-background backdrop-blur-sm shadow-sm">
                    {primaryBadge.label}
                  </span>
                </div>
              )}
              {/* Mobile: rating badge on photo */}
              {space.reviews > 0 && (
                <div className="absolute top-2.5 right-2.5 sm:hidden bg-background/90 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-0.5">
                  <Star size={10} className="text-accent fill-accent" />
                  <span className="text-[11px] font-bold text-foreground">{space.rating}</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 p-3.5 sm:p-4 flex flex-col justify-between min-h-0 sm:min-h-[170px]">
              <div>
                <div className="flex items-start justify-between gap-2 mb-0.5">
                  <h3 className="font-bold text-foreground text-sm leading-snug">{space.name}</h3>
                  {space.reviews > 0 ? (
                    <div className="hidden sm:flex items-center gap-0.5 flex-shrink-0">
                      <Star size={11} className="text-accent fill-accent" />
                      <span className="text-xs font-bold text-foreground">{space.rating}</span>
                      <span className="text-[10px] text-muted-foreground">({space.reviews})</span>
                    </div>
                  ) : (
                    <span className="hidden sm:block text-[10px] text-muted-foreground flex-shrink-0">Novo</span>
                  )}
                </div>

                <p className="text-xs text-muted-foreground mb-1">{space.type} · {space.neighborhood}, {space.city}</p>
                <p className="text-[11px] text-muted-foreground/70 italic mb-2 hidden sm:block">{useHint}</p>

                <div className="flex items-center gap-2.5 text-[11px] text-muted-foreground mb-2">
                  <span className="flex items-center gap-1">
                    <Ruler size={10} className="text-primary/70" />
                    <span className="font-medium text-foreground">{space.area} m³</span>
                  </span>
                  <span className="w-px h-3 bg-border" />
                  <span className="flex items-center gap-1">
                    <Shield size={10} className="text-primary/70" />
                    {space.owner}
                  </span>
                </div>

                <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                  {space.features.slice(0, 3).map((f: string) => (
                    <span key={f} className="text-[10px] text-muted-foreground/60 font-medium">{f}</span>
                  ))}
                </div>
              </div>

              {/* Price + CTA */}
              <div className="flex items-end justify-between gap-3 pt-2.5 sm:pt-3 mt-2 border-t border-border/30">
                <div>
                  <p className="text-lg sm:text-xl font-extrabold text-foreground leading-none">
                    R$ {bp.total.toFixed(0)}
                    <span className="text-[10px] font-normal text-muted-foreground ml-1">total</span>
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {reservedVol} m³ × {days}d + taxa
                  </p>
                  {days > 1 && (
                    <p className="text-[10px] text-primary/70 font-medium">
                      ≈ R$ {bp.dailyRate.toFixed(2).replace(".", ",")}/m³/dia
                    </p>
                  )}
                </div>
                <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 sm:px-5 shadow-sm text-xs" onClick={onSelect}>
                  Ver detalhes
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SpaceCard;
