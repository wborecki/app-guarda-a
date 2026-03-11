import { useState } from "react";
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
import {
  Home, ArrowRight, DollarSign, Camera, FileText, ShieldAlert, Ban, UserX, Clock,
  Warehouse, BedDouble, Container, Tent, Building2, Store,
  ClipboardList, Ruler, ImagePlus, Bell, Banknote, Shield, Upload
} from "lucide-react";

const earnings = [
  { area: "3 m³", value: "R$ 135", desc: "Garagem pequena" },
  { area: "5 m³", value: "R$ 225", desc: "Quarto vazio" },
  { area: "10 m³", value: "R$ 450", desc: "Depósito médio" },
];

const spaceTypes = [
  { icon: Warehouse, label: "Garagem", desc: "Vaga ou garagem coberta" },
  { icon: BedDouble, label: "Quarto vazio", desc: "Cômodo sem uso na casa" },
  { icon: Container, label: "Depósito", desc: "Área de armazenamento" },
  { icon: Tent, label: "Área coberta", desc: "Varanda, telheiro, cobertura" },
  { icon: Building2, label: "Pequeno galpão", desc: "Espaço tipo barracão" },
  { icon: Store, label: "Espaço comercial", desc: "Loja ou sala ociosa" },
];

const steps = [
  { num: "1", icon: ClipboardList, title: "Cadastre seu espaço", desc: "Preencha o formulário com dados do local." },
  { num: "2", icon: Ruler, title: "Informe medidas", desc: "Altura, largura e comprimento do espaço." },
  { num: "3", icon: ImagePlus, title: "Publique fotos", desc: "Mostre como é o espaço disponível." },
  { num: "4", icon: Bell, title: "Receba solicitações", desc: "Pessoas próximas encontram seu espaço." },
  { num: "5", icon: Banknote, title: "Ganhe renda", desc: "Receba por espaço que estava parado." },
];

const securityItems = [
  { icon: Camera, title: "Foto obrigatória dos itens", desc: "Todos os objetos são fotografados e registrados antes do armazenamento." },
  { icon: FileText, title: "Termos de responsabilidade", desc: "Ambas as partes aceitam termos claros antes de cada reserva." },
  { icon: Ban, title: "Itens proibidos", desc: "Drogas, armas, explosivos, perecíveis, animais e itens ilegais são vetados." },
  { icon: UserX, title: "Direito de recusa", desc: "Você pode recusar objetos que não se enquadrem nas regras." },
  { icon: Clock, title: "Política de abandono", desc: "Objetos não retirados no prazo são tratados conforme os termos." },
  { icon: Shield, title: "Intermediação da plataforma", desc: "O GuardaAí atua como intermediador digital entre as partes." },
];

const faqItems = [
  { q: "Que tipo de espaço posso anunciar?", a: "Garagens, quartos vazios, depósitos, áreas cobertas, galpões pequenos e espaços comerciais ociosos. O espaço precisa ser seguro e acessível." },
  { q: "Como o valor é calculado?", a: "O valor base é de R$45/m³ por mês. O sistema calcula automaticamente com base no volume do espaço cadastrado." },
  { q: "Preciso receber pessoas dentro da minha casa?", a: "Não necessariamente. O espaço pode ser independente, como uma garagem com acesso externo. Você define as regras de acesso." },
  { q: "Posso recusar objetos?", a: "Sim. O anfitrião tem total direito de recusar objetos que considere inadequados ou que não se enquadrem nas regras da plataforma." },
  { q: "O que acontece se o cliente não retirar os itens?", a: "Após o prazo contratual, os objetos poderão ser considerados abandonados conforme os termos aceitos por ambas as partes." },
  { q: "Que itens são proibidos?", a: "Drogas, armas, explosivos, materiais perecíveis, animais vivos e qualquer item ilegal são proibidos na plataforma." },
  { q: "Como recebo meu pagamento?", a: "Os pagamentos são processados pela plataforma e repassados diretamente para sua conta após a confirmação do armazenamento." },
];

const HostLanding = () => {
  const [form, setForm] = useState({
    name: "", whatsapp: "", email: "", city: "", neighborhood: "",
    spaceType: "", height: "", width: "", length: "",
    covered: false, closed: false, easyAccess: false, notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = encodeURIComponent(
      `Olá! Quero cadastrar meu espaço no GuardaAí.\n\nNome: ${form.name}\nCidade: ${form.city}\nBairro: ${form.neighborhood}\nTipo: ${form.spaceType}\nDimensões: ${form.width}m x ${form.length}m x ${form.height}m\nCoberto: ${form.covered ? "Sim" : "Não"}\nFechado: ${form.closed ? "Sim" : "Não"}\nFácil acesso: ${form.easyAccess ? "Sim" : "Não"}\nObs: ${form.notes}`
    );
    window.open(`https://wa.me/5500000000000?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-20 left-0 w-96 h-96 bg-accent/8 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/8 rounded-full blur-3xl" />
          </div>
          <div className="container text-center max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-6">
                <Home size={16} />
                Para anfitriões
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-5">
                Transforme espaço vazio em <span className="text-accent">renda extra</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Garagens, quartos vazios, depósitos e áreas cobertas podem virar dinheiro com o GuardaAí. Cadastre seu espaço e comece a ganhar.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-base px-8 group" asChild>
                  <a href="#cadastro">
                    Cadastrar meu espaço
                    <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Exemplos de ganhos */}
        <section className="py-20 md:py-28 bg-secondary/50">
          <div className="container">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Quanto você pode ganhar?</h2>
              <p className="text-muted-foreground text-lg">Estimativas de renda mensal com base no tamanho do espaço.</p>
            </motion.div>
            <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {earnings.map((e, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="p-8 rounded-2xl bg-card border text-center hover:shadow-lg hover:border-accent/30 transition-all">
                  <p className="text-sm text-muted-foreground mb-1">{e.desc}</p>
                  <p className="text-2xl font-bold text-foreground mb-2">{e.area}</p>
                  <p className="text-3xl font-extrabold text-accent">até {e.value}<span className="text-base font-normal text-muted-foreground">/mês</span></p>
                </motion.div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-6">* Valores ilustrativos com base em R$45/m² por mês.</p>
          </div>
        </section>

        {/* Tipos de espaço */}
        <section className="py-20 md:py-28">
          <div className="container">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Que espaços são aceitos?</h2>
              <p className="text-muted-foreground text-lg">Qualquer espaço seguro e acessível pode virar renda.</p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {spaceTypes.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                  className="p-6 rounded-2xl bg-card border hover:shadow-md hover:border-primary/20 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <s.icon size={24} className="text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{s.label}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Como funciona */}
        <section className="py-20 md:py-28 bg-secondary/50">
          <div className="container">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Como funciona para anfitriões</h2>
              <p className="text-muted-foreground text-lg">5 passos simples para começar a ganhar.</p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
              {steps.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <s.icon size={24} className="text-primary" />
                  </div>
                  <div className="text-xs font-bold text-primary mb-1">Passo {s.num}</div>
                  <h3 className="font-semibold text-foreground text-sm mb-1">{s.title}</h3>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Segurança */}
        <section className="py-20 md:py-28">
          <div className="container">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Segurança para quem oferece espaço</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                O GuardaAí protege anfitriões com regras claras, termos de responsabilidade e intermediação digital.
              </p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {securityItems.map((f, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="p-6 rounded-2xl bg-card border">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <f.icon size={22} className="text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 md:py-28 bg-secondary/50">
          <div className="container max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Perguntas frequentes para anfitriões</h2>
            </motion.div>
            <Accordion type="single" collapsible className="space-y-3">
              {faqItems.map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="bg-card border rounded-xl px-6">
                  <AccordionTrigger className="text-left font-semibold text-foreground">{item.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Formulário de cadastro */}
        <section id="cadastro" className="py-20 md:py-28">
          <div className="container max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Cadastre seu espaço</h2>
              <p className="text-muted-foreground text-lg">Preencha o formulário abaixo e comece a ganhar renda extra.</p>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="p-8 md:p-10 rounded-2xl bg-card border shadow-sm space-y-6"
            >
              {/* Dados pessoais */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground text-lg">Seus dados</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome</Label>
                    <Input id="name" placeholder="Seu nome completo" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                  </div>
                  <div>
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input id="whatsapp" placeholder="(00) 00000-0000" value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} required />
                  </div>
                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" placeholder="seu@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                  </div>
                </div>
              </div>

              {/* Localização */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground text-lg">Localização</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">Cidade</Label>
                    <Input id="city" placeholder="Ex: São Paulo" value={form.city} onChange={e => setForm({...form, city: e.target.value})} required />
                  </div>
                  <div>
                    <Label htmlFor="neighborhood">Bairro</Label>
                    <Input id="neighborhood" placeholder="Ex: Pinheiros" value={form.neighborhood} onChange={e => setForm({...form, neighborhood: e.target.value})} required />
                  </div>
                </div>
              </div>

              {/* Espaço */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground text-lg">Sobre o espaço</h3>
                <div>
                  <Label>Tipo de espaço</Label>
                  <Select value={form.spaceType} onValueChange={v => setForm({...form, spaceType: v})}>
                    <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
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
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="height">Altura (m)</Label>
                    <Input id="height" type="number" step="0.1" placeholder="0.0" value={form.height} onChange={e => setForm({...form, height: e.target.value})} />
                  </div>
                  <div>
                    <Label htmlFor="width">Largura (m)</Label>
                    <Input id="width" type="number" step="0.1" placeholder="0.0" value={form.width} onChange={e => setForm({...form, width: e.target.value})} />
                  </div>
                  <div>
                    <Label htmlFor="length">Comprimento (m)</Label>
                    <Input id="length" type="number" step="0.1" placeholder="0.0" value={form.length} onChange={e => setForm({...form, length: e.target.value})} />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4 pt-2">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border">
                    <Label htmlFor="covered" className="cursor-pointer">Espaço coberto?</Label>
                    <Switch id="covered" checked={form.covered} onCheckedChange={v => setForm({...form, covered: v})} />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border">
                    <Label htmlFor="closed" className="cursor-pointer">Espaço fechado?</Label>
                    <Switch id="closed" checked={form.closed} onCheckedChange={v => setForm({...form, closed: v})} />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border">
                    <Label htmlFor="easyAccess" className="cursor-pointer">Fácil acesso?</Label>
                    <Switch id="easyAccess" checked={form.easyAccess} onCheckedChange={v => setForm({...form, easyAccess: v})} />
                  </div>
                </div>
              </div>

              {/* Observações e fotos */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea id="notes" placeholder="Informações adicionais sobre o espaço..." value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={3} />
                </div>
                <div>
                  <Label>Fotos do espaço</Label>
                  <label className="mt-2 flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed border-border hover:border-primary/40 transition-colors cursor-pointer bg-secondary/30">
                    <Upload size={28} className="text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Clique para enviar fotos</span>
                    <span className="text-xs text-muted-foreground/60 mt-1">JPG, PNG — máx. 5 fotos</span>
                    <input type="file" accept="image/*" multiple className="hidden" />
                  </label>
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base h-13 group">
                Cadastrar meu espaço
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HostLanding;
