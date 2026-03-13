import { motion } from "framer-motion";
import { Check, X, Clock, TrendingDown, Sparkles, CheckCircle, Info, DollarSign, Timer, User, Brush } from "lucide-react";
import { PRICING_EXPLANATION, MIN_VOLUME, MIN_DAILY_RATE, PRICE_HIGHLIGHTS, CLEANING_FEE_RATE, CLEANING_FEE_MIN, CLEANING_FEE_MAX, CLEANING_FEE_THRESHOLD_DAYS } from "@/lib/pricing";

const Pricing = () => {
  return (
    <section id="precos" className="py-10 md:py-24 bg-secondary/40">
      <div className="container max-w-6xl px-5 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6 md:mb-10"
        >
          <span className="inline-block px-2.5 py-1 rounded-full bg-primary/8 text-primary text-[11px] font-semibold mb-2.5 tracking-wide">
            Precificação transparente
          </span>
          <h2 className="text-[1.3rem] md:text-4xl font-extrabold text-foreground mb-1.5 tracking-tight leading-tight">
            Preços flexíveis, com referência transparente
          </h2>
          <p className="text-muted-foreground text-[13px] md:text-base max-w-xl mx-auto">
            Na GuardaAí, cada anfitrião define seu próprio preço. A plataforma sugere valores com base no volume e na duração da reserva, mas a decisão final é do anfitrião.
          </p>
        </motion.div>

        {/* Bloco 1 — Comparação */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6 md:mb-10"
        >
          <div className="grid md:grid-cols-2 rounded-2xl overflow-hidden border border-border/60 shadow-sm">
            {/* Self storage */}
            <div className="bg-muted/30 p-5 md:p-8 flex flex-col justify-center border-b md:border-b-0 md:border-r border-border">
              <p className="text-[10px] md:text-xs uppercase tracking-[0.15em] text-muted-foreground/70 font-semibold mb-2.5">Self storage tradicional</p>
              <div className="flex items-baseline gap-1.5 mb-3">
                <span className="text-2xl md:text-5xl font-black text-muted-foreground/30 line-through decoration-destructive/40 decoration-2">R$80–150</span>
                <span className="text-[11px] md:text-sm text-muted-foreground/60">/m³ mês</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-muted-foreground/55 text-[11px] md:text-sm">
                  <X size={13} className="text-destructive/50 shrink-0" /> Contratos longos
                </div>
                <div className="flex items-center gap-2 text-muted-foreground/55 text-[11px] md:text-sm">
                  <X size={13} className="text-destructive/50 shrink-0" /> Localização limitada
                </div>
                <div className="flex items-center gap-2 text-muted-foreground/55 text-[11px] md:text-sm">
                  <X size={13} className="text-destructive/50 shrink-0" /> Preço fixo, sem flexibilidade
                </div>
              </div>
            </div>

            {/* GuardaAí */}
            <div className="bg-primary text-primary-foreground p-5 md:p-8 flex flex-col justify-center relative">
              <div className="absolute top-2.5 right-2.5 md:top-4 md:right-4 px-2.5 py-0.5 rounded-full bg-accent text-accent-foreground text-[9px] md:text-[10px] font-bold uppercase tracking-wider">
                Economize até 70%
              </div>
              <p className="text-[10px] md:text-xs uppercase tracking-[0.15em] text-primary-foreground/50 font-semibold mb-2.5">GuardaAí</p>
              <div className="flex items-baseline gap-1.5 mb-1">
                <span className="text-[11px] md:text-sm text-primary-foreground/60">a partir de</span>
                <span className="text-2xl md:text-5xl font-black">R$1,50</span>
                <span className="text-[11px] md:text-sm text-primary-foreground/45">/m³/dia</span>
              </div>
              <p className="text-[10px] md:text-xs text-primary-foreground/35 mb-3">Preço definido pelo anfitrião · Sem taxa de serviço</p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-primary-foreground/80 text-[11px] md:text-sm">
                  <Check size={13} className="text-accent shrink-0" /> Anfitrião define o preço
                </div>
                <div className="flex items-center gap-2 text-primary-foreground/80 text-[11px] md:text-sm">
                  <Check size={13} className="text-accent shrink-0" /> Sem contrato longo
                </div>
                <div className="flex items-center gap-2 text-primary-foreground/80 text-[11px] md:text-sm">
                  <Check size={13} className="text-accent shrink-0" /> Espaços perto de você
                </div>
                <div className="flex items-center gap-2 text-primary-foreground/80 text-[11px] md:text-sm">
                  <Check size={13} className="text-accent shrink-0" /> Aceita por hora (mínimo 1 diária)
                </div>
                <div className="flex items-center gap-2 text-primary-foreground/80 text-[11px] md:text-sm">
                  <Check size={13} className="text-accent shrink-0" /> Sem taxa de serviço
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bloco 2 — Como funciona */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6 md:mb-10"
        >
          <div className="grid md:grid-cols-3 gap-4">
            {/* Como funciona */}
            <div className="p-5 rounded-xl bg-card border border-border/60">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <User size={18} className="text-primary" />
              </div>
              <h3 className="text-sm font-bold text-foreground mb-1.5">Como funciona</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Os preços dos espaços são definidos pelos anfitriões. A GuardaAí sugere uma faixa de referência para ajudar na precificação, mas não impõe uma tabela fixa.
              </p>
            </div>

            {/* Valor mínimo */}
            <div className="p-5 rounded-xl bg-card border border-border/60">
              <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
                <DollarSign size={18} className="text-accent" />
              </div>
              <h3 className="text-sm font-bold text-foreground mb-1.5">Valor mínimo</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                O valor mínimo de anúncio é de R$ {MIN_DAILY_RATE.toFixed(2).replace(".", ",")}/m³ por diária. Reservas por horas são permitidas, com cobrança mínima equivalente a 1 diária. Volume mínimo: {MIN_VOLUME} m³.
              </p>
            </div>

            {/* Reservas longas */}
            <div className="p-5 rounded-xl bg-card border border-border/60">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <Brush size={18} className="text-primary" />
              </div>
              <h3 className="text-sm font-bold text-foreground mb-1.5">Reservas mais longas</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Para reservas acima de {CLEANING_FEE_THRESHOLD_DAYS} dias, o anfitrião pode optar por cobrar uma taxa de limpeza. Sugestão: R$ {CLEANING_FEE_RATE.toFixed(2).replace(".", ",")}/m³, mínimo R$ {CLEANING_FEE_MIN} e máximo R$ {CLEANING_FEE_MAX}.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Bloco 3 — Sugestão de preço da plataforma */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-5 md:mb-8"
        >
          <h3 className="text-[12.5px] md:text-sm font-semibold text-foreground mb-1 text-center">Referência de preço sugerida pela GuardaAí</h3>
          <p className="text-[10px] md:text-xs text-muted-foreground text-center mb-3">Valores sugeridos por m³/dia — o anfitrião define o preço final</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            {PRICE_HIGHLIGHTS.map((h, i) => {
              const isPopular = h.days === 30;
              const icons = [Timer, Clock, Sparkles, TrendingDown];
              const Icon = icons[i];
              return (
                <div
                  key={i}
                  className={`flex flex-col items-center gap-1.5 p-3 md:p-5 rounded-xl transition-shadow ${
                    isPopular
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/15 ring-1 ring-primary/20"
                      : "bg-card border border-border/60 hover:shadow-md"
                  }`}
                >
                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center shrink-0 ${
                    isPopular ? "bg-primary-foreground/15" : "bg-primary/8"
                  }`}>
                    <Icon size={16} className={`md:w-5 md:h-5 ${isPopular ? "text-primary-foreground" : "text-primary"}`} />
                  </div>
                  <p className={`text-[10px] md:text-xs font-medium ${isPopular ? "text-primary-foreground/60" : "text-muted-foreground/70"}`}>
                    {h.label}
                  </p>
                  {isPopular && (
                    <span className="px-1.5 py-0.5 rounded bg-accent text-accent-foreground text-[8px] md:text-[9px] font-bold uppercase">Melhor valor</span>
                  )}
                  <p className={`text-base md:text-xl font-extrabold ${isPopular ? "" : "text-foreground"}`}>
                    R${h.suggestedRate.toFixed(2).replace(".", ",")}
                    <span className={`text-[10px] md:text-xs font-normal ${isPopular ? "text-primary-foreground/50" : "text-muted-foreground"}`}>/m³/dia</span>
                  </p>
                  <p className={`text-[9px] md:text-[10px] ${isPopular ? "text-primary-foreground/40" : "text-muted-foreground/50"}`}>
                    valor sugerido
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Bloco 4 — Transparência */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-center md:gap-8 py-2 md:py-4 px-1 md:px-0">
            <div className="flex items-center gap-2 text-[11px] md:text-xs text-muted-foreground/70">
              <CheckCircle size={13} className="text-primary shrink-0" />
              <span>Cobrança mínima: {MIN_VOLUME} m³</span>
            </div>
            <div className="hidden md:block w-px h-4 bg-border" />
            <div className="flex items-center gap-2 text-[11px] md:text-xs text-muted-foreground/70">
              <DollarSign size={13} className="text-primary shrink-0" />
              <span>Sem taxa de serviço</span>
            </div>
            <div className="hidden md:block w-px h-4 bg-border" />
            <div className="flex items-center gap-2 text-[11px] md:text-xs text-muted-foreground/70">
              <TrendingDown size={13} className="text-primary shrink-0" />
              <span>Mínimo R$ {MIN_DAILY_RATE.toFixed(2).replace(".", ",")}/m³/dia</span>
            </div>
          </div>

          {/* Explanation */}
          <div className="mt-3 p-4 rounded-xl bg-card border border-border/60 max-w-xl mx-auto">
            <div className="flex items-start gap-2">
              <Info size={14} className="text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-foreground mb-1">Transparência</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Antes de concluir a reserva, o valor total é exibido com clareza, incluindo eventuais custos aplicáveis pelo anfitrião. Não há taxas ocultas ou surpresas.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
