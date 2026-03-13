import { motion } from "framer-motion";
import { CheckCircle, Info, DollarSign, Clock, Shield, Users, Sparkles } from "lucide-react";
import { MIN_VOLUME, MIN_DAILY_RATE, CLEANING_FEE_RATE, CLEANING_FEE_MIN, CLEANING_FEE_MAX, CLEANING_FEE_THRESHOLD_DAYS } from "@/lib/pricing";

const Pricing = () => {
  return (
    <section id="precos" className="py-14 md:py-24 bg-secondary/30">
      <div className="container max-w-4xl px-5 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-primary/8 text-primary text-[11px] font-semibold mb-3 tracking-wide">
            Precificação
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-foreground mb-3 tracking-tight leading-tight">
            Preços flexíveis, com transparência para todos
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Na GuardaAí, cada anfitrião define seu próprio preço. A plataforma sugere referências para ajudar na precificação, mas a decisão final é de quem anuncia o espaço, sempre respeitando o valor mínimo da plataforma.
          </p>
        </motion.div>

        {/* Rules grid */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-4 mb-8 md:mb-12"
        >
          {/* Como funciona */}
          <div className="p-6 rounded-2xl bg-card border border-border/50">
            <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center mb-4">
              <Users size={20} className="text-primary" />
            </div>
            <h3 className="text-sm font-bold text-foreground mb-2">Como funciona</h3>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              Os preços dos espaços são definidos pelos anfitriões. A GuardaAí sugere uma faixa de referência para ajudar na precificação, mas não impõe uma tabela fixa.
            </p>
          </div>

          {/* Valor mínimo */}
          <div className="p-6 rounded-2xl bg-card border border-border/50">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
              <DollarSign size={20} className="text-accent" />
            </div>
            <h3 className="text-sm font-bold text-foreground mb-2">Valor mínimo</h3>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              O valor mínimo de anúncio é de <span className="font-semibold text-foreground">R$ {MIN_DAILY_RATE.toFixed(2).replace(".", ",")}/m³ por diária</span>. Reservas por horas são permitidas, com cobrança mínima equivalente a 1 diária. Volume mínimo: {MIN_VOLUME} m³.
            </p>
          </div>

          {/* Reservas longas */}
          <div className="p-6 rounded-2xl bg-card border border-border/50">
            <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center mb-4">
              <Clock size={20} className="text-primary" />
            </div>
            <h3 className="text-sm font-bold text-foreground mb-2">Reservas mais longas</h3>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              Para reservas acima de {CLEANING_FEE_THRESHOLD_DAYS} dias, o anfitrião pode optar por cobrar uma taxa de limpeza. Sugestão: R$ {CLEANING_FEE_RATE.toFixed(2).replace(".", ",")}/m³, com mínimo de R$ {CLEANING_FEE_MIN} e máximo de R$ {CLEANING_FEE_MAX} por reserva.
            </p>
          </div>

          {/* Transparência */}
          <div className="p-6 rounded-2xl bg-card border border-border/50">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
              <Shield size={20} className="text-accent" />
            </div>
            <h3 className="text-sm font-bold text-foreground mb-2">Transparência total</h3>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              Antes de concluir a reserva, o valor total é exibido com clareza, incluindo eventuais custos do anfitrião. <span className="font-semibold text-foreground">Não há taxa de serviço da plataforma.</span>
            </p>
          </div>
        </motion.div>

        {/* Referência sugerida — sutil */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="p-5 rounded-2xl bg-card border border-border/40">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground mb-0.5">Referência de preço sugerida</p>
                <p className="text-[11px] text-muted-foreground">Valores sugeridos por m³/dia — o anfitrião define o preço final</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "1 dia", rate: "5,00" },
                { label: "7 dias", rate: "2,71" },
                { label: "15 dias", rate: "2,50" },
                { label: "30 dias", rate: "1,50" },
              ].map((h, i) => (
                <div key={i} className="text-center p-3 rounded-xl bg-secondary/60 border border-border/30">
                  <p className="text-[10px] text-muted-foreground mb-1">{h.label}</p>
                  <p className="text-sm font-bold text-foreground">R$ {h.rate}</p>
                  <p className="text-[9px] text-muted-foreground/60">/m³/dia</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bottom highlights */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-6 md:mt-8"
        >
          {[
            { icon: CheckCircle, text: `Volume mínimo: ${MIN_VOLUME} m³` },
            { icon: DollarSign, text: "Sem taxa de serviço" },
            { icon: Clock, text: "Aceita reservas por hora" },
          ].map(({ icon: Icon, text }, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[11px] md:text-xs text-muted-foreground/70">
              <Icon size={13} className="text-primary shrink-0" />
              <span>{text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
