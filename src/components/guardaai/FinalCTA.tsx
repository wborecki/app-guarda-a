import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Home, Sparkles } from "lucide-react";

const FinalCTA = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const simulatorHref = isHomePage ? "#simulador" : "/#simulador";
  return (
    <section className="py-20 md:py-36">
      <div className="container max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative max-w-5xl mx-auto rounded-[2rem] md:rounded-[2.5rem] bg-primary overflow-hidden shadow-2xl shadow-primary/25"
        >
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-primary-foreground/5 blur-2xl" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-accent/15 blur-2xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary-foreground/[0.02]" />
          </div>

          <div className="relative px-8 py-14 md:px-16 md:py-20 lg:px-24 lg:py-24 text-center">
            {/* Small badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-foreground/10 text-primary-foreground/80 text-xs font-semibold mb-6 md:mb-8 backdrop-blur-sm border border-primary-foreground/10">
              <Sparkles size={14} />
              Comece agora mesmo
            </div>

            <h2 className="text-3xl md:text-5xl lg:text-[3.5rem] font-extrabold text-primary-foreground mb-4 md:mb-6 tracking-tight leading-[1.15]">
              Precisa de espaço para<br className="hidden md:block" /> guardar suas coisas?
            </h2>

            <p className="text-base md:text-xl text-primary-foreground/70 mb-10 md:mb-12 max-w-xl mx-auto leading-relaxed font-medium">
              Encontre espaços perto de você e pague muito menos que um self storage tradicional.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground text-base md:text-lg px-8 md:px-10 h-13 md:h-14 group shadow-xl shadow-accent/30 font-semibold rounded-xl md:rounded-2xl w-full sm:w-auto"
                asChild
              >
                <a href={simulatorHref}>
                  Encontrar um espaço
                  <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button
                size="lg"
                className="bg-primary-foreground/15 hover:bg-primary-foreground/25 text-primary-foreground border border-primary-foreground/25 hover:border-primary-foreground/40 font-semibold text-base md:text-lg px-8 md:px-10 h-13 md:h-14 rounded-xl md:rounded-2xl backdrop-blur-sm transition-all duration-300 w-full sm:w-auto"
                asChild
              >
                <Link to="/anunciar">
                  <Home size={18} className="mr-2" />
                  Anunciar meu espaço
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
