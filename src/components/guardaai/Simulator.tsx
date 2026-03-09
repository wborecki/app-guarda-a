import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format, differenceInDays } from "date-fns";
import { pt } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import LocationAutocomplete from "@/components/guardaai/LocationAutocomplete";
import ItemDimensionInput, { type AddedItem } from "@/components/guardaai/ItemDimensionInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Search, Ruler, DollarSign, Zap, CalendarIcon, MapPin, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { calculatePrice, PRICING_HINT_SHORT, SERVICE_FEE } from "@/lib/pricing";

const Simulator = () => {
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

  const totalArea = Math.max(
    items.reduce((sum, i) => sum + ((i.largura / 100) * (i.comprimento / 100)) * i.quantidade, 0),
    items.length > 0 ? 1 : 0
  );
  const totalVol = items.reduce((sum, i) => sum + ((i.altura / 100) * (i.largura / 100) * (i.comprimento / 100)) * i.quantidade, 0);

  const days = (deliveryDate && pickupDate) ? Math.max(differenceInDays(pickupDate, deliveryDate), 1) : 0;

  const price = calculatePrice(totalArea, days);

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
    navigate("/buscar", {
      state: {
        items,
        location,
        days,
        spaceType,
        usage,
        totalArea,
        totalVol,
        estimatedPrice: price.subtotal,
        deliveryDate: deliveryDate?.toISOString(),
        deliveryTime,
        pickupDate: pickupDate?.toISOString(),
        pickupTime,
      },
    });
  };

  return (
    <section id="simulador" className="py-16 md:py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs md:text-sm font-semibold mb-3 md:mb-4">
            <Zap size={14} />
            Feature central do produto
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3 md:mb-4">
            Simulador de armazenamento
          </h2>
          <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto">
            Descubra quanto espaço você precisa e quanto vai pagar.
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
              <div className="mb-5">
                <ItemDimensionInput items={items} onItemsChange={handleItemsChange} />
              </div>

              <div className="mb-5 md:mb-4">
                <label className="text-sm font-medium text-foreground mb-2 block">Seu endereço</label>
                <LocationAutocomplete
                  value={location}
                  onChange={setLocation}
                  placeholder="Ex: São Paulo, Pinheiros"
                  className="h-11 md:h-10"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 md:mb-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Data e hora de entrega</label>
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "flex-1 justify-start text-left font-normal h-11 md:h-10",
                            !deliveryDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {deliveryDate ? format(deliveryDate, "dd/MM/yyyy", { locale: pt }) : "Data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={deliveryDate}
                          onSelect={setDeliveryDate}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <Input
                      type="time"
                      value={deliveryTime}
                      onChange={(e) => setDeliveryTime(e.target.value)}
                      className="w-24 h-11 md:h-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Data e hora de retirada</label>
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "flex-1 justify-start text-left font-normal h-11 md:h-10",
                            !pickupDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {pickupDate ? format(pickupDate, "dd/MM/yyyy", { locale: pt }) : "Data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={pickupDate}
                          onSelect={setPickupDate}
                          disabled={(date) => date < (deliveryDate || new Date())}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <Input
                      type="time"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-24 h-11 md:h-10"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 md:mb-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Tipo de espaço</label>
                  <Select value={spaceType} onValueChange={setSpaceType}>
                    <SelectTrigger className="h-11 md:h-10">
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
                  <label className="text-sm font-medium text-foreground mb-2 block">Uso</label>
                  <Select value={usage} onValueChange={setUsage}>
                    <SelectTrigger className="h-11 md:h-10">
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
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base h-12"
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
                  <div className="grid grid-cols-3 gap-3 md:gap-4">
                    <div className="text-center">
                      <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-1.5 md:mb-2">
                        <Ruler size={18} className="text-primary" />
                      </div>
                      <p className="text-[10px] md:text-xs text-muted-foreground">Área estimada</p>
                      <p className="text-base md:text-lg font-bold text-foreground">{totalArea.toFixed(1)} m²</p>
                    </div>
                    <div className="text-center">
                      <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-1.5 md:mb-2">
                        <Package size={18} className="text-primary" />
                      </div>
                      <p className="text-[10px] md:text-xs text-muted-foreground">Volume</p>
                      <p className="text-base md:text-lg font-bold text-foreground">{totalVol.toFixed(1)} m³</p>
                    </div>
                    <div className="text-center">
                      <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-1.5 md:mb-2">
                        <DollarSign size={18} className="text-accent" />
                      </div>
                      <p className="text-[10px] md:text-xs text-muted-foreground">Estimativa ({days} dias)</p>
                      <p className="text-base md:text-lg font-bold text-foreground">R${price.subtotal.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Rate tier info */}
                  <div className="mt-4 p-3 rounded-lg bg-background/60 border border-border/40">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Faixa aplicada</span>
                      <span className="font-semibold text-foreground">{price.tierLabel}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Valor por m²/dia</span>
                      <span className="font-semibold text-foreground">R${price.dailyRate.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">+ Taxa de serviço (12%)</span>
                      <span className="font-semibold text-muted-foreground">adicionada no checkout</span>
                    </div>
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
                      {PRICING_HINT_SHORT} O preço final inclui taxa de serviço de 12%.
                    </p>
                  </div>
                </motion.div>
              )}

              <p className="text-[10px] md:text-xs text-muted-foreground mt-3 md:mt-4 text-center">
                O sistema calcula automaticamente a metragem e encontra o melhor espaço.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Simulator;
