import { useState } from "react"; // hero-v2
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Package, Search, ArrowRight } from "lucide-react";
import { differenceInDays } from "date-fns";
import { encodeSearchParams } from "@/lib/searchParams";
import heroBg from "@/assets/hero-bg-new.jpg";
import LocationAutocomplete from "@/components/guardaai/LocationAutocomplete";
import DateRangePicker from "@/components/guardaai/DateRangePicker";
import ItemAutocomplete from "@/components/guardaai/ItemAutocomplete";
import type { ItemDimension } from "@/data/itemDimensions";

const Hero = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>();
  const [pickupDate, setPickupDate] = useState<Date | undefined>();
  const [selectedItem, setSelectedItem] = useState<ItemDimension | null>(null);
  const days = deliveryDate && pickupDate ? Math.max(differenceInDays(pickupDate, deliveryDate), 1) : 0;

  const itemVolume = selectedItem
    ? (selectedItem.altura * selectedItem.largura * selectedItem.comprimento) / 1_000_000
    : 0;

  const handleSearch = () => {
    const qs = encodeSearchParams({
      location: location || "São Paulo",
      days: days || 1,
      totalVol: itemVolume,
      deliveryDate: deliveryDate?.toISOString(),
      pickupDate: pickupDate?.toISOString(),
    });
    navigate(`/buscar?${qs}`);
  };

  return (
    <section className="relative isolate">
      {/* Background image — desktop only */}
      <div
        className="absolute inset-0 z-0 hidden md:block overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center right",
            backgroundRepeat: "no-repeat",
          }}
        />
      </div>
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
                Armazenamento descentralizado
              </div>
              <h1 className="text-5xl lg:text-[3.6rem] font-extrabold text-foreground leading-[1.12] mb-7 tracking-tight">
                Guarde perto.<br />
                <span className="text-primary">Pague menos.</span>
              </h1>
              <p className="text-[17px] text-muted-foreground max-w-lg leading-relaxed">
                Encontre espaços para armazenar seus objetos perto de você, por horas, diárias ou mensalidades.
              </p>
            </div>

            <div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.45 }}
                className="rounded-2xl bg-card border border-border shadow-2xl shadow-foreground/[0.08] mb-5 overflow-visible"
              >
                <div className="p-2.5 overflow-visible">
                  <div className="flex items-stretch gap-0">
                    <div className="flex-[1.4] min-w-0 px-4 py-3 rounded-xl hover:bg-muted/40 transition-colors">
                      <label className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                        Localização
                      </label>
                      <LocationAutocomplete
                        value={location}
                        onChange={setLocation}
                        placeholder="Onde quer guardar?"
                        compactGps
                        className="border-0 shadow-none bg-transparent h-9 px-0 text-[15px] font-medium placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                    <div className="w-px self-stretch my-3 bg-border" />
                    <div className="flex-[1.1] min-w-0 px-4 py-3 rounded-xl hover:bg-muted/40 transition-colors">
                      <DateRangePicker
                        deliveryDate={deliveryDate}
                        pickupDate={pickupDate}
                        onDeliveryChange={setDeliveryDate}
                        onPickupChange={setPickupDate}
                        compact
                      />
                    </div>
                    <div className="w-px self-stretch my-3 bg-border" />
                    <div className="relative flex-[1.2] min-w-0 px-4 py-3 rounded-xl hover:bg-muted/40 transition-colors">
                      <label className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                        O que guardar
                      </label>
                      <ItemAutocomplete
                        value={selectedItem}
                        onChange={setSelectedItem}
                        compact
                      />
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
                <Link
                  to="/quero-guardar"
                  className="text-sm text-muted-foreground/85 hover:text-primary transition-colors hover:underline underline-offset-4 decoration-muted-foreground/30 hover:decoration-primary/50"
                >
                  Precisa calcular em detalhe? Use o simulador →
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          MOBILE LAYOUT — premium mobile-first
          ═══════════════════════════════════════════════ */}
      <div className="md:hidden relative z-20 px-5 pt-[62px] pb-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* ── Headline block ── */}
          <div className="mb-6 pt-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/8 text-primary text-[11px] font-semibold mb-4 border border-primary/12">
              <Package size={12} />
              Self storage descentralizado
            </div>
            <h1 className="text-[1.85rem] font-extrabold text-foreground leading-[1.13] tracking-tight mb-3">
              Guarde perto.{" "}
              <span className="text-primary">Pague menos.</span>
            </h1>
            <p className="text-[13.5px] text-muted-foreground/80 leading-[1.55] max-w-[310px]">
              Encontre espaços para guardar seus objetos perto de você, por horas, diárias ou mensalidades.
            </p>
          </div>

          {/* ── Search card — clean & airy ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.45 }}
            className="rounded-2xl bg-card border border-border/60 shadow-xl shadow-foreground/[0.03] mb-5"
          >
            <div className="p-4 space-y-3">
              {/* Location */}
              <div>
                <label className="text-[10.5px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-1.5 block">
                  Localização
                </label>
                <LocationAutocomplete
                  value={location}
                  onChange={setLocation}
                  placeholder="Onde quer guardar?"
                  className="h-11 text-[14px] rounded-xl border-border/70"
                />
              </div>

              {/* Dates */}
              <div>
                <DateRangePicker
                  deliveryDate={deliveryDate}
                  pickupDate={pickupDate}
                  onDeliveryChange={setDeliveryDate}
                  onPickupChange={setPickupDate}
                  compact
                />
              </div>

              {/* O que guardar */}
              <div>
                <label className="text-[10.5px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-1.5 block">
                  O que guardar
                </label>
                <ItemAutocomplete
                  value={selectedItem}
                  onChange={setSelectedItem}
                />
              </div>

              {/* CTA */}
              <Button
                onClick={handleSearch}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-12 text-[15px] rounded-xl font-bold gap-2.5 shadow-lg shadow-accent/20 mt-1"
              >
                <Search size={17} />
                Buscar espaços
              </Button>
            </div>
          </motion.div>

          {/* ── Secondary links — polished row ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-3 px-1"
          >
            <Link
              to="/anunciar"
              className="inline-flex items-center gap-1 text-[12.5px] font-medium text-primary/90 hover:text-primary transition-colors"
            >
              Anunciar espaço
              <ArrowRight size={12} className="opacity-60" />
            </Link>
            <span className="w-px h-3.5 bg-border" />
            <Link
              to="/quero-guardar"
              className="inline-flex items-center gap-1 text-[12.5px] text-muted-foreground/65 hover:text-primary transition-colors"
            >
              Simulador detalhado
              <ArrowRight size={12} className="opacity-50" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
