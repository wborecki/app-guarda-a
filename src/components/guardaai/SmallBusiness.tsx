import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Store, Package, MapPin, ArrowRight } from "lucide-react";

const cards = [
  { icon: ShoppingBag, title: "Lojistas online", desc: "Estoque perto dos clientes, sem pagar caro." },
  { icon: Store, title: "Marketplace", desc: "Para quem vende no Mercado Livre, Shopee ou Amazon." },
  { icon: Package, title: "Pequenos e-commerces", desc: "Micro-hub urbano para operação local." },
  { icon: MapPin, title: "Estoques locais", desc: "Estoque em pontos estratégicos da cidade." },
];

const SmallBusiness = () => {
  return (
    <section className="py-16 md:py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs md:text-sm font-semibold mb-3 md:mb-4">
            <Store size={14} />
            Para pequenos negócios
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3 md:mb-4">
            Estoque mais perto, sem pagar caro
          </h2>
          <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto">
            Guarde estoques de forma acessível e próxima.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 max-w-5xl mx-auto mb-8 md:mb-10">
          {cards.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="p-4 md:p-6 rounded-xl md:rounded-2xl bg-card border hover:shadow-lg hover:border-accent/20 transition-all"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-accent/10 flex items-center justify-center mb-3 md:mb-4">
                <c.icon size={20} className="text-accent md:w-6 md:h-6" />
              </div>
              <h3 className="font-semibold text-foreground text-xs md:text-base mb-1 md:mb-2">{c.title}</h3>
              <p className="text-[10px] md:text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-sm md:text-base px-6 md:px-8 h-11 md:h-11 group" asChild>
            <a href="#simulador">
              Simular armazenamento
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SmallBusiness;
