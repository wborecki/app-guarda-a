import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Carla M.",
    role: "Guardou durante reforma",
    text: "Encontrei um espaço a 3 quadras de casa. Simples, prático e com preço justo.",
  },
  {
    name: "Lucas P.",
    role: "Guardou durante viagem",
    text: "Fui viajar por 3 meses e deixei tudo num quarto vazio pelo GuardaAí. Voltei e estava tudo perfeito.",
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateActiveIndex = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const childWidth = el.firstElementChild
      ? (el.firstElementChild as HTMLElement).offsetWidth + 12 // 12 = gap-3
      : 1;
    setActiveIndex(Math.round(scrollLeft / childWidth));
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateActiveIndex, { passive: true });
    return () => el.removeEventListener("scroll", updateActiveIndex);
  }, [updateActiveIndex]);

  const scrollTo = (index: number) => {
    const el = scrollRef.current;
    if (!el || !el.firstElementChild) return;
    const childWidth = (el.firstElementChild as HTMLElement).offsetWidth + 12;
    el.scrollTo({ left: childWidth * index, behavior: "smooth" });
  };

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
            O que nossos usuários dizem
          </h2>
          <p className="text-muted-foreground text-[13px] md:text-lg">
            Histórias reais de quem já usa o GuardaAí.
          </p>
        </motion.div>

        {/* Mobile: horizontal scroll. Desktop: grid */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory -mx-5 px-5 md:mx-0 md:px-0 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:pb-0 scrollbar-none"
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="min-w-[78vw] sm:min-w-[45vw] md:min-w-0 snap-center p-4 md:p-6 rounded-xl md:rounded-2xl bg-card border border-border/60 shrink-0"
            >
              <div className="flex gap-0.5 mb-2 md:mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={11} className="fill-accent text-accent md:w-3.5 md:h-3.5" />
                ))}
              </div>
              <p className="text-[11.5px] md:text-sm text-muted-foreground mb-3 md:mb-4 leading-relaxed">"{t.text}"</p>
              <div>
                <p className="font-semibold text-foreground text-[12px] md:text-sm">{t.name}</p>
                <p className="text-[10px] md:text-xs text-muted-foreground/65">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Scroll indicator - mobile only, tracks real scroll */}
        <div className="flex justify-center gap-1.5 mt-3 md:hidden">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ir para depoimento ${i + 1}`}
              onClick={() => scrollTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? "w-4 h-1.5 bg-primary/70"
                  : "w-1.5 h-1.5 bg-border hover:bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
