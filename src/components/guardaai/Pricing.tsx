import { motion } from "framer-motion";
import { Check, X, Clock, TrendingDown, Sparkles, CheckCircle, Calculator, Percent } from "lucide-react";

const Pricing = () => {
  return (
    <section id="precos" className="py-16 md:py-24 bg-secondary/50">
      <div className="container max-w-6xl">
        {/* Header — compact */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-10"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3 tracking-wide">
            Precificação transparente
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-foreground mb-2 tracking-tight">
            Pague muito menos que o mercado
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto">
            Preço por espaço. Sem surpresas. Sem contratos longos.
          </p>
        </motion.div>

        {/* Bloco 1 — Comparação editorial horizontal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 md:mb-10"
        >
          <div className="grid md:grid-cols-2 rounded-2xl overflow-hidden border shadow-sm">
            {/* Self storage */}
            <div className="bg-muted/40 p-6 md:p-8 flex flex-col justify-center border-b md:border-b-0 md:border-r border-border">
              <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold mb-3">Self storage tradicional</p>
              <div className="flex items-baseline gap-1.5 mb-4">
                <span className="text-3xl md:text-5xl font-black text-muted-foreground/35 line-through decoration-destructive/40 decoration-2">R$80–150</span>
                <span className="text-sm text-muted-foreground">/m² mês</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground/60 text-xs md:text-sm">
                  <X size={14} className="text-destructive/50 shrink-0" /> Contratos longos
                </div>
                <div className="flex items-center gap-2 text-muted-foreground/60 text-xs md:text-sm">
                  <X size={14} className="text-destructive/50 shrink-0" /> Localização limitada
                </div>
                <div className="flex items-center gap-2 text-muted-foreground/60 text-xs md:text-sm">
                  <X size={14} className="text-destructive/50 shrink-0" /> Pouca flexibilidade
                </div>
              </div>
            </div>

            {/* GuardaAí */}
            <div className="bg-primary text-primary-foreground p-6 md:p-8 flex flex-col justify-center relative">
              <div className="absolute top-3 right-3 md:top-4 md:right-4 px-3 py-1 rounded-full bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-wider">
                Economize até 70%
              </div>
              <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-primary-foreground/60 font-semibold mb-3">GuardaAí</p>
              <div className="flex items-baseline gap-1.5 mb-4">
                <span className="text-3xl md:text-5xl font-black">R$40</span>
                <span className="text-sm text-primary-foreground/50">/m² mês</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary-foreground/80 text-xs md:text-sm">
                  <Check size={14} className="text-accent shrink-0" /> Diárias a partir de R$1,50/m²
                </div>
                <div className="flex items-center gap-2 text-primary-foreground/80 text-xs md:text-sm">
                  <Check size={14} className="text-accent shrink-0" /> Sem contrato longo
                </div>
                <div className="flex items-center gap-2 text-primary-foreground/80 text-xs md:text-sm">
                  <Check size={14} className="text-accent shrink-0" /> Espaços perto de você
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bloco 2 — Modelo de cobrança: faixa horizontal compacta */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6 md:mb-8"
        >
          <div className="grid md:grid-cols-3 gap-3 md:gap-4">
            <div className="flex items-center gap-4 p-4 md:p-5 rounded-xl bg-card border hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Clock size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Diária</p>
                <p className="text-lg md:text-xl font-extrabold text-foreground">R$1,50<span className="text-xs font-normal text-muted-foreground">/m²</span></p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 md:p-5 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/15 ring-1 ring-primary/20">
              <div className="w-10 h-10 rounded-xl bg-primary-foreground/15 flex items-center justify-center shrink-0">
                <TrendingDown size={20} className="text-primary-foreground" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-primary-foreground/60 font-medium">Mensalidade</p>
                  <span className="px-1.5 py-0.5 rounded bg-accent text-accent-foreground text-[9px] font-bold uppercase">Popular</span>
                </div>
                <p className="text-lg md:text-xl font-extrabold">R$40<span className="text-xs font-normal text-primary-foreground/50">/m²</span></p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 md:p-5 rounded-xl bg-card border hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                <Sparkles size={20} className="text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Cálculo automático</p>
                <p className="text-lg md:text-xl font-extrabold text-foreground">Zero complicação</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bloco 3 — Regras rápidas: linha discreta */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-6 md:gap-8 py-3 md:py-4 px-4 md:px-0">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle size={14} className="text-primary shrink-0" />
              <span>Cobrança mínima: 1 m²</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-border" />
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calculator size={14} className="text-primary shrink-0" />
              <span>Taxa de serviço no checkout</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-border" />
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Percent size={14} className="text-primary shrink-0" />
              <span>Mais tempo = menor valor por dia</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
