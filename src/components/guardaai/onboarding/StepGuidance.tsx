import { type LucideIcon, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

interface StepGuidanceProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  tip?: string;
  className?: string;
}

const StepGuidance = ({ icon: Icon, title, subtitle, tip, className = "" }: StepGuidanceProps) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    whileHover={{ scale: 1.01, boxShadow: "0 4px 20px -4px hsl(var(--accent) / 0.15)" }}
    whileTap={{ scale: 0.99 }}
    className={`rounded-xl border border-accent/15 bg-gradient-to-br from-accent/5 to-transparent p-4 mb-5 cursor-default transition-colors duration-200 ${className}`}
  >
    <div className="flex items-start gap-3">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 20 }}
        className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 mt-0.5"
      >
        <Icon size={16} className="text-accent" />
      </motion.div>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{subtitle}</p>
        {tip && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="flex items-start gap-1.5 mt-2.5 p-2.5 rounded-lg bg-card/80 border border-border/50"
          >
            <Lightbulb size={11} className="text-accent shrink-0 mt-0.5" />
            <p className="text-[11px] text-muted-foreground leading-relaxed">{tip}</p>
          </motion.div>
        )}
      </div>
    </div>
  </motion.div>
);

export default StepGuidance;
