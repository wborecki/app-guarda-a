import Header from "@/components/guardaai/Header";
import Footer from "@/components/guardaai/Footer";
import Simulator from "@/components/guardaai/Simulator";
import { motion } from "framer-motion";
import { Shield, Clock, DollarSign, MapPin, CheckCircle2, Lock, Camera, FileText } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const steps = [
  { icon: MapPin, title: "Busque", desc: "Encontre espaços disponíveis perto de você." },
  { icon: Clock, title: "Reserve", desc: "Escolha as datas e reserve em poucos cliques." },
  { icon: CheckCircle2, title: "Guarde", desc: "Leve seus itens e pronto. Simples assim." },
];

const benefits = [
  { icon: DollarSign, text: "Até 60% mais barato que self storage" },
  { icon: Shield, text: "Seguro e com registro fotográfico" },
  { icon: Clock, text: "Flexibilidade de datas e volumes" },
  { icon: MapPin, text: "Espaços espalhados pela cidade" },
];

const trustItems = [
  { icon: Camera, title: "Registro fotográfico", desc: "Todos os objetos são fotografados e cadastrados na plataforma." },
  { icon: FileText, title: "Termos claros", desc: "Responsabilidades definidas e aceitas por ambas as partes." },
  { icon: Lock, title: "Intermediação digital", desc: "O GuardaAí atua como intermediador seguro entre as partes." },
];

const faqs = [
  { q: "O que posso guardar?", a: "Móveis, caixas, bicicletas, malas, equipamentos, estoque de e-commerce e itens pessoais em geral. Itens ilegais, perigosos ou perecíveis são proibidos." },
  { q: "Como o preço é calculado?", a: "O preço é baseado no volume (m³) e no período. Usamos uma tabela progressiva: quanto mais tempo, menor o valor por dia. Mínimo de 1 m³." },
  { q: "Posso guardar por poucos dias?", a: "Sim! A partir de 1 dia. A cobrança segue tabela progressiva — períodos curtos também têm preço justo." },
  { q: "Como funciona a segurança?", a: "Objetos são cadastrados com foto, ambas as partes aceitam termos de responsabilidade, e toda intermediação é feita pela plataforma." },
];

const QueroGuardar = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero compacto */}
        <section className="pt-24 md:pt-32 pb-6 md:pb-10">
          <div className="container max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-3 leading-tight">
                Guarde suas coisas por<br className="hidden md:block" /> muito menos
              </h1>
              <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
                Encontre espaços disponíveis perto de você e pague até 60% menos que um self storage tradicional.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Simulador */}
        <Simulator />

        {/* Como funciona */}
        <section className="py-14 md:py-20">
          <div className="container max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-8 tracking-tight">
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

        {/* Benefícios */}
        <section className="py-12 md:py-16 bg-secondary/30">
          <div className="container max-w-3xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.08 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-background border border-border/60"
                >
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-accent/15 text-accent flex items-center justify-center">
                    <b.icon size={18} />
                  </div>
                  <span className="text-sm font-medium text-foreground">{b.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Confiança e segurança */}
        <section className="py-14 md:py-20">
          <div className="container max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-3 tracking-tight">
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

        {/* FAQ resumido */}
        <section className="py-14 md:py-20 bg-secondary/30">
          <div className="container max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-8 tracking-tight">
              Perguntas frequentes
            </h2>
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="bg-card border rounded-xl px-4 md:px-6">
                  <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline text-sm md:text-base py-3.5">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-xs md:text-sm leading-relaxed pb-3.5">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default QueroGuardar;
