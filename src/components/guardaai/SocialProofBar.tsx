import { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { usePlatformStats } from "@/hooks/usePlatformStats";

const useCounter = (target: number, duration = 1800) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView || target <= 0) return;
    const startTime = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);

  return { count, ref };
};

const CounterItem = ({ target, suffix, label }: { target: number; suffix: string; label: string }) => {
  const { count, ref } = useCounter(target);
  return (
    <div className="flex flex-col items-center">
      <span ref={ref} className="text-lg md:text-xl font-extrabold text-primary tabular-nums">
        {count.toLocaleString("pt-BR")}{suffix}
      </span>
      <span className="text-[10px] md:text-[11px] text-muted-foreground/70 font-medium whitespace-nowrap">
        {label}
      </span>
    </div>
  );
};

const SocialProofBar = ({ className = "" }: { className?: string }) => {
  const stats = usePlatformStats();

  const items = [
    { target: stats.spaces_count, suffix: "+", label: "Espaços disponíveis" },
    { target: stats.reservations_count, suffix: "+", label: "Objetos guardados" },
    { target: stats.cities_count, suffix: "", label: "Cidades atendidas" },
  ];

  return (
    <div className={`flex items-center justify-center gap-6 md:gap-8 ${className}`}>
      {items.map((item, i) => (
        <CounterItem key={i} {...item} />
      ))}
    </div>
  );
};

export default SocialProofBar;
