import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Home } from "lucide-react";

const FinalCTA = () => {
  return (
    <section className="py-8 md:py-16">
      <div className="container max-w-3xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="relative rounded-2xl border border-border/60 bg-card overflow-hidden"
        >
          {/* Subtle background accent */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-accent/[0.03] pointer-events-none" />

          <div className="relative px-5 py-8 md:px-12 md:py-12 text-center">
            <h2 className="text-[1.15rem] md:text-2xl font-bold text-foreground mb-1.5 md:mb-2 tracking-tight leading-tight">
              Precisa guardar objetos ou veículos?
            </h2>

            <p className="text-[12.5px] md:text-sm text-muted-foreground mb-5 md:mb-6 max-w-md mx-auto leading-relaxed">
              Encontre espaços perto de você ou anuncie o seu e comece a gerar renda.
            </p>

            <div className="flex flex-col gap-2 sm:flex-row sm:gap-2.5 justify-center items-center">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground text-[13px] md:text-sm font-semibold px-5 md:px-6 h-10 group w-full sm:w-auto"
                asChild
              >
                <Link to="/quero-guardar">
                  Encontrar um espaço
                  <ArrowRight size={14} className="ml-1.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-[13px] md:text-sm font-semibold px-5 md:px-6 h-10 w-full sm:w-auto border-border/60"
                asChild
              >
                <Link to="/anunciar">
                  <Home size={13} className="mr-1.5" />
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
