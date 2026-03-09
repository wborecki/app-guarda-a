import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LocationAutocomplete from "@/components/guardaai/LocationAutocomplete";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Search, Ruler, DollarSign, MapPin, Zap } from "lucide-react";

const objectOptions = [
  { value: "caixa-pequena", label: "Caixa pequena", area: 0.25, vol: 0.06 },
  { value: "caixa-media", label: "Caixa média", area: 0.36, vol: 0.14 },
  { value: "caixa-grande", label: "Caixa grande", area: 0.5, vol: 0.3 },
  { value: "mala", label: "Mala", area: 0.4, vol: 0.15 },
  { value: "bicicleta", label: "Bicicleta", area: 1.2, vol: 0.6 },
  { value: "sofa", label: "Sofá", area: 3, vol: 2 },
  { value: "cama", label: "Cama", area: 3.5, vol: 1.5 },
  { value: "guarda-roupa", label: "Guarda-roupa", area: 1.8, vol: 2.5 },
  { value: "mesa", label: "Mesa", area: 1.5, vol: 0.8 },
  { value: "geladeira", label: "Geladeira", area: 0.8, vol: 1.2 },
  { value: "estoque-ecommerce", label: "Estoque de e-commerce", area: 4, vol: 3 },
  { value: "mudanca-completa", label: "Mudança completa", area: 15, vol: 20 },
  { value: "item-personalizado", label: "Item personalizado", area: 1, vol: 0.5 },
];

const Simulator = () => {
  const [selectedObject, setSelectedObject] = useState("");
  const [qty, setQty] = useState("1");
  const [location, setLocation] = useState("");
  const [period, setPeriod] = useState("");
  const [spaceType, setSpaceType] = useState("");
  const [usage, setUsage] = useState("");
  const [showResult, setShowResult] = useState(false);

  const obj = objectOptions.find((o) => o.value === selectedObject);
  const quantity = parseInt(qty) || 1;
  const totalArea = obj ? Math.max(obj.area * quantity, 1) : 0;
  const totalVol = obj ? obj.vol * quantity : 0;
  const days = period === "semanal" ? 7 : period === "quinzenal" ? 15 : period === "mensal" ? 30 : period === "trimestral" ? 90 : 1;
  const dailyRate = days >= 30 ? 1.5 : 2;
  const estimatedPrice = totalArea * dailyRate * days;

  const handleSimulate = () => {
    if (selectedObject && period) {
      setShowResult(true);
    }
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-4 mb-5 md:mb-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">O que deseja guardar?</label>
                  <Select value={selectedObject} onValueChange={(v) => { setSelectedObject(v); setShowResult(false); }}>
                    <SelectTrigger className="h-11 md:h-10">
                      <SelectValue placeholder="Selecione um objeto" />
                    </SelectTrigger>
                    <SelectContent>
                      {objectOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Quantidade</label>
                  <Input
                    type="number"
                    min="1"
                    value={qty}
                    onChange={(e) => { setQty(e.target.value); setShowResult(false); }}
                    placeholder="1"
                    className="h-11 md:h-10"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Cidade ou bairro</label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ex: São Paulo, Pinheiros"
                    className="h-11 md:h-10"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Período</label>
                  <Select value={period} onValueChange={(v) => { setPeriod(v); setShowResult(false); }}>
                    <SelectTrigger className="h-11 md:h-10">
                      <SelectValue placeholder="Selecione o período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diario">Diário</SelectItem>
                      <SelectItem value="semanal">Semanal (7 dias)</SelectItem>
                      <SelectItem value="quinzenal">Quinzenal (15 dias)</SelectItem>
                      <SelectItem value="mensal">Mensal (30 dias)</SelectItem>
                      <SelectItem value="trimestral">Trimestral (90 dias)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                disabled={!selectedObject || !period}
              >
                <Search size={18} className="mr-2" />
                Simular agora
              </Button>

              {showResult && obj && (
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
                      <p className="text-[10px] md:text-xs text-muted-foreground">Preço estimado</p>
                      <p className="text-base md:text-lg font-bold text-foreground">R${estimatedPrice.toFixed(2)}</p>
                    </div>
                  </div>
                  <p className="text-[10px] md:text-xs text-muted-foreground mt-3 md:mt-4 text-center">
                    * Valores estimados. O preço final inclui taxa de serviço.
                  </p>
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
