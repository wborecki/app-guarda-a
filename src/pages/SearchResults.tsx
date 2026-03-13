import SEO from "@/components/SEO";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  MapPin, Ruler, Calendar, Navigation, Info, Map as MapIcon, List, Pencil, Clock,
} from "lucide-react";
import BackButton from "@/components/guardaai/BackButton";
import { useEffect, useState, useMemo, useRef, useCallback, lazy, Suspense } from "react";
import { calculatePrice, PRICING_HINT_SHORT } from "@/lib/pricing";
import { getDailyRate } from "@/lib/pricing";
import { supabase } from "@/integrations/supabase/client";
import { decodeSearchParams } from "@/lib/searchParams";
import {
  type SortOption, type Filters,
  sortLabels, emptyFilters,
  shortenLocation, generateSpacesForCity,
} from "@/data/searchMockData";

// Components
import SpaceCard from "@/components/guardaai/search/SpaceCard";
import FilterBar from "@/components/guardaai/search/FilterBar";
import MobileFilterDrawer from "@/components/guardaai/search/MobileFilterDrawer";
import { SearchCardSkeletonList } from "@/components/guardaai/skeletons/SearchCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy-load map for performance
const SpaceMap = lazy(() => import("@/components/guardaai/SpaceMap"));
import type { MapSpace } from "@/components/guardaai/SpaceMap";

// Map skeleton for loading state
const MapSkeleton = () => (
  <div className="w-full h-full min-h-[400px] bg-muted relative overflow-hidden rounded-xl">
    <Skeleton className="absolute inset-0 rounded-xl" />
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
      <div className="w-10 h-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      <p className="text-xs font-medium text-muted-foreground">Carregando mapa…</p>
    </div>
    {/* Fake pin placeholders */}
    <div className="absolute top-1/3 left-1/4 w-5 h-6 rounded-full bg-muted-foreground/10" />
    <div className="absolute top-1/2 right-1/3 w-5 h-6 rounded-full bg-muted-foreground/10" />
    <div className="absolute bottom-1/3 left-1/2 w-5 h-6 rounded-full bg-muted-foreground/10" />
  </div>
);

// ─── Main component ────────────────────────────────────────────────
const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Decode params from URL (with location.state fallback for backward compat)
  const params = useMemo(
    () => decodeSearchParams(searchParams.toString(), location.state),
    [searchParams, location.state]
  );

  const { days, hours = 0, totalVol, location: userLocation, deliveryDate, deliveryTime, pickupDate, pickupTime } = params;
  const isHourly = days === 0 && hours > 0;
  const shortLocation = useMemo(() => shortenLocation(userLocation), [userLocation]);
  const templateSpaces = useMemo(() => generateSpacesForCity(userLocation), [userLocation]);

  // Resolve photo URL — handles storage paths and full URLs
  const resolvePhotoUrl = (path: string) => {
    if (!path || path === "/placeholder.svg") return "/placeholder.svg";
    if (path.startsWith("http")) return path;
    // Storage path — build public URL
    const { data } = supabase.storage.from("space-photos").getPublicUrl(path);
    return data?.publicUrl || "/placeholder.svg";
  };

  // Fetch real published spaces from database
  const [dbSpaces, setDbSpaces] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasRealSpaces, setHasRealSpaces] = useState(false);

  useEffect(() => {
    const fetchPublished = async () => {
      setIsLoading(true);
      const { data } = await supabase
        .from("spaces")
        .select("*")
        .eq("status", "published");

      if (!data || data.length === 0) {
        setDbSpaces([]);
        setHasRealSpaces(false);
        setIsLoading(false);
        return;
      }

      const typeMap: Record<string, string> = {
        garagem: "Garagem", quarto: "Quarto", deposito: "Depósito",
        "area-coberta": "Área coberta", galpao: "Galpão", comercial: "Espaço comercial",
      };

      const mapped = data.map((s, i) => {
        const locParts = (s.location || "").split(",").map((p: string) => p.trim());
        const neighborhood = locParts[0] || "Centro";
        const city = locParts.length >= 4 ? locParts[3] : locParts[1] || "";
        const vol = s.volume || ((s.width || 0) * (s.length || 0) * (s.height || 0)) || 0;
        const dailyRate = getDailyRate(Math.max(vol, 1));

        const photos = (s.photos && s.photos.length > 0)
          ? s.photos.map((p: string) => resolvePhotoUrl(p))
          : ["/placeholder.svg"];

        return {
          id: `db-${s.id}`,
          dbId: s.id,
          hostId: s.user_id,
          name: s.description?.split(".")[0]?.slice(0, 40) || `${typeMap[s.space_type] || s.space_type} disponível`,
          type: typeMap[s.space_type] || s.space_type || "Espaço",
          area: Number(vol) || 8,
          pricePerDay: dailyRate,
          description: s.description || "Espaço disponível para guardar seus itens com segurança.",
          photos,
          features: [
            s.covered ? "Coberto" : null,
            s.closed ? "Fechado" : null,
            s.easy_access ? "Fácil acesso" : null,
            s.security_features ? s.security_features.split(",")[0]?.trim() : null,
          ].filter(Boolean) as string[],
          owner: "Anfitrião",
          ownerPhoto: `https://i.pravatar.cc/100?img=${30 + i}`,
          ownerSince: new Date(s.created_at).getFullYear().toString(),
          ownerDescription: "Anfitrião verificado na plataforma.",
          rating: 0,
          reviews: 0,
          address: neighborhood,
          neighborhood,
          city,
          distance: "—",
          distanceNum: 999,
          reviewsList: [],
          lat: 0,
          lng: 0,
          isReal: true,
          rental_type: (s as any).rental_type || "daily",
          availability_schedule: (s as any).availability_schedule || {},
        };
      });
      setDbSpaces(mapped);
      setHasRealSpaces(true);
      setIsLoading(false);
    };
    fetchPublished();
  }, []);

  // Show real spaces when available, fall back to mock with a notice
  const allSpaces = useMemo(
    () => (hasRealSpaces ? dbSpaces : templateSpaces),
    [dbSpaces, templateSpaces, hasRealSpaces]
  );

  // ── State ──
  const [sortBy, setSortBy] = useState<SortOption>("proximity");
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [highlightedSpaceId, setHighlightedSpaceId] = useState<number | string | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "map">("list");
  const cardRefs = useRef<Record<number | string, HTMLDivElement | null>>({});

  // ── Filter + Sort logic ──
  const filteredSortedSpaces = useMemo(() => {
    let result = [...allSpaces];
    if (filters.types.length > 0) result = result.filter(s => filters.types.includes(s.type));
    if (filters.maxPrice !== null) result = result.filter(s => calculatePrice(Math.max(totalVol, 1), days).subtotal <= filters.maxPrice!);
    if (filters.maxDistance !== null) result = result.filter(s => s.distanceNum <= filters.maxDistance!);
    if (filters.minRating !== null) result = result.filter(s => s.rating >= filters.minRating!);
    if (filters.features.length > 0) result = result.filter(s => filters.features.every(f => s.features.includes(f)));

    switch (sortBy) {
      case "proximity": result.sort((a, b) => a.distanceNum - b.distanceNum); break;
      case "price_asc": result.sort((a, b) => a.area - b.area); break;
      case "rating": result.sort((a, b) => b.rating - a.rating); break;
      case "area_desc": result.sort((a, b) => b.area - a.area); break;
      case "relevance": result.sort((a, b) => (b.rating * b.reviews) - (a.rating * a.reviews)); break;
    }
    return result;
  }, [allSpaces, sortBy, filters, days, totalVol]);

  // ── Map spaces ──
  const mapSpaces: MapSpace[] = useMemo(() => {
    return filteredSortedSpaces
      .filter((s) => s.lat !== 0 && s.lng !== 0)
      .map((s) => {
        const reservedVol = Math.max(totalVol, 1);
        const bp = calculatePrice(reservedVol, days);
        return {
          id: s.id, name: s.name, type: s.type,
          neighborhood: s.neighborhood, city: s.city, distance: s.distance,
          rating: s.rating, reviews: s.reviews,
          price: `R$ ${bp.subtotal.toFixed(0)}`,
          photo: s.photos[0], lat: s.lat, lng: s.lng,
        };
      });
  }, [filteredSortedSpaces, totalVol, days]);

  // ── Active filter chips ──
  const activeFilterChips = useMemo(() => {
    const chips: { label: string; clear: () => void }[] = [];
    filters.types.forEach(t => chips.push({ label: t, clear: () => setFilters(f => ({ ...f, types: f.types.filter(x => x !== t) })) }));
    if (filters.maxDistance !== null) chips.push({ label: `Até ${filters.maxDistance} km`, clear: () => setFilters(f => ({ ...f, maxDistance: null })) });
    if (filters.minRating !== null) chips.push({ label: `${filters.minRating}+`, clear: () => setFilters(f => ({ ...f, minRating: null })) });
    if (filters.maxPrice !== null) chips.push({ label: `Até R$${filters.maxPrice}`, clear: () => setFilters(f => ({ ...f, maxPrice: null })) });
    filters.features.forEach(feat => chips.push({ label: feat, clear: () => setFilters(f => ({ ...f, features: f.features.filter(x => x !== feat) })) }));
    return chips;
  }, [filters]);

  const hasActiveFilters = activeFilterChips.length > 0;
  const clearAll = () => setFilters(emptyFilters);

  const handleSelect = useCallback((e: React.MouseEvent, space: any) => {
    e.stopPropagation();
    navigate(`/espaco/${space.id}`, { state: { space, simulation: params } });
  }, [navigate, params]);

  const handleCardClick = useCallback((space: any) => {
    navigate(`/espaco/${space.id}`, { state: { space, simulation: params } });
  }, [navigate, params]);

  const handlePinHover = useCallback((id: number | string | null) => {
    setHighlightedSpaceId(id);
  }, []);

  const handlePinClick = useCallback((id: number | string) => {
    const space = filteredSortedSpaces.find((s) => s.id === id);
    if (space) {
      if (mobileView === "map") {
        setMobileView("list");
        setTimeout(() => {
          cardRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "center" });
          setHighlightedSpaceId(id);
        }, 300);
      } else {
        cardRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "center" });
        setHighlightedSpaceId(id);
      }
    }
  }, [filteredSortedSpaces, mobileView]);

  // ─── RENDER ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
      <SEO title={`Espaços em ${shortLocation}`} description={`Encontre espaços para guardar ${totalVol.toFixed(1)} m³ em ${shortLocation}. Compare preços e reserve online.`} canonical="/buscar" />

      {/* ═══ STICKY HEADER ═══ */}
      <div className="bg-card border-b sticky top-0 z-20">
        <div className="container py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3">
          <BackButton label="Início" fallbackTo="/" />
          <div className="flex-1 min-w-0">
            <h1 className="text-sm sm:text-base font-bold text-foreground truncate">Espaços disponíveis</h1>
          </div>
          <span className="text-[11px] font-medium text-muted-foreground bg-secondary rounded-full px-2 py-0.5 sm:px-2.5 sm:py-1">
            {filteredSortedSpaces.length} resultado{filteredSortedSpaces.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* ═══ SEARCH SUMMARY BAR — compact on mobile ═══ */}
      <div className="bg-card/80 backdrop-blur-sm border-b">
        <div className="container py-2 sm:py-2.5">
          <div className="flex items-center gap-2 sm:gap-x-4 text-xs sm:text-sm overflow-x-auto scrollbar-hide overscroll-x-contain">
            <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
              <MapPin size={12} className="text-primary flex-shrink-0" />
              <span className="font-semibold text-foreground truncate max-w-[120px] sm:max-w-none">{shortLocation}</span>
            </div>
            <div className="w-px h-3 sm:h-4 bg-border/60 flex-shrink-0" />
            <div className="flex items-center gap-1 flex-shrink-0">
              <Ruler size={12} className="text-primary flex-shrink-0" />
              <span className="text-muted-foreground">{totalVol.toFixed(1)} m³</span>
            </div>
            <div className="w-px h-3 sm:h-4 bg-border/60 flex-shrink-0" />
            {deliveryDate && pickupDate ? (
              <div className="flex items-center gap-1 flex-shrink-0">
                <Calendar size={12} className="text-primary flex-shrink-0" />
                <span className="text-muted-foreground">
                  {format(new Date(deliveryDate), "dd/MM", { locale: pt })}
                  {" → "}
                  {format(new Date(pickupDate), "dd/MM", { locale: pt })}
                </span>
                {isHourly ? (
                  <span className="px-1.5 py-0.5 rounded bg-accent/10 text-accent text-[10px] sm:text-xs font-bold flex items-center gap-0.5">
                    <Clock size={9} /> {hours}h
                  </span>
                ) : (
                  <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] sm:text-xs font-bold">
                    {days}d
                  </span>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1 flex-shrink-0">
                <Calendar size={12} className="text-primary flex-shrink-0" />
                <span className="text-muted-foreground">
                  {isHourly ? `${hours} hora${hours > 1 ? "s" : ""}` : `${days} ${days === 1 ? "dia" : "dias"}`}
                </span>
              </div>
            )}
            <button
              onClick={() => window.history.length > 2 ? navigate(-1) : navigate("/")}
              className="ml-auto flex items-center gap-1 text-[11px] sm:text-xs text-primary font-medium hover:underline flex-shrink-0"
            >
              <Pencil size={10} />
              <span className="hidden sm:inline">Editar busca</span>
              <span className="sm:hidden">Editar</span>
            </button>
          </div>
        </div>
      </div>

      {/* ═══ DEMO NOTICE (when no real spaces) ═══ */}
      {!isLoading && !hasRealSpaces && (
        <div className="bg-accent/10 border-b border-accent/20">
          <div className="container py-2 flex items-center gap-2 text-xs text-accent">
            <Info size={13} className="flex-shrink-0" />
            <span>Exibindo espaços de exemplo. Quando anfitriões publicarem espaços reais, eles aparecerão aqui.</span>
          </div>
        </div>
      )}

      {/* ═══ SORT + FILTER BAR ═══ */}
      <FilterBar
        sortBy={sortBy}
        setSortBy={setSortBy}
        filters={filters}
        setFilters={setFilters}
        activeFilterChips={activeFilterChips}
        hasActiveFilters={hasActiveFilters}
        clearAll={clearAll}
        onOpenMobileFilters={() => setMobileFiltersOpen(true)}
      />

      {/* ═══ MAIN CONTENT: LIST + MAP ═══ */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* ── LEFT: Card List ── */}
        <div className={`flex-1 lg:max-w-[55%] xl:max-w-[50%] overflow-y-auto ${mobileView === "map" ? "hidden lg:block" : ""}`}>
          <div className="container lg:pr-0 py-3 sm:py-4 space-y-2.5 sm:space-y-3">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[11px] sm:text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Navigation size={12} className="text-primary" />
                {filteredSortedSpaces.length} espaço{filteredSortedSpaces.length !== 1 ? "s" : ""}
                <span className="hidden sm:inline"> · {sortLabels[sortBy].toLowerCase()}</span>
              </span>
            </div>

            {isLoading ? (
              <SearchCardSkeletonList count={4} />
            ) : filteredSortedSpaces.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                <p className="text-muted-foreground text-sm mb-2">Nenhum espaço encontrado com esses filtros.</p>
                <Button variant="outline" size="sm" onClick={clearAll}>Limpar filtros</Button>
              </motion.div>
            ) : (
              filteredSortedSpaces.map((space, index) => (
                <SpaceCard
                  key={space.id}
                  space={space}
                  allSpaces={filteredSortedSpaces}
                  totalVol={totalVol}
                  days={days}
                  hours={hours}
                  index={index}
                  isHighlighted={highlightedSpaceId === space.id}
                  onMouseEnter={() => setHighlightedSpaceId(space.id)}
                  onMouseLeave={() => setHighlightedSpaceId(null)}
                  onClick={() => handleCardClick(space)}
                  onSelect={(e) => handleSelect(e, space)}
                  cardRef={(el) => { cardRefs.current[space.id] = el; }}
                />
              ))
            )}

            {filteredSortedSpaces.length > 0 && (
              <div className="flex items-start gap-1.5 pt-2 pb-16 sm:pb-2 justify-center">
                <Info size={11} className="text-muted-foreground/50 shrink-0 mt-0.5" />
                <p className="text-[10px] text-muted-foreground/60 text-center max-w-md">
                  {PRICING_HINT_SHORT} + taxa fixa de R$ 28,00 no checkout.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: Map ── */}
        <div className={`lg:flex-1 lg:sticky lg:top-[105px] lg:h-[calc(100vh-105px)] ${mobileView === "list" ? "hidden lg:block" : "flex-1"}`}>
          <Suspense fallback={<MapSkeleton />}>
            <SpaceMap
              spaces={mapSpaces}
              highlightedId={highlightedSpaceId}
              onPinHover={handlePinHover}
              onPinClick={handlePinClick}
              className="h-full w-full lg:rounded-none"
            />
          </Suspense>
        </div>
      </div>

      {/* ═══ MOBILE: View toggle FAB ═══ */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 lg:hidden">
        <button
          onClick={() => setMobileView(mobileView === "list" ? "map" : "list")}
          className="flex items-center gap-2 bg-foreground text-background px-5 py-3 rounded-full shadow-xl font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          {mobileView === "list" ? (
            <><MapIcon size={16} /> Ver mapa</>
          ) : (
            <><List size={16} /> Ver lista</>
          )}
        </button>
      </div>

      {/* ═══ Mobile Filter Drawer ═══ */}
      <MobileFilterDrawer
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        filters={filters}
        setFilters={setFilters}
        clearAll={clearAll}
        resultCount={filteredSortedSpaces.length}
      />
    </div>
  );
};

export default SearchResults;
