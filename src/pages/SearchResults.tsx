import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Star, Ruler, Calendar, ArrowLeft, Shield, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

const mockSpaces = [
  {
    id: 1,
    name: "Garagem coberta espaçosa",
    owner: "Carlos M.",
    ownerPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    ownerSince: "2023",
    ownerDescription: "Moro no bairro há 15 anos. Ofereço minha garagem extra para quem precisa de um espaço seguro.",
    rating: 4.8,
    reviews: 23,
    type: "Garagem",
    address: "Rua Augusta, 1200 - Consolação",
    distance: "1.2 km",
    area: 12,
    pricePerDay: 8,
    description: "Garagem ampla e coberta com portão automático, ideal para guardar móveis, caixas e itens maiores. Ambiente seco e seguro com câmeras de monitoramento 24h.",
    photos: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
    ],
    features: ["Portão automático", "Câmeras 24h", "Acesso fácil"],
    reviewsList: [
      { name: "Pedro A.", rating: 5, date: "2024-01-15", text: "Excelente espaço! Muito seguro e o Carlos é super atencioso." },
      { name: "Lucia R.", rating: 5, date: "2024-02-20", text: "Guardei meus móveis por 2 meses sem problemas. Recomendo!" },
      { name: "Fernando G.", rating: 4, date: "2023-12-10", text: "Bom espaço, só achei um pouco difícil de estacionar na rua." },
    ],
  },
  {
    id: 2,
    name: "Quarto vazio em apartamento",
    owner: "Ana P.",
    ownerPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    ownerSince: "2022",
    ownerDescription: "Tenho um quarto extra no meu apartamento e decidi ajudar quem precisa de espaço temporário.",
    rating: 4.9,
    reviews: 41,
    type: "Quarto",
    address: "Av. Paulista, 900 - Bela Vista",
    distance: "2.0 km",
    area: 9,
    pricePerDay: 6,
    description: "Quarto vazio em apartamento com portaria 24h e elevador. Ambiente climatizado, perfeito para itens que precisam de cuidado extra.",
    photos: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
    ],
    features: ["Prédio com portaria", "Elevador", "Climatizado"],
    reviewsList: [
      { name: "Marcos T.", rating: 5, date: "2024-03-01", text: "A Ana é incrível! Apartamento super limpo e organizado." },
      { name: "Carla B.", rating: 5, date: "2024-01-28", text: "Melhor experiência que já tive. Muito prático e seguro." },
      { name: "Ricardo M.", rating: 5, date: "2024-02-14", text: "Perfeito para guardar coisas durante uma mudança." },
    ],
  },
  {
    id: 3,
    name: "Depósito comercial pequeno",
    owner: "Roberto S.",
    ownerPhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    ownerSince: "2021",
    ownerDescription: "Tenho um pequeno depósito comercial que não uso mais e resolvi disponibilizar na plataforma.",
    rating: 4.6,
    reviews: 15,
    type: "Depósito",
    address: "Rua Vergueiro, 3100 - Vila Mariana",
    distance: "3.5 km",
    area: 20,
    pricePerDay: 12,
    description: "Depósito comercial com piso nivelado e seguro incluso. Ideal para estoques, equipamentos e itens de maior volume.",
    photos: [
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1504418684940-75eb70512506?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=600&h=400&fit=crop",
    ],
    features: ["Seguro incluso", "Acesso 24h", "Piso nivelado"],
    reviewsList: [
      { name: "Sandra L.", rating: 5, date: "2024-02-05", text: "Ótimo depósito, muito espaçoso e seguro." },
      { name: "Diego C.", rating: 4, date: "2023-11-20", text: "Bom espaço, mas fica um pouco longe do metrô." },
    ],
  },
  {
    id: 4,
    name: "Área coberta em casa",
    owner: "Mariana L.",
    ownerPhoto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    ownerSince: "2023",
    ownerDescription: "Tenho uma área coberta grande nos fundos da minha casa que fica vazia. Ótima para guardar coisas!",
    rating: 5.0,
    reviews: 8,
    type: "Área coberta",
    address: "Rua Harmonia, 450 - Vila Madalena",
    distance: "4.1 km",
    area: 15,
    pricePerDay: 7,
    description: "Área coberta nos fundos de casa em bairro tranquilo. Ambiente seco e arejado com fácil acesso para carga e descarga.",
    photos: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&h=400&fit=crop",
    ],
    features: ["Ambiente seco", "Vizinhança tranquila", "Fácil estacionamento"],
    reviewsList: [
      { name: "Thiago N.", rating: 5, date: "2024-03-10", text: "Mariana é super gentil! O espaço é exatamente como descrito." },
      { name: "Juliana P.", rating: 5, date: "2024-02-28", text: "Lugar perfeito, tranquilo e seguro. Voltarei a usar!" },
    ],
  },
  {
    id: 5,
    name: "Pequeno galpão nos fundos",
    owner: "João F.",
    ownerPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    ownerSince: "2022",
    ownerDescription: "Tenho um galpão nos fundos da minha propriedade com portão largo, ideal para itens grandes.",
    rating: 4.7,
    reviews: 19,
    type: "Galpão",
    address: "Rua Cardeal Arcoverde, 800 - Pinheiros",
    distance: "1.8 km",
    area: 25,
    pricePerDay: 15,
    description: "Galpão com pé direito alto e portão largo, ideal para móveis grandes e equipamentos. Acesso para veículos facilita a carga e descarga.",
    photos: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1600566753051-f0b89df2dd90?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=600&h=400&fit=crop",
    ],
    features: ["Portão largo", "Pé direito alto", "Acesso para veículos"],
    reviewsList: [
      { name: "Bruno A.", rating: 5, date: "2024-01-05", text: "Galpão excelente! Coube tudo que eu precisava guardar." },
      { name: "Camila F.", rating: 4, date: "2023-12-18", text: "Bom espaço, João é muito prestativo e pontual." },
      { name: "Eduardo V.", rating: 5, date: "2024-03-02", text: "Perfeito para quem precisa de espaço grande. Super recomendo." },
    ],
  },
];

// Mini carousel component for cards
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
      <div ref={emblaRef} className="overflow-hidden h-full">
        <div className="flex h-full">
          {photos.map((photo, i) => (
            <div key={i} className="flex-[0_0_100%] min-w-0 h-full">
              <img src={photo} alt={`${name} ${i + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
      {/* Arrows */}
      <button
        onClick={scrollPrev}
        className="absolute left-1 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-1 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight size={16} />
      </button>
      {/* Dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {photos.map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              i === selectedIndex ? "bg-background" : "bg-background/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

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
  const totalVol = state?.totalVol || 0;
  const userLocation = state?.location || "Não informado";

  const handleSelect = (e: React.MouseEvent, spaceId: number) => {
    e.stopPropagation();
    toast({
      title: "Em breve!",
      description: "O fluxo de contratação estará disponível em breve. Obrigado pelo interesse!",
    });
  };

  const handleCardClick = (space: typeof mockSpaces[0]) => {
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
          <div>
            <h1 className="text-lg font-bold text-foreground">Espaços disponíveis</h1>
            <p className="text-sm text-muted-foreground">
              {totalArea.toFixed(1)} m² · {days} dias · {userLocation}
            </p>
          </div>
        </div>
      </div>

      <div className="container py-6 md:py-10">
        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 md:p-5 rounded-xl bg-primary-light border border-primary/20"
        >
          <h2 className="font-semibold text-foreground mb-3 text-sm">Resumo da sua busca</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Ruler size={16} className="text-primary" />
              <span className="text-muted-foreground">Área: <strong className="text-foreground">{totalArea.toFixed(1)} m²</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-primary" />
              <span className="text-muted-foreground">Período: <strong className="text-foreground">{days} dias</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-primary" />
              <span className="text-muted-foreground">Local: <strong className="text-foreground">{userLocation || "—"}</strong></span>
            </div>
            {state?.deliveryDate && (
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-primary" />
                <span className="text-muted-foreground">
                  Entrega: <strong className="text-foreground">
                    {format(new Date(state.deliveryDate), "dd/MM", { locale: pt })} {state.deliveryTime}
                  </strong>
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Results */}
        <div className="space-y-4">
          {mockSpaces.map((space, index) => {
            const totalPrice = space.pricePerDay * days;
            return (
              <motion.div
                key={space.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <Card
                  className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleCardClick(space)}
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      {/* Photo Carousel */}
                      <div className="sm:w-48 h-40 sm:h-auto bg-muted flex-shrink-0">
                        <CardCarousel photos={space.photos} name={space.name} />
                      </div>

                      {/* Info */}
                      <div className="flex-1 p-4 md:p-5">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-foreground text-base">{space.name}</h3>
                            <p className="text-sm text-muted-foreground">{space.type} · {space.area} m² disponíveis</p>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Star size={14} className="text-accent fill-accent" />
                            <span className="font-semibold text-foreground">{space.rating}</span>
                            <span className="text-muted-foreground">({space.reviews})</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                          <MapPin size={14} />
                          <span>{space.address}</span>
                          <span className="ml-2 text-primary font-medium">{space.distance}</span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {space.features.map((f) => (
                            <span
                              key={f}
                              className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
                            >
                              {f}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-1">
                              <Shield size={14} className="text-primary" />
                              <span className="text-xs text-muted-foreground">Proprietário: <strong className="text-foreground">{space.owner}</strong></span>
                            </div>
                            <p className="text-sm mt-1">
                              <span className="text-muted-foreground">R${space.pricePerDay}/dia · </span>
                              <span className="text-lg font-bold text-foreground">R${totalPrice.toFixed(2)}</span>
                              <span className="text-muted-foreground text-xs"> total</span>
                            </p>
                          </div>
                          <Button
                            className="bg-accent hover:bg-accent/90 text-accent-foreground"
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
