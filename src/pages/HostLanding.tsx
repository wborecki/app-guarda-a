import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import storageSupportImg from "@/assets/storage-vehicles-support.jpg";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Header from "@/components/guardaai/Header";
import Footer from "@/components/guardaai/Footer";
import LocationAutocomplete from "@/components/guardaai/LocationAutocomplete";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import {
  Home, ArrowRight, Camera, FileText, Ban, UserX, Clock,
  Warehouse, BedDouble, Container, Tent, Building2, Store,
  Shield, Upload, CheckCircle2, DollarSign, MapPin, CalendarCheck, Lock, Eye, X
} from "lucide-react";

const spaceTypes = [
  { icon: Warehouse, label: "Garagem" },
  { icon: BedDouble, label: "Quarto vazio" },
  { icon: Container, label: "Depósito" },
  { icon: Tent, label: "Área coberta" },
  { icon: Building2, label: "Galpão / Pátio" },
  { icon: Store, label: "Estacionamento / Vaga" },
];

const benefits = [
  { icon: DollarSign, title: "Renda por reserva", desc: "Receba por cada m³ ou vaga reservada no seu espaço." },
  { icon: Shield, title: "Seguro e intermediado", desc: "Termos, fotos e intermediação digital pela plataforma." },
  { icon: CheckCircle2, title: "Você no controle", desc: "Aceite ou recuse, defina preço e regras — para objetos ou veículos." },
];

const securityItems = [
  { icon: Camera, title: "Foto obrigatória", desc: "Objetos e veículos são registrados antes do armazenamento." },
  { icon: FileText, title: "Termos de responsabilidade", desc: "Regras claras aceitas por ambas as partes antes de cada reserva." },
  { icon: Ban, title: "Itens proibidos", desc: "Drogas, armas, explosivos, perecíveis e itens ilegais são vetados." },
  { icon: UserX, title: "Direito de recusa", desc: "Você pode recusar objetos ou veículos fora das regras." },
  { icon: Clock, title: "Política de abandono", desc: "Itens não retirados no prazo são tratados conforme os termos." },
  { icon: Lock, title: "Intermediação digital", desc: "O GuardaAí atua como intermediador seguro entre as partes." },
];

const faqItems = [
  { q: "Que tipo de espaço posso anunciar?", a: "Garagens, vagas, quartos vazios, depósitos, áreas cobertas, galpões, pátios e estacionamentos — residenciais ou comerciais. Espaços para guardar objetos, veículos ou ambos." },
  { q: "Posso anunciar vaga para veículos?", a: "Sim! Ao cadastrar, selecione 'Veículos' ou 'Ambos' como tipo de uso. Informe as dimensões do portão e quais veículos o espaço comporta (carros, motos, SUVs, barcos, etc.)." },
  { q: "Quem define o preço?", a: "Você define o preço do seu espaço livremente. A GuardaAí sugere valores de referência, mas a decisão final é sua. O mínimo obrigatório é R$ 1,50/m³/dia." },
  { q: "Posso recusar objetos ou veículos?", a: "Sim. O anfitrião tem total direito de recusar itens inadequados ou veículos incompatíveis com o espaço." },
  { q: "Como recebo meu pagamento?", a: "Os pagamentos são processados pela plataforma e repassados para sua conta." },
  { q: "Que itens são proibidos?", a: "Drogas, armas, explosivos, materiais perecíveis, animais vivos e qualquer item ilegal." },
  { q: "Preciso estar em casa para receber itens?", a: "Depende do seu modelo. Você pode combinar horários de acesso ou oferecer acesso independente, conforme sua preferência." },
];

const earningsExamples = [
  { label: "Vaga garagem", size: "1 carro", value: "R$ 250" },
  { label: "Depósito", size: "5 m³", value: "R$ 225" },
  { label: "Garagem grande", size: "carro + objetos", value: "R$ 400" },
];

const HostLanding = () => {
  const { user, displayName, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [photos, setPhotos] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    location: "",
    spaceType: "", spaceCategory: "",
    spaceUse: "objects" as "objects" | "vehicles" | "both",
    height: "", width: "", length: "",
    covered: false, closed: false, easyAccess: false,
    availability: "continuous",
    accessHours: "",
    accessType: "",
    notes: "",
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const total = photos.length + files.length;
    if (total > 5) {
      toast({ title: "Limite de fotos", description: "Você pode enviar no máximo 5 fotos.", variant: "destructive" });
      const allowed = files.slice(0, 5 - photos.length);
      setPhotos(prev => [...prev, ...allowed]);
    } else {
      setPhotos(prev => [...prev, ...files]);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const isLoggedIn = !!user;

  const volume = (() => {
    const h = parseFloat(form.height);
    const w = parseFloat(form.width);
    const l = parseFloat(form.length);
    if (h > 0 && w > 0 && l > 0) return (h * w * l).toFixed(1);
    return null;
  })();

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn || !user) return;
    setSubmitting(true);

    try {
      const { data, error } = await supabase.from("spaces").insert({
        user_id: user.id,
        location: form.location,
        space_type: form.spaceType,
        space_category: form.spaceCategory,
        space_use: form.spaceUse,
        height: parseFloat(form.height) || 0,
        width: parseFloat(form.width) || 0,
        length: parseFloat(form.length) || 0,
        covered: form.covered,
        closed: form.closed,
        easy_access: form.easyAccess,
        availability: form.availability,
        access_hours: form.accessHours,
        access_type: form.accessType,
        notes: form.notes,
        status: "draft",
        onboarding_step: 1,
      }).select("id").single();

      if (error) throw error;

      // Upload photos if any
      if (photos.length > 0 && data) {
        const uploaded: string[] = [];
        for (const file of photos) {
          const ext = file.name.split(".").pop();
          const path = `${user.id}/${data.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
          const { error: upErr } = await supabase.storage.from("space-photos").upload(path, file);
          if (!upErr) {
            const { data: urlData } = supabase.storage.from("space-photos").getPublicUrl(path);
            uploaded.push(urlData.publicUrl);
          }
        }
        if (uploaded.length > 0) {
          await supabase.from("spaces").update({ photos: uploaded }).eq("id", data.id);
        }
      }

      navigate(`/anunciar/finalizar?id=${data.id}`);
    } catch (err: any) {
      toast({ title: "Erro ao salvar", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Anuncie garagem, vaga ou depósito"
        description="Transforme espaço ocioso em renda. Anuncie garagem, vaga, depósito ou galpão na GuardaAí para guardar objetos e veículos."
        canonical="/anunciar"
      />
      <Header />
      <main>
        {/* ========== HERO + FORM ========== */}
        <section className="relative pt-24 pb-10 md:pt-28 md:pb-16 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-16 -left-20 w-80 h-80 bg-accent/6 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          </div>

          <div className="container">
            <div className="grid lg:grid-cols-[1fr_440px] gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
              {/* LEFT — Value prop */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="pt-1 lg:pt-6"
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-[11px] font-semibold tracking-wide uppercase mb-4">
                  <Home size={13} />
                  Para anfitriões
                </div>

                <h1 className="text-[1.75rem] md:text-4xl lg:text-[2.65rem] font-extrabold text-foreground leading-[1.15] mb-3">
                  Garagem, vaga ou depósito parado?<br className="hidden md:block" /> Transforme em <span className="text-accent">renda extra</span>
                </h1>

                <p className="text-[15px] md:text-base text-muted-foreground mb-6 max-w-md leading-relaxed">
                  Anuncie para quem precisa guardar caixas, estoque, carros, motos, barcos e mais. Cadastre em minutos e comece a faturar.
                </p>

                {/* Benefits */}
                <div className="space-y-3 mb-6">
                  {benefits.map((b, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 + i * 0.08 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <b.icon size={16} className="text-accent" />
                      </div>
                      <div>
                        <span className="font-semibold text-foreground text-sm">{b.title}</span>
                        <span className="text-muted-foreground text-xs ml-1.5">— {b.desc}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Earnings cards */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2.5">Estimativa de renda bruta mensal</p>
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5">
                    {earningsExamples.map((e, i) => (
                      <div key={i} className="relative p-2.5 sm:p-3.5 rounded-xl bg-card border border-border/80 hover:border-accent/30 transition-colors">
                        <p className="text-[9px] sm:text-[10px] font-medium text-muted-foreground">{e.label} · {e.size}</p>
                        <p className="text-base sm:text-lg font-bold text-accent leading-none mt-1">{e.value}</p>
                        <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-0.5">/mês</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">
                    * Estimativas brutas com ocupação total a R$ 1,50/m³/dia por 30 dias. Rendimento real varia conforme o preço definido pelo anfitrião e a demanda.
                  </p>
                </motion.div>
              </motion.div>

              {/* RIGHT — Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.12 }}
                className="lg:sticky lg:top-24"
              >
                <form
                  onSubmit={handleSubmit}
                  className="rounded-2xl bg-card border border-border/80 shadow-xl overflow-hidden"
                  id="cadastro"
                >
                  {/* Form header */}
                  <div className="px-5 pt-5 pb-3 border-b border-border/60 bg-secondary/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-base font-bold text-foreground">Cadastre seu espaço</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {step === 1 ? "Dados básicos do espaço" : "Detalhes e finalização"}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full transition-colors ${step >= 1 ? "bg-accent" : "bg-border"}`} />
                        <div className={`w-2 h-2 rounded-full transition-colors ${step >= 2 ? "bg-accent" : "bg-border"}`} />
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    {!isLoggedIn ? (
                      <div className="text-center py-6 space-y-3">
                        <Lock size={24} className="mx-auto text-muted-foreground" />
                        <p className="text-sm font-medium text-foreground">Faça login para cadastrar seu espaço</p>
                        <p className="text-xs text-muted-foreground">Entre na sua conta ou crie uma para começar.</p>
                        <Button
                          type="button"
                          className="bg-accent hover:bg-accent/90 text-accent-foreground text-sm font-semibold h-10 px-6"
                          onClick={() => navigate("/entrar")}
                        >
                          Entrar ou criar conta
                        </Button>
                      </div>
                    ) : (
                    <>
                    <div className={step === 1 ? "space-y-4" : "hidden"}>
                        {/* Connected user badge */}
                        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-secondary/60 border border-border/60">
                          <CheckCircle2 size={15} className="text-primary shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-foreground truncate">{displayName || user.email}</p>
                            <p className="text-[10px] text-muted-foreground">Conectado</p>
                          </div>
                        </div>

                        {/* === LOCATION === */}
                        <div className="space-y-2.5">
                          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                            <MapPin size={11} />
                            Localização
                          </p>
                          <LocationAutocomplete
                            value={form.location}
                            onChange={(v) => setForm({...form, location: v})}
                            placeholder="Endereço ou região do espaço"
                            className="h-10 text-sm"
                          />
                        </div>

                        {/* === SPACE USE === */}
                        <div className="space-y-2.5">
                          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Para que tipo de uso?</p>
                          <div className="grid grid-cols-3 gap-1.5">
                            {([
                              { value: "objects", label: "Objetos" },
                              { value: "vehicles", label: "Veículos" },
                              { value: "both", label: "Ambos" },
                            ] as const).map(opt => (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => setForm({...form, spaceUse: opt.value})}
                                className={`text-xs font-medium px-3 py-2.5 rounded-lg border transition-colors ${
                                  form.spaceUse === opt.value
                                    ? "bg-accent/10 border-accent/40 text-accent"
                                    : "bg-card border-border/60 text-muted-foreground hover:border-primary/30"
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* === SPACE TYPE === */}
                        <div className="space-y-2.5">
                          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Tipo de espaço</p>
                          <Select value={form.spaceType} onValueChange={v => setForm({...form, spaceType: v})}>
                            <SelectTrigger className="h-10 text-sm"><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="garagem">Garagem</SelectItem>
                              <SelectItem value="quarto">Quarto vazio</SelectItem>
                              <SelectItem value="deposito">Depósito</SelectItem>
                              <SelectItem value="area-coberta">Área coberta</SelectItem>
                              <SelectItem value="galpao">Pequeno galpão</SelectItem>
                              <SelectItem value="comercial">Espaço comercial</SelectItem>
                              <SelectItem value="estacionamento">Estacionamento / Vaga</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* === DIMENSIONS === */}
                        <div className="space-y-2.5">
                          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Dimensões aproximadas</p>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="text-[10px] text-muted-foreground mb-1 block">Altura (m)</label>
                              <Input type="number" step="0.1" min="0" value={form.height} onChange={e => setForm({...form, height: e.target.value})} className="h-10 text-sm" />
                            </div>
                            <div>
                              <label className="text-[10px] text-muted-foreground mb-1 block">Largura (m)</label>
                              <Input type="number" step="0.1" min="0" value={form.width} onChange={e => setForm({...form, width: e.target.value})} className="h-10 text-sm" />
                            </div>
                            <div>
                              <label className="text-[10px] text-muted-foreground mb-1 block">Compr. (m)</label>
                              <Input type="number" step="0.1" min="0" value={form.length} onChange={e => setForm({...form, length: e.target.value})} className="h-10 text-sm" />
                            </div>
                          </div>
                          {volume && (
                            <p className="text-xs text-primary font-medium">Volume útil estimado: {volume} m³</p>
                          )}
                        </div>

                        {/* === STEP 1 CTA === */}
                        <Button
                          type="button"
                          size="lg"
                          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-sm font-semibold h-11 group"
                          onClick={() => setStep(2)}
                        >
                          Continuar
                          <ArrowRight size={16} className="ml-1.5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                    <div className={step === 2 ? "space-y-4" : "hidden"}>
                        {/* === STEP 2: DETAILS === */}

                        {/* Category + toggles */}
                        <div className="space-y-2.5">
                          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Características</p>
                          <Select value={form.spaceCategory} onValueChange={v => setForm({...form, spaceCategory: v})}>
                            <SelectTrigger className="h-10 text-sm"><SelectValue placeholder="Residencial ou comercial?" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="residencial">Residencial</SelectItem>
                              <SelectItem value="comercial">Comercial</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { id: "covered", label: "Coberto", value: form.covered, key: "covered" as const },
                              { id: "closed", label: "Fechado", value: form.closed, key: "closed" as const },
                              { id: "easyAccess", label: "Fácil acesso", value: form.easyAccess, key: "easyAccess" as const },
                            ].map(s => (
                              <div key={s.id} className="flex items-center justify-between p-2 rounded-lg bg-secondary/40 border border-border/60">
                                <Label htmlFor={s.id} className="cursor-pointer text-[11px]">{s.label}</Label>
                                <Switch id={s.id} checked={s.value} onCheckedChange={v => setForm({...form, [s.key]: v})} className="scale-[0.85]" />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Availability */}
                        <div className="space-y-2.5">
                          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                            <CalendarCheck size={11} />
                            Disponibilidade e acesso
                          </p>
                          <Select value={form.availability} onValueChange={v => setForm({...form, availability: v})}>
                            <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="continuous">Contínua / Indeterminada</SelectItem>
                              <SelectItem value="weekdays">Apenas dias úteis</SelectItem>
                              <SelectItem value="weekends">Apenas finais de semana</SelectItem>
                              <SelectItem value="custom">Personalizada (informar nas obs.)</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <Select value={form.accessHours} onValueChange={v => setForm({...form, accessHours: v})}>
                              <SelectTrigger className="h-10 text-sm"><SelectValue placeholder="Horário de acesso" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="livre">Livre / Sem restrição</SelectItem>
                                <SelectItem value="comercial">Horário comercial</SelectItem>
                                <SelectItem value="combinado">A combinar</SelectItem>
                              </SelectContent>
                            </Select>
                            <Select value={form.accessType} onValueChange={v => setForm({...form, accessType: v})}>
                              <SelectTrigger className="h-10 text-sm"><SelectValue placeholder="Tipo de acesso" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="independente">Independente</SelectItem>
                                <SelectItem value="acompanhado">Acompanhado</SelectItem>
                                <SelectItem value="combinar">A combinar</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Notes + photos */}
                        <div className="space-y-2.5">
                          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Detalhes adicionais</p>
                          <Textarea
                            placeholder="Observações, restrições, regras... (opcional)"
                            value={form.notes}
                            onChange={e => setForm({...form, notes: e.target.value})}
                            rows={2}
                            className="text-sm resize-none"
                          />
                          <label className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-border hover:border-accent/40 transition-colors cursor-pointer bg-secondary/20">
                            <Upload size={16} className="text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {photos.length === 0 ? "Enviar fotos do espaço (máx. 5)" : `${photos.length}/5 foto(s) selecionada(s)`}
                            </span>
                            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoChange} />
                          </label>
                          {photos.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {photos.map((photo, i) => (
                                <div key={i} className="relative group">
                                  <img
                                    src={URL.createObjectURL(photo)}
                                    alt={`Foto ${i + 1}`}
                                    className="w-16 h-16 rounded-lg object-cover border border-border"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removePhoto(i)}
                                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Navigation */}
                        <div className="flex gap-2.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            className="h-11 text-sm font-semibold px-5"
                            onClick={() => setStep(1)}
                          >
                            Voltar
                          </Button>
                           <Button type="submit" size="lg" disabled={submitting} className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground text-sm font-semibold h-11 group">
                             {submitting ? "Salvando..." : "Cadastrar meu espaço"}
                             {!submitting && <ArrowRight size={16} className="ml-1.5 group-hover:translate-x-1 transition-transform" />}
                           </Button>
                        </div>
                    </div>
                    </>
                    )}
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ========== ESPAÇOS ACEITOS ========== */}
        <section className="py-12 md:py-16 bg-secondary/40">
          <div className="container max-w-4xl">
            <div className="text-center mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1.5">Espaços que você pode anunciar</h2>
              <p className="text-sm text-muted-foreground">Garagens, vagas, depósitos e mais — para objetos ou veículos.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {spaceTypes.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                  className="p-4 rounded-xl bg-card border hover:border-accent/20 transition-colors text-center group">
                  <div className="w-9 h-9 rounded-lg bg-accent/10 group-hover:bg-accent/15 flex items-center justify-center mx-auto mb-2 transition-colors">
                    <s.icon size={18} className="text-accent" />
                  </div>
                  <p className="text-xs font-semibold text-foreground">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== IMAGEM DE APOIO ========== */}
        <section className="py-8 md:py-12">
          <div className="container max-w-4xl">
            <div className="rounded-2xl overflow-hidden border border-border/60 shadow-lg">
              <img
                src={storageSupportImg}
                alt="Espaço organizado com moto, bicicleta e caixas para armazenamento"
                className="w-full h-48 md:h-64 object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* ========== SEGURANÇA ========== */}
        <section className="py-12 md:py-16">
          <div className="container max-w-4xl">
            <div className="text-center mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1.5">Segurança para anfitriões</h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                O GuardaAí protege você com regras claras e intermediação digital.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {securityItems.map((f, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className="p-5 rounded-xl bg-card border hover:border-primary/20 transition-colors group">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 group-hover:bg-primary/15 flex items-center justify-center mb-2.5 transition-colors">
                    <f.icon size={18} className="text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm mb-1">{f.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== FAQ ========== */}
        <section className="py-12 md:py-16 bg-secondary/40">
          <div className="container max-w-2xl">
            <div className="text-center mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1.5">Perguntas frequentes</h2>
              <p className="text-sm text-muted-foreground">Tire suas dúvidas sobre como anunciar.</p>
            </div>
            <Accordion type="single" collapsible className="space-y-2">
              {faqItems.map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="bg-card border rounded-xl px-5 data-[state=open]:border-accent/20 transition-colors">
                  <AccordionTrigger className="text-left font-semibold text-foreground text-sm hover:no-underline py-3.5">{item.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* ========== CTA FINAL ========== */}
        <section className="py-12 md:py-16">
          <div className="container max-w-lg text-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">Pronto para começar?</h2>
              <p className="text-sm text-muted-foreground mb-5">
                Cadastre seu espaço agora e transforme metros ociosos em renda.
              </p>
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 h-11 text-sm font-semibold group"
                onClick={() => document.getElementById("cadastro")?.scrollIntoView({ behavior: "smooth" })}
              >
                Cadastrar meu espaço
                <ArrowRight size={16} className="ml-1.5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HostLanding;
