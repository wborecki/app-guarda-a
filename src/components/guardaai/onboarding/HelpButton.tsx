import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, X, MessageCircle, BookOpen, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const FAQ_ITEMS = [
  {
    icon: Clock,
    q: "Quanto tempo leva o cadastro?",
    a: "Cerca de 5 minutos. Você pode salvar e continuar depois, sem perder nada.",
  },
  {
    icon: Shield,
    q: "Meus dados estão seguros?",
    a: "Sim! Seus dados pessoais e financeiros são criptografados e usados apenas para operar sua conta.",
  },
  {
    icon: BookOpen,
    q: "Posso editar depois de publicar?",
    a: "Sim, você pode editar seu anúncio a qualquer momento pelo painel do anfitrião.",
  },
  {
    icon: MessageCircle,
    q: "Como os locatários me encontram?",
    a: "Seu espaço aparecerá nos resultados de busca da plataforma. Fotos e uma boa descrição ajudam muito!",
  },
];

const HelpButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating button — positioned on the left to avoid conflict with chat widget */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 left-6 z-40 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors flex items-center justify-center group"
        aria-label="Preciso de ajuda"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={20} />
            </motion.div>
          ) : (
            <motion.div key="help" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <HelpCircle size={20} />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 left-6 z-40 w-[calc(100vw-3rem)] max-w-sm bg-card rounded-2xl border border-border shadow-2xl overflow-hidden"
          >
            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-foreground">Precisa de ajuda?</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Dúvidas frequentes sobre o cadastro do espaço.
                </p>
              </div>

              <div className="space-y-2.5">
                {FAQ_ITEMS.map((item, i) => (
                  <details key={i} className="group">
                    <summary className="flex items-center gap-2.5 cursor-pointer select-none p-2.5 rounded-lg hover:bg-secondary/50 transition-colors">
                      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <item.icon size={13} className="text-primary" />
                      </div>
                      <span className="text-xs font-medium text-foreground flex-1">{item.q}</span>
                    </summary>
                    <div className="pl-12 pr-2 pb-2">
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{item.a}</p>
                    </div>
                  </details>
                ))}
              </div>

              <div className="pt-2 border-t border-border/50">
                <p className="text-[10px] text-muted-foreground text-center">
                  Ainda com dúvida? Entre em contato com nosso suporte.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HelpButton;
