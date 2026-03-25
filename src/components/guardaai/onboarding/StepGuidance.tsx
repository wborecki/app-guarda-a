import { type LucideIcon, Lightbulb } from "lucide-react";

interface StepGuidanceProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  tip?: string;
  /** Extra className for the wrapper */
  className?: string;
}

const StepGuidance = ({ icon: Icon, title, subtitle, tip, className = "" }: StepGuidanceProps) => (
  <div className={`rounded-xl border border-accent/15 bg-gradient-to-br from-accent/5 to-transparent p-4 mb-5 ${className}`}>
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={16} className="text-accent" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{subtitle}</p>
        {tip && (
          <div className="flex items-start gap-1.5 mt-2.5 p-2.5 rounded-lg bg-card/80 border border-border/50">
            <Lightbulb size={11} className="text-accent shrink-0 mt-0.5" />
            <p className="text-[11px] text-muted-foreground leading-relaxed">{tip}</p>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default StepGuidance;
