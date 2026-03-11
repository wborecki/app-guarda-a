import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Package, Search, MapPin, CalendarIcon, Box, ArrowRight, TrendingDown, Briefcase, Home } from "lucide-react";
import { differenceInDays } from "date-fns";
import heroBg from "@/assets/hero-bg-new.jpg";
import LocationAutocomplete from "@/components/guardaai/LocationAutocomplete";
import DateRangePicker from "@/components/guardaai/DateRangePicker";

const highlights = [
  { icon: TrendingDown, text: "Mais barato que self storage tradicional" },
  { icon: MapPin, text: "Espaços perto de você" },
  { icon: Briefcase, text: "Ideal para mudanças, reformas, viagens e estoque" },
  { icon: Home, text: "Ganhe dinheiro com espaço vazio" },
];

const Hero = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>();
  const [pickupDate, setPickupDate] = useState<Date | undefined>();
  const [volume, setVolume] = useState("");

  const days = deliveryDate && pickupDate ? Math.max(differenceInDays(pickupDate, deliveryDate), 1) : 0;

  const handleSearch = () => {
    const totalVol = parseFloat(volume) || 0;
    navigate("/buscar", {
      state: {
        location: location || "São Paulo",
        deliveryDate: deliveryDate?.toISOString(),
        pickupDate: pickupDate?.toISOString(),
        totalVol,
        days: days || 1,
      },
    });
  };

  return (
    <section className="relative isolate overflow-hidden">
      {/* Background image - hidden on mobile */}
      <div
        className="absolute inset-0 z-0 hidden md:block"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center right",
          backgroundRepeat: "no-repeat",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 z-10 hidden md:block"
        style={{
          background:
            "linear-gradient(90deg, hsl(var(--background) / 0.98) 0%, hsl(var(--background) / 0.93) 28%, hsl(var(--background) / 0.72) 48%, hsl(var(--background) / 0.38) 64%, hsl(var(--background) / 0.16) 78%, transparent 100%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-24 z-10 hidden md:block"
        style={{
          background: "linear-gradient(to top, hsl(var(--background) / 0.85), transparent)",
        }}
        aria-hidden="true"
      />
      {/* Mobile gradient */}
      <div
        className="absolute inset-0 z-0 md:hidden"
        style={{
          background: "linear-gradient(160deg, hsl(var(--background)) 0%, hsl(var(--primary) / 0.06) 50%, hsl(var(--background)) 100%)",
        }}
        aria-hidden="true"
      />

      <div className="container relative z-20 min-h-[auto] md:min-h-[90vh] flex items-center py-16 pt-24 md:py-32">
        <div className="max-w-2xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full bg-primary/10 backdrop-blur-sm text-primary text-xs md:text-sm font-medium mb-4 md:mb-6 border border-primary/20">
              <Package size={14} className="md:w-4 md:h-4" />
              Self storage descentralizado
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-3 md:mb-4">
              Guarde perto.<br />
              <span className="text-primary">Pague menos.</span>
            </h1>

            <p className="text-sm md:text-lg text-muted-foreground mb-6 md:mb-8 max-w-lg">
              Encontre espaços para armazenar seus objetos perto de você, por diárias ou mensalidades.
            </p>

            {/* ── Search Bar ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-card/90 backdrop-blur-md border border-border/60 rounded-2xl shadow-lg p-4 md:p-5 mb-5"
            >
              {/* Desktop: inline row */}
              <div className="hidden md:flex items-end gap-3">
                {/* Location */}
                <div className="flex-1 min-w-0">
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
                    <MapPin size={12} className="text-primary" />
                    Onde quer guardar?
                  </label>
                  <LocationAutocomplete
                    value={location}
                    onChange={setLocation}
                    placeholder="Ex: São Paulo, Curitiba..."
                    className="h-10 text-sm"
                  />
                </div>

                {/* Separator */}
                <div className="w-px h-10 bg-border/60 shrink-0" />

                {/* Dates */}
                <div className="w-[220px] shrink-0">
                  <DateRangePicker
                    deliveryDate={deliveryDate}
                    pickupDate={pickupDate}
                    onDeliveryChange={setDeliveryDate}
                    onPickupChange={setPickupDate}
                    compact
                  />
                </div>

                {/* Separator */}
                <div className="w-px h-10 bg-border/60 shrink-0" />

                {/* Volume */}
                <div className="w-[120px] shrink-0">
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
                    <Box size={12} className="text-primary" />
                    Volume
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={volume}
                      onChange={(e) => setVolume(e.target.value)}
                      placeholder="Ex: 2"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 pr-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">m³</span>
                  </div>
                </div>

                {/* CTA */}
                <Button
                  onClick={handleSearch}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground h-10 px-6 shrink-0 shadow-md"
                >
                  <Search size={16} className="mr-1.5" />
                  Buscar
                </Button>
              </div>

              {/* Mobile: stacked */}
              <div className="flex flex-col gap-3 md:hidden">
                {/* Location */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
                    <MapPin size={12} className="text-primary" />
                    Onde quer guardar?
                  </label>
                  <LocationAutocomplete
                    value={location}
                    onChange={setLocation}
                    placeholder="Ex: São Paulo, Curitiba..."
                    className="h-11"
                  />
                </div>

                {/* Dates */}
                <DateRangePicker
                  deliveryDate={deliveryDate}
                  pickupDate={pickupDate}
                  onDeliveryChange={setDeliveryDate}
                  onPickupChange={setPickupDate}
                  compact
                />

                {/* Volume */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
                    <Box size={12} className="text-primary" />
                    Volume estimado
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={volume}
                      onChange={(e) => setVolume(e.target.value)}
                      placeholder="Ex: 2"
                      className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 pr-10"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">m³</span>
                  </div>
                </div>

                {/* CTA */}
                <Button
                  onClick={handleSearch}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground h-12 text-base w-full shadow-lg group"
                >
                  <Search size={18} className="mr-2" />
                  Buscar espaços
                  <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>

            {/* Secondary links */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-6 md:mb-8">
              <Button
                size="sm"
                variant="outline"
                className="text-sm border-primary text-primary hover:bg-primary/5 bg-background/40 backdrop-blur-sm"
                asChild
              >
                <Link to="/anunciar">Quero anunciar meu espaço</Link>
              </Button>
              <a
                href="#simulador"
                className="text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-2"
              >
                Quer mais detalhe? Use nosso simulador completo ↓
              </a>
            </div>

            {/* Mobile chips */}
            <div className="flex flex-wrap gap-2 md:hidden">
              {highlights.map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-card border border-border/60 text-xs font-medium text-foreground"
                >
                  <h.icon size={13} className="text-primary shrink-0" />
                  {h.text}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
