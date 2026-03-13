import { motion } from "framer-motion";
import { Truck, Hammer, Plane, Home, Store, Car, Sailboat, CalendarRange, Bike, Sofa, Package } from "lucide-react";

const cases = [
  { icon: Truck, title: "Mudança", desc: "Guarde móveis e caixas durante a transição." },
  { icon: Car, title: "Guardar veículo", desc: "Estacione carros, motos ou SUVs em vagas seguras." },
  { icon: Hammer, title: "Reforma", desc: "Proteja pertences enquanto a obra acontece." },
  { icon: Sailboat, title: "Barcos e jet skis", desc: "Encontre espaço para embarcações fora de temporada." },
  { icon: Plane, title: "Viagem longa", desc: "Guarde o que não vai usar — objetos ou veículos." },
  { icon: Home, title: "Falta de espaço", desc: "Libere espaço em casa sem se desfazer das coisas." },
  { icon: Store, title: "Estoque do negócio", desc: "Guarde produtos e materiais perto dos clientes." },
  { icon: Bike, title: "Bikes e motos", desc: "Vagas compactas para duas rodas, perto de casa." },
  { icon: Sofa, title: "Guarda de móveis", desc: "Solução prática por dias ou meses." },
  { icon: Package, title: "Objetos sazonais", desc: "Itens de temporada guardados com praticidade." },
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
            Soluções para quem precisa guardar objetos, veículos ou estoque.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4">
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
