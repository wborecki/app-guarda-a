import { motion } from "framer-motion";
import { Camera, FileText, ShieldAlert, Ban, UserX, Clock, Shield, Handshake, Lock, Home } from "lucide-react";

const userFeatures = [
  { icon: Camera, title: "Cadastro com foto", desc: "Objetos e veículos fotografados e registrados na plataforma." },
  { icon: FileText, title: "Termos claros", desc: "Responsabilidade aceita por ambas as partes." },
  { icon: ShieldAlert, title: "Declaração de responsabilidade", desc: "Natureza e estado dos itens ou veículos declarados." },
  { icon: Handshake, title: "Intermediação digital", desc: "Segurança na comunicação e transações." },
];

const hostFeatures = [
  { icon: Ban, title: "Itens proibidos", desc: "Drogas, armas, explosivos e itens ilegais vetados." },
  { icon: UserX, title: "Direito de recusa", desc: "Objetos ou veículos fora das regras podem ser recusados." },
  { icon: Clock, title: "Regra de abandono", desc: "Itens não retirados no prazo são tratados conforme termos." },
  { icon: Shield, title: "Proteção para você", desc: "Regras claras contra uso indevido do espaço." },
];

const SecurityCard = ({ f, i, variant }: { f: typeof userFeatures[0]; i: number; variant: "primary" | "accent" }) => (
  <motion.div
    key={i}
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: i * 0.06 }}
    className="flex items-start gap-3 p-3 md:p-6 rounded-xl md:rounded-2xl bg-card border border-border/60 hover:shadow-md transition-shadow"
  >
    <div className={`w-8 h-8 md:w-11 md:h-11 rounded-lg md:rounded-xl ${variant === "primary" ? "bg-primary/8" : "bg-accent/8"} flex items-center justify-center shrink-0`}>
      <f.icon size={16} className={`md:w-[18px] md:h-[18px] ${variant === "primary" ? "text-primary" : "text-accent"}`} />
    </div>
    <div className="min-w-0">
      <h3 className="font-semibold text-foreground text-[12.5px] md:text-sm mb-0.5 md:mb-1 leading-tight">{f.title}</h3>
      <p className="text-[11px] md:text-xs text-muted-foreground/75 leading-relaxed">{f.desc}</p>
    </div>
  </motion.div>
);

const Security = () => {
  return (
    <section id="seguranca" className="py-10 md:py-20 bg-secondary/40">
      <div className="container px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6 md:mb-14"
        >
          <h2 className="text-[1.3rem] md:text-4xl font-bold text-foreground mb-1.5 md:mb-4 leading-tight">
            Segurança e confiança
          </h2>
          <p className="text-muted-foreground text-[13px] md:text-lg max-w-2xl mx-auto">
            Regras claras para proteger objetos, veículos e todas as partes envolvidas.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto space-y-6 md:space-y-12">
          <div>
            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-[13px] md:text-xl font-bold text-foreground mb-3 md:mb-6 text-center"
            >
              <Lock size={15} className="inline mr-1.5 text-primary md:w-[18px] md:h-[18px]" />
              Para quem guarda
            </motion.h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6">
              {userFeatures.map((f, i) => (
                <SecurityCard key={i} f={f} i={i} variant="primary" />
              ))}
            </div>
          </div>

          <div>
            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-[13px] md:text-xl font-bold text-foreground mb-3 md:mb-6 text-center"
            >
              <Home size={15} className="inline mr-1.5 text-accent md:w-[18px] md:h-[18px]" />
              Para quem oferece espaço
            </motion.h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6">
              {hostFeatures.map((f, i) => (
                <SecurityCard key={i} f={f} i={i} variant="accent" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Security;
