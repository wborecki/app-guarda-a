import SEO from "@/components/SEO";
import Header from "@/components/guardaai/Header";
import Footer from "@/components/guardaai/Footer";
import Simulator from "@/components/guardaai/Simulator";
import { motion } from "framer-motion";
import { Shield, Clock, DollarSign, MapPin, CheckCircle2, Lock, Camera, FileText, Package, ArrowRight, TrendingDown } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const steps = [
  { num: "1", icon: MapPin, title: "Simule e busque", desc: "Informe seus itens e encontre espaços disponíveis na sua região." },
  { num: "2", icon: Clock, title: "Reserve online", desc: "Escolha datas, confirme o valor e reserve em poucos cliques." },
  { num: "3", icon: CheckCircle2, title: "Guarde com segurança", desc: "Leve seus itens ao local. Tudo registrado e intermediado pela plataforma." },
];

const benefits = [
  { icon: DollarSign, title: "Mais acessível", desc: "Preços definidos por anfitriões, muito abaixo de self storages." },
  { icon: Shield, title: "Seguro e registrado", desc: "Itens fotografados, cadastrados e protegidos por termos." },
  { icon: TrendingDown, title: "Preço flexível", desc: "Cada anfitrião define seu valor. Sem taxa de serviço." },
];

const trustItems = [
  { icon: Camera, title: "Registro fotográfico", desc: "Todos os objetos são fotografados antes do armazenamento." },
  { icon: FileText, title: "Termos de responsabilidade", desc: "Regras claras aceitas por ambas as partes antes de cada reserva." },
  { icon: Lock, title: "Intermediação pela plataforma", desc: "O GuardaAí atua como intermediador seguro em toda a operação." },
];

const faqs = [
  { q: "O que posso guardar?", a: "Móveis, caixas, bicicletas, malas, equipamentos, estoque de e-commerce e itens pessoais. Itens ilegais, perigosos ou perecíveis são proibidos." },
  { q: "Quem define o preço?", a: "O anfitrião define o preço do espaço. A GuardaAí sugere valores de referência, mas não impõe uma tabela fixa. O mínimo é R$ 1,50/m³/dia." },
  { q: "Posso guardar por poucas horas?", a: "Sim! Espaços que aceitam por hora permitem reservas curtas. A cobrança mínima é de 1 diária." },
  { q: "Posso guardar por poucos dias?", a: "Sim, a partir de 1 dia. O preço varia conforme o anfitrião." },
  { q: "Como funciona a segurança?", a: "Objetos são cadastrados com foto, ambas as partes aceitam termos de responsabilidade, e toda intermediação é feita digitalmente pela plataforma." },
];

const pricingTiers = [
  { period: "1 dia", price: "R$ 5,00", daily: "sugestão/m³" },
  { period: "7 dias", price: "R$ 2,71", daily: "sugestão/m³/dia" },
  { period: "30 dias", price: "R$ 1,50", daily: "mínimo/m³/dia" },
  { period: "Por hora", price: "aceito", daily: "mín. 1 diária" },
];

const QueroGuardar = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO title="Quero guardar" description="Simule o custo de armazenamento, encontre espaços disponíveis e reserve online. Mais barato que self storage tradicional." canonical="/quero-guardar" />
      <Header />
      <main>
        {/* ========== HERO + SIMULATOR ========== */}
        <section className="relative pt-24 pb-10 md:pt-28 md:pb-16 overflow-hidden">
          {/* Background blobs */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-16 -left-20 w-80 h-80 bg-primary/6 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
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
                {/* Chip */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold tracking-wide uppercase mb-4">
                  <Package size={13} />
                  Armazenamento fácil e acessível
                </div>

                {/* Headline */}
                <h1 className="text-[1.75rem] md:text-4xl lg:text-[2.65rem] font-extrabold text-foreground leading-[1.15] mb-3">
                  Guarde suas coisas<br className="hidden md:block" /> por <span className="text-primary">muito menos</span>
                </h1>

                {/* Subtitle */}
                <p className="text-[15px] md:text-base text-muted-foreground mb-6 max-w-md leading-relaxed">
                  Espaços reais perto de você, com preço justo e segurança garantida. Simule agora e descubra o valor.
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
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <b.icon size={16} className="text-primary" />
                      </div>
                      <div>
                        <span className="font-semibold text-foreground text-sm">{b.title}</span>
                        <span className="text-muted-foreground text-xs ml-1.5">— {b.desc}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Pricing reference cards */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2.5">Referência de preço</p>
                  <div className="grid grid-cols-4 gap-2.5">
                    {pricingTiers.map((t, i) => (
                      <div key={i} className="relative p-3.5 rounded-xl bg-card border border-border/80 hover:border-primary/30 transition-colors">
                        <p className="text-[10px] font-medium text-muted-foreground mb-1">{t.period}</p>
                        <p className="text-lg font-bold text-foreground leading-none">{t.price}</p>
                        <p className="text-[10px] text-primary font-medium mt-1">{t.daily}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">
                    Preço definido pelo anfitrião. Mínimo R$ 1,50/m³/dia. Sem taxa de serviço. Reservas por hora com cobrança mínima de 1 diária.
                  </p>
                </motion.div>
              </motion.div>

              {/* RIGHT — Simulator */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.12 }}
                className="lg:sticky lg:top-24"
              >
                <div className="rounded-2xl bg-card border border-border/80 shadow-xl overflow-hidden">
                  <div className="px-5 pt-5 pb-2 border-b border-border/60 bg-secondary/30">
                    <h2 className="text-base font-bold text-foreground">Simule seu armazenamento</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Calcule o volume e o preço em segundos.</p>
                  </div>
                  <Simulator embedded />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ========== COMO FUNCIONA ========== */}
        <section className="py-12 md:py-16 bg-secondary/40">
          <div className="container max-w-4xl">
            <div className="text-center mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1.5">Como funciona</h2>
              <p className="text-sm text-muted-foreground">Três passos simples para guardar seus itens com segurança.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {steps.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.08 }}
                  className="relative p-5 rounded-xl bg-card border hover:border-primary/20 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <step.icon size={18} className="text-primary" />
                    </div>
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">{step.num}</span>
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">{step.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== SEGURANÇA E CONFIANÇA ========== */}
        <section className="py-12 md:py-16">
          <div className="container max-w-4xl">
            <div className="text-center mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1.5">Segurança e confiança</h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Seus objetos protegidos por regras claras, registro fotográfico e intermediação digital.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {trustItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="p-5 rounded-xl bg-card border hover:border-primary/20 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 group-hover:bg-primary/15 flex items-center justify-center mb-3 transition-colors">
                    <item.icon size={18} className="text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
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
              <p className="text-sm text-muted-foreground">Tire suas dúvidas sobre o serviço.</p>
            </div>
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="bg-card border rounded-xl px-5 data-[state=open]:border-primary/20 transition-colors">
                  <AccordionTrigger className="text-left font-semibold text-foreground text-sm hover:no-underline py-3.5">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4">
                    {faq.a}
                  </AccordionContent>
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
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">Pronto para guardar?</h2>
              <p className="text-sm text-muted-foreground mb-5">
                Simule o preço, encontre um espaço e guarde seus itens com segurança.
              </p>
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 h-11 text-sm font-semibold group"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Simular agora
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

export default QueroGuardar;
