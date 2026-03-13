import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    q: "O que é o GuardaAí?",
    a: "O GuardaAí é uma plataforma que conecta quem precisa guardar objetos com quem tem espaço sobrando — como garagens, quartos vazios e depósitos. É um self storage descentralizado, mais barato e mais perto de você.",
  },
  {
    q: "Como o preço é calculado?",
    a: "O preço é definido pelo anfitrião, com base no volume que seus objetos vão ocupar (mínimo de 1 m³) e na duração da reserva. A GuardaAí sugere valores de referência, mas o anfitrião tem liberdade para definir seu próprio preço, respeitando o mínimo da plataforma.",
  },
  {
    q: "Quem define o preço?",
    a: "O anfitrião define o preço do seu espaço. A GuardaAí oferece uma sugestão baseada em volume e duração, mas a decisão final é do anfitrião.",
  },
  {
    q: "Existe taxa de serviço?",
    a: "Não. A GuardaAí não cobra taxa de serviço nas reservas.",
  },
  {
    q: "Existe taxa de limpeza?",
    a: "Para reservas acima de 7 dias, o anfitrião pode optar por cobrar uma taxa de limpeza. Essa taxa é opcional, informada antes do checkout e varia conforme o anfitrião.",
  },
  {
    q: "Posso reservar por poucas horas?",
    a: "Sim! Espaços que aceitam locação por hora permitem reservas de poucas horas. A cobrança mínima é equivalente a 1 diária. Basta selecionar o mesmo dia de entrada e saída.",
  },
  {
    q: "Como funciona a cobrança em reserva curta?",
    a: "Reservas por horas são permitidas, mas a cobrança mínima é sempre equivalente a 1 diária completa, conforme o preço definido pelo anfitrião.",
  },
  {
    q: "Existe valor mínimo?",
    a: "Sim. O valor mínimo é de R$ 1,50 por m³ por diária. O volume mínimo de cobrança é 1 m³.",
  },
  {
    q: "Como a GuardaAí sugere preço ao anfitrião?",
    a: "A plataforma utiliza uma tabela progressiva de referência baseada no volume e na duração da reserva. Essa tabela serve como sugestão para ajudar o anfitrião a precificar seu espaço de forma competitiva, mas não é obrigatória.",
  },
  {
    q: "Posso guardar por poucos dias?",
    a: "Sim! Você pode guardar a partir de 1 dia. O preço varia conforme o anfitrião.",
  },
  {
    q: "Posso guardar por meses ou mais?",
    a: "Claro. Reservas longas são aceitas e geralmente têm valores mais vantajosos por dia.",
  },
  {
    q: "Eu pago pelo volume total do espaço?",
    a: "Não. Você paga apenas pelo volume que seus objetos vão ocupar, e não pela capacidade total do local anunciado. Objetos podem ser empilhados para otimizar o uso do espaço.",
  },
  {
    q: "Quais objetos posso armazenar?",
    a: "Móveis, caixas, bicicletas, malas, equipamentos, estoque de e-commerce, ferramentas e itens pessoais em geral. Basta serem objetos permitidos pelos termos de uso.",
  },
  {
    q: "Quais itens são proibidos?",
    a: "Drogas, armas, explosivos, produtos perigosos, perecíveis, animais vivos e qualquer item ilegal.",
  },
  {
    q: "Como funciona a segurança?",
    a: "Todos os objetos são cadastrados com foto. Ambas as partes aceitam termos de responsabilidade. Toda a intermediação é feita pela plataforma, com regras claras para proteger quem guarda e quem oferece espaço.",
  },
  {
    q: "Como faço para anunciar meu espaço?",
    a: "Cadastre seu espaço com dimensões, tipo e fotos. Defina seu preço, seus horários de atendimento e se aceita reservas por hora, por dia ou ambos. A plataforma sugere valores, mas você decide.",
  },
  {
    q: "Preciso medir meu objeto?",
    a: "Não necessariamente. O sistema possui uma lista de objetos com medidas estimadas. Basta selecionar o que deseja guardar e o cálculo é automático.",
  },
  {
    q: "Posso pagar online?",
    a: "Sim. Todo o processo de reserva e pagamento pode ser feito diretamente pela plataforma.",
  },
  {
    q: "Como funcionam os horários de atendimento?",
    a: "Cada anfitrião define os horários em que está disponível para receber e devolver itens, por dia da semana. Ao reservar, você pode verificar os horários disponíveis antes de confirmar.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="py-10 md:py-20 bg-secondary/40">
      <div className="container max-w-3xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6 md:mb-12"
        >
          <h2 className="text-[1.3rem] md:text-4xl font-bold text-foreground mb-1.5 md:mb-4 leading-tight">
            Perguntas frequentes
          </h2>
          <p className="text-muted-foreground text-[13px] md:text-lg">
            Tire suas dúvidas sobre o GuardaAí.
          </p>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-1.5 md:space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="bg-card border border-border/60 rounded-xl px-3.5 md:px-6">
              <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline text-[13px] md:text-base py-3 md:py-4">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground/80 text-[11.5px] md:text-sm leading-relaxed pb-3 md:pb-4">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
