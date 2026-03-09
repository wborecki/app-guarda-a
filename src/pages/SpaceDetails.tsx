import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Star, MapPin, Shield, ChevronLeft, ChevronRight, MessageSquare, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

const SpaceDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const space = (location.state as any)?.space;
  const simulation = (location.state as any)?.simulation;
  const days = simulation?.days || 1;

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  if (!space) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Espaço não encontrado</p>
          <Button onClick={() => navigate(-1)}>Voltar</Button>
        </div>
      </div>
    );
  }

  const totalPrice = space.pricePerDay * days;

  const handleSelect = () => {
    toast({
      title: "Em breve!",
      description: "O fluxo de contratação estará disponível em breve. Obrigado pelo interesse!",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-card border-b sticky top-0 z-20">
        <div className="container py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-semibold text-foreground truncate">{space.name}</h1>
            <p className="text-xs text-muted-foreground truncate">
              {space.neighborhood}, {space.city}
            </p>
          </div>
        </div>
      </div>

      {/* Photo Gallery */}
      <div className="relative">
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex">
            {space.photos.map((photo: string, i: number) => (
              <div key={i} className="flex-[0_0_100%] min-w-0">
                <img
                  src={photo}
                  alt={`${space.name} - foto ${i + 1}`}
                  className="w-full h-64 sm:h-80 md:h-96 object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={scrollPrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full p-2 shadow-md"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={scrollNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full p-2 shadow-md"
        >
          <ChevronRight size={20} />
        </button>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {space.photos.map((_: string, i: number) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i === selectedIndex ? "bg-background w-4" : "bg-background/50"
              }`}
            />
          ))}
        </div>
        <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-foreground">
          {selectedIndex + 1}/{space.photos.length}
        </div>
      </div>

      <div className="container py-6 space-y-6 max-w-2xl">
        {/* Space Info */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-start justify-between mb-2">
            <div>
              <h2 className="text-xl font-bold text-foreground">{space.name}</h2>
              <p className="text-sm text-muted-foreground">{space.type} · {space.area} m²</p>
            </div>
            <div className="flex items-center gap-1">
              <Star size={16} className="text-accent fill-accent" />
              <span className="font-bold text-foreground">{space.rating}</span>
              <span className="text-muted-foreground text-sm">({space.reviews})</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
            <MapPin size={14} />
            <span>{space.address}</span>
            <span className="ml-2 text-primary font-semibold">{space.distance}</span>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed mb-4">{space.description}</p>

          <div className="flex flex-wrap gap-2">
            {space.features.map((f: string) => (
              <span key={f} className="text-xs px-3 py-1 rounded-md bg-secondary text-secondary-foreground font-medium">
                {f}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Pricing */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-primary/20 bg-primary-light">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Preço por dia</p>
                  <p className="text-lg font-bold text-foreground">R$ {space.pricePerDay.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{days} {days === 1 ? "dia" : "dias"}</p>
                  <p className="text-2xl font-extrabold text-primary">R$ {totalPrice.toFixed(0)}</p>
                  <p className="text-xs text-muted-foreground">total estimado</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Owner Profile */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
            <User size={18} className="text-primary" />
            Sobre o proprietário
          </h3>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <img
                  src={space.ownerPhoto}
                  alt={space.owner}
                  className="w-14 h-14 rounded-full object-cover flex-shrink-0 bg-muted"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-foreground">{space.owner}</h4>
                    <Shield size={14} className="text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Na plataforma desde {space.ownerSince} · {space.reviews} avaliações
                  </p>
                  <p className="text-sm text-muted-foreground">{space.ownerDescription}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Reviews */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
            <MessageSquare size={18} className="text-primary" />
            Comentários ({space.reviewsList?.length || 0})
          </h3>
          <div className="space-y-3">
            {space.reviewsList?.map((review: any, i: number) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground text-sm">{review.name}</span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, si) => (
                        <Star
                          key={si}
                          size={11}
                          className={si < review.rating ? "text-accent fill-accent" : "text-muted-foreground/30"}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.text}</p>
                  <p className="text-xs text-muted-foreground/60 mt-2">
                    {format(new Date(review.date), "dd 'de' MMMM 'de' yyyy", { locale: pt })}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t p-4 z-20">
        <div className="container max-w-2xl flex items-center justify-between">
          <div>
            <p className="text-2xl font-extrabold text-foreground">R$ {totalPrice.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground">{days} {days === 1 ? "dia" : "dias"} · {space.area} m²</p>
          </div>
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
            onClick={handleSelect}
          >
            Selecionar este espaço
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SpaceDetails;
