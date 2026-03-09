import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Star, Ruler, Calendar, ArrowLeft, Shield, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockSpaces = [
  {
    id: 1,
    name: "Garagem coberta espaçosa",
    owner: "Carlos M.",
    rating: 4.8,
    reviews: 23,
    type: "Garagem",
    address: "Rua Augusta, 1200 - Consolação",
    distance: "1.2 km",
    area: 12,
    pricePerDay: 8,
    photo: "/placeholder.svg",
    features: ["Portão automático", "Câmeras 24h", "Acesso fácil"],
  },
  {
    id: 2,
    name: "Quarto vazio em apartamento",
    owner: "Ana P.",
    rating: 4.9,
    reviews: 41,
    type: "Quarto",
    address: "Av. Paulista, 900 - Bela Vista",
    distance: "2.0 km",
    area: 9,
    pricePerDay: 6,
    photo: "/placeholder.svg",
    features: ["Prédio com portaria", "Elevador", "Climatizado"],
  },
  {
    id: 3,
    name: "Depósito comercial pequeno",
    owner: "Roberto S.",
    rating: 4.6,
    reviews: 15,
    type: "Depósito",
    address: "Rua Vergueiro, 3100 - Vila Mariana",
    distance: "3.5 km",
    area: 20,
    pricePerDay: 12,
    photo: "/placeholder.svg",
    features: ["Seguro incluso", "Acesso 24h", "Piso nivelado"],
  },
  {
    id: 4,
    name: "Área coberta em casa",
    owner: "Mariana L.",
    rating: 5.0,
    reviews: 8,
    type: "Área coberta",
    address: "Rua Harmonia, 450 - Vila Madalena",
    distance: "4.1 km",
    area: 15,
    pricePerDay: 7,
    photo: "/placeholder.svg",
    features: ["Ambiente seco", "Vizinhança tranquila", "Fácil estacionamento"],
  },
  {
    id: 5,
    name: "Pequeno galpão nos fundos",
    owner: "João F.",
    rating: 4.7,
    reviews: 19,
    type: "Galpão",
    address: "Rua Cardeal Arcoverde, 800 - Pinheiros",
    distance: "1.8 km",
    area: 25,
    pricePerDay: 15,
    photo: "/placeholder.svg",
    features: ["Portão largo", "Pé direito alto", "Acesso para veículos"],
  },
];

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

  const handleSelect = (spaceId: number) => {
    toast({
      title: "Em breve!",
      description: "O fluxo de contratação estará disponível em breve. Obrigado pelo interesse!",
    });
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
                <Card className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      {/* Photo */}
                      <div className="sm:w-48 h-40 sm:h-auto bg-muted flex-shrink-0">
                        <img
                          src={space.photo}
                          alt={space.name}
                          className="w-full h-full object-cover"
                        />
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
                            onClick={() => handleSelect(space.id)}
                          >
                            Selecionar este espaço
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
