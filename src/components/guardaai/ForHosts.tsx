import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home, ArrowRight } from "lucide-react";

const examples = [
  { area: "3 m²", income: "R$ 135/mês", desc: "Uma garagem pequena" },
  { area: "5 m²", income: "R$ 225/mês", desc: "Um quarto vazio" },
  { area: "10 m²", income: "R$ 450/mês", desc: "Um depósito médio" },
];

const ForHosts = () => {
  return (
    <section id="anfitriao" className="py-16 md:py-32 bg-secondary/50">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs md:text-sm font-semibold mb-4 md:mb-6">
              <Home size={14} />
              Para quem tem espaço sobrando
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3 md:mb-4">
              Transforme espaço vazio em renda extra.
            </h2>
            <p className="text-muted-foreground text-sm md:text-lg mb-6 md:mb-8">
              Garagens, quartos vazios e depósitos podem virar uma nova fonte de renda. Cadastre e comece a ganhar.
            </p>

            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-sm md:text-base px-6 md:px-8 h-11 group" asChild>
              <Link to="/anunciar">
                Quero anunciar meu espaço
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-3 md:space-y-4"
          >
            {examples.map((ex, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-4 md:p-6 rounded-xl md:rounded-2xl bg-card border flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">{ex.desc}</p>
                  <p className="font-semibold text-foreground text-sm md:text-base">{ex.area} disponíveis</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] md:text-xs text-muted-foreground">Renda estimada</p>
                  <p className="text-lg md:text-xl font-bold text-primary">{ex.income}</p>
                </div>
              </motion.div>
            ))}
            <p className="text-[10px] md:text-xs text-muted-foreground text-center">
              * Valores ilustrativos baseados em R$45/m² por mês.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ForHosts;
