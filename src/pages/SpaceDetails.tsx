import SEO from "@/components/SEO";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft, Star, MapPin, Shield, ChevronLeft, ChevronRight,
  MessageSquare, User, Clock, CheckCircle2, Lock, FileText,
  Camera, Package, Calendar, Pencil, Plus, Minus, Info, Ruler
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { calculatePrice, PRICING_HINT_SHORT, SERVICE_FEE } from "@/lib/pricing";

const SpaceDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const space = (location.state as any)?.space;
  const simulation = (location.state as any)?.simulation;
  const initialDays = simulation?.days || 1;
  const initialReservedArea = Math.max(simulation?.totalVol || 1, 1);

  const [days, setDays] = useState(initialDays);
  const [reservedArea, setReservedArea] = useState(initialReservedArea);
  const [editingReservation, setEditingReservation] = useState(false);

  // Gallery carousel
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [thumbRef, thumbApi] = useEmblaCarousel({ containScroll: "keepSnaps", dragFree: true });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  const scrollToIndex = useCallback((index: number) => {
    emblaApi?.scrollTo(index);
  }, [emblaApi]);

  if (!space) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Espaço não encontrado</p>
          <Button onClick={() => window.history.length > 1 ? navigate(-1) : navigate("/buscar")}>Voltar</Button>
        </div>
      </div>
    );
  }

  // Available capacity = total - already occupied (simulated)
  const occupiedArea = Math.max(space.area * 0.0, 0); // placeholder: no other reservations yet
  const availableArea = space.area - occupiedArea;

  // Clamp reserved area to available
  const effectiveReservedArea = Math.min(Math.max(reservedArea, 1), availableArea);

  const bp = calculatePrice(effectiveReservedArea, days);
  const subtotal = bp.subtotal;
  const serviceFee = bp.serviceFee;
  const totalPrice = bp.total;

  const handleContinue = () => {
    navigate("/checkout", {
      state: {
        space,
        reservedVolume: effectiveReservedArea,
        days,
        simulation,
      },
    });
  };

  const allReviews = [
    { name: "Pedro A.", rating: 5, date: "2024-01-15", text: "Espaço exatamente como descrito, fácil acesso e muito perto de casa. Super recomendo." },
    { name: "Lucia R.", rating: 5, date: "2024-02-20", text: "Usei durante uma reforma e foi tudo muito tranquilo. Proprietário muito atencioso." },
    { name: "Fernando G.", rating: 4, date: "2023-12-10", text: "Bom espaço, proprietário pontual e comunicativo. Voltarei a usar." },
    { name: "Sandra L.", rating: 5, date: "2024-02-05", text: "Ótimo local, exatamente como descrito no anúncio. Me senti segura." },
    { name: "Diego C.", rating: 4, date: "2023-11-20", text: "Muito prático e bem localizado. Bom atendimento e local seguro." },
    ...(space.reviewsList || []),
  ].slice(0, 5);

  const avgRating = space.rating;
  const totalReviews = space.reviews;

  const allFeatures = [
    ...space.features,
    ...(space.features.length < 5
      ? ["Piso nivelado", "Ambiente seco", "Sem umidade"].filter(f => !space.features.includes(f)).slice(0, 3 - Math.max(0, space.features.length - 3))
      : []),
  ];

  const adjustArea = (delta: number) => {
    const next = Math.round((reservedArea + delta) * 10) / 10;
    setReservedArea(Math.min(Math.max(next, 1), availableArea));
  };

  return (
    <div className="min-h-screen bg-background pb-24 sm:pb-28 lg:pb-8">
      <SEO title={`${space.name} — ${space.neighborhood}`} description={space.description?.slice(0, 155) || `Espaço disponível para guardar seus itens em ${space.neighborhood}.`} />
      {/* Sticky Header */}
      <div className="bg-card border-b sticky top-0 z-30">
        <div className="container py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3 max-w-6xl">
          <Button variant="ghost" size="icon" onClick={() => window.history.length > 1 ? navigate(-1) : navigate("/buscar")} className="flex-shrink-0 h-8 w-8 sm:h-9 sm:w-9">
            <ArrowLeft size={18} />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm sm:text-base font-bold text-foreground truncate">{space.name}</h1>
            <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-muted-foreground">
              <span className="truncate">{space.neighborhood}, {space.city}</span>
              <span>•</span>
              <span className="text-primary font-semibold">{space.distance}</span>
              <span className="hidden sm:inline">•</span>
              <div className="hidden sm:flex items-center gap-0.5">
                <Star size={10} className="text-accent fill-accent" />
                <span className="font-semibold text-foreground">{avgRating}</span>
                <span>({totalReviews})</span>
              </div>
            </div>
          </div>
          {/* Quick price on header */}
          <div className="hidden sm:flex flex-col items-end">
            <p className="text-base font-extrabold text-foreground">R$ {totalPrice.toFixed(0)}</p>
            <p className="text-[10px] text-muted-foreground">{effectiveReservedArea} m³ · {days}d · total</p>
          </div>
        </div>
      </div>

      {/* ── Steps bar: Compare → Escolha → Reserve ── */}
      <div className="bg-primary/[0.03] border-b">
        <div className="container max-w-6xl py-2 sm:py-2.5">
          <div className="flex items-center justify-center gap-4 sm:gap-6 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1 sm:gap-1.5 text-muted-foreground">
              <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center text-[9px] sm:text-[10px] font-bold">1</span>
              Compare
            </span>
            <ChevronRight size={10} className="text-border" />
            <span className="flex items-center gap-1 sm:gap-1.5 text-primary font-semibold">
              <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[9px] sm:text-[10px] font-bold">2</span>
              Escolha
            </span>
            <ChevronRight size={10} className="text-border" />
            <span className="flex items-center gap-1 sm:gap-1.5 text-muted-foreground">
              <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center text-[9px] sm:text-[10px] font-bold">3</span>
              Reserve
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="lg:container lg:py-6">
          <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-8">
            {/* ═══ LEFT COLUMN ═══ */}
            <div className="space-y-5 sm:space-y-6">
              {/* ── Photo Gallery — edge-to-edge on mobile ── */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="relative overflow-hidden lg:rounded-xl">
                  <div ref={emblaRef} className="overflow-hidden">
                    <div className="flex">
                      {space.photos.map((photo: string, i: number) => (
                        <div key={i} className="flex-[0_0_100%] min-w-0">
                          <img
                            src={photo}
                            alt={`${space.name} – ângulo ${i + 1}`}
                            className="w-full h-56 sm:h-72 md:h-80 lg:h-[420px] object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <button onClick={scrollPrev} className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background rounded-full p-1.5 sm:p-2 shadow-md transition-opacity">
                    <ChevronLeft size={18} className="text-foreground" />
                  </button>
                  <button onClick={scrollNext} className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background rounded-full p-1.5 sm:p-2 shadow-md transition-opacity">
                    <ChevronRight size={18} className="text-foreground" />
                  </button>
                  {/* Mobile: rating badge on photo */}
                  <div className="absolute top-3 right-3 sm:hidden bg-background/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1">
                    <Star size={11} className="text-accent fill-accent" />
                    <span className="text-xs font-bold text-foreground">{avgRating}</span>
                    <span className="text-[10px] text-muted-foreground">({totalReviews})</span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-background/85 backdrop-blur-sm rounded-full px-2.5 py-1 text-[11px] sm:text-xs font-medium text-foreground flex items-center gap-1.5">
                    <Camera size={11} />
                    {selectedIndex + 1}/{space.photos.length}
                  </div>
                </div>
                {/* Thumbnails — hidden on mobile for cleaner UX, dots instead */}
                <div className="flex justify-center gap-1.5 py-3 lg:hidden">
                  {space.photos.map((_: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => scrollToIndex(i)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === selectedIndex ? "bg-primary w-5" : "bg-border"
                      }`}
                    />
                  ))}
                </div>
                <div ref={thumbRef} className="overflow-hidden mt-3 hidden lg:block px-4 lg:px-0">
                  <div className="flex gap-2">
                    {space.photos.map((photo: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => scrollToIndex(i)}
                        className={`flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                          i === selectedIndex ? "border-primary ring-1 ring-primary/30" : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img src={photo} alt={`Miniatura ${i + 1}`} className="w-20 h-14 object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>

            {/* ── Space Details ── */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="px-4 lg:px-0">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-foreground">{space.name}</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">{space.type}</p>
                </div>
                <div className="hidden sm:flex items-center gap-1 bg-accent/10 rounded-lg px-2.5 py-1.5 flex-shrink-0">
                  <Star size={14} className="text-accent fill-accent" />
                  <span className="font-bold text-foreground">{avgRating}</span>
                  <span className="text-xs text-muted-foreground">({totalReviews})</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3 sm:mb-4">
                <MapPin size={14} className="text-primary flex-shrink-0" />
                <span>{space.address}</span>
                <span className="ml-1 text-primary font-semibold">{space.distance}</span>
              </div>

              {/* Capacity info */}
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 p-2.5 sm:p-3 rounded-lg bg-secondary/50 border border-border/40">
                <div className="flex items-center gap-2">
                  <Ruler size={14} className="text-primary" />
                  <div>
                    <p className="text-[11px] sm:text-xs text-muted-foreground">Capacidade total</p>
                    <p className="text-sm font-bold text-foreground">{space.area} m³</p>
                  </div>
                </div>
                <div className="w-px h-8 bg-border/60" />
                <div>
                  <p className="text-[11px] sm:text-xs text-muted-foreground">Disponível agora</p>
                  <p className="text-sm font-bold text-primary">{availableArea} m³</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-4 sm:mb-5">{space.description}</p>

              {/* Features grid */}
              <h3 className="text-sm font-semibold text-foreground mb-2.5 sm:mb-3">Comodidades e diferenciais</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5 mb-2">
                {allFeatures.map((f: string) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 size={14} className="text-primary flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ── Owner ── */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="px-4 lg:px-0">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <User size={16} className="text-primary" />
                Sobre o proprietário
              </h3>
              <Card>
                <CardContent className="p-3.5 sm:p-5">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <img src={space.ownerPhoto} alt={space.owner} className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover flex-shrink-0 bg-muted" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-foreground">{space.owner}</h4>
                        <span className="text-[10px] bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Shield size={10} /> Verificado
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-muted-foreground mb-2">
                        Na plataforma desde {space.ownerSince} · {totalReviews} avaliações
                      </p>
                      <p className="text-sm text-muted-foreground">{space.ownerDescription}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* ── Reviews ── */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="px-4 lg:px-0">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <MessageSquare size={16} className="text-primary" />
                  Avaliações ({totalReviews})
                </h3>
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-accent fill-accent" />
                  <span className="font-bold text-foreground">{avgRating}</span>
                  <span className="text-xs text-muted-foreground">média</span>
                </div>
              </div>
              <div className="space-y-2.5 sm:space-y-3">
                {allReviews.map((review, i) => (
                  <Card key={i}>
                    <CardContent className="p-3.5 sm:p-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-semibold text-foreground text-sm">{review.name}</span>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, si) => (
                            <Star key={si} size={11} className={si < review.rating ? "text-accent fill-accent" : "text-muted-foreground/30"} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{review.text}</p>
                      <p className="text-[11px] text-muted-foreground/60 mt-2">
                        {format(new Date(review.date), "dd 'de' MMMM 'de' yyyy", { locale: pt })}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* ── Trust / Security ── */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="px-4 lg:px-0">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Shield size={16} className="text-primary" />
                Segurança e confiança
              </h3>
              <Card className="bg-primary/[0.03] border-primary/10">
                <CardContent className="p-3.5 sm:p-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                    {[
                      { icon: Camera, text: "Fotos verificadas pela plataforma" },
                      { icon: FileText, text: "Termos de uso aceitos por ambas as partes" },
                      { icon: Lock, text: "Comunicação intermediada pelo GuardaAí" },
                      { icon: Shield, text: "Regras claras de armazenamento e retirada" },
                    ].map(({ icon: Icon, text }, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <Icon size={15} className="text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-muted-foreground leading-snug">{text}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* ═══ RIGHT COLUMN — Reservation Summary (sticky on desktop) ═══ */}
          <div className="mt-6 lg:mt-0">
            <div className="lg:sticky lg:top-20 space-y-4">
              {/* Reservation Card */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
                <Card className="border-primary/20 shadow-md">
                  <CardContent className="p-5">
                    <h3 className="font-bold text-foreground mb-4 text-base">Resumo da reserva</h3>

                    {/* Space info */}
                    <div className="space-y-2.5 mb-4 pb-4 border-b border-border/50">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Espaço</span>
                        <span className="text-foreground font-medium text-right max-w-[200px] truncate">{space.name}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Local</span>
                        <span className="text-foreground font-medium">{space.neighborhood}, {space.city}</span>
                      </div>
                      {simulation?.deliveryDate && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Entrada</span>
                          <span className="text-foreground font-medium">
                            {format(new Date(simulation.deliveryDate), "dd/MM/yyyy", { locale: pt })}
                            {simulation.deliveryTime ? ` às ${simulation.deliveryTime}` : ""}
                          </span>
                        </div>
                      )}
                      {simulation?.pickupDate && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Retirada</span>
                          <span className="text-foreground font-medium">
                            {format(new Date(simulation.pickupDate), "dd/MM/yyyy", { locale: pt })}
                            {simulation.pickupTime ? ` às ${simulation.pickupTime}` : ""}
                          </span>
                        </div>
                      )}
                      {simulation?.deliveryDate && simulation?.pickupDate && (
                        <div className="flex justify-between text-sm items-center">
                          <span className="text-muted-foreground">Período total</span>
                          <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-bold">
                            {days} {days === 1 ? "dia" : "dias"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Reservation editor: area + period */}
                    <div className="mb-4 pb-4 border-b border-border/50">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-foreground">Sua reserva</span>
                        {!editingReservation && (
                          <button
                            onClick={() => setEditingReservation(true)}
                            className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
                          >
                            <Pencil size={11} /> Editar
                          </button>
                        )}
                      </div>

                      {editingReservation ? (
                        <div className="space-y-4">
                          {/* Area editor */}
                          <div>
                            <label className="text-xs text-muted-foreground mb-1.5 block">Volume reservado (m³)</label>
                            <div className="flex items-center gap-3 bg-secondary/50 rounded-lg p-3">
                              <button
                                onClick={() => adjustArea(-1)}
                                disabled={effectiveReservedArea <= 1}
                                className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40"
                              >
                                <Minus size={14} className="text-foreground" />
                              </button>
                              <div className="flex-1 text-center">
                                <span className="text-2xl font-bold text-foreground">{effectiveReservedArea}</span>
                                <span className="text-sm text-muted-foreground ml-1">m³</span>
                              </div>
                              <button
                                onClick={() => adjustArea(1)}
                                disabled={effectiveReservedArea >= availableArea}
                                className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40"
                              >
                                <Plus size={14} className="text-foreground" />
                              </button>
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-1">Máximo disponível: {availableArea} m³</p>
                          </div>

                          {/* Days editor */}
                          <div>
                            <label className="text-xs text-muted-foreground mb-1.5 block">Período (dias)</label>
                            <div className="flex items-center gap-3 bg-secondary/50 rounded-lg p-3">
                              <button
                                onClick={() => setDays(Math.max(1, days - 1))}
                                className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center hover:bg-muted transition-colors"
                              >
                                <Minus size={14} className="text-foreground" />
                              </button>
                              <div className="flex-1 text-center">
                                <span className="text-2xl font-bold text-foreground">{days}</span>
                                <span className="text-sm text-muted-foreground ml-1">{days === 1 ? "dia" : "dias"}</span>
                              </div>
                              <button
                                onClick={() => setDays(days + 1)}
                                className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center hover:bg-muted transition-colors"
                              >
                                <Plus size={14} className="text-foreground" />
                              </button>
                            </div>
                          </div>

                          <button
                            onClick={() => setEditingReservation(false)}
                            className="text-xs text-primary font-semibold hover:underline"
                          >
                            Confirmar
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Volume reservado</span>
                            <span className="text-foreground font-medium">{effectiveReservedArea} m³</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Período</span>
                            <span className="text-foreground font-medium">{days} {days === 1 ? "dia" : "dias"}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Pricing breakdown */}
                    <div className="space-y-2 mb-4 pb-4 border-b border-border/50">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Cálculo</h4>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Preço do espaço</span>
                        <span className="text-foreground font-medium">R$ {subtotal.toFixed(2).replace(".", ",")}</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground/70 pl-0.5">
                        {effectiveReservedArea} m³ × {days} {days === 1 ? "dia" : "dias"} → R$ {bp.pricePerM3.toFixed(2).replace(".", ",")}/m³
                        {days > 1 && <> (≈ R$ {bp.dailyRate.toFixed(2).replace(".", ",")}/m³/dia)</>}
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Taxa de serviço (fixa)</span>
                        <span className="text-foreground font-medium">R$ {SERVICE_FEE.toFixed(2).replace(".", ",")}</span>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-foreground">Total estimado</span>
                      <span className="text-2xl font-extrabold text-primary">R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
                    </div>

                    {/* Hint */}
                    <div className="flex items-start gap-1.5 mb-5 p-2.5 rounded-lg bg-secondary/50">
                      <Info size={12} className="text-muted-foreground/50 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {PRICING_HINT_SHORT}
                      </p>
                    </div>

                    {/* CTAs */}
                    <Button
                      size="lg"
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-base shadow-md"
                      onClick={handleContinue}
                    >
                      Reservar online
                    </Button>
                    <p className="text-center text-[10px] text-muted-foreground mt-2">
                      Reserva rápida, segura e sem compromisso até a confirmação.
                    </p>

                    <button
                      onClick={() => setEditingReservation(!editingReservation)}
                      className="w-full text-center text-sm text-primary font-semibold mt-2 hover:underline flex items-center justify-center gap-1.5"
                    >
                      <Package size={14} />
                      {editingReservation ? "Fechar edição" : "Editar reserva"}
                    </button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Add items card */}
              <Card className="border-dashed border-border/60">
                <CardContent className="p-4">
                  <button
                    onClick={() => {
                      adjustArea(1);
                      setEditingReservation(true);
                      toast({
                        title: "Área aumentada",
                        description: `Volume reservado ajustado para ${Math.min(effectiveReservedArea + 1, availableArea)} m³. Edite conforme sua necessidade.`,
                      });
                    }}
                    className="w-full flex items-center gap-3 text-left group"
                  >
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                      <Plus size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Adicionar mais itens</p>
                      <p className="text-xs text-muted-foreground">Precisa de mais espaço? Aumente a área reservada.</p>
                    </div>
                  </button>
                </CardContent>
              </Card>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* ═══ Mobile sticky CTA ═══ */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t p-4 z-30 lg:hidden">
        <div className="container max-w-6xl flex items-center justify-between gap-4">
          <div>
            <p className="text-xl font-extrabold text-foreground">R$ {totalPrice.toFixed(2).replace(".", ",")}</p>
            <p className="text-[11px] text-muted-foreground">{effectiveReservedArea} m³ · {days} {days === 1 ? "dia" : "dias"}</p>
          </div>
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold shadow-md"
            onClick={handleContinue}
          >
            Reservar online
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SpaceDetails;
