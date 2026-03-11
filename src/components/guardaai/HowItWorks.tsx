import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MapPin, Calculator, CreditCard, Truck, Home, Camera, Send, Banknote, ClipboardList } from "lucide-react";

const stepsGuardar = [
  { icon: ClipboardList, title: "Escolha o que guardar", desc: "Selecione os objetos que precisa armazenar" },
  { icon: MapPin, title: "Localização e tempo", desc: "Diga onde você está e por quanto tempo precisa" },
  { icon: Calculator, title: "Cálculo automático", desc: "Calculamos a metragem e volume necessários" },
  { icon: CreditCard, title: "Reserve e pague", desc: "Pagamento seguro pela plataforma" },
  { icon: Truck, title: "Leve seus objetos", desc: "Transporte seus itens para o espaço escolhido" },
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
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="flex items-start gap-4 md:flex-col md:items-center md:text-center p-4"
  >
    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl ${variant === "primary" ? "bg-primary/10" : "bg-accent/10"} flex items-center justify-center shrink-0 relative`}>
      <step.icon size={22} className={variant === "primary" ? "text-primary" : "text-accent"} />
      <span className={`absolute -top-1.5 -right-1.5 w-5 h-5 md:w-6 md:h-6 rounded-full ${variant === "primary" ? "bg-primary" : "bg-accent"} text-${variant === "primary" ? "primary" : "accent"}-foreground text-[10px] md:text-xs font-bold flex items-center justify-center`}>
        {index + 1}
      </span>
    </div>
    <div>
      <h3 className="font-semibold text-foreground text-sm mb-0.5">{step.title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
    </div>
  </motion.div>
);

const HowItWorks = () => {
  return (
    <section id="como-funciona" className="py-14 md:py-20 bg-secondary/50">
      <div className="container">
        <motion.div {...fadeIn} transition={{ duration: 0.5 }} className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3 md:mb-4">
            Como funciona o GuardaAí?
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Simples, rápido e sem complicação.
          </p>
        </motion.div>

        <Tabs defaultValue="guardar" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-6 md:mb-10 h-11 md:h-12">
            <TabsTrigger value="guardar" className="text-sm md:text-base font-semibold">
              Quero guardar
            </TabsTrigger>
            <TabsTrigger value="espaco" className="text-sm md:text-base font-semibold">
              Tenho espaço
            </TabsTrigger>
          </TabsList>

          <TabsContent value="guardar">
            <div className="flex flex-col gap-1 md:grid md:grid-cols-5 md:gap-4">
              {stepsGuardar.map((step, i) => (
                <StepCard key={i} step={step} index={i} variant="primary" />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="espaco">
            <div className="flex flex-col gap-1 md:grid md:grid-cols-5 md:gap-4">
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
