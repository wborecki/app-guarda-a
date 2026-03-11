import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
import { useAuth } from "@/hooks/useAuth";
import {
  Home, ArrowRight, Camera, FileText, Ban, UserX, Clock,
  Warehouse, BedDouble, Container, Tent, Building2, Store,
  Shield, Upload, CheckCircle2, DollarSign
} from "lucide-react";

const spaceTypes = [
  { icon: Warehouse, label: "Garagem" },
  { icon: BedDouble, label: "Quarto vazio" },
  { icon: Container, label: "Depósito" },
  { icon: Tent, label: "Área coberta" },
  { icon: Building2, label: "Pequeno galpão" },
  { icon: Store, label: "Espaço comercial" },
];

const benefits = [
  { icon: DollarSign, title: "Renda passiva", desc: "Ganhe até R$45/m³ por mês com espaço ocioso." },
  { icon: Shield, title: "Seguro e intermediado", desc: "Termos claros, fotos obrigatórias e intermediação digital." },
  { icon: CheckCircle2, title: "Você no controle", desc: "Defina regras, aceite ou recuse solicitações." },
];

const securityItems = [
  { icon: Camera, title: "Foto obrigatória dos itens", desc: "Todos os objetos são registrados antes do armazenamento." },
  { icon: FileText, title: "Termos de responsabilidade", desc: "Ambas as partes aceitam termos claros antes de cada reserva." },
  { icon: Ban, title: "Itens proibidos", desc: "Drogas, armas, explosivos, perecíveis e itens ilegais são vetados." },
  { icon: UserX, title: "Direito de recusa", desc: "Você pode recusar objetos que não se enquadrem nas regras." },
  { icon: Clock, title: "Política de abandono", desc: "Objetos não retirados no prazo são tratados conforme os termos." },
  { icon: Shield, title: "Intermediação digital", desc: "O GuardaAí atua como intermediador entre as partes." },
];

const faqItems = [
  { q: "Que tipo de espaço posso anunciar?", a: "Garagens, quartos vazios, depósitos, áreas cobertas, galpões pequenos e espaços comerciais ociosos." },
  { q: "Como o valor é calculado?", a: "O valor base é de R$45/m³ por mês. O sistema calcula automaticamente com base no volume do espaço." },
  { q: "Posso recusar objetos?", a: "Sim. O anfitrião tem total direito de recusar objetos inadequados ou fora das regras da plataforma." },
  { q: "Como recebo meu pagamento?", a: "Os pagamentos são processados pela plataforma e repassados diretamente para sua conta." },
  { q: "Que itens são proibidos?", a: "Drogas, armas, explosivos, materiais perecíveis, animais vivos e qualquer item ilegal." },
];

const HostLanding = () => {
  const { user, displayName, loading: authLoading } = useAuth();

  const [form, setForm] = useState({
    name: "", whatsapp: "", email: "", city: "", neighborhood: "",
    spaceType: "", height: "", width: "", length: "",
    covered: false, closed: false, easyAccess: false, notes: "",
  });

  // Pre-fill form with user data when available
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        name: prev.name || displayName || "",
        email: prev.email || user.email || "",
        whatsapp: prev.whatsapp || user.user_metadata?.phone || "",
      }));
    }
  }, [user, displayName]);

  const isLoggedIn = !!user;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = isLoggedIn ? (displayName || form.name) : form.name;
    const finalEmail = isLoggedIn ? (user.email || form.email) : form.email;
    const message = encodeURIComponent(
      `Olá! Quero cadastrar meu espaço no GuardaAí.\n\nNome: ${finalName}\nE-mail: ${finalEmail}\nWhatsApp: ${form.whatsapp}\nCidade: ${form.city}\nBairro: ${form.neighborhood}\nTipo: ${form.spaceType}\nDimensões: ${form.width}m x ${form.length}m x ${form.height}m\nCoberto: ${form.covered ? "Sim" : "Não"}\nFechado: ${form.closed ? "Sim" : "Não"}\nFácil acesso: ${form.easyAccess ? "Sim" : "Não"}\nObs: ${form.notes}`
    );
    window.open(`https://wa.me/5511994541862?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero + Form — side by side on desktop, stacked on mobile */}
        <section className="relative pt-24 pb-14 md:pt-32 md:pb-20 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-20 left-0 w-72 h-72 bg-accent/8 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/6 rounded-full blur-3xl" />
          </div>

          <div className="container">
            <div className="grid lg:grid-cols-[1fr_420px] gap-10 lg:gap-14 items-start max-w-6xl mx-auto">
              {/* Left: Value prop */}
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="pt-2 lg:pt-8">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-5">
                  <Home size={14} />
                  Para anfitriões
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold text-foreground leading-tight mb-4">
                  Transforme espaço vazio em <span className="text-accent">renda extra</span>
                </h1>
                <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
                  Garagens, quartos, depósitos e áreas cobertas podem virar dinheiro. Cadastre seu espaço e comece a ganhar até R$45/m³ por mês.
                </p>

                {/* Benefits */}
                <div className="space-y-4">
                  {benefits.map((b, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <b.icon size={18} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{b.title}</p>
                        <p className="text-xs text-muted-foreground">{b.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Earnings preview */}
                <div className="mt-8 grid grid-cols-3 gap-3">
                  {[
                    { size: "3 m³", value: "R$ 135", label: "Garagem" },
                    { size: "5 m³", value: "R$ 225", label: "Quarto" },
                    { size: "10 m³", value: "R$ 450", label: "Depósito" },
                  ].map((e, i) => (
                    <div key={i} className="p-3 rounded-xl bg-card border text-center">
                      <p className="text-[10px] text-muted-foreground">{e.label}</p>
                      <p className="text-xs font-semibold text-foreground">{e.size}</p>
                      <p className="text-sm font-bold text-accent mt-0.5">até {e.value}<span className="text-[10px] font-normal text-muted-foreground">/mês</span></p>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">* Valores ilustrativos baseados em R$45/m³ por mês.</p>
              </motion.div>

              {/* Right: Compact Form */}
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
                <form
                  onSubmit={handleSubmit}
                  className="p-5 md:p-6 rounded-2xl bg-card border shadow-lg space-y-4"
                  id="cadastro"
                >
                  <div className="text-center mb-1">
                    <h2 className="text-lg font-bold text-foreground">Cadastre seu espaço</h2>
                    <p className="text-xs text-muted-foreground">Preencha os dados e comece a ganhar.</p>
                  </div>

                  {/* Personal data — smart: hidden or pre-filled if logged in */}
                  {!isLoggedIn ? (
                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Seus dados</p>
                      <Input placeholder="Nome completo" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="h-10 text-sm" />
                      <div className="grid grid-cols-2 gap-3">
                        <Input placeholder="E-mail" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required className="h-10 text-sm" />
                        <Input placeholder="WhatsApp" value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} required className="h-10 text-sm" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary/60 border border-border/60">
                      <CheckCircle2 size={16} className="text-primary shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{displayName || user.email}</p>
                        <p className="text-[10px] text-muted-foreground">Conectado — dados preenchidos automaticamente</p>
                      </div>
                    </div>
                  )}

                  {/* Location */}
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Localização</p>
                    <div className="grid grid-cols-2 gap-3">
                      <Input placeholder="Cidade" value={form.city} onChange={e => setForm({...form, city: e.target.value})} required className="h-10 text-sm" />
                      <Input placeholder="Bairro" value={form.neighborhood} onChange={e => setForm({...form, neighborhood: e.target.value})} required className="h-10 text-sm" />
                    </div>
                  </div>

                  {/* Space details */}
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Sobre o espaço</p>
                    <Select value={form.spaceType} onValueChange={v => setForm({...form, spaceType: v})}>
                      <SelectTrigger className="h-10 text-sm"><SelectValue placeholder="Tipo de espaço" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="garagem">Garagem</SelectItem>
                        <SelectItem value="quarto">Quarto vazio</SelectItem>
                        <SelectItem value="deposito">Depósito</SelectItem>
                        <SelectItem value="area-coberta">Área coberta</SelectItem>
                        <SelectItem value="galpao">Pequeno galpão</SelectItem>
                        <SelectItem value="comercial">Espaço comercial</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="grid grid-cols-3 gap-2">
                      <Input placeholder="Altura (m)" type="number" step="0.1" value={form.height} onChange={e => setForm({...form, height: e.target.value})} className="h-10 text-sm" />
                      <Input placeholder="Largura (m)" type="number" step="0.1" value={form.width} onChange={e => setForm({...form, width: e.target.value})} className="h-10 text-sm" />
                      <Input placeholder="Compr. (m)" type="number" step="0.1" value={form.length} onChange={e => setForm({...form, length: e.target.value})} className="h-10 text-sm" />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "covered", label: "Coberto", value: form.covered, key: "covered" as const },
                        { id: "closed", label: "Fechado", value: form.closed, key: "closed" as const },
                        { id: "easyAccess", label: "Fácil acesso", value: form.easyAccess, key: "easyAccess" as const },
                      ].map(s => (
                        <div key={s.id} className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/40 border border-border/60">
                          <Label htmlFor={s.id} className="cursor-pointer text-xs">{s.label}</Label>
                          <Switch id={s.id} checked={s.value} onCheckedChange={v => setForm({...form, [s.key]: v})} className="scale-90" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notes + Photos */}
                  <Textarea placeholder="Observações sobre o espaço (opcional)" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={2} className="text-sm resize-none" />

                  <label className="flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-border hover:border-primary/40 transition-colors cursor-pointer bg-secondary/20">
                    <Upload size={18} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Enviar fotos do espaço (máx. 5)</span>
                    <input type="file" accept="image/*" multiple className="hidden" />
                  </label>

                  <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-sm font-semibold h-11 group">
                    Cadastrar meu espaço
                    <ArrowRight size={16} className="ml-1.5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Space types — condensed */}
        <section className="py-14 md:py-20 bg-secondary/40">
          <div className="container max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-8">Espaços aceitos</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {spaceTypes.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                  className="p-4 rounded-xl bg-card border text-center hover:border-primary/20 transition-all">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <s.icon size={20} className="text-primary" />
                  </div>
                  <p className="text-xs font-semibold text-foreground">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Security — condensed */}
        <section className="py-14 md:py-20">
          <div className="container max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-3">Segurança para anfitriões</h2>
            <p className="text-sm text-muted-foreground text-center mb-8 max-w-xl mx-auto">
              O GuardaAí protege você com regras claras e intermediação digital.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {securityItems.map((f, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className="p-5 rounded-xl bg-card border">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-2.5">
                    <f.icon size={18} className="text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm mb-1">{f.title}</h3>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ — condensed */}
        <section className="py-14 md:py-20 bg-secondary/40">
          <div className="container max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-8">Perguntas frequentes</h2>
            <Accordion type="single" collapsible className="space-y-2">
              {faqItems.map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="bg-card border rounded-xl px-5">
                  <AccordionTrigger className="text-left font-semibold text-foreground text-sm">{item.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-14 md:py-20">
          <div className="container text-center max-w-xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Pronto para começar?</h2>
            <p className="text-sm text-muted-foreground mb-6">Cadastre seu espaço agora e transforme metros ociosos em renda.</p>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 group" onClick={() => document.getElementById("cadastro")?.scrollIntoView({ behavior: "smooth" })}>
              Cadastrar meu espaço
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HostLanding;
