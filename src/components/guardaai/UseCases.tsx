import { motion } from "framer-motion";
import { Truck, Hammer, Plane, Home, Store, KeyRound, Sofa, CalendarRange } from "lucide-react";

const cases = [
  { icon: Truck, title: "Mudança", desc: "Guarde seus móveis e caixas durante a transição entre imóveis." },
  { icon: Hammer, title: "Reforma", desc: "Proteja seus pertences enquanto a obra acontece em casa." },
  { icon: Plane, title: "Viagem longa", desc: "Armazene com segurança o que não vai usar durante um período fora." },
  { icon: Home, title: "Falta de espaço em casa", desc: "Libere espaço sem precisar se desfazer das suas coisas." },
  { icon: Store, title: "Estoque do negócio", desc: "Guarde produtos e materiais do seu negócio perto de você." },
  { icon: KeyRound, title: "Transição de imóvel", desc: "Ideal para quem está saindo de um lugar e ainda não entrou no próximo." },
  { icon: Sofa, title: "Guarda temporária de móveis", desc: "Uma solução prática para guardar móveis por dias ou meses." },
  { icon: CalendarRange, title: "Objetos sazonais", desc: "Guarde itens que usa só em alguns períodos do ano." },
];

const UseCases = () => {
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
            Para quem é o GuardaAí?
          </h2>
          <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto">
            Soluções para diferentes situações do dia a dia.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {cases.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-4 md:p-5 rounded-xl md:rounded-2xl bg-card border hover:border-primary/30 hover:shadow-md transition-all text-center group"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mx-auto mb-2 md:mb-3 transition-colors">
                <c.icon size={20} className="text-primary md:w-6 md:h-6" />
              </div>
              <h3 className="font-semibold text-foreground text-xs md:text-sm mb-0.5 md:mb-1">{c.title}</h3>
              <p className="text-[10px] md:text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;
