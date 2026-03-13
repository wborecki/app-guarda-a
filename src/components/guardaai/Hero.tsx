import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package, ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-bg-new.jpg";
import HeroSearchForm from "@/components/guardaai/HeroSearchForm";
import SocialProofBar from "@/components/guardaai/SocialProofBar";

const Hero = () => {
  return (
    <section className="relative isolate">
      {/* Background image — desktop only */}
      <div
        className="absolute inset-0 z-0 hidden md:block overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center right",
            backgroundRepeat: "no-repeat",
          }}
        />
      </div>
      <div
        className="absolute inset-0 z-10 hidden md:block"
        style={{
          background:
            "linear-gradient(90deg, hsl(var(--background)) 0%, hsl(var(--background) / 0.88) 22%, hsl(var(--background) / 0.55) 42%, hsl(var(--background) / 0.18) 58%, transparent 72%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-12 z-10 hidden md:block"
        style={{
          background: "linear-gradient(to top, hsl(var(--background) / 0.5), transparent)",
        }}
        aria-hidden="true"
      />
      {/* Mobile: clean, subtle gradient */}
      <div
        className="absolute inset-0 z-0 md:hidden"
        style={{
          background: "linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--primary) / 0.04) 60%, hsl(var(--background)) 100%)",
        }}
        aria-hidden="true"
      />

      {/* ═══ DESKTOP LAYOUT ═══ */}
      <div className="hidden md:flex container relative z-20 min-h-[92vh] items-center">
        <div className="max-w-[720px] w-full py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <div className="mb-11">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 backdrop-blur-sm text-primary text-xs font-semibold mb-6 border border-primary/20">
                <Package size={14} />
                Armazenamento descentralizado
              </div>
              <h1 className="text-5xl lg:text-[3.6rem] font-extrabold text-foreground leading-[1.12] mb-7 tracking-tight">
                Guarde perto.<br />
                <span className="text-primary">Pague menos.</span>
              </h1>
              <p className="text-[17px] text-muted-foreground max-w-lg leading-relaxed">
                Encontre espaços para armazenar seus objetos perto de você, por horas, diárias ou mensalidades.
              </p>
            </div>

            <div>
              <HeroSearchForm variant="desktop" />

              <div className="flex flex-row items-center gap-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-sm border-primary/40 text-primary hover:bg-primary/5 bg-card/80 backdrop-blur-sm font-medium px-5"
                  asChild
                >
                  <Link to="/anunciar">Quero anunciar meu espaço</Link>
                </Button>
                <span className="text-border">|</span>
                <Link
                  to="/quero-guardar"
                  className="text-sm text-muted-foreground/85 hover:text-primary transition-colors hover:underline underline-offset-4 decoration-muted-foreground/30 hover:decoration-primary/50"
                >
                  Precisa calcular em detalhe? Use o simulador →
                </Link>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                className="mt-7 pt-5 border-t border-border/40"
              >
                <SocialProofBar className="justify-start" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ═══ MOBILE LAYOUT ═══ */}
      <div className="md:hidden relative z-20 px-5 pt-[62px] pb-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="mb-6 pt-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/8 text-primary text-[11px] font-semibold mb-4 border border-primary/12">
              <Package size={12} />
              Armazenamento descentralizado
            </div>
            <h1 className="text-[1.85rem] font-extrabold text-foreground leading-[1.13] tracking-tight mb-3">
              Guarde perto.{" "}
              <span className="text-primary">Pague menos.</span>
            </h1>
            <p className="text-[13.5px] text-muted-foreground/80 leading-[1.55] max-w-[310px]">
              Encontre espaços para guardar seus objetos perto de você, por horas, diárias ou mensalidades.
            </p>
          </div>

          <HeroSearchForm variant="mobile" />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-3 px-1"
          >
            <Link
              to="/anunciar"
              className="inline-flex items-center gap-1 text-[12.5px] font-medium text-primary/90 hover:text-primary transition-colors"
            >
              Anunciar espaço
              <ArrowRight size={12} className="opacity-60" />
            </Link>
            <span className="w-px h-3.5 bg-border" />
            <Link
              to="/quero-guardar"
              className="inline-flex items-center gap-1 text-[12.5px] text-muted-foreground/65 hover:text-primary transition-colors"
            >
              Simulador detalhado
              <ArrowRight size={12} className="opacity-50" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-5 pt-4 border-t border-border/30"
          >
            <SocialProofBar />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
