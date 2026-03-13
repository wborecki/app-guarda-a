import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    q: "O que é o GuardaAí?",
    a: "O GuardaAí é uma plataforma que conecta quem precisa guardar objetos com quem tem espaço sobrando — como garagens, quartos vazios e depósitos. É um self storage descentralizado, mais barato e mais perto de você.",
  },
  {
    q: "Como o preço é calculado?",
    a: "O preço é baseado no volume que seus objetos vão ocupar (mínimo de 1 m³). Usamos uma tabela progressiva: quanto mais tempo você guardar, menor o valor proporcional por dia. Reservas por hora são proporcionais à diária. Uma taxa de serviço fixa de R$ 28,00 é adicionada no checkout.",
  },
  {
    q: "Quanto custa guardar no GuardaAí?",
    a: "Diárias a partir de R$ 5,00/m³. Para 30 dias, o valor é R$ 45,00/m³. Reservas por hora a partir de R$ 0,21/m³/hora. Quanto maior o período, menor o custo por dia.",
  },
  {
    q: "Posso guardar por poucas horas?",
    a: "Sim! Espaços que aceitam locação por hora permitem reservas de poucas horas. O valor é proporcional à diária (diária ÷ 24). Basta selecionar o mesmo dia de entrada e saída e ajustar os horários.",
  },
  {
    q: "Posso guardar por poucos dias?",
    a: "Sim! Você pode guardar a partir de 1 dia. A cobrança segue a tabela progressiva — mesmo períodos curtos têm preço justo.",
  },
  {
    q: "Posso guardar por meses ou mais?",
    a: "Claro. Temos planos de 30 dias e anuais. Quanto mais longo o período, menor o valor proporcional por dia.",
  },
  {
    q: "Existe cobrança mínima?",
    a: "Sim. A cobrança mínima equivale a 1 m³. Objetos que ocupem menos de 1 m³ são cobrados como 1 m³.",
  },
  {
    q: "O que é a taxa de serviço?",
    a: "É uma taxa fixa de R$ 28,00 por reserva, cobrada no checkout. Ela cobre os custos operacionais da plataforma.",
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
    q: "O que acontece se o objeto não for retirado?",
    a: "Objetos não retirados após o prazo contratual e o período adicional previsto nos termos poderão ser considerados abandonados, conforme as regras da plataforma.",
  },
  {
    q: "Como faço para anunciar meu espaço?",
    a: "Cadastre seu espaço com dimensões, tipo e fotos. Defina seus horários de atendimento e se aceita reservas por hora, por dia ou ambos. Depois é só aguardar solicitações e aceitar as reservas.",
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
