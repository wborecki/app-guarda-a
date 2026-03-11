import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin, Star, Ruler, Calendar, ArrowLeft, Shield, Clock,
  ChevronLeft, ChevronRight, Navigation, SlidersHorizontal,
  X, ChevronDown, Check, Info, Map as MapIcon, List, CheckCircle2
} from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState, useMemo, useRef, lazy, Suspense } from "react";
import { calculatePrice, getDailyRate, PRICING_HINT_SHORT } from "@/lib/pricing";

// Lazy-load map for performance
const SpaceMap = lazy(() => import("@/components/guardaai/SpaceMap"));
import type { MapSpace } from "@/components/guardaai/SpaceMap";

// Coherent photo sets
import garageA1 from "@/assets/spaces/garage-a1.jpg";
import garageA2 from "@/assets/spaces/garage-a2.jpg";
import garageA3 from "@/assets/spaces/garage-a3.jpg";
import roomA1 from "@/assets/spaces/room-a1.jpg";
import roomA2 from "@/assets/spaces/room-a2.jpg";
import roomA3 from "@/assets/spaces/room-a3.jpg";
import depositA1 from "@/assets/spaces/deposit-a1.jpg";
import depositA2 from "@/assets/spaces/deposit-a2.jpg";
import depositA3 from "@/assets/spaces/deposit-a3.jpg";
import coveredA1 from "@/assets/spaces/covered-a1.jpg";
import coveredA2 from "@/assets/spaces/covered-a2.jpg";
import coveredA3 from "@/assets/spaces/covered-a3.jpg";
import shedA1 from "@/assets/spaces/shed-a1.jpg";
import shedA2 from "@/assets/spaces/shed-a2.jpg";
import shedA3 from "@/assets/spaces/shed-a3.jpg";

// ─── City database with coordinates ───────────────────────────────
type CityData = {
  city: string;
  state: string;
  lat: number;
  lng: number;
  neighborhoods: { name: string; street: string; number: string; lat: number; lng: number }[];
};

const cityDatabase: Record<string, CityData> = {
  curitiba: {
    city: "Curitiba", state: "PR", lat: -25.4284, lng: -49.2733,
    neighborhoods: [
      { name: "Centro", street: "Rua Emiliano Perneta", number: "340", lat: -25.4290, lng: -49.2710 },
      { name: "Batel", street: "Rua Coronel Dulcídio", number: "185", lat: -25.4410, lng: -49.2890 },
      { name: "Água Verde", street: "Rua Brasílio Itiberê", number: "455", lat: -25.4500, lng: -49.2810 },
      { name: "Rebouças", street: "Rua Rockefeller", number: "72", lat: -25.4430, lng: -49.2660 },
      { name: "Alto da XV", street: "Rua Fernando Amaro", number: "290", lat: -25.4320, lng: -49.2550 },
      { name: "Juvevê", street: "Rua Augusto Stresser", number: "112", lat: -25.4170, lng: -49.2640 },
      { name: "Mercês", street: "Rua Jaime Reis", number: "540", lat: -25.4230, lng: -49.2830 },
      { name: "São Francisco", street: "Rua São Francisco", number: "88", lat: -25.4260, lng: -49.2750 },
    ],
  },
  "são paulo": {
    city: "São Paulo", state: "SP", lat: -23.5505, lng: -46.6333,
    neighborhoods: [
      { name: "Consolação", street: "Rua Augusta", number: "1200", lat: -23.5530, lng: -46.6560 },
      { name: "Bela Vista", street: "Rua Treze de Maio", number: "900", lat: -23.5600, lng: -46.6480 },
      { name: "Vila Mariana", street: "Rua Vergueiro", number: "3100", lat: -23.5850, lng: -46.6380 },
      { name: "Vila Madalena", street: "Rua Harmonia", number: "450", lat: -23.5500, lng: -46.6900 },
      { name: "Pinheiros", street: "Rua dos Pinheiros", number: "800", lat: -23.5660, lng: -46.6930 },
      { name: "Moema", street: "Av. Ibirapuera", number: "2120", lat: -23.6010, lng: -46.6600 },
      { name: "Itaim Bibi", street: "Rua João Cachoeira", number: "350", lat: -23.5820, lng: -46.6780 },
      { name: "Lapa", street: "Rua Guaicurus", number: "200", lat: -23.5260, lng: -46.7020 },
    ],
  },
  "rio de janeiro": {
    city: "Rio de Janeiro", state: "RJ", lat: -22.9068, lng: -43.1729,
    neighborhoods: [
      { name: "Copacabana", street: "Rua Barata Ribeiro", number: "300", lat: -22.9700, lng: -43.1860 },
      { name: "Botafogo", street: "Rua Voluntários da Pátria", number: "120", lat: -22.9510, lng: -43.1870 },
      { name: "Tijuca", street: "Rua Conde de Bonfim", number: "800", lat: -22.9280, lng: -43.2350 },
      { name: "Leblon", street: "Rua Dias Ferreira", number: "250", lat: -22.9830, lng: -43.2230 },
      { name: "Flamengo", street: "Rua Marquês de Abrantes", number: "150", lat: -22.9320, lng: -43.1760 },
      { name: "Ipanema", street: "Rua Visconde de Pirajá", number: "500", lat: -22.9840, lng: -43.2030 },
      { name: "Centro", street: "Av. Rio Branco", number: "100", lat: -22.9030, lng: -43.1770 },
      { name: "Lapa", street: "Rua do Lavradio", number: "80", lat: -22.9120, lng: -43.1830 },
    ],
  },
  "belo horizonte": {
    city: "Belo Horizonte", state: "MG", lat: -19.9167, lng: -43.9345,
    neighborhoods: [
      { name: "Savassi", street: "Rua Pernambuco", number: "1000", lat: -19.9360, lng: -43.9370 },
      { name: "Funcionários", street: "Rua Fernandes Tourinho", number: "350", lat: -19.9300, lng: -43.9310 },
      { name: "Lourdes", street: "Rua São Paulo", number: "1500", lat: -19.9270, lng: -43.9420 },
      { name: "Centro", street: "Av. Afonso Pena", number: "800", lat: -19.9190, lng: -43.9380 },
      { name: "Prado", street: "Rua Platina", number: "200", lat: -19.9380, lng: -43.9560 },
      { name: "Gutierrez", street: "Rua Araguari", number: "100", lat: -19.9430, lng: -43.9610 },
      { name: "Santa Efigênia", street: "Rua Pouso Alegre", number: "500", lat: -19.9230, lng: -43.9240 },
      { name: "Floresta", street: "Rua Salinas", number: "300", lat: -19.9150, lng: -43.9280 },
    ],
  },
};

const defaultCity: CityData = {
  city: "Sua região", state: "", lat: -25.4284, lng: -49.2733,
  neighborhoods: [
    { name: "Centro", street: "Rua Principal", number: "100", lat: -25.4290, lng: -49.2710 },
    { name: "Bairro Norte", street: "Av. Norte", number: "200", lat: -25.4200, lng: -49.2680 },
    { name: "Bairro Sul", street: "Rua Sul", number: "300", lat: -25.4380, lng: -49.2750 },
    { name: "Zona Leste", street: "Rua Leste", number: "400", lat: -25.4300, lng: -49.2600 },
    { name: "Vila Nova", street: "Av. Brasil", number: "500", lat: -25.4350, lng: -49.2800 },
    { name: "Bairro Alto", street: "Rua São José", number: "80", lat: -25.4150, lng: -49.2720 },
    { name: "Boa Vista", street: "Rua XV de Novembro", number: "300", lat: -25.4250, lng: -49.2650 },
    { name: "Industrial", street: "Rua dos Operários", number: "150", lat: -25.4450, lng: -49.2900 },
  ],
};

// ─── Space templates ───────────────────────────────────────────────
const spaceTemplates = [
  { name: "Garagem coberta disponível", type: "Garagem", area: 12, pricePerDay: 8, description: "Garagem residencial coberta com portão automático. Espaço limpo e seco, ideal para caixas, móveis e itens do dia a dia.", photos: [garageA1, garageA2, garageA3], features: ["Portão automático", "Câmeras", "Acesso fácil"] },
  { name: "Quarto extra em apartamento", type: "Quarto", area: 9, pricePerDay: 6, description: "Quarto vazio em apartamento com portaria e elevador. Ambiente fechado e arejado, perfeito para itens que precisam de cuidado.", photos: [roomA1, roomA2, roomA3], features: ["Portaria 24h", "Elevador", "Climatizado"] },
  { name: "Depósito organizado", type: "Depósito", area: 20, pricePerDay: 12, description: "Depósito com prateleiras metálicas e piso nivelado. Espaço prático para estoque, equipamentos ou volumes variados.", photos: [depositA1, depositA2, depositA3], features: ["Seguro incluso", "Acesso 24h", "Piso nivelado"] },
  { name: "Área coberta nos fundos", type: "Área coberta", area: 15, pricePerDay: 7, description: "Área coberta nos fundos de casa em bairro residencial. Ambiente arejado com acesso fácil para carga e descarga.", photos: [coveredA1, coveredA2, coveredA3], features: ["Ambiente seco", "Rua tranquila", "Fácil acesso"] },
  { name: "Galpão pequeno nos fundos", type: "Galpão", area: 25, pricePerDay: 15, description: "Galpão com pé direito alto e portão largo. Ideal para móveis maiores, equipamentos ou volumes grandes.", photos: [shedA1, shedA2, shedA3], features: ["Portão largo", "Pé direito alto", "Veículos entram"] },
];

const ownerProfiles = [
  { name: "Carlos M.", since: "2023", description: "Moro no bairro há 15 anos. Ofereço minha garagem extra." },
  { name: "Ana P.", since: "2022", description: "Tenho um quarto sobrando e resolvi ajudar quem precisa." },
  { name: "Roberto S.", since: "2021", description: "Disponibilizo meu depósito que não uso mais." },
  { name: "Mariana L.", since: "2023", description: "Minha área coberta fica vazia, então resolvi compartilhar." },
  { name: "João F.", since: "2022", description: "Tenho um galpão nos fundos, ideal para guardar coisas grandes." },
];

const reviewsPool = [
  { name: "Pedro A.", rating: 5, date: "2024-01-15", text: "Excelente espaço, muito seguro e organizado." },
  { name: "Lucia R.", rating: 5, date: "2024-02-20", text: "Guardei meus móveis sem problemas. Recomendo!" },
  { name: "Fernando G.", rating: 4, date: "2023-12-10", text: "Bom espaço, proprietário atencioso e pontual." },
  { name: "Sandra L.", rating: 5, date: "2024-02-05", text: "Ótimo local, exatamente como descrito no anúncio." },
  { name: "Diego C.", rating: 4, date: "2023-11-20", text: "Muito prático e bem localizado. Voltarei a usar." },
];

// ─── Smart badges logic ────────────────────────────────────────────
// HIERARCHY: Only ONE primary badge per card (the strongest differentiator)
type SmartBadge = { label: string; tier: "primary" };

function computePrimaryBadge(space: any, allSpaces: any[]): SmartBadge | null {
  // Priority order: best value → closest → best rated → large capacity
  const byPrice = [...allSpaces].sort((a, b) => a.pricePerDay - b.pricePerDay);
  if (byPrice[0]?.id === space.id) return { label: "Melhor custo", tier: "primary" };
  
  const byDist = [...allSpaces].sort((a, b) => a.distanceNum - b.distanceNum);
  if (byDist[0]?.id === space.id) return { label: "Mais próximo", tier: "primary" };
  
  const byRating = [...allSpaces].sort((a, b) => b.rating - a.rating);
  if (byRating[0]?.id === space.id) return { label: "Mais bem avaliado", tier: "primary" };
  
  if (space.area >= 20) return { label: "Grande capacidade", tier: "primary" };
  
  return null;
}

// Contextual one-liner — not a badge, just guidance text
function getUseCaseHint(type: string): string {
  switch (type) {
    case "Garagem": return "Ideal para mudanças e itens volumosos";
    case "Quarto": return "Perfeito para caixas e objetos pessoais";
    case "Depósito": return "Ótimo para estoque e equipamentos";
    case "Área coberta": return "Bom para itens que precisam de ventilação";
    case "Galpão": return "Para móveis grandes e volumes pesados";
    default: return "Espaço versátil para diversas necessidades";
  }
}


// ─── Helpers ───────────────────────────────────────────────────────
function detectCity(locationStr: string): CityData {
  const lower = locationStr.toLowerCase();
  for (const [key, data] of Object.entries(cityDatabase)) {
    if (lower.includes(key)) return data;
  }
  const parts = locationStr.split(",").map((s) => s.trim());
  if (parts.length >= 2) return { ...defaultCity, city: parts[1] || parts[0] };
  return { ...defaultCity, city: parts[0] || "Sua região" };
}

function shortenLocation(locationStr: string): string {
  if (!locationStr || locationStr === "Não informado") return "Não informado";
  const lower = locationStr.toLowerCase();
  for (const [key, data] of Object.entries(cityDatabase)) {
    if (lower.includes(key)) {
      const parts = locationStr.split(",").map((s) => s.trim()).filter(Boolean);
      for (const part of parts) {
        const partLower = part.toLowerCase();
        for (const n of data.neighborhoods) {
          if (partLower.includes(n.name.toLowerCase())) return `${n.name}, ${data.city}`;
        }
      }
      if (parts[0] && parts[0].length <= 35 && !parts[0].toLowerCase().includes(key)) return `${parts[0]} – ${data.city}`;
      return `Centro, ${data.city}`;
    }
  }
  const parts = locationStr.split(",").map((s) => s.trim()).filter(Boolean);
  if (parts.length >= 2) return `${parts[0]}, ${parts[1]}`;
  return parts[0] || locationStr;
}

function generateSpacesForCity(locationStr: string) {
  const cityData = detectCity(locationStr);
  const distances = [0.8, 1.4, 2.1, 3.2, 4.5];
  const ratings = [4.8, 4.9, 4.6, 5.0, 4.7];
  const reviewCounts = [23, 41, 15, 8, 19];

  return spaceTemplates.map((template, i) => {
    const neighborhood = cityData.neighborhoods[i % cityData.neighborhoods.length];
    const owner = ownerProfiles[i];
    return {
      id: i + 1, ...template,
      owner: owner.name, ownerPhoto: `https://i.pravatar.cc/100?img=${20 + i}`,
      ownerSince: owner.since, ownerDescription: owner.description,
      rating: ratings[i], reviews: reviewCounts[i],
      address: `${neighborhood.street}, ${neighborhood.number} – ${neighborhood.name}`,
      neighborhood: neighborhood.name, city: cityData.city,
      distance: `${distances[i]} km`, distanceNum: distances[i],
      reviewsList: reviewsPool.slice(0, 2 + (i % 2)),
      lat: neighborhood.lat,
      lng: neighborhood.lng,
    };
  });
}

// ─── Sort & Filter types ───────────────────────────────────────────
type SortOption = "proximity" | "price_asc" | "rating" | "area_desc" | "relevance";
const sortLabels: Record<SortOption, string> = {
  proximity: "Mais próximos",
  price_asc: "Menor preço",
  rating: "Melhor avaliação",
  area_desc: "Maior espaço",
  relevance: "Mais relevantes",
};

const spaceTypes = ["Garagem", "Quarto", "Depósito", "Área coberta", "Galpão"];
const distanceOptions = [
  { label: "Até 1 km", value: 1 },
  { label: "Até 3 km", value: 3 },
  { label: "Até 5 km", value: 5 },
  { label: "Até 10 km", value: 10 },
];
const ratingOptions = [
  { label: "4.0+", value: 4.0 },
  { label: "4.5+", value: 4.5 },
  { label: "4.8+", value: 4.8 },
];
const allFeatures = ["Câmeras", "Portão automático", "Acesso fácil", "Portaria 24h", "Elevador", "Climatizado", "Seguro incluso", "Piso nivelado", "Acesso 24h", "Ambiente seco", "Portão largo", "Pé direito alto"];

type Filters = {
  types: string[];
  maxPrice: number | null;
  maxDistance: number | null;
  minRating: number | null;
  features: string[];
};

const emptyFilters: Filters = { types: [], maxPrice: null, maxDistance: null, minRating: null, features: [] };

// ─── Dropdown component ────────────────────────────────────────────
const Dropdown = ({ label, isActive, children }: { label: string; isActive: boolean; children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-full border transition-colors whitespace-nowrap ${
          isActive
            ? "bg-primary/10 border-primary/30 text-primary"
            : "bg-card border-border/60 text-foreground hover:border-primary/30"
        }`}
      >
        {label}
        <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-1.5 bg-card border border-border rounded-xl shadow-lg z-30 min-w-[200px] p-2"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── CardCarousel ──────────────────────────────────────────────────
const CardCarousel = ({ photos, name }: { photos: string[]; name: string }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const scrollPrev = useCallback((e: React.MouseEvent) => { e.stopPropagation(); emblaApi?.scrollPrev(); }, [emblaApi]);
  const scrollNext = useCallback((e: React.MouseEvent) => { e.stopPropagation(); emblaApi?.scrollNext(); }, [emblaApi]);
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  return (
    <div className="relative group h-full">
      <div ref={emblaRef} className="overflow-hidden h-full">
        <div className="flex h-full">
          {photos.map((photo, i) => (
            <div key={i} className="flex-[0_0_100%] min-w-0 h-full">
              <img src={photo} alt={`${name} – ângulo ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
      <button onClick={scrollPrev} className="absolute left-1.5 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm" aria-label="Foto anterior"><ChevronLeft size={14} className="text-foreground" /></button>
      <button onClick={scrollNext} className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm" aria-label="Próxima foto"><ChevronRight size={14} className="text-foreground" /></button>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {photos.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all ${i === selectedIndex ? "bg-background w-3" : "bg-background/50 w-1.5"}`} />
        ))}
      </div>
    </div>
  );
};

// ─── Main component ────────────────────────────────────────────────
const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as {
    items?: any[]; location?: string; days?: number;
    totalVol?: number; estimatedPrice?: number; deliveryDate?: string;
    deliveryTime?: string; pickupDate?: string; pickupTime?: string;
  } | null;

  const days = state?.days || 1;
  const totalVol = state?.totalVol || 0;
  const userLocation = state?.location || "Não informado";
  const shortLocation = useMemo(() => shortenLocation(userLocation), [userLocation]);
  const allSpaces = useMemo(() => generateSpacesForCity(userLocation), [userLocation]);

  // ── State ──
  const [sortBy, setSortBy] = useState<SortOption>("proximity");
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [highlightedSpaceId, setHighlightedSpaceId] = useState<number | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "map">("list");
  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});

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
    return filteredSortedSpaces.map((s) => {
      const reservedVol = Math.max(totalVol, 1);
      const bp = calculatePrice(reservedVol, days);
      return {
        id: s.id,
        name: s.name,
        type: s.type,
        neighborhood: s.neighborhood,
        city: s.city,
        distance: s.distance,
        rating: s.rating,
        reviews: s.reviews,
        price: `R$ ${bp.subtotal.toFixed(0)}`,
        photo: s.photos[0],
        lat: s.lat,
        lng: s.lng,
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

  const toggleType = (t: string) => setFilters(f => ({ ...f, types: f.types.includes(t) ? f.types.filter(x => x !== t) : [...f.types, t] }));
  const toggleFeature = (feat: string) => setFilters(f => ({ ...f, features: f.features.includes(feat) ? f.features.filter(x => x !== feat) : [...f.features, feat] }));

  const handleSelect = (e: React.MouseEvent, space: (typeof allSpaces)[0]) => {
    e.stopPropagation();
    navigate(`/espaco/${space.id}`, { state: { space, simulation: state } });
  };

  const handleCardClick = (space: (typeof allSpaces)[0]) => {
    navigate(`/espaco/${space.id}`, { state: { space, simulation: state } });
  };

  const handlePinClick = (id: number) => {
    const space = filteredSortedSpaces.find((s) => s.id === id);
    if (space) {
      // On mobile map view, switch to list and scroll
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
  };

  // ── Filter panel content (shared desktop/mobile) ──
  const FilterContent = () => (
    <div className="space-y-5">
      <div>
        <h4 className="text-xs font-semibold text-foreground mb-2">Tipo de espaço</h4>
        <div className="flex flex-wrap gap-1.5">
          {spaceTypes.map(t => (
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

  // ─── RENDER ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ═══ STICKY HEADER ═══ */}
      <div className="bg-card border-b sticky top-0 z-20">
        <div className="container py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => window.history.length > 1 ? navigate(-1) : navigate("/")}><ArrowLeft size={20} /></Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-foreground">Espaços disponíveis</h1>
          </div>
          <span className="text-xs font-medium text-muted-foreground bg-secondary rounded-full px-2.5 py-1 hidden sm:block">
            {filteredSortedSpaces.length} resultado{filteredSortedSpaces.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* ═══ SEARCH SUMMARY BAR ═══ */}
      <div className="bg-card/80 backdrop-blur-sm border-b">
        <div className="container py-2.5">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
            <div className="flex items-center gap-1.5">
              <MapPin size={13} className="text-primary flex-shrink-0" />
              <span className="font-semibold text-foreground">{shortLocation}</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-border/60" />
            <div className="flex items-center gap-1.5">
              <Ruler size={13} className="text-primary flex-shrink-0" />
              <span className="text-muted-foreground">{totalVol.toFixed(1)} m³</span>
            </div>
            {state?.deliveryDate && state?.pickupDate && (
              <>
                <div className="hidden sm:block w-px h-4 bg-border/60" />
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-primary flex-shrink-0" />
                  <span className="text-muted-foreground text-xs">
                    {format(new Date(state.deliveryDate), "dd/MM", { locale: pt })}
                    {state.deliveryTime ? ` ${state.deliveryTime}` : ""}
                    {" → "}
                    {format(new Date(state.pickupDate), "dd/MM", { locale: pt })}
                    {state.pickupTime ? ` ${state.pickupTime}` : ""}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-xs font-bold">
                    {days} {days === 1 ? "dia" : "dias"}
                  </span>
                </div>
              </>
            )}
            {!(state?.deliveryDate && state?.pickupDate) && (
              <>
                <div className="hidden sm:block w-px h-4 bg-border/60" />
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">{days} {days === 1 ? "dia" : "dias"}</span>
                </div>
              </>
            )}
            <button
              onClick={() => window.history.length > 1 ? navigate(-1) : navigate("/")}
              className="ml-auto text-xs text-primary font-medium hover:underline hidden sm:block"
            >
              Editar busca
            </button>
          </div>
        </div>
      </div>

      {/* ═══ SORT + FILTER BAR ═══ */}
      <div className="bg-background border-b">
        <div className="container py-2.5 space-y-2">
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
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
                  {spaceTypes.map(t => (
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
              onClick={() => setMobileFiltersOpen(true)}
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

      {/* ═══ MAIN CONTENT: LIST + MAP ═══ */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* ── Results count bar ── */}
        <div className="lg:hidden container py-2 flex items-center justify-between border-b bg-background">
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <Navigation size={12} className="text-primary" />
            {filteredSortedSpaces.length} espaço{filteredSortedSpaces.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* ── LEFT: Card List ── */}
        <div className={`flex-1 lg:max-w-[55%] xl:max-w-[50%] overflow-y-auto ${mobileView === "map" ? "hidden lg:block" : ""}`}>
          <div className="container lg:pr-0 py-4 space-y-3">
            {/* Desktop result count */}
            <div className="hidden lg:flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Navigation size={12} className="text-primary" />
                {filteredSortedSpaces.length} espaço{filteredSortedSpaces.length !== 1 ? "s" : ""} · {sortLabels[sortBy].toLowerCase()}
              </span>
            </div>

            {filteredSortedSpaces.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                <p className="text-muted-foreground text-sm mb-2">Nenhum espaço encontrado com esses filtros.</p>
                <Button variant="outline" size="sm" onClick={clearAll}>Limpar filtros</Button>
              </motion.div>
            ) : (
              filteredSortedSpaces.map((space, index) => {
                const reservedVol = Math.max(totalVol, 1);
                const bp = calculatePrice(reservedVol, days);
                const isHighlighted = highlightedSpaceId === space.id;
                const badges = computeSmartBadges(space, filteredSortedSpaces, index);
                const useHint = getUseCaseHint(space.type);

                return (
                  <motion.div
                    key={space.id}
                    ref={(el) => { cardRefs.current[space.id] = el; }}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    onMouseEnter={() => setHighlightedSpaceId(space.id)}
                    onMouseLeave={() => setHighlightedSpaceId(null)}
                  >
                    <Card
                      className={`overflow-hidden transition-all cursor-pointer ${
                        isHighlighted
                          ? "shadow-lg ring-2 ring-primary/30 border-primary/40"
                          : "hover:shadow-md border-border/60"
                      }`}
                      onClick={() => handleCardClick(space)}
                    >
                      <CardContent className="p-0">
                        <div className="flex flex-col sm:flex-row">
                          <div className="sm:w-52 lg:w-48 xl:w-52 h-48 sm:h-auto bg-muted flex-shrink-0 relative">
                            <CardCarousel photos={space.photos} name={space.name} />
                            <div className="absolute top-2.5 left-2.5 bg-background/95 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1 shadow-sm">
                              <MapPin size={11} className="text-primary" />
                              <span className="text-xs font-bold text-foreground">{space.distance}</span>
                            </div>
                            {/* Smart badges */}
                            {badges.length > 0 && (
                              <div className="absolute top-2.5 right-2.5 flex flex-col gap-1">
                                {badges.map((b) => (
                                  <span key={b.label} className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm backdrop-blur-sm ${b.color}`}>
                                    {b.label}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 p-4 flex flex-col justify-between min-h-[170px]">
                            <div>
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-bold text-foreground text-sm leading-snug">{space.name}</h3>
                                  <p className="text-xs text-muted-foreground mt-0.5">{space.type} · {space.neighborhood}, {space.city}</p>
                                </div>
                                <div className="flex items-center gap-0.5 flex-shrink-0 bg-accent/10 rounded-md px-1.5 py-0.5">
                                  <Star size={11} className="text-accent fill-accent" />
                                  <span className="text-xs font-bold text-foreground">{space.rating}</span>
                                  <span className="text-[10px] text-muted-foreground">({space.reviews})</span>
                                </div>
                              </div>

                              {/* Use-case hint */}
                              <p className="text-[11px] text-primary/80 font-medium mb-2">{useHint}</p>

                              {/* Key metrics row */}
                              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                                <span className="flex items-center gap-1">
                                  <Ruler size={11} className="text-primary" />
                                  <span className="font-semibold text-foreground">{space.area} m³</span> disponível
                                </span>
                                <span className="text-border">•</span>
                                <span className="flex items-center gap-1">
                                  <Shield size={11} className="text-primary" />
                                  {space.owner}
                                </span>
                              </div>

                              {/* Feature chips */}
                              <div className="flex flex-wrap gap-1">
                                {space.features.slice(0, 3).map((f: string) => (
                                  <span key={f} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium flex items-center gap-0.5">
                                    <CheckCircle2 size={9} className="text-primary" />
                                    {f}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Price + CTA */}
                            <div className="flex items-end justify-between gap-3 pt-3 mt-2 border-t border-border/40">
                              <div>
                                <p className="text-xl font-extrabold text-foreground leading-none">
                                  R$ {bp.total.toFixed(0)}
                                  <span className="text-xs font-medium text-muted-foreground ml-1">total</span>
                                </p>
                                <p className="text-[10px] text-muted-foreground mt-0.5">
                                  {reservedVol} m³ × {days} {days === 1 ? "dia" : "dias"} + taxa
                                </p>
                                {days > 1 && (
                                  <p className="text-[10px] text-primary font-medium">
                                    ≈ R$ {bp.dailyRate.toFixed(2).replace(".", ",")}/m³/dia
                                  </p>
                                )}
                              </div>
                              <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-5 shadow-sm text-xs" onClick={(e) => handleSelect(e, space)}>
                                Ver detalhes
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            )}

            {/* Pricing hint */}
            {filteredSortedSpaces.length > 0 && (
              <div className="flex items-start gap-1.5 pt-2 justify-center">
                <Info size={11} className="text-muted-foreground/50 shrink-0 mt-0.5" />
                <p className="text-[10px] text-muted-foreground/60 text-center max-w-md">
                  {PRICING_HINT_SHORT} + taxa fixa de R$ 28,00 no checkout.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: Map (desktop always visible, mobile toggled) ── */}
        <div className={`lg:flex-1 lg:sticky lg:top-[105px] lg:h-[calc(100vh-105px)] ${mobileView === "list" ? "hidden lg:block" : "flex-1"}`}>
          <Suspense fallback={
            <div className="w-full h-full min-h-[400px] bg-muted flex items-center justify-center rounded-xl">
              <p className="text-sm text-muted-foreground">Carregando mapa...</p>
            </div>
          }>
            <SpaceMap
              spaces={mapSpaces}
              highlightedId={highlightedSpaceId}
              onPinHover={setHighlightedSpaceId}
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
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-foreground/40 z-40" onClick={() => setMobileFiltersOpen(false)} />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-2xl border-t max-h-[85vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-card z-10 p-4 pb-2 border-b border-border/40 flex items-center justify-between">
                <h3 className="font-bold text-foreground">Filtros</h3>
                <button onClick={() => setMobileFiltersOpen(false)} className="p-1 rounded-full hover:bg-secondary"><X size={18} className="text-muted-foreground" /></button>
              </div>
              <div className="p-4 pt-3">
                <FilterContent />
                <div className="flex gap-3 mt-6 pt-4 border-t border-border/40">
                  <Button variant="outline" className="flex-1" onClick={() => { clearAll(); setMobileFiltersOpen(false); }}>Limpar</Button>
                  <Button className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold" onClick={() => setMobileFiltersOpen(false)}>
                    Ver {filteredSortedSpaces.length} resultado{filteredSortedSpaces.length !== 1 ? "s" : ""}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchResults;
