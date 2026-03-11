import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Package, Search, MapPin, CalendarIcon, Box, ArrowRight, TrendingDown, Briefcase, Home } from "lucide-react";
import { differenceInDays } from "date-fns";
import heroBg from "@/assets/hero-bg-new.jpg";
import LocationAutocomplete from "@/components/guardaai/LocationAutocomplete";
import DateRangePicker from "@/components/guardaai/DateRangePicker";

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
      <div
        className="absolute inset-0 z-10 hidden md:block"
        style={{
          background:
            "linear-gradient(90deg, hsl(var(--background)) 0%, hsl(var(--background) / 0.88) 22%, hsl(var(--background) / 0.55) 42%, hsl(var(--background) / 0.18) 58%, transparent 72%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-12 z-10 hidden md:block"
        style={{
          background: "linear-gradient(to top, hsl(var(--background) / 0.5), transparent)",
        }}
        aria-hidden="true"
      />
      {/* Mobile: clean, subtle gradient */}
      <div
        className="absolute inset-0 z-0 md:hidden"
        style={{
          background: "linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--primary) / 0.04) 60%, hsl(var(--background)) 100%)",
        }}
        aria-hidden="true"
      />

      {/* ═══════════════════════════════════════════════
          DESKTOP LAYOUT — unchanged
          ═══════════════════════════════════════════════ */}
      <div className="hidden md:flex container relative z-20 min-h-[92vh] items-center">
        <div className="max-w-[720px] w-full py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <div className="mb-11">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 backdrop-blur-sm text-primary text-xs font-semibold mb-6 border border-primary/20">
                <Package size={14} />
                Self storage descentralizado
              </div>
              <h1 className="text-5xl lg:text-[3.6rem] font-extrabold text-foreground leading-[1.12] mb-7 tracking-tight">
                Guarde perto.<br />
                <span className="text-primary">Pague menos.</span>
              </h1>
              <p className="text-[17px] text-muted-foreground max-w-lg leading-relaxed">
                Encontre espaços para armazenar seus objetos perto de você, por diárias ou mensalidades.
              </p>
            </div>

            <div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.45 }}
                className="rounded-2xl bg-card border border-border shadow-2xl shadow-foreground/[0.08] mb-5"
              >
                <div className="p-2.5">
                  <div className="flex items-stretch gap-0">
                    <div className="flex-[1.5] min-w-0 px-4 py-3 rounded-xl hover:bg-muted/40 transition-colors">
                      <label className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                        Localização
                      </label>
                      <LocationAutocomplete
                        value={location}
                        onChange={setLocation}
                        placeholder="Onde quer guardar?"
                        hideGps
                        className="border-0 shadow-none bg-transparent h-9 px-0 text-[15px] font-medium placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                    <div className="w-px self-stretch my-3 bg-border" />
                    <div className="flex-[1.2] min-w-0 px-4 py-3 rounded-xl hover:bg-muted/40 transition-colors">
                      <DateRangePicker
                        deliveryDate={deliveryDate}
                        pickupDate={pickupDate}
                        onDeliveryChange={setDeliveryDate}
                        onPickupChange={setPickupDate}
                        compact
                      />
                    </div>
                    <div className="w-px self-stretch my-3 bg-border" />
                    <div className="flex-[0.8] min-w-0 px-4 py-3 rounded-xl hover:bg-muted/40 transition-colors">
                      <label className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
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
                          className="h-9 w-full bg-transparent text-[15px] font-medium placeholder:text-muted-foreground/50 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        {volume && (
                          <span className="absolute right-0 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">m³</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center pl-3 pr-1">
                      <Button
                        onClick={handleSearch}
                        size="lg"
                        className="bg-accent hover:bg-accent/90 text-accent-foreground h-[44px] px-7 rounded-xl shadow-lg shadow-accent/25 text-[15px] font-bold gap-2.5 transition-all hover:shadow-xl hover:shadow-accent/30 hover:scale-[1.02]"
                      >
                        <Search size={18} />
                        Buscar
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="flex flex-row items-center gap-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-sm border-primary/40 text-primary hover:bg-primary/5 bg-card/80 backdrop-blur-sm font-medium px-5"
                  asChild
                >
                  <Link to="/anunciar">Quero anunciar meu espaço</Link>
                </Button>
                <span className="text-border">|</span>
                <a
                  href="#simulador"
                  className="text-sm text-muted-foreground/85 hover:text-primary transition-colors hover:underline underline-offset-4 decoration-muted-foreground/30 hover:decoration-primary/50"
                >
                  Precisa calcular em detalhe? Use o simulador ↓
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          MOBILE LAYOUT — redesigned, mobile-first
          ═══════════════════════════════════════════════ */}
      <div className="md:hidden relative z-20 px-5 pt-[72px] pb-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          {/* ── Headline block — compact ── */}
          <div className="mb-5">
            <h1 className="text-[1.75rem] font-extrabold text-foreground leading-[1.15] tracking-tight mb-2">
              Guarde perto.<br />
              <span className="text-primary">Pague menos.</span>
            </h1>
            <p className="text-[13px] text-muted-foreground leading-relaxed max-w-[300px]">
              Espaços para guardar seus objetos perto de você, por diárias ou mensalidades.
            </p>
          </div>

          {/* ── Search card — lightweight ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="rounded-xl bg-card border border-border/80 shadow-lg shadow-foreground/[0.04] mb-4"
          >
            <div className="p-3 space-y-2.5">
              {/* Location */}
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 mb-1 block">
                  Localização
                </label>
                <LocationAutocomplete
                  value={location}
                  onChange={setLocation}
                  placeholder="Onde quer guardar?"
                  className="h-10 text-[14px] rounded-lg"
                />
              </div>

              {/* Dates + Volume — compact row */}
              <div className="grid grid-cols-2 gap-2">
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
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 mb-1 block">
                    Volume
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={volume}
                      onChange={(e) => setVolume(e.target.value)}
                      placeholder="m³"
                      className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-[14px] ring-offset-background placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 pr-9 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground/60 font-medium">m³</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <Button
                onClick={handleSearch}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-11 text-[14px] rounded-lg font-semibold gap-2 shadow-md shadow-accent/15"
              >
                <Search size={16} />
                Buscar espaços
              </Button>
            </div>
          </motion.div>

          {/* ── Secondary links — minimal ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="flex items-center justify-between px-0.5"
          >
            <Link
              to="/anunciar"
              className="text-[12px] font-medium text-primary hover:underline underline-offset-2"
            >
              Anunciar espaço →
            </Link>
            <a
              href="#simulador"
              className="text-[12px] text-muted-foreground/60 hover:text-primary transition-colors"
            >
              Simulador detalhado ↓
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
