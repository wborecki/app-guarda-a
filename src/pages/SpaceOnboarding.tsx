import SEO from "@/components/SEO";
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/guardaai/Header";
import Footer from "@/components/guardaai/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Loader2, Check, Save } from "lucide-react";
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
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

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
      setLastSaved(new Date());
    }
    setSaving(false);
  }, [space]);

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateStep = (step: number): Record<string, string> => {
    if (!space) return {};
    const errors: Record<string, string> = {};
    switch (step) {
      case 1:
        if (!space.location?.trim()) errors.location = "Informe a localização do espaço";
        if (!space.space_type?.trim()) errors.space_type = "Selecione o tipo de espaço";
        break;
      case 2:
        if (!space.availability?.trim()) errors.availability = "Selecione a disponibilidade";
        if (!(space as any).price_per_day || (space as any).price_per_day < 1.5) errors.price = "Defina um preço mínimo de R$ 1,50/m³/dia";
        break;
      case 3:
        if (!space.description?.trim()) errors.description = "Adicione uma descrição do espaço";
        break;
      case 5:
        if (!space.pix_key?.trim()) errors.pix_key = "Informe sua chave Pix";
        if (!space.beneficiary_name?.trim()) errors.beneficiary_name = "Informe o nome do titular";
        break;
    }
    return errors;
  };

  const goToStep = async (step: number) => {
    // Only validate when advancing forward via the "Continuar" button
    if (step > currentStep) {
      const errors = validateStep(currentStep);
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        toast({
          title: "Preencha os campos obrigatórios",
          description: Object.values(errors)[0],
          variant: "destructive",
        });
        return;
      }
    }
    setValidationErrors({});
    setCurrentStep(step);
    if (space && step > (space.onboarding_step || 1)) {
      await updateSpace({ onboarding_step: step });
    }
  };

  const handlePublish = async () => {
    if (!space) return;
    await updateSpace({ status: "published", onboarding_step: 6 });
    toast({ title: "🎉 Espaço publicado!", description: "Seu anúncio já está ativo e visível." });
    navigate("/minha-conta/espacos");
  };

  const handleSaveDraft = () => {
    toast({ title: "Rascunho salvo", description: "Você pode continuar a qualquer momento." });
    navigate("/minha-conta/espacos");
  };

  // Completion checkers
  const hasBasicInfo = space && space.location && space.space_type;
  const hasAvailability = space && space.availability;
  const hasDetails = space && space.description;
  const hasPhotos = space && space.photos && space.photos.length > 0;
  const hasPayment = space && space.pix_key && space.beneficiary_name;
  const completionItems = [
    { label: "Dados do espaço", done: !!hasBasicInfo },
    { label: "Disponibilidade e preço", done: !!hasAvailability },
    { label: "Descrição", done: !!hasDetails },
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
      case 1: return <StepResumo space={space} updateSpace={updateSpace} errors={validationErrors} />;
      case 2: return <StepDisponibilidade space={space} updateSpace={updateSpace} errors={validationErrors} />;
      case 3: return <StepDetalhes space={space} updateSpace={updateSpace} errors={validationErrors} />;
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
        <div className="container max-w-3xl mx-auto px-4">
          {/* Progress header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-1">
              <h1 className="text-lg md:text-xl font-bold text-foreground">Criar anúncio</h1>
              {/* Autosave indicator */}
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                {saving ? (
                  <><Loader2 size={10} className="animate-spin" /> Salvando...</>
                ) : lastSaved ? (
                  <><Save size={10} className="text-primary" /> Salvo</>
                ) : null}
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-500"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
              <span className="text-[10px] font-semibold text-accent">{completionPercent}%</span>
            </div>

            {/* Step pills */}
            <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
              {STEPS.map(s => {
                const isActive = currentStep === s.id;
                const isDone = completionItems[s.id - 1]?.done;
                return (
                  <button
                    key={s.id}
                    onClick={() => setCurrentStep(s.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap transition-all shrink-0 ${
                      isActive
                        ? "bg-accent text-accent-foreground shadow-sm"
                        : isDone
                        ? "bg-primary/10 text-primary hover:bg-primary/15"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {isDone && !isActive ? <Check size={11} /> : <s.icon size={11} />}
                    <span className="hidden sm:inline">{s.label}</span>
                    <span className="sm:hidden">{s.id}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {/* Bottom navigation */}
          {currentStep < 6 && (
            <div className="flex justify-between mt-6 pb-4" style={{ paddingBottom: "env(safe-area-inset-bottom, 16px)" }}>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className="text-sm text-muted-foreground"
              >
                <ArrowLeft size={14} className="mr-1" /> Voltar
              </Button>
              <Button
                type="button"
                onClick={() => goToStep(currentStep + 1)}
                className="bg-accent hover:bg-accent/90 text-accent-foreground text-sm group"
              >
                {currentStep === 5 ? "Revisar" : "Continuar"}
                <ArrowRight size={14} className="ml-1 group-hover:translate-x-0.5 transition-transform" />
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
