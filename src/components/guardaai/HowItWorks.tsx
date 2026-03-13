import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MapPin, Calculator, CreditCard, Truck, Home, Camera, Send, Banknote, ClipboardList } from "lucide-react";

const stepsGuardar = [
  { icon: ClipboardList, title: "Escolha o que guardar", desc: "Selecione objetos ou veículos que precisa armazenar" },
  { icon: MapPin, title: "Localização e tempo", desc: "Diga onde você está e por quanto tempo precisa" },
  { icon: Calculator, title: "Cálculo automático", desc: "Calculamos a metragem e espaço necessários" },
  { icon: CreditCard, title: "Reserve e pague", desc: "Pagamento seguro pela plataforma" },
  { icon: Truck, title: "Leve seus itens", desc: "Transporte seus objetos ou veículos ao espaço" },
];

const stepsEspaco = [
  { icon: Home, title: "Cadastre seu espaço", desc: "Garagem, quarto, depósito ou área coberta" },
  { icon: Calculator, title: "Informe as dimensões", desc: "Altura, largura e comprimento disponíveis" },
  { icon: Camera, title: "Publique fotos", desc: "Fotos atraem mais clientes" },
  { icon: Send, title: "Receba solicitações", desc: "Aceite as reservas que fizerem sentido" },
  { icon: Banknote, title: "Ganhe renda extra", desc: "Receba pelo espaço parado" },
];

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const StepCard = ({ step, index, variant }: { step: typeof stepsGuardar[0]; index: number; variant: "primary" | "accent" }) => (
  <motion.div
    key={index}
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.08 }}
    className="flex items-start gap-3.5 md:flex-col md:items-center md:text-center py-3 px-1 md:p-4"
  >
    <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl ${variant === "primary" ? "bg-primary/8" : "bg-accent/8"} flex items-center justify-center shrink-0 relative`}>
      <step.icon size={18} className={`md:w-[22px] md:h-[22px] ${variant === "primary" ? "text-primary" : "text-accent"}`} />
      <span className={`absolute -top-1 -right-1 w-[18px] h-[18px] md:w-6 md:h-6 rounded-full ${variant === "primary" ? "bg-primary" : "bg-accent"} text-${variant === "primary" ? "primary" : "accent"}-foreground text-[9px] md:text-xs font-bold flex items-center justify-center`}>
        {index + 1}
      </span>
    </div>
    <div className="min-w-0">
      <h3 className="font-semibold text-foreground text-[13px] md:text-sm mb-0.5 leading-tight">{step.title}</h3>
      <p className="text-[11.5px] md:text-xs text-muted-foreground/75 leading-relaxed">{step.desc}</p>
    </div>
  </motion.div>
);

const HowItWorks = () => {
  return (
    <section id="como-funciona" className="py-10 md:py-20 bg-secondary/40">
      <div className="container px-5 md:px-8">
        <motion.div {...fadeIn} transition={{ duration: 0.5 }} className="text-center mb-7 md:mb-12">
          <h2 className="text-[1.35rem] md:text-4xl font-bold text-foreground mb-2 md:mb-4 leading-tight">
            Como funciona?
          </h2>
          <p className="text-muted-foreground text-[13px] md:text-lg max-w-2xl mx-auto leading-relaxed">
            Simples, rápido e sem complicação.
          </p>
        </motion.div>

        <Tabs defaultValue="guardar" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-5 md:mb-10 h-10 md:h-12 rounded-xl">
            <TabsTrigger value="guardar" className="text-[13px] md:text-base font-semibold rounded-lg">
              Quero guardar
            </TabsTrigger>
            <TabsTrigger value="espaco" className="text-[13px] md:text-base font-semibold rounded-lg">
              Tenho espaço
            </TabsTrigger>
          </TabsList>

          <TabsContent value="guardar">
            <div className="flex flex-col divide-y divide-border/40 md:divide-y-0 md:grid md:grid-cols-5 md:gap-4">
              {stepsGuardar.map((step, i) => (
                <StepCard key={i} step={step} index={i} variant="primary" />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="espaco">
            <div className="flex flex-col divide-y divide-border/40 md:divide-y-0 md:grid md:grid-cols-5 md:gap-4">
              {stepsEspaco.map((step, i) => (
                <StepCard key={i} step={step} index={i} variant="accent" />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default HowItWorks;
