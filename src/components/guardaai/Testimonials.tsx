import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Carla M.",
    role: "Guardou durante reforma",
    text: "Encontrei um espaço a 3 quadras de casa. Simples e muito mais barato que um self storage.",
  },
  {
    name: "Lucas P.",
    role: "Estudante",
    text: "Fui fazer intercâmbio e deixei tudo num quarto vazio pelo GuardaAí. Voltei e estava tudo perfeito.",
  },
  {
    name: "Ana R.",
    role: "Lojista online",
    text: "Achei um depósito pagando metade do que um galpão comercial custaria.",
  },
  {
    name: "Roberto S.",
    role: "Anunciante de espaço",
    text: "Minha garagem ficava vazia o dia todo. Agora ganho quase R$400 por mês sem fazer nada.",
  },
];

const Testimonials = () => {
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
            O que nossos usuários dizem
          </h2>
          <p className="text-muted-foreground text-sm md:text-lg">
            Histórias reais de quem já usa o GuardaAí.
          </p>
        </motion.div>

        {/* Mobile: horizontal scroll. Desktop: grid */}
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-4 md:overflow-visible md:pb-0">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="min-w-[75vw] sm:min-w-[45vw] md:min-w-0 snap-center p-5 md:p-6 rounded-xl md:rounded-2xl bg-card border shrink-0"
            >
              <div className="flex gap-0.5 mb-2.5 md:mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={12} className="fill-accent text-accent md:w-3.5 md:h-3.5" />
                ))}
              </div>
              <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4 leading-relaxed">"{t.text}"</p>
              <div>
                <p className="font-semibold text-foreground text-xs md:text-sm">{t.name}</p>
                <p className="text-[10px] md:text-xs text-muted-foreground">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
