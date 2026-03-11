import { motion } from "framer-motion";
import { DollarSign, MapPin, Zap, Calendar, Wallet, ShieldCheck } from "lucide-react";

const items = [
  { icon: DollarSign, title: "Muito mais barato", desc: "Pague muito menos que um self storage tradicional." },
  { icon: MapPin, title: "Espaços perto de casa", desc: "Encontre opções no seu bairro, sem atravessar a cidade." },
  { icon: Zap, title: "Reserva simples e rápida", desc: "Escolha, reserve e pague online em minutos." },
  { icon: Calendar, title: "Curtos e longos períodos", desc: "Guarde por dias, semanas ou meses. Flexibilidade total." },
  { icon: Wallet, title: "Renda extra garantida", desc: "Transforme espaço ocioso em dinheiro." },
  { icon: ShieldCheck, title: "Segurança na plataforma", desc: "Cadastro com foto, termos claros e intermediação digital." },
];

const Differentials = () => {
  return (
    <section className="py-10 md:py-20">
      <div className="container px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6 md:mb-14"
        >
          <h2 className="text-[1.3rem] md:text-4xl font-bold text-foreground mb-1.5 md:mb-4 leading-tight">
            Por que escolher o GuardaAí?
          </h2>
          <p className="text-muted-foreground text-[13px] md:text-lg max-w-2xl mx-auto">
            Vantagens que fazem do GuardaAí a melhor opção.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 md:gap-6">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="group flex flex-col items-center text-center md:items-start md:text-left p-3.5 md:p-6 rounded-xl md:rounded-2xl bg-card border border-border/60 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-9 h-9 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-primary/8 group-hover:bg-primary/15 flex items-center justify-center shrink-0 mb-2 md:mb-3 transition-colors">
                <item.icon size={18} className="text-primary md:w-6 md:h-6" />
              </div>
              <h3 className="text-[12.5px] md:text-lg font-semibold text-foreground mb-0.5 md:mb-2 leading-tight">{item.title}</h3>
              <p className="text-[11px] md:text-sm text-muted-foreground/75 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Differentials;
