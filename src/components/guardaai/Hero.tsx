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
  { icon: TrendingDown, text: "Mais barato que self storage" },
  { icon: MapPin, text: "Espaços perto de você" },
  { icon: Briefcase, text: "Mudanças, reformas e viagens" },
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
      {/* Background image — desktop only */}
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
      {/* Lateral overlay — much lighter, preserves photo impact */}
      <div
        className="absolute inset-0 z-10 hidden md:block"
        style={{
          background:
            "linear-gradient(90deg, hsl(var(--background)) 0%, hsl(var(--background) / 0.88) 22%, hsl(var(--background) / 0.55) 42%, hsl(var(--background) / 0.18) 58%, transparent 72%)",
        }}
      />
      {/* Bottom fade — very subtle */}
      <div
        className="absolute inset-x-0 bottom-0 h-12 z-10 hidden md:block"
        style={{
          background: "linear-gradient(to top, hsl(var(--background) / 0.5), transparent)",
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

      <div className="container relative z-20 min-h-[auto] md:min-h-[92vh] flex items-center py-20 pt-32 md:py-0">
        <div className="max-w-[720px] w-full md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="space-y-0"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 backdrop-blur-sm text-primary text-xs font-semibold mb-6 md:mb-7 border border-primary/20">
              <Package size={14} />
              Self storage descentralizado
            </div>

            {/* Headline */}
            <h1 className="text-[2rem] md:text-5xl lg:text-[3.6rem] font-extrabold text-foreground leading-[1.12] mb-5 md:mb-6 tracking-tight">
              Guarde perto.<br />
              <span className="text-primary">Pague menos.</span>
            </h1>

            <p className="text-[15px] md:text-[17px] text-muted-foreground mb-10 md:mb-12 max-w-lg leading-relaxed">
              Encontre espaços para armazenar seus objetos perto de você, por diárias ou mensalidades.
            </p>

            {/* ══════ SEARCH CARD ══════ */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.45 }}
              className="rounded-2xl bg-card border border-border shadow-2xl shadow-foreground/[0.08] mb-8 md:mb-10"
            >
              {/* ── Desktop layout ── */}
              <div className="hidden md:block p-3.5">
                <div className="flex items-stretch gap-0">
                  {/* Location */}
                  <div className="flex-[1.5] min-w-0 px-4 py-3 rounded-xl hover:bg-muted/40 transition-colors">
                    <label className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">
                      Localização
                    </label>
                    <LocationAutocomplete
                      value={location}
                      onChange={setLocation}
                      placeholder="Onde quer guardar?"
                      hideGps
                      className="border-0 shadow-none bg-transparent h-10 px-0 text-[15px] font-medium placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>

                  {/* Divider */}
                  <div className="w-px self-stretch my-3 bg-border" />

                  {/* Dates */}
                  <div className="flex-[1.2] min-w-0 px-4 py-3 rounded-xl hover:bg-muted/40 transition-colors">
                    <DateRangePicker
                      deliveryDate={deliveryDate}
                      pickupDate={pickupDate}
                      onDeliveryChange={setDeliveryDate}
                      onPickupChange={setPickupDate}
                      compact
                    />
                  </div>

                  {/* Divider */}
                  <div className="w-px self-stretch my-3 bg-border" />

                  {/* Volume */}
                  <div className="flex-[0.8] min-w-0 px-4 py-3 rounded-xl hover:bg-muted/40 transition-colors">
                    <label className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">
                      Volume
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={volume}
                        onChange={(e) => setVolume(e.target.value)}
                        placeholder="Quanto? (m³)"
                        className="h-10 w-full bg-transparent text-[15px] font-medium placeholder:text-muted-foreground/50 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      {volume && (
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">m³</span>
                      )}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center pl-3 pr-1">
                    <Button
                      onClick={handleSearch}
                      size="lg"
                      className="bg-accent hover:bg-accent/90 text-accent-foreground h-[52px] px-8 rounded-xl shadow-lg shadow-accent/25 text-[15px] font-bold gap-2.5 transition-all hover:shadow-xl hover:shadow-accent/30 hover:scale-[1.02]"
                    >
                      <Search size={18} />
                      Buscar
                    </Button>
                  </div>
                </div>
              </div>

              {/* ── Mobile layout ── */}
              <div className="md:hidden p-4 space-y-4">
                {/* Location */}
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                    Localização
                  </label>
                  <LocationAutocomplete
                    value={location}
                    onChange={setLocation}
                    placeholder="Onde quer guardar?"
                    className="h-12 text-base"
                  />
                </div>

                {/* Dates & Volume row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <DateRangePicker
                      deliveryDate={deliveryDate}
                      pickupDate={pickupDate}
                      onDeliveryChange={setDeliveryDate}
                      onPickupChange={setPickupDate}
                      compact
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
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
                        className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 pr-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">m³</span>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <Button
                  onClick={handleSearch}
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground h-13 text-base w-full shadow-lg shadow-accent/20 rounded-xl font-semibold gap-2 group"
                >
                  <Search size={18} />
                  Buscar espaços
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </div>
            </motion.div>

            {/* Secondary links */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5">
              <Button
                size="sm"
                variant="outline"
                className="text-sm border-primary/40 text-primary hover:bg-primary/5 bg-card/80 backdrop-blur-sm font-medium"
                asChild
              >
                <Link to="/anunciar">Quero anunciar meu espaço</Link>
              </Button>
              <a
                href="#simulador"
                className="text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-4 decoration-muted-foreground/30 hover:decoration-primary/50"
              >
                Precisa calcular em detalhe? Use o simulador ↓
              </a>
            </div>

            {/* Mobile highlight chips */}
            <div className="flex flex-wrap gap-2 mt-8 md:hidden">
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
