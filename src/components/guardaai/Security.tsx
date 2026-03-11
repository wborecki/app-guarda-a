import { motion } from "framer-motion";
import { Camera, FileText, ShieldAlert, Ban, Clock, UserX, Shield, Handshake, Lock, Home } from "lucide-react";

const userFeatures = [
  { icon: Camera, title: "Cadastro com foto", desc: "Objetos fotografados e registrados na plataforma." },
  { icon: FileText, title: "Termos claros", desc: "Responsabilidade aceita por ambas as partes." },
  { icon: ShieldAlert, title: "Declaração de responsabilidade", desc: "Natureza e estado dos objetos declarados." },
  { icon: Handshake, title: "Intermediação digital", desc: "Segurança na comunicação e transações." },
];

const hostFeatures = [
  { icon: Ban, title: "Itens proibidos", desc: "Drogas, armas, explosivos e itens ilegais vetados." },
  { icon: UserX, title: "Direito de recusa", desc: "Objetos fora das regras podem ser recusados." },
  { icon: Clock, title: "Regra de abandono", desc: "Objetos não retirados no prazo são tratados conforme termos." },
  { icon: Shield, title: "Proteção para você", desc: "Regras claras contra uso indevido do espaço." },
];

const SecurityCard = ({ f, i, variant }: { f: typeof userFeatures[0]; i: number; variant: "primary" | "accent" }) => (
  <motion.div
    key={i}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: i * 0.08 }}
    className="flex items-start gap-3 md:flex-col md:items-start p-4 md:p-6 rounded-xl md:rounded-2xl bg-card border hover:shadow-md transition-shadow"
  >
    <div className={`w-9 h-9 md:w-11 md:h-11 rounded-lg md:rounded-xl ${variant === "primary" ? "bg-primary/10" : "bg-accent/10"} flex items-center justify-center shrink-0`}>
      <f.icon size={18} className={variant === "primary" ? "text-primary" : "text-accent"} />
    </div>
    <div>
      <h3 className="font-semibold text-foreground text-sm mb-0.5 md:mb-1">{f.title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
    </div>
  </motion.div>
);

const Security = () => {
  return (
    <section id="seguranca" className="py-14 md:py-20 bg-secondary/50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-14"
        >
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3 md:mb-4">
            Segurança e confiança
          </h2>
          <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto">
            Regras claras e intermediação digital para proteger todos.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto space-y-8 md:space-y-12">
          <div>
            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-base md:text-xl font-bold text-foreground mb-4 md:mb-6 text-center"
            >
              <Lock size={18} className="inline mr-2 text-primary" />
              Para quem guarda objetos
            </motion.h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
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
              className="text-base md:text-xl font-bold text-foreground mb-4 md:mb-6 text-center"
            >
              <Home size={18} className="inline mr-2 text-accent" />
              Para quem oferece espaço
            </motion.h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
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
