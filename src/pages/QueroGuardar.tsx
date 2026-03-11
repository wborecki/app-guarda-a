import { useNavigate } from "react-router-dom";
import Header from "@/components/guardaai/Header";
import Footer from "@/components/guardaai/Footer";
import Simulator from "@/components/guardaai/Simulator";
import { motion } from "framer-motion";
import { Shield, Clock, DollarSign, MapPin, CheckCircle2, Lock, Camera, FileText, Package, ArrowRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const steps = [
  { icon: MapPin, title: "Busque", desc: "Encontre espaços disponíveis perto de você." },
  { icon: Clock, title: "Reserve", desc: "Escolha as datas e reserve em poucos cliques." },
  { icon: CheckCircle2, title: "Guarde", desc: "Leve seus itens ao local. Simples assim." },
];

const benefits = [
  { icon: DollarSign, title: "Mais acessível", desc: "Pague muito menos que um self storage tradicional." },
  { icon: Shield, title: "Seguro e registrado", desc: "Itens fotografados e cadastrados na plataforma." },
  { icon: Clock, title: "Flexibilidade total", desc: "A partir de 1 dia. Quanto mais tempo, menor o custo." },
];

const trustItems = [
  { icon: Camera, title: "Registro fotográfico", desc: "Todos os objetos são fotografados e cadastrados na plataforma." },
  { icon: FileText, title: "Termos claros", desc: "Responsabilidades definidas e aceitas por ambas as partes." },
  { icon: Lock, title: "Intermediação digital", desc: "O GuardaAí atua como intermediador seguro entre as partes." },
];

const faqs = [
  { q: "O que posso guardar?", a: "Móveis, caixas, bicicletas, malas, equipamentos, estoque de e-commerce e itens pessoais em geral. Itens ilegais, perigosos ou perecíveis são proibidos." },
  { q: "Como o preço é calculado?", a: "O preço é baseado no volume (m³) e no período. Usamos uma tabela progressiva: quanto mais tempo, menor o valor por dia. Mínimo de 1 m³. Uma taxa de serviço fixa de R$ 28,00 é adicionada no checkout." },
  { q: "Posso guardar por poucos dias?", a: "Sim! A partir de 1 dia. A cobrança segue tabela progressiva — períodos curtos também têm preço justo." },
  { q: "Como funciona a segurança?", a: "Objetos são cadastrados com foto, ambas as partes aceitam termos de responsabilidade, e toda intermediação é feita pela plataforma." },
];

const QueroGuardar = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero + Simulator — side by side */}
        <section className="relative pt-24 pb-14 md:pt-32 md:pb-20 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-20 left-0 w-72 h-72 bg-accent/8 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/6 rounded-full blur-3xl" />
          </div>

          <div className="container">
            <div className="grid lg:grid-cols-[1fr_420px] gap-10 lg:gap-14 items-start max-w-6xl mx-auto">
              {/* Left: Value prop */}
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="pt-2 lg:pt-8">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-5">
                  <Package size={14} />
                  Para quem quer guardar
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold text-foreground leading-tight mb-4">
                  Guarde suas coisas por <span className="text-primary">muito menos</span>
                </h1>
                <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
                  Encontre espaços disponíveis perto de você e pague muito menos que um self storage tradicional. Simule agora e veja o preço.
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

                {/* Pricing mini-cards */}
                <div className="mt-8 grid grid-cols-3 gap-3">
                  {[
                    { period: "1 dia", price: "R$ 5,00", unit: "/m³" },
                    { period: "7 dias", price: "R$ 15,75", unit: "/m³" },
                    { period: "30 dias", price: "R$ 45,00", unit: "/m³" },
                  ].map((p, i) => (
                    <div key={i} className="p-3 rounded-xl bg-card border text-center">
                      <p className="text-[10px] text-muted-foreground">{p.period}</p>
                      <p className="text-sm font-bold text-primary mt-0.5">{p.price}<span className="text-[10px] font-normal text-muted-foreground">{p.unit}</span></p>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">Tabela progressiva — quanto mais dias, menor o custo por dia. + Taxa de serviço de R$ 28,00.</p>
              </motion.div>

              {/* Right: Simulator in card */}
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
                <div className="rounded-2xl bg-card border shadow-lg overflow-hidden">
                  <div className="text-center pt-5 pb-1 px-5">
                    <h2 className="text-lg font-bold text-foreground">Simule seu armazenamento</h2>
                    <p className="text-xs text-muted-foreground">Descubra o preço em segundos.</p>
                  </div>
                  <Simulator embedded />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Como funciona */}
        <section className="py-14 md:py-20 bg-secondary/40">
          <div className="container max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
              Como funciona
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {steps.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                    <step.icon size={22} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Confiança e segurança */}
        <section className="py-14 md:py-20">
          <div className="container max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-3">
              Segurança e confiança
            </h2>
            <p className="text-sm text-muted-foreground text-center mb-8 max-w-lg mx-auto">
              Seus objetos protegidos com regras claras e intermediação digital.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {trustItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="p-5 rounded-xl bg-card border text-center"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <item.icon size={20} className="text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-14 md:py-20 bg-secondary/40">
          <div className="container max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
              Perguntas frequentes
            </h2>
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="bg-card border rounded-xl px-5">
                  <AccordionTrigger className="text-left font-semibold text-foreground text-sm">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA final */}
        <section className="py-14 md:py-20">
          <div className="container text-center max-w-xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Pronto para guardar?</h2>
            <p className="text-sm text-muted-foreground mb-6">Simule o preço, encontre um espaço e guarde seus itens com segurança.</p>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 group" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              Simular agora
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

/** Simulator wrapped in a compact card to match HostLanding form style */
const SimulatorCard = () => {
  return (
    <div className="rounded-2xl bg-card border shadow-lg overflow-hidden">
      <div className="text-center pt-5 pb-2 px-5">
        <h2 className="text-lg font-bold text-foreground">Simule seu armazenamento</h2>
        <p className="text-xs text-muted-foreground">Descubra o preço em segundos.</p>
      </div>
      {/* Embed the Simulator component but override its outer wrapper styles */}
      <div className="simulator-card-wrapper">
        <Simulator />
      </div>
    </div>
  );
};

export default QueroGuardar;
