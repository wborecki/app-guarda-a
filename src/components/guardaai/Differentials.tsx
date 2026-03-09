import { motion } from "framer-motion";
import { DollarSign, MapPin, Zap, Calendar, Wallet, ShieldCheck } from "lucide-react";

const items = [
  { icon: DollarSign, title: "Mais barato que self storage", desc: "Preços até 60% menores que self storages tradicionais." },
  { icon: MapPin, title: "Espaços perto de casa", desc: "Encontre opções no seu bairro, sem atravessar a cidade." },
  { icon: Zap, title: "Reserva simples e rápida", desc: "Escolha, reserve e pague online em minutos." },
  { icon: Calendar, title: "Curtos e longos períodos", desc: "Guarde por dias, semanas ou meses. Flexibilidade total." },
  { icon: Wallet, title: "Renda extra garantida", desc: "Transforme espaço ocioso em dinheiro." },
  { icon: ShieldCheck, title: "Segurança na plataforma", desc: "Cadastro com foto, termos claros e intermediação digital." },
];

const Differentials = () => {
  return (
    <section className="py-16 md:py-28">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-14"
        >
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3 md:mb-4">
            Por que escolher o GuardaAí?
          </h2>
          <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto">
            Vantagens que fazem do GuardaAí a melhor opção.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group flex items-start gap-4 md:flex-col md:items-start p-4 md:p-6 rounded-xl md:rounded-2xl bg-card border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center shrink-0 transition-colors">
                <item.icon size={20} className="text-primary md:w-6 md:h-6" />
              </div>
              <div>
                <h3 className="text-sm md:text-lg font-semibold text-foreground mb-0.5 md:mb-2">{item.title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Differentials;
