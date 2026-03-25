import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, Camera, Wallet, ArrowRight, Sparkles, Shield, BookOpen } from "lucide-react";

interface WelcomeModalProps {
  onStart: () => void;
}

const CHECKLIST = [
  { icon: Camera, text: "Fotos do espaço (opcional, mas recomendado)" },
  { icon: Wallet, text: "Chave Pix para recebimento" },
  { icon: Clock, text: "Cerca de 5 minutos do seu tempo" },
];

const STEPS_PREVIEW = [
  { num: 1, label: "Dados básicos", desc: "Local, tipo e dimensões" },
  { num: 2, label: "Disponibilidade", desc: "Dias, horários e preço" },
  { num: 3, label: "Descrição", desc: "Detalhes e regras" },
  { num: 4, label: "Fotos", desc: "Imagens do espaço" },
  { num: 5, label: "Recebimento", desc: "Dados de pagamento" },
  { num: 6, label: "Revisão", desc: "Conferir e publicar" },
];

const WelcomeModal = ({ onStart }: WelcomeModalProps) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="w-full max-w-lg bg-card rounded-2xl shadow-2xl border border-border overflow-hidden"
        >
          {/* Header */}
          <div className="relative px-6 pt-8 pb-6 text-center bg-gradient-to-b from-primary/5 to-transparent">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 mb-4">
              <Sparkles size={24} className="text-accent" />
            </div>
            <h2 className="text-xl font-bold text-foreground">
              Bem-vindo ao cadastro do seu espaço!
            </h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
              Vamos te guiar em cada etapa para criar um anúncio atrativo. 
              É rápido, simples e você pode salvar e continuar depois.
            </p>
          </div>

          {/* Content */}
          <div className="px-6 pb-6 space-y-5">
            {/* Steps timeline */}
            <div>
              <p className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
                <BookOpen size={12} className="text-primary" />
                6 etapas simples
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {STEPS_PREVIEW.map(s => (
                  <div key={s.num} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-secondary/40">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-accent/10 text-accent text-[10px] font-bold shrink-0 mt-0.5">
                      {s.num}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold text-foreground leading-tight">{s.label}</p>
                      <p className="text-[10px] text-muted-foreground leading-tight">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What you'll need */}
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
              <p className="text-xs font-semibold text-foreground mb-2.5">O que ter em mãos:</p>
              <div className="space-y-2">
                {CHECKLIST.map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <item.icon size={12} className="text-primary" />
                    </div>
                    <span className="text-xs text-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust badge */}
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <Shield size={12} className="text-primary shrink-0" />
              <span>Seus dados são protegidos. Você pode salvar o rascunho a qualquer momento.</span>
            </div>

            {/* CTA */}
            <Button
              onClick={() => { setVisible(false); onStart(); }}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold h-12 text-sm group"
            >
              Começar cadastro
              <ArrowRight size={16} className="ml-1.5 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WelcomeModal;
