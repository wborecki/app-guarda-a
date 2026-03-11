import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft, MapPin, Shield, Lock, CreditCard, QrCode,
  CheckCircle2, Info, ChevronRight, Smartphone,
  Camera, Upload, ImagePlus, X, AlertTriangle, FileText, Ban,
  ShieldAlert, Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import CheckoutAuth from "@/components/guardaai/CheckoutAuth";
import { calculatePrice, formatBRL, PRICING_HINT_SHORT, SERVICE_FEE } from "@/lib/pricing";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { supabase } from "@/integrations/supabase/client";

type PaymentMethod = "credit" | "debit" | "pix";
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
  const simulation = state?.simulation;

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit");
  const [confirmed, setConfirmed] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [installments, setInstallments] = useState("1");

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
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Reserva não encontrada</p>
          <Button onClick={() => navigate("/")}>Voltar ao início</Button>
        </div>
      </div>
    );
  }

  const bp = calculatePrice(reservedArea, days);
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
      // Convert photos to base64
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
        body: {
          images,
          reservationRef: reservationId,
        },
      });

      if (error) {
        console.error("Analysis error:", error);
        setAnalysisStatus("review");
        setAnalysisResult({
          reason: "Não foi possível concluir a análise automática. Seus itens serão avaliados manualmente.",
          detected_items: [],
          flagged_items: [],
          confidence: 0,
        });
        toast({
          title: "Análise inconclusiva",
          description: "Seus itens foram encaminhados para revisão manual.",
          variant: "destructive",
        });
        return;
      }

      const result = data as {
        verdict: string;
        confidence: number;
        reason: string;
        detected_items: string[];
        flagged_items: string[];
      };

      setAnalysisResult(result);

      if (result.verdict === "approved") {
        setAnalysisStatus("approved");
        toast({ title: "Itens aprovados ✓", description: result.reason });
      } else if (result.verdict === "blocked") {
        setAnalysisStatus("blocked");
        toast({
          title: "Itens proibidos detectados",
          description: result.reason,
          variant: "destructive",
        });
      } else {
        // review or any other status
        setAnalysisStatus("review");
        toast({
          title: "Análise pendente de revisão",
          description: result.reason,
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Analysis failed:", err);
      setAnalysisStatus("review");
      setAnalysisResult({
        reason: "Erro ao analisar as fotos. Encaminhado para revisão manual por segurança.",
        detected_items: [],
        flagged_items: [],
        confidence: 0,
      });
      toast({
        title: "Erro na análise",
        description: "Seus itens foram encaminhados para revisão manual por segurança.",
        variant: "destructive",
      });
    }
  };

  const handlePay = () => {
    if (!user) {
      toast({ title: "Faça login primeiro", variant: "destructive" });
      return;
    }
    if (!verificationComplete) {
      toast({ title: "Complete a verificação", description: "Envie fotos dos itens e aceite os termos.", variant: "destructive" });
      return;
    }
    if (paymentMethod !== "pix" && (!cardNumber.trim() || !cardName.trim() || !cardExpiry.trim() || !cardCvv.trim())) {
      toast({ title: "Preencha os dados do cartão", variant: "destructive" });
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setConfirmed(true);
    }, 2200);
  };

  // ─── SUCCESS STATE ────────────────────────────────────────────
  if (confirmed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="w-full max-w-lg"
        >
          <Card className="border-primary/20 shadow-xl overflow-hidden">
            <div className="bg-primary/10 py-8 flex flex-col items-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 300 }}>
                <CheckCircle2 size={56} className="text-primary" />
              </motion.div>
              <h1 className="text-xl font-bold text-foreground mt-4">Reserva confirmada!</h1>
              <p className="text-sm text-muted-foreground mt-1">Seu espaço foi reservado com sucesso.</p>
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="rounded-lg bg-secondary/50 p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Nº da reserva</span>
                  <span className="font-bold text-foreground">{reservationId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Espaço</span>
                  <span className="font-medium text-foreground truncate max-w-[180px]">{space.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Área reservada</span>
                  <span className="font-medium text-foreground">{reservedArea} m²</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Período</span>
                  <span className="font-medium text-foreground">{days} {days === 1 ? "dia" : "dias"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fotos verificadas</span>
                  <span className="font-medium text-primary">{photos.length} foto{photos.length !== 1 ? "s" : ""} ✓</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-border/50">
                  <span className="font-bold text-foreground">Total pago</span>
                  <span className="font-extrabold text-primary text-lg">{formatBRL(bp.total)}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center leading-relaxed">
                Enviamos os detalhes para <strong>{user?.email}</strong>.<br />
                Você também pode acompanhar na sua conta.
              </p>
              <Button className="w-full" onClick={() => navigate("/")}>
                Voltar ao início
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // ─── CHECKOUT PAGE ────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background pb-28 lg:pb-8">
      {/* Header */}
      <div className="bg-card border-b sticky top-0 z-30">
        <div className="container py-3 flex items-center gap-3 max-w-5xl">
          <Button variant="ghost" size="icon" onClick={() => window.history.length > 1 ? navigate(-1) : navigate("/buscar")} className="flex-shrink-0">
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-base font-bold text-foreground">Finalizar reserva</h1>
          <div className="hidden sm:flex items-center gap-1 ml-auto">
            {STEPS.map((s, i) => (
              <div key={s.key} className="flex items-center gap-1">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  i === currentStep
                    ? "bg-primary text-primary-foreground"
                    : i < currentStep
                    ? "bg-primary/20 text-primary"
                    : "bg-secondary text-muted-foreground"
                }`}>
                  {s.label}
                </span>
                {i < STEPS.length - 1 && <ChevronRight size={12} className="text-muted-foreground/40" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container max-w-5xl py-6">
        <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-8">
          {/* ═══ LEFT — Forms ═══ */}
          <div className="space-y-6">
            {/* Step 1: Auth */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <CheckoutAuth />
            </motion.div>

            {/* Step 2: Verification — Photos + Terms */}
            <AnimatePresence>
              {user && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className={verificationComplete ? "border-primary/30" : ""}>
                    <CardContent className="p-5 sm:p-6">
                      <h2 className="font-bold text-foreground mb-1 flex items-center gap-2 text-base">
                        <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">2</span>
                        Verificação dos itens
                      </h2>
                       <p className="text-xs text-muted-foreground mb-5">
                         Envie fotos dos seus itens para análise automática de conformidade. A aprovação depende da verificação dos itens conforme a política da plataforma.
                       </p>

                      {/* ── Photo Upload ── */}
                      <div className="mb-6">
                        <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
                          <Camera size={14} className="text-primary" />
                          Fotos dos itens
                        </h3>
                        <p className="text-xs text-muted-foreground mb-3">
                          Fotografe os objetos que serão armazenados. As fotos são obrigatórias para análise de conformidade e segurança.
                        </p>

                        {/* Instructions */}
                        <div className="p-3 rounded-lg bg-secondary/50 border border-border/40 mb-4">
                          <ul className="space-y-1.5 text-xs text-muted-foreground">
                            <li className="flex items-start gap-2"><CheckCircle2 size={12} className="text-primary shrink-0 mt-0.5" /> Fotografe cada item de forma clara e legível</li>
                            <li className="flex items-start gap-2"><CheckCircle2 size={12} className="text-primary shrink-0 mt-0.5" /> Inclua pelo menos 1 foto (máx. 10)</li>
                            <li className="flex items-start gap-2"><ShieldAlert size={12} className="text-amber-500 shrink-0 mt-0.5" /> Itens proibidos serão bloqueados automaticamente</li>
                            <li className="flex items-start gap-2"><Info size={12} className="text-muted-foreground shrink-0 mt-0.5" /> Enviar fotos não significa aprovação automática</li>
                          </ul>
                        </div>

                        {/* Upload area */}
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => handlePhotoAdd(e.target.files)}
                          className="hidden"
                        />

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

                        {/* Preview grid */}
                        {photoPreviews.length > 0 && (
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4">
                            {photoPreviews.map((preview, i) => (
                              <div key={i} className="relative group rounded-lg overflow-hidden border bg-muted aspect-square">
                                <img src={preview} alt={`Item ${i + 1}`} className="w-full h-full object-cover" />
                                <button
                                  onClick={() => handlePhotoRemove(i)}
                                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Analyze button / status */}
                        {photos.length > 0 && analysisStatus === "pending" && (
                          <Button
                            onClick={handleAnalyze}
                            className="w-full bg-primary hover:bg-primary/90"
                            size="sm"
                          >
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
                              {analysisResult?.detected_items && analysisResult.detected_items.length > 0 && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Itens detectados: {analysisResult.detected_items.join(", ")}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {analysisStatus === "review" && (
                          <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
                            <div className="flex items-center gap-2 mb-2">
                              <ShieldAlert size={16} className="text-amber-600" />
                              <p className="text-sm font-semibold text-foreground">Análise pendente de revisão</p>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">
                              {analysisResult?.reason || "Não foi possível aprovar automaticamente. Seus itens serão avaliados manualmente."}
                            </p>
                            {analysisResult?.flagged_items && analysisResult.flagged_items.length > 0 && (
                              <p className="text-xs text-destructive mb-2">
                                Itens sinalizados: {analysisResult.flagged_items.join(", ")}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mb-3">
                              A reserva não pode ser concluída até a revisão. Você pode reenviar novas fotos ou aguardar a revisão manual.
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() => {
                                setAnalysisStatus("pending");
                                setAnalysisResult(null);
                              }}
                            >
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
                            <p className="text-xs text-muted-foreground mb-2">
                              {analysisResult?.reason || "A análise identificou itens proibidos pela política da plataforma."}
                            </p>
                            {analysisResult?.flagged_items && analysisResult.flagged_items.length > 0 && (
                              <p className="text-xs text-destructive font-medium mb-2">
                                Itens proibidos detectados: {analysisResult.flagged_items.join(", ")}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mb-3">
                              Não é possível prosseguir com a reserva. Caso acredite ser um erro, solicite revisão manual.
                            </p>
                            <Button variant="outline" size="sm" className="text-xs">
                              Solicitar revisão manual
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* ── Prohibited items summary ── */}
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
                        <Link
                          to="/itens-proibidos"
                          target="_blank"
                          className="text-[11px] text-primary font-medium hover:underline"
                        >
                          Ver lista completa →
                        </Link>
                      </div>

                      {/* ── Terms acceptance ── */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          <FileText size={12} className="text-primary" />
                          Termos obrigatórios
                        </h4>

                        <label className="flex items-start gap-3 p-3 rounded-lg border border-border/60 hover:border-primary/20 transition-colors cursor-pointer">
                          <Checkbox
                            checked={renterTerms}
                            onCheckedChange={(v) => setRenterTerms(v === true)}
                            className="mt-0.5"
                          />
                          <div className="text-xs text-muted-foreground leading-relaxed">
                            Li e aceito o{" "}
                            <Link to="/termos/locatario" target="_blank" className="text-primary font-medium hover:underline">
                              Termo de Responsabilidade do Locatário
                            </Link>
                            , incluindo a declaração de que sou responsável pelos itens armazenados.
                          </div>
                        </label>

                        <label className="flex items-start gap-3 p-3 rounded-lg border border-border/60 hover:border-primary/20 transition-colors cursor-pointer">
                          <Checkbox
                            checked={prohibitedTerms}
                            onCheckedChange={(v) => setProhibitedTerms(v === true)}
                            className="mt-0.5"
                          />
                          <div className="text-xs text-muted-foreground leading-relaxed">
                            Declaro que meus itens <strong>não incluem</strong> itens proibidos pela{" "}
                            <Link to="/itens-proibidos" target="_blank" className="text-primary font-medium hover:underline">
                              política da plataforma
                            </Link>{" "}
                            e autorizo a análise automatizada das fotos enviadas.
                          </div>
                        </label>
                      </div>

                      {/* Verification status */}
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

            {/* Step 3: Payment — only visible when verification complete */}
            <AnimatePresence>
              {user && verificationComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card>
                    <CardContent className="p-5 sm:p-6">
                      <h2 className="font-bold text-foreground mb-4 flex items-center gap-2 text-base">
                        <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">3</span>
                        Forma de pagamento
                      </h2>

                      {/* Payment method tabs */}
                      <div className="grid grid-cols-3 gap-2 mb-5">
                        {([
                          { key: "credit" as const, label: "Crédito", icon: CreditCard },
                          { key: "debit" as const, label: "Débito", icon: CreditCard },
                          { key: "pix" as const, label: "Pix", icon: QrCode },
                        ]).map((m) => (
                          <button
                            key={m.key}
                            onClick={() => setPaymentMethod(m.key)}
                            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                              paymentMethod === m.key
                                ? "border-primary bg-primary/5 text-primary"
                                : "border-border bg-card text-muted-foreground hover:border-primary/30"
                            }`}
                          >
                            <m.icon size={20} />
                            <span>{m.label}</span>
                          </button>
                        ))}
                      </div>

                      <AnimatePresence mode="wait">
                        {(paymentMethod === "credit" || paymentMethod === "debit") && (
                          <motion.div
                            key="card"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-4 overflow-hidden"
                          >
                            <div>
                              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Número do cartão</label>
                              <Input value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="0000 0000 0000 0000" maxLength={19} />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Nome no cartão</label>
                              <Input value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="Como está no cartão" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Validade</label>
                                <Input value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} placeholder="MM/AA" maxLength={5} />
                              </div>
                              <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">CVV</label>
                                <Input type="password" value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} placeholder="•••" maxLength={4} />
                              </div>
                            </div>
                            {paymentMethod === "credit" && (
                              <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Parcelas</label>
                                <select
                                  value={installments}
                                  onChange={(e) => setInstallments(e.target.value)}
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                  <option value="1">1× de {formatBRL(bp.total)} (à vista)</option>
                                  {bp.total >= 50 && <option value="2">2× de {formatBRL(bp.total / 2)}</option>}
                                  {bp.total >= 90 && <option value="3">3× de {formatBRL(bp.total / 3)}</option>}
                                </select>
                              </div>
                            )}
                          </motion.div>
                        )}

                        {paymentMethod === "pix" && (
                          <motion.div
                            key="pix"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="text-center py-6 space-y-4">
                              <div className="w-44 h-44 mx-auto bg-secondary rounded-xl flex items-center justify-center border border-border">
                                <QrCode size={100} className="text-muted-foreground/30" />
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Clique em <strong>"Confirmar e pagar"</strong> para gerar o QR Code Pix.
                              </p>
                              <div className="flex items-center gap-2 justify-center">
                                <Smartphone size={14} className="text-primary" />
                                <span className="text-xs text-muted-foreground">Escaneie com o app do seu banco</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
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
                <Button
                  size="lg"
                  disabled={processing}
                  onClick={handlePay}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-base h-14 shadow-lg"
                >
                  {processing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-accent-foreground/40 border-t-accent-foreground rounded-full animate-spin" />
                      Processando...
                    </span>
                  ) : (
                    `Confirmar e pagar · ${formatBRL(bp.total)}`
                  )}
                </Button>
                <button onClick={() => window.history.length > 1 ? navigate(-1) : navigate("/buscar")} className="w-full text-center text-sm text-primary font-semibold mt-3 hover:underline">
                  ← Voltar para editar reserva
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
                      <img
                        src={space.photos?.[0]}
                        alt={space.name}
                        className="w-20 h-16 rounded-lg object-cover flex-shrink-0 bg-muted"
                      />
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
                        <span className="text-muted-foreground">Área reservada</span>
                        <span className="text-foreground font-medium">{reservedArea} m²</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Período</span>
                        <span className="text-foreground font-medium">{days} {days === 1 ? "dia" : "dias"}</span>
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
                      {space.owner && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Anunciante</span>
                          <span className="text-foreground font-medium">{space.owner}</span>
                        </div>
                      )}
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
                        {reservedArea} m² × {days} {days === 1 ? "dia" : "dias"} → {formatBRL(bp.pricePerM2)}/m²
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Taxa de serviço (fixa)</span>
                        <span className="text-foreground font-medium">{formatBRL(SERVICE_FEE)}</span>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-foreground">Total final</span>
                      <span className="text-2xl font-extrabold text-primary">{formatBRL(bp.total)}</span>
                    </div>

                    {/* Hint */}
                    <div className="flex items-start gap-1.5 p-2.5 rounded-lg bg-secondary/50">
                      <Info size={12} className="text-muted-foreground/50 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{PRICING_HINT_SHORT}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      {user && verificationComplete && (
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t p-4 z-30 lg:hidden">
          <div className="container max-w-5xl">
            <Button
              size="lg"
              disabled={processing}
              onClick={handlePay}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-base h-13 shadow-lg"
            >
              {processing ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-accent-foreground/40 border-t-accent-foreground rounded-full animate-spin" />
                  Processando...
                </span>
              ) : (
                `Confirmar e pagar · ${formatBRL(bp.total)}`
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
