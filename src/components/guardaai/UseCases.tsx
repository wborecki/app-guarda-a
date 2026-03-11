import { motion } from "framer-motion";
import { Truck, Hammer, Plane, Home, Store, KeyRound, Sofa, CalendarRange } from "lucide-react";

const cases = [
  { icon: Truck, title: "Mudança", desc: "Guarde móveis e caixas durante a transição." },
  { icon: Hammer, title: "Reforma", desc: "Proteja pertences enquanto a obra acontece." },
  { icon: Plane, title: "Viagem longa", desc: "Armazene o que não vai usar por um tempo." },
  { icon: Home, title: "Falta de espaço", desc: "Libere espaço sem se desfazer das coisas." },
  { icon: Store, title: "Estoque do negócio", desc: "Guarde produtos e materiais perto de você." },
  { icon: KeyRound, title: "Mudança de escritório", desc: "Guarde equipamentos na troca de ponto." },
  { icon: Sofa, title: "Guarda de móveis", desc: "Solução prática por dias ou meses." },
  { icon: CalendarRange, title: "Objetos sazonais", desc: "Guarde itens que usa só em certas épocas." },
];

const UseCases = () => {
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
            Para quem é o GuardaAí?
          </h2>
          <p className="text-muted-foreground text-[13px] md:text-lg max-w-2xl mx-auto">
            Soluções para quando falta espaço ou sobra coisa.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          {cases.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="p-3 md:p-5 rounded-xl md:rounded-2xl bg-card border border-border/60 hover:border-primary/30 hover:shadow-md transition-all text-center group"
            >
              <div className="w-9 h-9 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-primary/8 group-hover:bg-primary/15 flex items-center justify-center mx-auto mb-1.5 md:mb-3 transition-colors">
                <c.icon size={17} className="text-primary md:w-6 md:h-6" />
              </div>
              <h3 className="font-semibold text-foreground text-[11.5px] md:text-sm mb-0.5 md:mb-1 leading-tight">{c.title}</h3>
              <p className="text-[10px] md:text-xs text-muted-foreground/70 leading-relaxed">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;
