import CheckoutSkeleton from "@/components/guardaai/skeletons/CheckoutSkeleton";
import SEO from "@/components/SEO";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  MapPin, Shield, Lock, CreditCard,
  CheckCircle2, Info, ChevronRight,
  Camera, Upload, ImagePlus, X, AlertTriangle, FileText, Ban,
  ShieldAlert, Loader2, Package, Car
} from "lucide-react";
import BackButton from "@/components/guardaai/BackButton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import CheckoutAuth from "@/components/guardaai/CheckoutAuth";
import { calculatePrice, formatBRL, PRICING_HINT_SHORT, MIN_DAILY_RATE } from "@/lib/pricing";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { supabase } from "@/integrations/supabase/client";

type AnalysisStatus = "pending" | "analyzing" | "approved" | "review" | "blocked";

const STEPS = [
  { key: "account", label: "Conta" },
  { key: "verification", label: "Verificação" },
  { key: "payment", label: "Pagamento" },
];

const PROHIBITED_SHORT = [
  "Armas, munições e explosivos",
  "Drogas e substâncias ilícitas",
  "Inflamáveis, tóxicos e químicos",
  "Perecíveis e animais",
  "Itens roubados ou ilegais",
];

const formatDateHuman = (dateStr?: string) => {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return format(d, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  } catch {
    return dateStr;
  }
};

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const state = location.state as any;
  const space = state?.space;
  const reservedArea = Math.max(state?.reservedVolume || state?.reservedArea || 1, 1);
  const days = Math.max(state?.days || 1, 1);
  const hours = state?.simulation?.hours || 0;
  const isHourlyReservation = days <= 1 && hours > 0;
  const simulation = state?.simulation;

  // Payment state
  const [processing, setProcessing] = useState(false);

  // Photo upload state
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>("pending");
  const [analysisResult, setAnalysisResult] = useState<{
    reason?: string;
    detected_items?: string[];
    flagged_items?: string[];
    confidence?: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Terms state
  const [renterTerms, setRenterTerms] = useState(false);
  const [prohibitedTerms, setProhibitedTerms] = useState(false);

  const allTermsAccepted = renterTerms && prohibitedTerms;
  const photosApproved = photos.length > 0 && analysisStatus === "approved";
  const photosBlocked = analysisStatus === "blocked" || analysisStatus === "review";
  const verificationComplete = photosApproved && allTermsAccepted;

  if (!space) {
    return <CheckoutSkeleton />;
  }

  const hostRate = space.pricePerDay || space.price_per_day || MIN_DAILY_RATE;
  const bp = calculatePrice(reservedArea, days, hostRate, {
    hours: isHourlyReservation ? hours : undefined,
    cleaningFeeEnabled: space.cleaning_fee_enabled,
    cleaningFeeAmount: space.cleaning_fee_amount,
  });
  const reservationId = `GA-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  const currentStep = !user ? 0 : !verificationComplete ? 1 : 2;

  // Photo handlers
  const handlePhotoAdd = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).slice(0, 10 - photos.length);
    const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
    setPhotos((prev) => [...prev, ...newFiles]);
    setPhotoPreviews((prev) => [...prev, ...newPreviews]);
    if (analysisStatus !== "pending") {
      setAnalysisStatus("pending");
      setAnalysisResult(null);
    }
  };

  const handlePhotoRemove = (index: number) => {
    URL.revokeObjectURL(photoPreviews[index]);
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
    if (analysisStatus !== "pending") {
      setAnalysisStatus("pending");
      setAnalysisResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (photos.length === 0) {
      toast({ title: "Envie pelo menos uma foto", variant: "destructive" });
      return;
    }
    setAnalysisStatus("analyzing");
    setAnalysisResult(null);

    try {
      const imagePromises = photos.map((file) => {
        return new Promise<{ base64: string; mimeType: string }>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const dataUrl = reader.result as string;
            const base64 = dataUrl.split(",")[1];
            resolve({ base64, mimeType: file.type || "image/jpeg" });
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      const images = await Promise.all(imagePromises);

      const { data, error } = await supabase.functions.invoke("analyze-items", {
        body: { images, reservationRef: reservationId },
      });

      if (error) {
        console.error("Analysis error:", error);
        setAnalysisStatus("review");
        setAnalysisResult({
          reason: "Não foi possível concluir a análise automática. Seus itens serão avaliados manualmente.",
          detected_items: [], flagged_items: [], confidence: 0,
        });
        toast({ title: "Análise inconclusiva", description: "Seus itens foram encaminhados para revisão manual.", variant: "destructive" });
        return;
      }

      const result = data as { verdict: string; confidence: number; reason: string; detected_items: string[]; flagged_items: string[] };
      setAnalysisResult(result);

      if (result.verdict === "approved") {
        setAnalysisStatus("approved");
        toast({ title: "Itens aprovados ✓", description: result.reason });
      } else if (result.verdict === "blocked") {
        setAnalysisStatus("blocked");
        toast({ title: "Itens proibidos detectados", description: result.reason, variant: "destructive" });
      } else {
        setAnalysisStatus("review");
        toast({ title: "Análise pendente de revisão", description: result.reason, variant: "destructive" });
      }
    } catch (err) {
      console.error("Analysis failed:", err);
      setAnalysisStatus("review");
      setAnalysisResult({
        reason: "Erro ao analisar as fotos. Encaminhado para revisão manual por segurança.",
        detected_items: [], flagged_items: [], confidence: 0,
      });
      toast({ title: "Erro na análise", description: "Seus itens foram encaminhados para revisão manual por segurança.", variant: "destructive" });
    }
  };

  const handlePay = async () => {
    if (!user) {
      toast({ title: "Faça login primeiro", variant: "destructive" });
      return;
    }
    if (!verificationComplete) {
      toast({ title: "Complete a verificação", description: "Envie fotos dos itens e aceite os termos.", variant: "destructive" });
      return;
    }
    setProcessing(true);

    try {
      const termsToInsert = [
        { user_id: user.id, term_type: "renter", term_version: "1.0", context: "checkout" },
        { user_id: user.id, term_type: "prohibited_items", term_version: "1.0", context: "checkout" },
      ];
      await supabase.from("terms_acceptances").insert(termsToInsert);

      const startDate = simulation?.deliveryDate
        ? new Date(simulation.deliveryDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];
      const endDate = simulation?.pickupDate
        ? new Date(simulation.pickupDate).toISOString().split("T")[0]
        : new Date(Date.now() + days * 86400000).toISOString().split("T")[0];

      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          spaceName: space.name,
          spaceLocation: `${space.neighborhood}, ${space.city}`,
          volume: reservedArea,
          days,
          startDate,
          endDate,
          totalPrice: bp.total,
          subtotal: bp.subtotal,
          cleaningFee: bp.cleaningFee,
          hostId: space.userId || space.hostId || user.id,
          spaceId: space.dbId || null,
        },
      });

      if (error || !data?.url) {
        console.error("Checkout error:", error || data);
        toast({ title: "Erro ao iniciar pagamento", description: error?.message || "Tente novamente.", variant: "destructive" });
        setProcessing(false);
        return;
      }

      window.location.href = data.url;
    } catch (err) {
      console.error("Checkout error:", err);
      toast({ title: "Erro inesperado", description: "Tente novamente.", variant: "destructive" });
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24 sm:pb-28 lg:pb-8">
      <SEO title="Checkout" description="Finalize sua reserva de espaço na GuardaAí. Pagamento seguro via Stripe." noIndex />
      {/* Header */}
      <div className="bg-card border-b sticky top-0 z-30">
        <div className="container py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3 max-w-5xl">
          <BackButton label="Voltar para detalhes" fallbackTo="/buscar" />
          <h1 className="text-sm sm:text-base font-bold text-foreground">Finalizar reserva</h1>
          <div className="flex items-center gap-1 ml-auto">
            {STEPS.map((s, i) => (
              <div key={s.key} className="flex items-center gap-0.5 sm:gap-1">
                <span className={`text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 rounded-full ${
                  i === currentStep
                    ? "bg-primary text-primary-foreground"
                    : i < currentStep
                    ? "bg-primary/20 text-primary"
                    : "bg-secondary text-muted-foreground"
                }`}>
                  <span className="hidden sm:inline">{s.label}</span>
                  <span className="sm:hidden">{i + 1}</span>
                </span>
                {i < STEPS.length - 1 && <ChevronRight size={10} className="text-muted-foreground/40" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container max-w-5xl py-4 sm:py-6">
        {/* Mobile price summary — always visible on top */}
        <div className="lg:hidden mb-4">
          <div className="flex items-center justify-between bg-card border border-border/60 rounded-xl p-3 shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <img src={space.photos?.[0]} alt={space.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0 bg-muted" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{space.name}</p>
                <p className="text-[11px] text-muted-foreground">{reservedArea} m³ · {days} {days === 1 ? "dia" : "dias"}</p>
              </div>
            </div>
            <p className="text-lg font-extrabold text-primary flex-shrink-0">{formatBRL(bp.total)}</p>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-8">
          {/* ═══ LEFT — Forms ═══ */}
          <div className="space-y-4 sm:space-y-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <CheckoutAuth />
            </motion.div>

            {/* Step 2: Verification */}
            <AnimatePresence>
              {user && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className={verificationComplete ? "border-primary/30" : ""}>
                    <CardContent className="p-4 sm:p-6">
                      <h2 className="font-bold text-foreground mb-1 flex items-center gap-2 text-base">
                        <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">2</span>
                        Verificação dos itens
                      </h2>
                       <p className="text-xs text-muted-foreground mb-5">
                         Envie fotos dos seus itens para análise automática de conformidade.
                       </p>

                      {/* Photo Upload */}
                      <div className="mb-6">
                        <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
                          <Camera size={14} className="text-primary" />
                          Fotos dos itens
                        </h3>
                        <p className="text-xs text-muted-foreground mb-3">
                          Fotografe os objetos que serão armazenados. As fotos são obrigatórias para análise de conformidade e segurança.
                        </p>

                        <div className="p-3 rounded-lg bg-secondary/50 border border-border/40 mb-4">
                          <ul className="space-y-1.5 text-xs text-muted-foreground">
                            <li className="flex items-start gap-2"><CheckCircle2 size={12} className="text-primary shrink-0 mt-0.5" /> Fotografe cada item de forma clara e legível</li>
                            <li className="flex items-start gap-2"><CheckCircle2 size={12} className="text-primary shrink-0 mt-0.5" /> Inclua pelo menos 1 foto (máx. 10)</li>
                            <li className="flex items-start gap-2"><ShieldAlert size={12} className="text-amber-500 shrink-0 mt-0.5" /> Itens proibidos serão bloqueados automaticamente</li>
                            <li className="flex items-start gap-2"><Info size={12} className="text-muted-foreground shrink-0 mt-0.5" /> Enviar fotos não significa aprovação automática</li>
                          </ul>
                        </div>

                        <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={(e) => handlePhotoAdd(e.target.files)} className="hidden" />

                        {photos.length < 10 && (
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full border-2 border-dashed border-border/60 rounded-xl p-6 flex flex-col items-center gap-2 hover:border-primary/40 hover:bg-primary/[0.02] transition-colors mb-4"
                          >
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <ImagePlus size={22} className="text-primary" />
                            </div>
                            <p className="text-sm font-medium text-foreground">Clique para adicionar fotos</p>
                            <p className="text-xs text-muted-foreground">JPG, PNG · Máximo 10 fotos</p>
                          </button>
                        )}

                        {photoPreviews.length > 0 && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4">
                            {photoPreviews.map((preview, i) => (
                              <div key={i} className="relative group rounded-lg overflow-hidden border bg-muted aspect-square">
                                <img src={preview} alt={`Item ${i + 1}`} className="w-full h-full object-cover" />
                                <button
                                  onClick={() => handlePhotoRemove(i)}
                                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shadow-sm"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {photos.length > 0 && analysisStatus === "pending" && (
                          <Button onClick={handleAnalyze} className="w-full bg-primary hover:bg-primary/90" size="sm">
                            <Upload size={14} className="mr-2" />
                            Enviar {photos.length} foto{photos.length > 1 ? "s" : ""} para análise
                          </Button>
                        )}

                        {analysisStatus === "analyzing" && (
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/15">
                            <Loader2 size={18} className="text-primary animate-spin" />
                            <div>
                              <p className="text-sm font-medium text-foreground">Analisando itens...</p>
                              <p className="text-xs text-muted-foreground">Verificação automática em andamento</p>
                            </div>
                          </div>
                        )}

                        {analysisStatus === "approved" && (
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/15">
                            <CheckCircle2 size={18} className="text-primary" />
                            <div>
                              <p className="text-sm font-medium text-foreground">Itens aprovados</p>
                              <p className="text-xs text-muted-foreground">
                                {analysisResult?.reason || `${photos.length} foto${photos.length > 1 ? "s" : ""} verificada${photos.length > 1 ? "s" : ""}`}
                              </p>
                            </div>
                          </div>
                        )}

                        {analysisStatus === "review" && (
                          <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
                            <div className="flex items-center gap-2 mb-2">
                              <ShieldAlert size={16} className="text-amber-600" />
                              <p className="text-sm font-semibold text-foreground">Análise pendente de revisão</p>
                            </div>
                            <p className="text-xs text-muted-foreground mb-3">{analysisResult?.reason || "Seus itens serão avaliados manualmente."}</p>
                            <Button variant="outline" size="sm" className="text-xs" onClick={() => { setAnalysisStatus("pending"); setAnalysisResult(null); }}>
                              Reenviar fotos
                            </Button>
                          </div>
                        )}

                        {analysisStatus === "blocked" && (
                          <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/15">
                            <div className="flex items-center gap-2 mb-2">
                              <Ban size={16} className="text-destructive" />
                              <p className="text-sm font-semibold text-foreground">Reserva bloqueada — itens proibidos detectados</p>
                            </div>
                            <p className="text-xs text-muted-foreground mb-3">{analysisResult?.reason || "Itens proibidos detectados."}</p>
                            <Button variant="outline" size="sm" className="text-xs">Solicitar revisão manual</Button>
                          </div>
                        )}
                      </div>

                      {/* Prohibited items summary */}
                      <div className="mb-6 p-3 rounded-lg bg-destructive/[0.03] border border-destructive/10">
                        <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                          <Ban size={12} className="text-destructive" />
                          Itens proibidos
                        </h4>
                        <ul className="space-y-1 mb-2">
                          {PROHIBITED_SHORT.map((item, i) => (
                            <li key={i} className="text-[11px] text-muted-foreground flex items-start gap-1.5">
                              <span className="text-destructive/40 mt-0.5">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                        <Link to="/itens-proibidos" target="_blank" className="text-[11px] text-primary font-medium hover:underline">Ver lista completa →</Link>
                      </div>

                      {/* Terms */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          <FileText size={12} className="text-primary" />
                          Termos obrigatórios
                        </h4>

                        <label className="flex items-start gap-3 p-3 rounded-lg border border-border/60 hover:border-primary/20 transition-colors cursor-pointer">
                          <Checkbox checked={renterTerms} onCheckedChange={(v) => setRenterTerms(v === true)} className="mt-0.5" />
                          <div className="text-xs text-muted-foreground leading-relaxed">
                            Li e aceito o{" "}
                            <Link to="/termos/locatario" target="_blank" className="text-primary font-medium hover:underline">
                              Termo de Responsabilidade do Locatário
                            </Link>.
                          </div>
                        </label>

                        <label className="flex items-start gap-3 p-3 rounded-lg border border-border/60 hover:border-primary/20 transition-colors cursor-pointer">
                          <Checkbox checked={prohibitedTerms} onCheckedChange={(v) => setProhibitedTerms(v === true)} className="mt-0.5" />
                          <div className="text-xs text-muted-foreground leading-relaxed">
                            Declaro que meus itens <strong>não incluem</strong> itens proibidos pela{" "}
                            <Link to="/itens-proibidos" target="_blank" className="text-primary font-medium hover:underline">
                              política da plataforma
                            </Link>.
                          </div>
                        </label>
                      </div>

                      {verificationComplete && (
                        <div className="mt-4 flex items-center gap-2 p-2 rounded-lg bg-primary/5">
                          <CheckCircle2 size={14} className="text-primary" />
                          <span className="text-xs font-medium text-primary">Verificação completa</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step 3: Payment */}
            <AnimatePresence>
              {user && verificationComplete && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ delay: 0.1 }}>
                  <Card>
                    <CardContent className="p-5 sm:p-6">
                      <h2 className="font-bold text-foreground mb-4 flex items-center gap-2 text-base">
                        <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">3</span>
                        Pagamento seguro
                      </h2>
                      <div className="rounded-xl bg-secondary/50 border border-border/60 p-5 text-center space-y-4">
                        <div className="flex items-center justify-center gap-3">
                          <Lock size={20} className="text-primary" />
                          <Shield size={20} className="text-primary" />
                          <CreditCard size={20} className="text-primary" />
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Ao clicar em <strong>"Confirmar e pagar"</strong>, você será redirecionado para o <strong>Stripe</strong>, nossa plataforma de pagamento segura.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Trust badges */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: Lock, text: "Pagamento seguro" },
                  { icon: Shield, text: "Dados protegidos" },
                  { icon: Camera, text: "Itens verificados" },
                  { icon: FileText, text: "Termos aceitos" },
                ].map(({ icon: Icon, text }, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-card border border-border/60">
                    <Icon size={16} className="text-primary flex-shrink-0" />
                    <span className="text-[11px] text-muted-foreground leading-tight font-medium">{text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Desktop CTA */}
            {user && verificationComplete && (
              <div className="hidden lg:block">
                <Button size="lg" disabled={processing} onClick={handlePay} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-base h-14 shadow-lg">
                  {processing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-accent-foreground/40 border-t-accent-foreground rounded-full animate-spin" />
                      Processando...
                    </span>
                  ) : (
                    `Confirmar e pagar · ${formatBRL(bp.total)}`
                  )}
                </Button>
                <button onClick={() => window.history.length > 2 ? navigate(-1) : navigate("/buscar")} className="w-full text-center text-sm text-primary font-semibold mt-3 hover:underline">
                  ← Editar reserva
                </button>
              </div>
            )}
          </div>

          {/* ═══ RIGHT — Sticky Summary ═══ */}
          <div className="mt-6 lg:mt-0">
            <div className="lg:sticky lg:top-20 space-y-4">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
                <Card className="border-primary/20 shadow-md">
                  <CardContent className="p-5">
                    <h3 className="font-bold text-foreground mb-4 text-base">Resumo da reserva</h3>

                    {/* Space info */}
                    <div className="flex gap-3 mb-4 pb-4 border-b border-border/50">
                      <img src={space.photos?.[0]} alt={space.name} className="w-20 h-16 rounded-lg object-cover flex-shrink-0 bg-muted" />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-foreground text-sm truncate">{space.name}</p>
                        <p className="text-xs text-muted-foreground">{space.type}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <MapPin size={10} className="text-primary" />
                          <span className="truncate">{space.neighborhood}, {space.city}</span>
                        </div>
                      </div>
                    </div>

                    {/* Reservation details */}
                    <div className="space-y-2 mb-4 pb-4 border-b border-border/50">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Volume reservado</span>
                        <span className="text-foreground font-medium">{reservedArea} m³</span>
                      </div>
                      {simulation?.deliveryDate && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Entrada</span>
                          <span className="text-foreground font-medium text-xs">{formatDateHuman(simulation.deliveryDate)}</span>
                        </div>
                      )}
                      {simulation?.pickupDate && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Retirada</span>
                          <span className="text-foreground font-medium text-xs">{formatDateHuman(simulation.pickupDate)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm items-center">
                        <span className="text-muted-foreground">Período total</span>
                        <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-bold">
                          {isHourlyReservation ? `${hours} hora${hours > 1 ? "s" : ""} (mín. 1 diária)` : `${days} ${days === 1 ? "dia" : "dias"}`}
                        </span>
                      </div>
                    </div>

                    {/* Verification status */}
                    <div className="space-y-1.5 mb-4 pb-4 border-b border-border/50">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Verificação</h4>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Fotos dos itens</span>
                        {photosApproved ? (
                          <span className="text-primary font-medium text-xs flex items-center gap-1"><CheckCircle2 size={12} /> Aprovado</span>
                        ) : (
                          <span className="text-muted-foreground/50 text-xs">Pendente</span>
                        )}
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Termos aceitos</span>
                        {allTermsAccepted ? (
                          <span className="text-primary font-medium text-xs flex items-center gap-1"><CheckCircle2 size={12} /> Aceito</span>
                        ) : (
                          <span className="text-muted-foreground/50 text-xs">Pendente</span>
                        )}
                      </div>
                    </div>

                    {/* Financial breakdown */}
                    <div className="space-y-2 mb-4 pb-4 border-b border-border/50">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Valores</h4>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Preço do espaço</span>
                        <span className="text-foreground font-medium">{formatBRL(bp.subtotal)}</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground/70 pl-0.5">
                        {reservedArea} m³ × {days} {days === 1 ? "dia" : "dias"} × R$ {bp.hostDailyRate.toFixed(2).replace(".", ",")}/m³/dia
                      </div>
                      {bp.cleaningFee > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Taxa de limpeza</span>
                          <span className="text-foreground font-medium">{formatBRL(bp.cleaningFee)}</span>
                        </div>
                      )}
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-foreground">Total final</span>
                      <span className="text-2xl font-extrabold text-primary">{formatBRL(bp.total)}</span>
                    </div>

                    {/* Hint */}
                    <div className="flex items-start gap-1.5 p-2.5 rounded-lg bg-secondary/50">
                      <Info size={12} className="text-muted-foreground/50 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        O valor total é definido com base no preço informado pelo anfitrião, no volume reservado e na duração da locação.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      {user && (
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t p-3 sm:p-4 z-30 lg:hidden pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          <div className="container max-w-5xl flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-lg font-extrabold text-foreground leading-none">{formatBRL(bp.total)}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{reservedArea} m³ · {days}d</p>
            </div>
            {verificationComplete ? (
              <Button size="default" disabled={processing} onClick={handlePay} className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-sm px-5 shadow-lg">
                {processing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-accent-foreground/40 border-t-accent-foreground rounded-full animate-spin" />
                    Processando...
                  </span>
                ) : (
                  "Confirmar e pagar"
                )}
              </Button>
            ) : (
              <Button size="default" disabled className="font-semibold text-sm px-5">
                Complete a verificação
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
