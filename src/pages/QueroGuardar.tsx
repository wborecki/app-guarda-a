import Header from "@/components/guardaai/Header";
import Footer from "@/components/guardaai/Footer";
import Simulator from "@/components/guardaai/Simulator";
import { motion } from "framer-motion";
import { Shield, Clock, DollarSign, MapPin, CheckCircle2 } from "lucide-react";

const steps = [
  { icon: MapPin, title: "Busque", desc: "Encontre espaços disponíveis perto de você." },
  { icon: Clock, title: "Reserve", desc: "Escolha as datas e reserve em poucos cliques." },
  { icon: CheckCircle2, title: "Guarde", desc: "Leve seus itens e pronto. Simples assim." },
];

const benefits = [
  { icon: DollarSign, text: "Até 60% mais barato que self storage" },
  { icon: Shield, text: "Seguro e com registro fotográfico" },
  { icon: Clock, text: "Flexibilidade de datas e volumes" },
  { icon: MapPin, text: "Espaços espalhados pela cidade" },
];

const QueroGuardar = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero compacto */}
        <section className="pt-24 md:pt-32 pb-8 md:pb-12">
          <div className="container max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4 leading-tight">
                Guarde suas coisas por<br className="hidden md:block" /> muito menos
              </h1>
              <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto mb-2">
                Encontre espaços disponíveis perto de você e pague até 60% menos que um self storage tradicional.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Simulador — componente reutilizado */}
        <Simulator />

        {/* Como funciona — resumido */}
        <section className="py-14 md:py-20">
          <div className="container max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-10 tracking-tight">
              Como funciona
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {steps.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                    <step.icon size={22} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefícios compactos */}
        <section className="py-12 md:py-16 bg-secondary/30">
          <div className="container max-w-3xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.08 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-background border border-border/60"
                >
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-accent/15 text-accent flex items-center justify-center">
                    <b.icon size={18} />
                  </div>
                  <span className="text-sm font-medium text-foreground">{b.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default QueroGuardar;
