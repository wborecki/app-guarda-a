import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { encodeSearchParams } from "@/lib/searchParams";
import { motion } from "framer-motion";
import { differenceInDays, isSameDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LocationAutocomplete from "@/components/guardaai/LocationAutocomplete";
import ItemDimensionInput, { type AddedItem } from "@/components/guardaai/ItemDimensionInput";
import DateRangePicker from "@/components/guardaai/DateRangePicker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Search, DollarSign, Zap, MapPin, Info, Clock } from "lucide-react";
import { calculatePrice, getSuggestedDailyRate, PRICING_HINT_SHORT, MIN_DAILY_RATE } from "@/lib/pricing";

interface SimulatorProps {
  embedded?: boolean;
}

const Simulator = ({ embedded = false }: SimulatorProps) => {
  const navigate = useNavigate();
  const [items, setItems] = useState<AddedItem[]>([]);
  const [location, setLocation] = useState("");

  const [spaceType, setSpaceType] = useState("");
  const [usage, setUsage] = useState("");
  const [showResult, setShowResult] = useState(false);

  const [deliveryDate, setDeliveryDate] = useState<Date>();
  const [deliveryTime, setDeliveryTime] = useState("09:00");
  const [pickupDate, setPickupDate] = useState<Date>();
  const [pickupTime, setPickupTime] = useState("09:00");

  const totalVol = Math.max(
    items.reduce((sum, i) => sum + ((i.altura / 100) * (i.largura / 100) * (i.comprimento / 100)) * i.quantidade, 0),
    items.length > 0 ? 1 : 0
  );

  // Detect same-day (hourly) vs multi-day reservation
  const isSameDayReservation = deliveryDate && pickupDate && isSameDay(deliveryDate, pickupDate);

  const days = (deliveryDate && pickupDate)
    ? (isSameDayReservation ? 0 : Math.max(differenceInDays(pickupDate, deliveryDate), 1))
    : 0;

  // Calculate hours for same-day reservations
  const calcHours = (): number => {
    if (!isSameDayReservation) return 0;
    const [dH, dM] = deliveryTime.split(":").map(Number);
    const [pH, pM] = pickupTime.split(":").map(Number);
    const diffMinutes = (pH * 60 + pM) - (dH * 60 + dM);
    return Math.max(Math.ceil(diffMinutes / 60), 1);
  };

  const hours = calcHours();

  // Use suggested daily rate for simulation (since we don't know the host's price yet)
  const effectiveDays = Math.max(isSameDayReservation ? 1 : days, 1);
  const suggestedRate = getSuggestedDailyRate(effectiveDays);
  const price = calculatePrice(totalVol, effectiveDays, suggestedRate, { hours: isSameDayReservation ? hours : undefined });

  const handleSimulate = () => {
    if (items.length > 0 && deliveryDate && pickupDate) {
      setShowResult(true);
    }
  };

  const handleItemsChange = (newItems: AddedItem[]) => {
    setItems(newItems);
    setShowResult(false);
  };

  const handleFindSpace = () => {
    const qs = encodeSearchParams({
      location,
      days: effectiveDays,
      hours: isSameDayReservation ? hours : undefined,
      totalVol,
      deliveryDate: deliveryDate?.toISOString(),
      deliveryTime,
      pickupDate: pickupDate?.toISOString(),
      pickupTime,
    });
    navigate(`/buscar?${qs}`);
  };

  const simulatorContent = (
    <div className="space-y-4">
      <div>
        <ItemDimensionInput items={items} onItemsChange={handleItemsChange} />
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Seu endereço</label>
        <LocationAutocomplete
          value={location}
          onChange={setLocation}
          placeholder="Ex: São Paulo, Pinheiros"
          className="h-10"
        />
      </div>

      {/* Date Range Picker + Time inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-3 items-end">
        <DateRangePicker
          deliveryDate={deliveryDate}
          pickupDate={pickupDate}
          onDeliveryChange={setDeliveryDate}
          onPickupChange={setPickupDate}
        />
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Hora entrada</label>
          <Input
            type="time"
            value={deliveryTime}
            onChange={(e) => { setDeliveryTime(e.target.value); setShowResult(false); }}
            className="w-24 h-10"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Hora retirada</label>
          <Input
            type="time"
            value={pickupTime}
            onChange={(e) => { setPickupTime(e.target.value); setShowResult(false); }}
            className="w-24 h-10"
          />
        </div>
      </div>

      {/* Same-day hint */}
      {isSameDayReservation && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-accent/10 border border-accent/20 text-xs">
          <Clock size={14} className="text-accent shrink-0" />
          <span className="text-foreground">
            <span className="font-semibold">Reserva por hora.</span>{" "}
            {hours > 0 && <>Duração estimada: <span className="font-bold text-accent">{hours}h</span>. Cobrança mínima de 1 diária.</>}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Tipo de espaço</label>
          <Select value={spaceType} onValueChange={setSpaceType}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Qualquer tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="qualquer">Qualquer tipo</SelectItem>
              <SelectItem value="garagem">Garagem</SelectItem>
              <SelectItem value="quarto">Quarto vazio</SelectItem>
              <SelectItem value="deposito">Depósito</SelectItem>
              <SelectItem value="area-coberta">Área coberta</SelectItem>
              <SelectItem value="galpao">Pequeno galpão</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Uso</label>
          <Select value={usage} onValueChange={setUsage}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pessoal">Uso pessoal</SelectItem>
              <SelectItem value="negocio">Pequeno negócio</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-sm font-semibold h-11"
        onClick={handleSimulate}
        disabled={items.length === 0 || !deliveryDate || !pickupDate}
      >
        <Search size={18} className="mr-2" />
        Simular agora
      </Button>

      {showResult && items.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-6 p-5 md:p-6 rounded-xl bg-primary-light border border-primary/20"
        >
          <h3 className="font-semibold text-foreground mb-4 text-sm md:text-base">Resultado da simulação</h3>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="text-center">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-1.5 md:mb-2">
                <Package size={18} className="text-primary" />
              </div>
              <p className="text-[10px] md:text-xs text-muted-foreground">Volume estimado</p>
              <p className="text-base md:text-lg font-bold text-foreground">{totalVol.toFixed(1)} m³</p>
            </div>
            <div className="text-center">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-1.5 md:mb-2">
                <DollarSign size={18} className="text-accent" />
              </div>
              <p className="text-[10px] md:text-xs text-muted-foreground">
                Estimativa ({isSameDayReservation ? `${hours}h` : `${effectiveDays} dias`})
              </p>
              <p className="text-base md:text-lg font-bold text-foreground">R${price.subtotal.toFixed(2)}</p>
            </div>
          </div>

          {/* Rate info */}
          <div className="mt-4 p-3 rounded-lg bg-background/60 border border-border/40">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">Valor sugerido por m³/dia</span>
              <span className="font-semibold text-foreground">R$ {suggestedRate.toFixed(2).replace(".", ",")}</span>
            </div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">Período cobrado</span>
              <span className="font-semibold text-accent">{effectiveDays} {effectiveDays === 1 ? "dia" : "dias"} (mínimo)</span>
            </div>
            {isSameDayReservation && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Horários</span>
                <span className="font-semibold text-foreground">{hours}h (cobrança mín. 1 diária)</span>
              </div>
            )}
          </div>

          <Button
            className="w-full mt-5 bg-primary hover:bg-primary/90 text-primary-foreground text-base h-12"
            onClick={handleFindSpace}
          >
            <MapPin size={18} className="mr-2" />
            Encontrar espaço disponível
          </Button>

          <div className="flex items-start gap-1.5 mt-3 md:mt-4 justify-center">
            <Info size={11} className="text-muted-foreground/50 shrink-0 mt-0.5" />
            <p className="text-[10px] md:text-xs text-muted-foreground text-center">
              {PRICING_HINT_SHORT} O preço final depende do valor definido pelo anfitrião.
            </p>
          </div>
        </motion.div>
      )}

      <p className="text-[10px] md:text-xs text-muted-foreground mt-3 md:mt-4 text-center">
        O sistema calcula automaticamente o volume e encontra o melhor espaço. Preço final definido pelo anfitrião.
      </p>
    </div>
  );

  if (embedded) {
    return <div className="p-5 md:p-6">{simulatorContent}</div>;
  }

  return (
    <section id="simulador" className="py-14 md:py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs md:text-sm font-semibold mb-3 md:mb-4">
            <Zap size={14} />
            Calcule em segundos
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3 md:mb-4">
            Simulador de armazenamento
          </h2>
          <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto">
            Descubra quanto espaço você precisa e veja uma estimativa de valor.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div className="p-5 md:p-10 rounded-2xl bg-card border shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-accent/3 pointer-events-none" />
            <div className="relative">
              {simulatorContent}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Simulator;
