import SEO from "@/components/SEO";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/guardaai/Header";
import Footer from "@/components/guardaai/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import LocationAutocomplete from "@/components/guardaai/LocationAutocomplete";
import {
  MapPin, Ruler, Home, CalendarCheck, FileText, Camera, Wallet,
  CheckCircle2, ArrowRight, ArrowLeft, Upload, X, Edit2,
  Clock, Shield, Eye, AlertCircle, Loader2, Check
} from "lucide-react";

const STEPS = [
  { id: 1, label: "Resumo", icon: Home },
  { id: 2, label: "Disponibilidade", icon: CalendarCheck },
  { id: 3, label: "Detalhes", icon: FileText },
  { id: 4, label: "Fotos", icon: Camera },
  { id: 5, label: "Recebimento", icon: Wallet },
  { id: 6, label: "Revisão", icon: Eye },
];

const WEEKDAYS = [
  { value: "seg", label: "Seg" },
  { value: "ter", label: "Ter" },
  { value: "qua", label: "Qua" },
  { value: "qui", label: "Qui" },
  { value: "sex", label: "Sex" },
  { value: "sab", label: "Sáb" },
  { value: "dom", label: "Dom" },
];

const PHOTO_TIPS = [
  "Visão geral do espaço",
  "Entrada / acesso",
  "Espaço interno",
  "Condições do local",
];

type AvailabilitySlot = { start: string; end: string };
type AvailabilitySchedule = Record<string, AvailabilitySlot>;

type SpaceData = {
  id: string;
  location: string;
  space_type: string;
  space_category: string;
  height: number;
  width: number;
  length: number;
  volume: number;
  covered: boolean;
  closed: boolean;
  easy_access: boolean;
  availability: string;
  access_hours: string;
  access_type: string;
  available_days: string[];
  description: string;
  notes: string;
  rules: string;
  security_features: string;
  photos: string[];
  pix_key: string;
  pix_key_type: string;
  beneficiary_name: string;
  document_number: string;
  status: string;
  onboarding_step: number;
  rental_type: string;
  availability_schedule: AvailabilitySchedule;
  price_per_day: number;
  cleaning_fee_enabled: boolean;
  cleaning_fee_amount: number;
};

// Debounced field hook — keeps local state, saves after delay
const useDebouncedField = (
  initialValue: string,
  onSave: (val: string) => void,
  delay = 800
) => {
  const [local, setLocal] = useState(initialValue);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;

  // Sync from DB when initialValue changes externally (e.g. after load)
  const prevInit = useRef(initialValue);
  useEffect(() => {
    if (initialValue !== prevInit.current) {
      setLocal(initialValue);
      prevInit.current = initialValue;
    }
  }, [initialValue]);

  const onChange = useCallback((val: string) => {
    setLocal(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onSaveRef.current(val), delay);
  }, [delay]);

  // Flush on unmount
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return [local, onChange] as const;
};

const SpaceOnboarding = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const spaceId = searchParams.get("id");

  const [currentStep, setCurrentStep] = useState(1);
  const [space, setSpace] = useState<SpaceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingBasic, setEditingBasic] = useState(false);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load space data
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/entrar");
      return;
    }
    if (!spaceId) {
      navigate("/anunciar");
      return;
    }
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

  // Debounced text fields
  const [descLocal, setDescLocal] = useDebouncedField(space?.description || "", v => updateSpace({ description: v }));
  const [rulesLocal, setRulesLocal] = useDebouncedField(space?.rules || "", v => updateSpace({ rules: v }));
  const [securityLocal, setSecurityLocal] = useDebouncedField(space?.security_features || "", v => updateSpace({ security_features: v }));
  const [notesLocal, setNotesLocal] = useDebouncedField(space?.notes || "", v => updateSpace({ notes: v }));
  const [pixKeyLocal, setPixKeyLocal] = useDebouncedField(space?.pix_key || "", v => updateSpace({ pix_key: v }));
  const [beneficiaryLocal, setBeneficiaryLocal] = useDebouncedField(space?.beneficiary_name || "", v => updateSpace({ beneficiary_name: v }));
  const [documentLocal, setDocumentLocal] = useDebouncedField(space?.document_number || "", v => updateSpace({ document_number: v }));

  const goToStep = async (step: number) => {
    setCurrentStep(step);
    if (space && step > (space.onboarding_step || 1)) {
      await updateSpace({ onboarding_step: step });
    }
  };

  // Photo upload
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentCount = (space?.photos?.length || 0) + photoFiles.length;
    const remaining = 5 - currentCount;
    if (remaining <= 0) {
      toast({ title: "Limite atingido", description: "Máximo de 5 fotos.", variant: "destructive" });
      return;
    }
    setPhotoFiles(prev => [...prev, ...files.slice(0, remaining)]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadPhotos = async () => {
    if (!space || !user || photoFiles.length === 0) return;
    setUploadingPhotos(true);
    const uploaded: string[] = [];

    for (const file of photoFiles) {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/${space.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("space-photos").upload(path, file);
      if (!error) {
        const { data: urlData } = supabase.storage.from("space-photos").getPublicUrl(path);
        uploaded.push(urlData.publicUrl);
      }
    }

    const newPhotos = [...(space.photos || []), ...uploaded];
    await updateSpace({ photos: newPhotos });
    setPhotoFiles([]);
    setUploadingPhotos(false);
    if (uploaded.length > 0) {
      toast({ title: `${uploaded.length} foto(s) enviada(s)` });
    }
  };

  const removePhoto = async (url: string) => {
    if (!space) return;
    const newPhotos = space.photos.filter(p => p !== url);
    await updateSpace({ photos: newPhotos });
  };

  const handlePublish = async () => {
    if (!space) return;
    await updateSpace({ status: "published", onboarding_step: 6 });
    toast({ title: "Espaço publicado!", description: "Seu anúncio está ativo." });
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

  const spaceTypeLabel: Record<string, string> = {
    garagem: "Garagem", quarto: "Quarto vazio", deposito: "Depósito",
    "area-coberta": "Área coberta", galpao: "Pequeno galpão", comercial: "Espaço comercial",
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

            {/* Progress bar */}
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
            <div className="mt-4 flex gap-1 overflow-x-auto pb-1">
              {STEPS.map(s => {
                const isActive = currentStep === s.id;
                const isDone = completionItems[s.id - 1]?.done;
                return (
                  <button
                    key={s.id}
                    onClick={() => setCurrentStep(s.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : isDone
                        ? "bg-primary/10 text-primary"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {isDone && !isActive ? <Check size={12} /> : <s.icon size={12} />}
                    {s.label}
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
              {/* ===== STEP 1: RESUMO ===== */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-border bg-card p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                        <Home size={16} className="text-accent" /> Resumo do espaço
                      </h2>
                      <Button variant="ghost" size="sm" onClick={() => setEditingBasic(!editingBasic)}>
                        <Edit2 size={14} className="mr-1" /> {editingBasic ? "Fechar" : "Editar"}
                      </Button>
                    </div>

                    {!editingBasic ? (
                      <div className="grid grid-cols-2 gap-3">
                        <InfoItem icon={MapPin} label="Localização" value={space.location || "—"} />
                        <InfoItem icon={Home} label="Tipo" value={spaceTypeLabel[space.space_type] || space.space_type || "—"} />
                        <InfoItem icon={Ruler} label="Dimensões" value={`${space.width}m × ${space.length}m × ${space.height}m`} />
                        <InfoItem icon={Ruler} label="Volume" value={space.volume ? `${Number(space.volume).toFixed(1)} m³` : "—"} />
                        <InfoItem icon={Shield} label="Coberto" value={space.covered ? "Sim" : "Não"} />
                        <InfoItem icon={Shield} label="Fechado" value={space.closed ? "Sim" : "Não"} />
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <label className="text-[11px] font-semibold text-muted-foreground uppercase mb-1 block">Localização</label>
                          <LocationAutocomplete
                            value={space.location}
                            onChange={v => updateSpace({ location: v })}
                            placeholder="Endereço ou região"
                            className="h-10 text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-muted-foreground uppercase mb-1 block">Tipo de espaço</label>
                          <Select value={space.space_type} onValueChange={v => updateSpace({ space_type: v })}>
                            <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="garagem">Garagem</SelectItem>
                              <SelectItem value="quarto">Quarto vazio</SelectItem>
                              <SelectItem value="deposito">Depósito</SelectItem>
                              <SelectItem value="area-coberta">Área coberta</SelectItem>
                              <SelectItem value="galpao">Pequeno galpão</SelectItem>
                              <SelectItem value="comercial">Espaço comercial</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { key: "height", label: "Altura (m)" },
                            { key: "width", label: "Largura (m)" },
                            { key: "length", label: "Compr. (m)" },
                          ].map(d => (
                            <div key={d.key}>
                              <label className="text-[10px] text-muted-foreground mb-1 block">{d.label}</label>
                              <Input
                                type="number" step="0.1" min="0"
                                value={(space as any)[d.key]}
                                onChange={e => updateSpace({ [d.key]: parseFloat(e.target.value) || 0 })}
                                className="h-10 text-sm"
                              />
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-4">
                          {[
                            { key: "covered", label: "Coberto" },
                            { key: "closed", label: "Fechado" },
                            { key: "easy_access", label: "Fácil acesso" },
                          ].map(t => (
                            <div key={t.key} className="flex items-center gap-2">
                              <Switch
                                checked={(space as any)[t.key]}
                                onCheckedChange={v => updateSpace({ [t.key]: v })}
                                className="scale-[0.85]"
                              />
                              <Label className="text-xs">{t.label}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ===== STEP 2: DISPONIBILIDADE ===== */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                    <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                      <CalendarCheck size={16} className="text-accent" /> Disponibilidade e acesso
                    </h2>

                    {/* Rental type */}
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground uppercase mb-2 block">Tipo de locação aceita</label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { value: "daily", label: "Por dia", desc: "Reservas de 1+ dias" },
                          { value: "hourly", label: "Por hora", desc: "Reservas de poucas horas" },
                          { value: "both", label: "Ambos", desc: "Aceita hora e diária" },
                        ].map(opt => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => updateSpace({ rental_type: opt.value } as any)}
                            className={`flex flex-col items-start px-4 py-2.5 rounded-xl border text-left transition-colors ${
                              (space as any).rental_type === opt.value
                                ? "border-accent bg-accent/10 text-accent-foreground"
                                : "border-border bg-secondary/40 text-muted-foreground hover:border-accent/40"
                            }`}
                          >
                            <span className="text-xs font-semibold">{opt.label}</span>
                            <span className="text-[10px] text-muted-foreground">{opt.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="rounded-lg border border-border bg-secondary/20 p-4 space-y-3">
                      <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <Wallet size={14} className="text-accent" /> Defina o preço do seu espaço
                      </h3>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        Você pode definir livremente o valor da sua locação. A GuardaAí sugere uma referência, mas a decisão final é sua. Mínimo: R$ 1,50/m³/dia.
                      </p>

                      <div>
                        <label className="text-[11px] font-semibold text-muted-foreground uppercase mb-1.5 block">
                          Preço por m³/dia (R$)
                        </label>
                        <div className="flex items-center gap-3">
                          <Input
                            type="number"
                            step="0.10"
                            min="1.50"
                            value={(space as any).price_per_day || ""}
                            onChange={e => {
                              const val = parseFloat(e.target.value);
                              updateSpace({ price_per_day: isNaN(val) ? 0 : val } as any);
                            }}
                            placeholder="Ex: 5.00"
                            className="w-32 h-10 text-sm"
                          />
                          <span className="text-[10px] text-muted-foreground">
                            Sugestão: R$ 5,00/m³/dia (1 dia) · R$ 2,71 (7 dias) · R$ 1,50 (30 dias)
                          </span>
                        </div>
                        {(space as any).price_per_day > 0 && (space as any).price_per_day < 1.5 && (
                          <p className="text-[10px] text-destructive mt-1 flex items-center gap-1">
                            <AlertCircle size={10} /> O valor mínimo é R$ 1,50 por m³/dia.
                          </p>
                        )}
                      </div>

                      <p className="text-[10px] text-muted-foreground italic">
                        Reservas por horas são permitidas, com cobrança mínima equivalente a 1 diária.
                      </p>
                    </div>

                    {/* Cleaning fee */}
                    <div className="rounded-lg border border-border bg-secondary/20 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xs font-bold text-foreground">Taxa de limpeza (opcional)</h3>
                          <p className="text-[10px] text-muted-foreground">Apenas para reservas acima de 7 dias.</p>
                        </div>
                        <Switch
                          checked={(space as any).cleaning_fee_enabled || false}
                          onCheckedChange={checked => {
                            const updates: any = { cleaning_fee_enabled: checked };
                            if (checked && !(space as any).cleaning_fee_amount) {
                              // Suggest based on volume
                              const vol = space.volume || 1;
                              const suggested = Math.min(Math.max(Math.round(vol * 0.5 * 100) / 100, 5), 20);
                              updates.cleaning_fee_amount = suggested;
                            }
                            updateSpace(updates);
                          }}
                        />
                      </div>
                      {(space as any).cleaning_fee_enabled && (
                        <div>
                          <label className="text-[11px] font-semibold text-muted-foreground uppercase mb-1.5 block">
                            Valor da taxa (R$)
                          </label>
                          <div className="flex items-center gap-3">
                            <Input
                              type="number"
                              step="0.50"
                              min="5"
                              max="20"
                              value={(space as any).cleaning_fee_amount || ""}
                              onChange={e => {
                                const val = parseFloat(e.target.value);
                                updateSpace({ cleaning_fee_amount: isNaN(val) ? 0 : val } as any);
                              }}
                              className="w-28 h-10 text-sm"
                            />
                            <span className="text-[10px] text-muted-foreground">
                              Sugestão: R$ 0,50/m³ · Mín. R$ 5 · Máx. R$ 20
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground uppercase mb-1.5 block">Tipo de disponibilidade</label>
                      <Select value={space.availability} onValueChange={v => updateSpace({ availability: v })}>
                        <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="continuous">Contínua / Indeterminada</SelectItem>
                          <SelectItem value="weekdays">Apenas dias úteis</SelectItem>
                          <SelectItem value="weekends">Apenas finais de semana</SelectItem>
                          <SelectItem value="custom">Personalizada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {(space.availability === "custom" || space.availability === "weekdays" || space.availability === "weekends") && (
                      <div>
                        <label className="text-[11px] font-semibold text-muted-foreground uppercase mb-2 block">Dias disponíveis</label>
                        <div className="flex flex-wrap gap-2">
                          {WEEKDAYS.map(d => {
                            const selected = (space.available_days || []).includes(d.value);
                            return (
                              <button
                                key={d.value}
                                type="button"
                                onClick={() => {
                                  const newDays = selected
                                    ? (space.available_days || []).filter(v => v !== d.value)
                                    : [...(space.available_days || []), d.value];
                                  updateSpace({ available_days: newDays });
                                }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                  selected ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                                }`}
                              >
                                {d.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Availability schedule per day */}
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground uppercase mb-2 block">
                        Horários de atendimento por dia
                      </label>
                      <p className="text-[10px] text-muted-foreground mb-3">
                        Defina em quais horários você pode receber e devolver itens em cada dia da semana.
                      </p>
                      <div className="space-y-2">
                        {WEEKDAYS.map(d => {
                          const schedule = ((space as any).availability_schedule || {}) as AvailabilitySchedule;
                          const slot = schedule[d.value] || { start: "", end: "" };
                          const isEnabled = !!slot.start && !!slot.end;
                          return (
                            <div key={d.value} className="flex items-center gap-2">
                              <Switch
                                checked={isEnabled}
                                onCheckedChange={checked => {
                                  const newSchedule = { ...schedule };
                                  if (checked) {
                                    newSchedule[d.value] = { start: "08:00", end: "18:00" };
                                  } else {
                                    delete newSchedule[d.value];
                                  }
                                  updateSpace({ availability_schedule: newSchedule } as any);
                                }}
                                className="scale-[0.75]"
                              />
                              <span className={`w-8 text-xs font-medium ${isEnabled ? "text-foreground" : "text-muted-foreground/50"}`}>
                                {d.label}
                              </span>
                              {isEnabled && (
                                <div className="flex items-center gap-1.5">
                                  <Input
                                    type="time"
                                    value={slot.start}
                                    onChange={e => {
                                      const newSchedule = { ...schedule, [d.value]: { ...slot, start: e.target.value } };
                                      updateSpace({ availability_schedule: newSchedule } as any);
                                    }}
                                    className="w-24 h-8 text-xs"
                                  />
                                  <span className="text-[10px] text-muted-foreground">às</span>
                                  <Input
                                    type="time"
                                    value={slot.end}
                                    onChange={e => {
                                      const newSchedule = { ...schedule, [d.value]: { ...slot, end: e.target.value } };
                                      updateSpace({ availability_schedule: newSchedule } as any);
                                    }}
                                    className="w-24 h-8 text-xs"
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 text-xs text-primary"
                        onClick={() => {
                          const allSchedule: AvailabilitySchedule = {};
                          WEEKDAYS.forEach(d => { allSchedule[d.value] = { start: "08:00", end: "18:00" }; });
                          updateSpace({ availability_schedule: allSchedule } as any);
                        }}
                      >
                        Preencher todos (08:00–18:00)
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-muted-foreground uppercase mb-1.5 block">Horário de acesso geral</label>
                        <Select value={space.access_hours} onValueChange={v => updateSpace({ access_hours: v })}>
                          <SelectTrigger className="h-10 text-sm"><SelectValue placeholder="Selecione" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="livre">Livre / Sem restrição</SelectItem>
                            <SelectItem value="comercial">Horário comercial</SelectItem>
                            <SelectItem value="combinado">A combinar</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-muted-foreground uppercase mb-1.5 block">Tipo de acesso</label>
                        <Select value={space.access_type} onValueChange={v => updateSpace({ access_type: v })}>
                          <SelectTrigger className="h-10 text-sm"><SelectValue placeholder="Selecione" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="independente">Independente</SelectItem>
                            <SelectItem value="acompanhado">Acompanhado</SelectItem>
                            <SelectItem value="combinar">A combinar</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ===== STEP 3: DETALHES ===== */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                    <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                      <FileText size={16} className="text-accent" /> Detalhes do espaço
                    </h2>

                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground uppercase mb-1.5 block">Descrição do espaço</label>
                      <Textarea
                        placeholder="Descreva seu espaço para que os clientes entendam o que estão reservando..."
                        value={descLocal}
                        onChange={e => setDescLocal(e.target.value)}
                        rows={3}
                        className="text-sm resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground uppercase mb-1.5 block">Regras do espaço</label>
                      <Textarea
                        placeholder="Ex: Não armazenar líquidos, não ultrapassar o limite do espaço..."
                        value={rulesLocal}
                        onChange={e => setRulesLocal(e.target.value)}
                        rows={2}
                        className="text-sm resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground uppercase mb-1.5 block">Recursos de segurança</label>
                      <Textarea
                        placeholder="Ex: Câmera, portão eletrônico, alarme, portaria..."
                        value={securityLocal}
                        onChange={e => setSecurityLocal(e.target.value)}
                        rows={2}
                        className="text-sm resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground uppercase mb-1.5 block">Observações adicionais</label>
                      <Textarea
                        placeholder="Qualquer informação extra relevante..."
                        value={notesLocal}
                        onChange={e => setNotesLocal(e.target.value)}
                        rows={2}
                        className="text-sm resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ===== STEP 4: FOTOS ===== */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                    <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                      <Camera size={16} className="text-accent" /> Fotos do espaço
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Envie até 5 fotos do seu espaço. Boas fotos aumentam as chances de reserva.
                    </p>

                    {/* Tips */}
                    <div className="grid grid-cols-2 gap-2">
                      {PHOTO_TIPS.map((tip, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-secondary/40 border border-border/60">
                          <Camera size={12} className="text-muted-foreground shrink-0" />
                          <span className="text-[11px] text-muted-foreground">{tip}</span>
                        </div>
                      ))}
                    </div>

                    {/* Existing photos */}
                    {space.photos && space.photos.length > 0 && (
                      <div className="flex flex-wrap gap-3">
                        {space.photos.map((url, i) => (
                          <div key={i} className="relative group">
                            <img src={url} alt={`Foto ${i + 1}`} className="w-24 h-24 rounded-xl object-cover border border-border" />
                            <button
                              type="button"
                              onClick={() => removePhoto(url)}
                              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* New photo previews */}
                    {photoFiles.length > 0 && (
                      <div className="flex flex-wrap gap-3">
                        {photoFiles.map((file, i) => (
                          <div key={i} className="relative group">
                            <img src={URL.createObjectURL(file)} alt={`Nova ${i + 1}`} className="w-24 h-24 rounded-xl object-cover border-2 border-dashed border-accent/40" />
                            <button
                              type="button"
                              onClick={() => setPhotoFiles(prev => prev.filter((_, idx) => idx !== i))}
                              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Upload area */}
                    {((space.photos?.length || 0) + photoFiles.length) < 5 && (
                      <label className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed border-border hover:border-accent/40 transition-colors cursor-pointer bg-secondary/20">
                        <Upload size={20} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Clique para selecionar fotos ({(space.photos?.length || 0) + photoFiles.length}/5)
                        </span>
                        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoSelect} />
                      </label>
                    )}

                    {photoFiles.length > 0 && (
                      <Button
                        type="button"
                        onClick={uploadPhotos}
                        disabled={uploadingPhotos}
                        className="bg-accent hover:bg-accent/90 text-accent-foreground text-sm"
                      >
                        {uploadingPhotos ? <><Loader2 size={14} className="animate-spin mr-1" /> Enviando...</> : `Enviar ${photoFiles.length} foto(s)`}
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* ===== STEP 5: RECEBIMENTO ===== */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                    <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                      <Wallet size={16} className="text-accent" /> Dados de recebimento
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Configure como você vai receber os pagamentos das reservas.
                    </p>

                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground uppercase mb-1.5 block">Tipo de chave Pix</label>
                      <Select value={space.pix_key_type} onValueChange={v => updateSpace({ pix_key_type: v })}>
                        <SelectTrigger className="h-10 text-sm"><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cpf">CPF</SelectItem>
                          <SelectItem value="cnpj">CNPJ</SelectItem>
                          <SelectItem value="email">E-mail</SelectItem>
                          <SelectItem value="phone">Telefone</SelectItem>
                          <SelectItem value="random">Chave aleatória</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground uppercase mb-1.5 block">Chave Pix</label>
                      <Input
                        value={pixKeyLocal}
                        onChange={e => setPixKeyLocal(e.target.value)}
                        placeholder="Informe sua chave Pix"
                        className="h-10 text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground uppercase mb-1.5 block">Nome do favorecido</label>
                      <Input
                        value={beneficiaryLocal}
                        onChange={e => setBeneficiaryLocal(e.target.value)}
                        placeholder="Nome completo do titular"
                        className="h-10 text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground uppercase mb-1.5 block">CPF ou CNPJ</label>
                      <Input
                        value={documentLocal}
                        onChange={e => setDocumentLocal(e.target.value)}
                        placeholder="000.000.000-00"
                        className="h-10 text-sm"
                      />
                    </div>

                    {hasPayment && (
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-primary/5 border border-primary/20">
                        <CheckCircle2 size={14} className="text-primary" />
                        <span className="text-xs text-primary font-medium">Recebimento configurado</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ===== STEP 6: REVISÃO FINAL ===== */}
              {currentStep === 6 && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-border bg-card p-5 space-y-5">
                    <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                      <Eye size={16} className="text-accent" /> Revisão final
                    </h2>

                    {/* Checklist */}
                    <div className="space-y-2">
                      {completionItems.map((item, i) => (
                        <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border ${item.done ? "border-primary/20 bg-primary/5" : "border-destructive/20 bg-destructive/5"}`}>
                          {item.done ? (
                            <CheckCircle2 size={16} className="text-primary shrink-0" />
                          ) : (
                            <AlertCircle size={16} className="text-destructive shrink-0" />
                          )}
                          <span className={`text-sm font-medium ${item.done ? "text-foreground" : "text-destructive"}`}>
                            {item.label}
                          </span>
                          {!item.done && (
                            <Button variant="ghost" size="sm" className="ml-auto text-xs" onClick={() => setCurrentStep(i + 1)}>
                              Completar
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Summary */}
                    <div className="border-t border-border pt-4 space-y-2">
                      <h3 className="text-sm font-semibold text-foreground">Resumo do anúncio</h3>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div><span className="text-muted-foreground">Local:</span> <span className="font-medium text-foreground">{space.location || "—"}</span></div>
                        <div><span className="text-muted-foreground">Tipo:</span> <span className="font-medium text-foreground">{spaceTypeLabel[space.space_type] || "—"}</span></div>
                        <div><span className="text-muted-foreground">Volume:</span> <span className="font-medium text-foreground">{space.volume ? `${Number(space.volume).toFixed(1)} m³` : "—"}</span></div>
                        <div><span className="text-muted-foreground">Fotos:</span> <span className="font-medium text-foreground">{space.photos?.length || 0} foto(s)</span></div>
                        <div><span className="text-muted-foreground">Recebimento:</span> <span className="font-medium text-foreground">{hasPayment ? "Configurado" : "Pendente"}</span></div>
                      </div>
                    </div>

                    {/* Photos preview */}
                    {space.photos && space.photos.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto">
                        {space.photos.map((url, i) => (
                          <img key={i} src={url} alt={`Foto ${i + 1}`} className="w-20 h-20 rounded-lg object-cover border border-border shrink-0" />
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col gap-2.5 pt-2">
                      <Button
                        type="button"
                        size="lg"
                        disabled={!isReadyToPublish}
                        onClick={handlePublish}
                        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold h-12 text-sm group"
                      >
                        <CheckCircle2 size={16} className="mr-1.5" />
                        Publicar espaço
                        <ArrowRight size={16} className="ml-1.5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                      {!isReadyToPublish && (
                        <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
                          <AlertCircle size={12} /> Complete todas as etapas para publicar
                        </p>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        onClick={() => {
                          toast({ title: "Rascunho salvo", description: "Você pode continuar depois." });
                          navigate("/minha-conta/espacos");
                        }}
                        className="w-full h-10 text-sm"
                      >
                        Salvar rascunho e sair
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Bottom navigation */}
          {currentStep < 6 && (
            <div className="flex justify-between mt-6">
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

// Helper component
const InfoItem = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-secondary/40">
    <Icon size={13} className="text-muted-foreground mt-0.5 shrink-0" />
    <div>
      <p className="text-[10px] text-muted-foreground uppercase">{label}</p>
      <p className="text-xs font-medium text-foreground">{value}</p>
    </div>
  </div>
);

export default SpaceOnboarding;
