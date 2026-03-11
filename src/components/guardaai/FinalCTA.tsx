import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Home } from "lucide-react";

const FinalCTA = () => {
  return (
    <section className="py-12 md:py-16">
      <div className="container max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="relative rounded-2xl border border-border/80 bg-card overflow-hidden"
        >
          {/* Subtle background accent */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-accent/[0.03] pointer-events-none" />

          <div className="relative px-6 py-10 md:px-12 md:py-12 text-center">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2 tracking-tight">
              Precisa de espaço para guardar suas coisas?
            </h2>

            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">
              Encontre espaços perto de você ou anuncie o seu e comece a gerar renda.
            </p>

            <div className="flex flex-col sm:flex-row gap-2.5 justify-center items-center">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground text-sm font-semibold px-6 h-10 group w-full sm:w-auto"
                asChild
              >
                <Link to="/quero-guardar">
                  Encontrar um espaço
                  <ArrowRight size={15} className="ml-1.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-sm font-semibold px-6 h-10 w-full sm:w-auto"
                asChild
              >
                <Link to="/anunciar">
                  <Home size={14} className="mr-1.5" />
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
