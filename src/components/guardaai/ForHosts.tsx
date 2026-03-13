import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home, ArrowRight } from "lucide-react";

const examples = [
  { area: "3 m³", income: "R$ 135/mês", desc: "Uma garagem pequena" },
  { area: "5 m³", income: "R$ 225/mês", desc: "Um quarto vazio" },
  { area: "10 m³", income: "R$ 450/mês", desc: "Um depósito médio" },
];

const ForHosts = () => {
  return (
    <section id="anfitriao" className="py-10 md:py-20 bg-secondary/40">
      <div className="container px-5 md:px-8">
        <div className="grid lg:grid-cols-2 gap-6 md:gap-12 items-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-1.5 px-2.5 md:px-4 py-1 md:py-1.5 rounded-full bg-accent/8 text-accent text-[11px] md:text-sm font-semibold mb-3 md:mb-6">
              <Home size={13} />
              Para quem tem espaço sobrando
            </div>
            <h2 className="text-[1.3rem] md:text-4xl font-bold text-foreground mb-2 md:mb-4 leading-tight">
              Transforme espaço vazio em renda extra.
            </h2>
            <p className="text-muted-foreground text-[13px] md:text-lg mb-4 md:mb-8 leading-relaxed">
              Garagens, vagas, quartos vazios e depósitos podem virar uma nova fonte de renda — para guardar objetos ou veículos. Cadastre e comece a ganhar.
            </p>

            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-[13px] md:text-base px-5 md:px-8 h-10 md:h-11 group" asChild>
              <Link to="/anunciar">
                Quero anunciar meu espaço
                <ArrowRight size={16} className="ml-1.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-2 md:space-y-4"
          >
            {examples.map((ex, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-3.5 md:p-6 rounded-xl md:rounded-2xl bg-card border border-border/60 flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <p className="text-[11px] md:text-sm text-muted-foreground/70">{ex.desc}</p>
                  <p className="font-semibold text-foreground text-[13px] md:text-base">{ex.area} disponíveis</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] md:text-xs text-muted-foreground/60">Renda estimada</p>
                  <p className="text-base md:text-xl font-bold text-primary">{ex.income}</p>
                </div>
              </motion.div>
            ))}
            <p className="text-[9px] md:text-xs text-muted-foreground/55 text-center">
              * Valores ilustrativos baseados em R$45/m³ por mês.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ForHosts;
