import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Package, ArrowRight, TrendingDown, MapPin, Briefcase, Home } from "lucide-react";
import heroBg from "@/assets/hero-bg-new.jpg";

const highlights = [
  { icon: TrendingDown, text: "Mais barato que self storage tradicional" },
  { icon: MapPin, text: "Espaços perto de você" },
  { icon: Briefcase, text: "Ideal para mudanças, reformas, viagens e estoque" },
  { icon: Home, text: "Ganhe dinheiro com espaço vazio" },
];

const Hero = () => {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Background image - hidden on mobile for cleaner look */}
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
            "linear-gradient(90deg, hsl(var(--background) / 0.98) 0%, hsl(var(--background) / 0.93) 28%, hsl(var(--background) / 0.72) 48%, hsl(var(--background) / 0.38) 64%, hsl(var(--background) / 0.16) 78%, transparent 100%)",
        }}
      />

      <div
        className="absolute inset-x-0 bottom-0 h-24 z-10 hidden md:block"
        style={{
          background: "linear-gradient(to top, hsl(var(--background) / 0.85), transparent)",
        }}
        aria-hidden="true"
      />

      {/* Mobile: subtle gradient bg instead of image */}
      <div
        className="absolute inset-0 z-0 md:hidden"
        style={{
          background: "linear-gradient(160deg, hsl(var(--background)) 0%, hsl(var(--primary) / 0.06) 50%, hsl(var(--background)) 100%)",
        }}
        aria-hidden="true"
      />

      <div className="container relative z-20 min-h-[auto] md:min-h-[90vh] flex items-center py-16 pt-24 md:py-32">
        <div className="max-w-2xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full bg-primary/10 backdrop-blur-sm text-primary text-xs md:text-sm font-medium mb-4 md:mb-6 border border-primary/20">
              <Package size={14} className="md:w-4 md:h-4" />
              Self storage descentralizado
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-3 md:mb-4">
              Guarde perto.<br />
              <span className="text-primary">Pague menos.</span>
            </h1>

            <p className="text-lg md:text-2xl font-semibold text-foreground/80 mb-1.5 md:mb-2">
              O jeito mais barato de guardar suas coisas.
            </p>

            <p className="text-sm md:text-lg text-muted-foreground mb-6 md:mb-8 max-w-lg">
              Encontre espaços para armazenar seus objetos perto de você, por diárias ou mensalidades.
            </p>

            {/* Mobile: chips layout. Desktop: grid cards */}
            <div className="hidden md:grid grid-cols-2 gap-3 mb-8">
              {highlights.map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-card/75 backdrop-blur-sm border border-border/50 hover:shadow-sm transition-shadow"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <h.icon size={18} className="text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{h.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Mobile chips */}
            <div className="flex flex-wrap gap-2 mb-6 md:hidden">
              {highlights.map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-card border border-border/60 text-xs font-medium text-foreground"
                >
                  <h.icon size={13} className="text-primary shrink-0" />
                  {h.text}
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-base px-8 group shadow-lg h-12 md:h-11" asChild>
                <a href="#simulador">
                  Quero guardar meus objetos
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 border-primary text-primary hover:bg-primary/5 bg-background/40 backdrop-blur-sm h-12 md:h-11"
                asChild
              >
                <Link to="/anunciar">Quero anunciar meu espaço</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
