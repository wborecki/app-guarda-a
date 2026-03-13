import SEO from "@/components/SEO";
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/guardaai/Header";
import Footer from "@/components/guardaai/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Loader2, Check } from "lucide-react";
import { STEPS, type SpaceData } from "@/components/guardaai/onboarding/types";
import StepResumo from "@/components/guardaai/onboarding/StepResumo";
import StepDisponibilidade from "@/components/guardaai/onboarding/StepDisponibilidade";
import StepDetalhes from "@/components/guardaai/onboarding/StepDetalhes";
import StepFotos from "@/components/guardaai/onboarding/StepFotos";
import StepRecebimento from "@/components/guardaai/onboarding/StepRecebimento";
import StepRevisao from "@/components/guardaai/onboarding/StepRevisao";

const SpaceOnboarding = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const spaceId = searchParams.get("id");

  const [currentStep, setCurrentStep] = useState(1);
  const [space, setSpace] = useState<SpaceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/entrar"); return; }
    if (!spaceId) { navigate("/anunciar"); return; }
    loadSpace();
  }, [user, authLoading, spaceId]);

  const loadSpace = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("spaces")
      .select("*")
      .eq("id", spaceId!)
      .single();

    if (error || !data) {
      toast({ title: "Espaço não encontrado", variant: "destructive" });
      navigate("/anunciar");
      return;
    }
    setSpace(data as unknown as SpaceData);
    setCurrentStep(data.onboarding_step || 1);
    setLoading(false);
  };

  const updateSpace = useCallback(async (updates: Partial<SpaceData>) => {
    if (!space) return;
    setSaving(true);
    const { error } = await supabase
      .from("spaces")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", space.id);

    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } else {
      setSpace(prev => prev ? { ...prev, ...updates } : prev);
    }
    setSaving(false);
  }, [space]);

  const goToStep = async (step: number) => {
    setCurrentStep(step);
    if (space && step > (space.onboarding_step || 1)) {
      await updateSpace({ onboarding_step: step });
    }
  };

  const handlePublish = async () => {
    if (!space) return;
    await updateSpace({ status: "published", onboarding_step: 6 });
    toast({ title: "Espaço publicado!", description: "Seu anúncio está ativo." });
    navigate("/minha-conta/espacos");
  };

  const handleSaveDraft = () => {
    toast({ title: "Rascunho salvo", description: "Você pode continuar depois." });
    navigate("/minha-conta/espacos");
  };

  // Completion checkers
  const hasBasicInfo = space && space.location && space.space_type;
  const hasAvailability = space && space.availability;
  const hasDetails = space && (space.description || space.notes);
  const hasPhotos = space && space.photos && space.photos.length > 0;
  const hasPayment = space && space.pix_key && space.beneficiary_name;
  const completionItems = [
    { label: "Dados básicos", done: !!hasBasicInfo },
    { label: "Disponibilidade", done: !!hasAvailability },
    { label: "Detalhes", done: !!hasDetails },
    { label: "Fotos", done: !!hasPhotos },
    { label: "Recebimento", done: !!hasPayment },
  ];
  const completionPercent = Math.round((completionItems.filter(i => i.done).length / completionItems.length) * 100);
  const isReadyToPublish = completionItems.every(i => i.done);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-accent" size={32} />
      </div>
    );
  }

  if (!space) return null;

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <StepResumo space={space} updateSpace={updateSpace} />;
      case 2: return <StepDisponibilidade space={space} updateSpace={updateSpace} />;
      case 3: return <StepDetalhes space={space} updateSpace={updateSpace} />;
      case 4: return <StepFotos space={space} updateSpace={updateSpace} />;
      case 5: return <StepRecebimento space={space} updateSpace={updateSpace} />;
      case 6: return (
        <StepRevisao
          space={space}
          updateSpace={updateSpace}
          completionItems={completionItems}
          isReadyToPublish={isReadyToPublish}
          onPublish={handlePublish}
          onSaveDraft={handleSaveDraft}
          setCurrentStep={setCurrentStep}
        />
      );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Cadastrar espaço" description="Complete o cadastro do seu espaço na GuardaAí e comece a receber reservas." noIndex />
      <Header />
      <main className="pt-20 pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          {/* Progress header */}
          <div className="mb-8">
            <h1 className="text-xl md:text-2xl font-bold text-foreground mb-1">Finalizar anúncio do espaço</h1>
            <p className="text-sm text-muted-foreground">Complete as informações para publicar seu espaço.</p>

            <div className="mt-4 flex items-center gap-2">
              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-500"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-accent">{completionPercent}%</span>
            </div>

            {/* Step navigation */}
            <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1 snap-x snap-mandatory scrollbar-none">
              {STEPS.map(s => {
                const isActive = currentStep === s.id;
                const isDone = completionItems[s.id - 1]?.done;
                return (
                  <button
                    key={s.id}
                    onClick={() => setCurrentStep(s.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors snap-start min-w-[auto] shrink-0 ${
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : isDone
                        ? "bg-primary/10 text-primary"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {isDone && !isActive ? <Check size={12} /> : <s.icon size={12} />}
                    <span className="hidden sm:inline">{s.label}</span>
                    <span className="sm:hidden">{s.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Saving indicator */}
          {saving && (
            <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 size={12} className="animate-spin" /> Salvando...
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {/* Bottom navigation */}
          {currentStep < 6 && (
            <div className="flex justify-between mt-6" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className="text-sm"
              >
                <ArrowLeft size={14} className="mr-1" /> Etapa anterior
              </Button>
              <Button
                type="button"
                onClick={() => goToStep(currentStep + 1)}
                className="bg-accent hover:bg-accent/90 text-accent-foreground text-sm group"
              >
                Próximo <ArrowRight size={14} className="ml-1 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SpaceOnboarding;
