import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Star, Ruler, Calendar, ArrowLeft, Shield, Clock, ChevronLeft, ChevronRight, Navigation } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState, useMemo } from "react";

// Coherent photo sets — each set shows the SAME space from different angles
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

// ─── City-aware neighborhood data ──────────────────────────────────
type CityData = {
  city: string;
  state: string;
  neighborhoods: { name: string; street: string; number: string }[];
};

const cityDatabase: Record<string, CityData> = {
  curitiba: {
    city: "Curitiba",
    state: "PR",
    neighborhoods: [
      { name: "Centro", street: "Rua Emiliano Perneta", number: "340" },
      { name: "Batel", street: "Rua Coronel Dulcídio", number: "185" },
      { name: "Água Verde", street: "Rua Brasílio Itiberê", number: "455" },
      { name: "Rebouças", street: "Rua Rockefeller", number: "72" },
      { name: "Alto da XV", street: "Rua Fernando Amaro", number: "290" },
      { name: "Juvevê", street: "Rua Augusto Stresser", number: "112" },
      { name: "Mercês", street: "Rua Jaime Reis", number: "540" },
      { name: "São Francisco", street: "Rua São Francisco", number: "88" },
    ],
  },
  "são paulo": {
    city: "São Paulo",
    state: "SP",
    neighborhoods: [
      { name: "Consolação", street: "Rua Augusta", number: "1200" },
      { name: "Bela Vista", street: "Rua Treze de Maio", number: "900" },
      { name: "Vila Mariana", street: "Rua Vergueiro", number: "3100" },
      { name: "Vila Madalena", street: "Rua Harmonia", number: "450" },
      { name: "Pinheiros", street: "Rua Cardeal Arcoverde", number: "800" },
      { name: "Perdizes", street: "Rua Monte Alegre", number: "220" },
      { name: "Lapa", street: "Rua Clélia", number: "315" },
      { name: "Mooca", street: "Rua da Mooca", number: "1500" },
    ],
  },
  "rio de janeiro": {
    city: "Rio de Janeiro",
    state: "RJ",
    neighborhoods: [
      { name: "Botafogo", street: "Rua Voluntários da Pátria", number: "340" },
      { name: "Tijuca", street: "Rua Conde de Bonfim", number: "700" },
      { name: "Copacabana", street: "Rua Barata Ribeiro", number: "500" },
      { name: "Méier", street: "Rua Dias da Cruz", number: "220" },
      { name: "Vila Isabel", street: "Boulevard Vinte e Oito de Setembro", number: "100" },
      { name: "Laranjeiras", street: "Rua das Laranjeiras", number: "410" },
      { name: "Flamengo", street: "Rua Marquês de Abrantes", number: "180" },
      { name: "Maracanã", street: "Rua São Francisco Xavier", number: "95" },
    ],
  },
  "belo horizonte": {
    city: "Belo Horizonte",
    state: "MG",
    neighborhoods: [
      { name: "Savassi", street: "Rua Pernambuco", number: "1000" },
      { name: "Funcionários", street: "Rua Gonçalves Dias", number: "300" },
      { name: "Serra", street: "Rua do Ouro", number: "150" },
      { name: "Santo Antônio", street: "Rua Aimorés", number: "420" },
      { name: "Lourdes", street: "Rua Curitiba", number: "700" },
      { name: "Centro", street: "Avenida Afonso Pena", number: "1500" },
      { name: "Floresta", street: "Rua Pouso Alegre", number: "230" },
      { name: "Santa Tereza", street: "Rua Mármore", number: "80" },
    ],
  },
};

const defaultCity: CityData = {
  city: "Sua região",
  state: "",
  neighborhoods: [
    { name: "Centro", street: "Rua Principal", number: "100" },
    { name: "Jardim América", street: "Rua das Flores", number: "250" },
    { name: "Vila Nova", street: "Av. Brasil", number: "500" },
    { name: "Bairro Alto", street: "Rua São José", number: "80" },
    { name: "Boa Vista", street: "Rua XV de Novembro", number: "300" },
    { name: "Industrial", street: "Rua dos Operários", number: "150" },
    { name: "Jardim Europa", street: "Rua Portugal", number: "420" },
    { name: "Santa Cruz", street: "Rua Santa Cruz", number: "60" },
  ],
};

// ─── Space templates with coherent photo sets ──────────────────────
const spaceTemplates = [
  {
    name: "Garagem coberta disponível",
    type: "Garagem",
    area: 12,
    pricePerDay: 8,
    description: "Garagem residencial coberta com portão automático. Espaço limpo e seco, ideal para caixas, móveis e itens do dia a dia.",
    photos: [garageA1, garageA2, garageA3],
    features: ["Portão automático", "Câmeras", "Acesso fácil"],
  },
  {
    name: "Quarto extra em apartamento",
    type: "Quarto",
    area: 9,
    pricePerDay: 6,
    description: "Quarto vazio em apartamento com portaria e elevador. Ambiente fechado e arejado, perfeito para itens que precisam de cuidado.",
    photos: [roomA1, roomA2, roomA3],
    features: ["Portaria 24h", "Elevador", "Climatizado"],
  },
  {
    name: "Depósito organizado",
    type: "Depósito",
    area: 20,
    pricePerDay: 12,
    description: "Depósito com prateleiras metálicas e piso nivelado. Espaço prático para estoque, equipamentos ou volumes variados.",
    photos: [depositA1, depositA2, depositA3],
    features: ["Seguro incluso", "Acesso 24h", "Piso nivelado"],
  },
  {
    name: "Área coberta nos fundos",
    type: "Área coberta",
    area: 15,
    pricePerDay: 7,
    description: "Área coberta nos fundos de casa em bairro residencial. Ambiente arejado com acesso fácil para carga e descarga.",
    photos: [coveredA1, coveredA2, coveredA3],
    features: ["Ambiente seco", "Rua tranquila", "Fácil acesso"],
  },
  {
    name: "Galpão pequeno nos fundos",
    type: "Galpão",
    area: 25,
    pricePerDay: 15,
    description: "Galpão com pé direito alto e portão largo. Ideal para móveis maiores, equipamentos ou volumes grandes.",
    photos: [shedA1, shedA2, shedA3],
    features: ["Portão largo", "Pé direito alto", "Veículos entram"],
  },
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

// ─── Detect city from user location string ─────────────────────────
function detectCity(locationStr: string): CityData {
  const lower = locationStr.toLowerCase();
  for (const [key, data] of Object.entries(cityDatabase)) {
    if (lower.includes(key)) return data;
  }
  const parts = locationStr.split(",").map((s) => s.trim());
  if (parts.length >= 2) {
    return { ...defaultCity, city: parts[1] || parts[0] };
  }
  return { ...defaultCity, city: parts[0] || "Sua região" };
}

// ─── Shorten location for display ──────────────────────────────────
function shortenLocation(locationStr: string): string {
  if (!locationStr || locationStr === "Não informado") return "Não informado";

  const lower = locationStr.toLowerCase();

  // Try known cities first
  for (const [key, data] of Object.entries(cityDatabase)) {
    if (lower.includes(key)) {
      // Try to extract a neighborhood or street from the original string
      const parts = locationStr.split(",").map((s) => s.trim()).filter(Boolean);

      // Look for a neighborhood match in the parts
      for (const part of parts) {
        const partLower = part.toLowerCase();
        for (const n of data.neighborhoods) {
          if (partLower.includes(n.name.toLowerCase())) {
            return `${n.name}, ${data.city}`;
          }
        }
      }

      // If first part looks like a street (short enough), use it
      if (parts[0] && parts[0].length <= 35 && !parts[0].toLowerCase().includes(key)) {
        return `${parts[0]} – ${data.city}`;
      }

      return `Centro, ${data.city}`;
    }
  }

  // Generic: first 2 meaningful parts
  const parts = locationStr.split(",").map((s) => s.trim()).filter(Boolean);
  if (parts.length >= 3) return `${parts[0]}, ${parts[1]}`;
  if (parts.length >= 2) return `${parts[0]}, ${parts[1]}`;
  return parts[0] || locationStr;
}

// ─── Generate mock spaces for a city ───────────────────────────────
function generateSpacesForCity(locationStr: string) {
  const cityData = detectCity(locationStr);
  const distances = [0.8, 1.4, 2.1, 3.2, 4.5];
  const ratings = [4.8, 4.9, 4.6, 5.0, 4.7];
  const reviewCounts = [23, 41, 15, 8, 19];

  return spaceTemplates.map((template, i) => {
    const neighborhood = cityData.neighborhoods[i % cityData.neighborhoods.length];
    const owner = ownerProfiles[i];
    return {
      id: i + 1,
      ...template,
      owner: owner.name,
      ownerPhoto: `https://i.pravatar.cc/100?img=${20 + i}`,
      ownerSince: owner.since,
      ownerDescription: owner.description,
      rating: ratings[i],
      reviews: reviewCounts[i],
      address: `${neighborhood.street}, ${neighborhood.number} – ${neighborhood.name}`,
      neighborhood: neighborhood.name,
      city: cityData.city,
      distance: `${distances[i]} km`,
      distanceNum: distances[i],
      reviewsList: reviewsPool.slice(0, 2 + (i % 2)),
    };
  }).sort((a, b) => a.distanceNum - b.distanceNum);
}

// ─── Mini carousel component ───────────────────────────────────────
const CardCarousel = ({ photos, name }: { photos: string[]; name: string }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    emblaApi?.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  return (
    <div className="relative group h-full">
      <div ref={emblaRef} className="overflow-hidden h-full rounded-l-lg sm:rounded-l-lg rounded-r-none">
        <div className="flex h-full">
          {photos.map((photo, i) => (
            <div key={i} className="flex-[0_0_100%] min-w-0 h-full">
              <img src={photo} alt={`${name} – ângulo ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={scrollPrev}
        className="absolute left-1.5 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
        aria-label="Foto anterior"
      >
        <ChevronLeft size={14} className="text-foreground" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
        aria-label="Próxima foto"
      >
        <ChevronRight size={14} className="text-foreground" />
      </button>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {photos.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === selectedIndex ? "bg-background w-3" : "bg-background/50 w-1.5"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// ─── Main component ────────────────────────────────────────────────
const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const state = location.state as {
    items?: any[];
    location?: string;
    days?: number;
    totalArea?: number;
    totalVol?: number;
    estimatedPrice?: number;
    deliveryDate?: string;
    deliveryTime?: string;
    pickupDate?: string;
    pickupTime?: string;
  } | null;

  const days = state?.days || 1;
  const totalArea = state?.totalArea || 0;
  const userLocation = state?.location || "Não informado";
  const shortLocation = useMemo(() => shortenLocation(userLocation), [userLocation]);

  const spaces = useMemo(() => generateSpacesForCity(userLocation), [userLocation]);

  const handleSelect = (e: React.MouseEvent, spaceId: number) => {
    e.stopPropagation();
    toast({
      title: "Em breve!",
      description: "O fluxo de contratação estará disponível em breve. Obrigado pelo interesse!",
    });
  };

  const handleCardClick = (space: (typeof spaces)[0]) => {
    navigate(`/espaco/${space.id}`, { state: { space, simulation: state } });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b sticky top-0 z-10">
        <div className="container py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-foreground">Espaços disponíveis</h1>
            <p className="text-sm text-muted-foreground truncate">
              {shortLocation} · {totalArea.toFixed(1)} m² · {days} {days === 1 ? "dia" : "dias"}
            </p>
          </div>
          <span className="text-xs font-medium text-muted-foreground bg-secondary rounded-full px-2.5 py-1 hidden sm:block">
            {spaces.length} resultados
          </span>
        </div>
      </div>

      <div className="container py-6 md:py-8 max-w-3xl">
        {/* Summary bar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 p-3 md:p-4 rounded-xl bg-primary-light border border-primary/15"
        >
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <div className="flex items-center gap-1.5">
              <MapPin size={14} className="text-primary flex-shrink-0" />
              <span className="text-foreground font-semibold">{shortLocation}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Ruler size={14} className="text-primary flex-shrink-0" />
              <span className="text-muted-foreground">{totalArea.toFixed(1)} m²</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-primary flex-shrink-0" />
              <span className="text-muted-foreground">{days} {days === 1 ? "dia" : "dias"}</span>
            </div>
            {state?.deliveryDate && (
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-primary flex-shrink-0" />
                <span className="text-muted-foreground">
                  {format(new Date(state.deliveryDate), "dd/MM", { locale: pt })} {state.deliveryTime}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Sort label */}
        <div className="flex items-center gap-1.5 mb-4">
          <Navigation size={12} className="text-primary" />
          <span className="text-xs font-medium text-muted-foreground">Espaços mais próximos de você</span>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {spaces.map((space, index) => {
            const totalPrice = space.pricePerDay * days;
            return (
              <motion.div
                key={space.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
              >
                <Card
                  className="overflow-hidden hover:shadow-md transition-all cursor-pointer border-border/60"
                  onClick={() => handleCardClick(space)}
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      {/* Photo */}
                      <div className="sm:w-56 h-48 sm:h-auto bg-muted flex-shrink-0 relative">
                        <CardCarousel photos={space.photos} name={space.name} />
                        {/* Distance badge */}
                        <div className="absolute top-2.5 left-2.5 bg-background/95 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1 shadow-sm">
                          <MapPin size={11} className="text-primary" />
                          <span className="text-xs font-bold text-foreground">{space.distance}</span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between min-h-[180px]">
                        {/* Top */}
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <h3 className="font-bold text-foreground text-[15px] leading-snug">{space.name}</h3>
                            <div className="flex items-center gap-0.5 flex-shrink-0 bg-accent/10 rounded-md px-1.5 py-0.5">
                              <Star size={12} className="text-accent fill-accent" />
                              <span className="text-sm font-bold text-foreground">{space.rating}</span>
                              <span className="text-[10px] text-muted-foreground">({space.reviews})</span>
                            </div>
                          </div>

                          <p className="text-xs text-muted-foreground mb-3">
                            {space.type} · {space.area} m² · {space.neighborhood}, {space.city}
                          </p>

                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {space.features.map((f) => (
                              <span
                                key={f}
                                className="text-[11px] px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground font-medium"
                              >
                                {f}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Bottom */}
                        <div className="flex items-end justify-between gap-3 pt-2 border-t border-border/40">
                          <div>
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <Shield size={12} className="text-primary" />
                              <span className="text-xs text-muted-foreground font-medium">{space.owner}</span>
                            </div>
                            <p className="text-xl font-extrabold text-foreground leading-none">
                              R$ {totalPrice.toFixed(0)}
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              {days} {days === 1 ? "dia" : "dias"} · R$ {space.pricePerDay}/dia
                            </p>
                          </div>
                          <Button
                            size="sm"
                            className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-5 shadow-sm"
                            onClick={(e) => handleSelect(e, space.id)}
                          >
                            Selecionar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
