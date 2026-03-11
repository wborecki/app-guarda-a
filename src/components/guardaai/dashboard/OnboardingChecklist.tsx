import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import {
  UserCircle,
  Search,
  Home,
  CheckCircle2,
  Circle,
  Sparkles,
  ChevronRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface Step {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  href: string;
  completed: boolean;
}

export const OnboardingChecklist = () => {
  const { user } = useAuth();
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Check if dismissed in localStorage
    const key = `guardaai_onboarding_dismissed_${user.id}`;
    if (localStorage.getItem(key) === "true") {
      setDismissed(true);
      setLoading(false);
      return;
    }

    const checkProgress = async () => {
      // Parallel queries
      const [profileRes, spacesRes] = await Promise.all([
        supabase
          .from("profiles")
          .select("display_name, phone")
          .eq("user_id", user.id)
          .single(),
        supabase
          .from("spaces")
          .select("id")
          .eq("user_id", user.id)
          .limit(1),
      ]);

      const profile = profileRes.data;
      const hasProfile = !!(profile?.display_name && profile?.phone);
      const hasSpace = (spacesRes.data?.length ?? 0) > 0;

      setSteps([
        {
          id: "profile",
          label: "Complete seu perfil",
          description: "Adicione seu nome e telefone",
          icon: UserCircle,
          href: "/minha-conta/perfil",
          completed: hasProfile,
        },
        {
          id: "search",
          label: "Explore espaços disponíveis",
          description: "Encontre um lugar perto de você",
          icon: Search,
          href: "/buscar",
          completed: false, // Can't track search visits, always encourage
        },
        {
          id: "space",
          label: "Anuncie seu primeiro espaço",
          description: "Ganhe dinheiro com espaço ocioso",
          icon: Home,
          href: "/anunciar",
          completed: hasSpace,
        },
      ]);

      setLoading(false);
    };

    checkProgress();
  }, [user]);

  const handleDismiss = () => {
    if (user) {
      localStorage.setItem(`guardaai_onboarding_dismissed_${user.id}`, "true");
    }
    setDismissed(true);
  };

  if (loading || dismissed) return null;

  const completedCount = steps.filter((s) => s.completed).length;
  const allDone = completedCount === steps.length;
  const progress = steps.length > 0 ? (completedCount / steps.length) * 100 : 0;

  if (allDone) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card p-5 md:p-6 shadow-sm relative overflow-hidden"
    >
      {/* Decorative glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between mb-4 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Sparkles size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Primeiros passos no GuardaAí
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {completedCount} de {steps.length} concluídos
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-muted-foreground/50 hover:text-muted-foreground transition-colors p-1 rounded-lg hover:bg-secondary"
          aria-label="Fechar onboarding"
        >
          <X size={16} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-secondary rounded-full mb-5 overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
      </div>

      {/* Steps */}
      <div className="space-y-2">
        <AnimatePresence>
          {steps.map((step, i) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * i }}
            >
              <Link
                to={step.href}
                className={`flex items-center gap-3.5 p-3 rounded-xl transition-all group ${
                  step.completed
                    ? "bg-secondary/50 opacity-70"
                    : "hover:bg-secondary/80 hover:shadow-sm"
                }`}
              >
                {/* Check icon */}
                <div className="flex-shrink-0">
                  {step.completed ? (
                    <CheckCircle2 size={20} className="text-primary" />
                  ) : (
                    <Circle
                      size={20}
                      className="text-muted-foreground/30 group-hover:text-primary/50 transition-colors"
                    />
                  )}
                </div>

                {/* Step icon */}
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                    step.completed
                      ? "bg-primary/10 text-primary/60"
                      : "bg-primary/10 text-primary group-hover:bg-primary/15"
                  }`}
                >
                  <step.icon size={18} />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium ${
                      step.completed
                        ? "line-through text-muted-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {step.description}
                  </p>
                </div>

                {/* Arrow */}
                {!step.completed && (
                  <ChevronRight
                    size={16}
                    className="text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0"
                  />
                )}
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Dismiss link */}
      <div className="mt-4 text-center">
        <button
          onClick={handleDismiss}
          className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
        >
          Não mostrar novamente
        </button>
      </div>
    </motion.div>
  );
};
