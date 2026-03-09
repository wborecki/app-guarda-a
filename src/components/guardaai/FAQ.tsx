import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "O que é o GuardaAí?", a: "O GuardaAí é uma plataforma que conecta pessoas que precisam guardar objetos com pessoas que têm espaço ocioso em casa — como garagens, quartos vazios e depósitos. É um marketplace de self storage descentralizado, mais barato e mais próximo de você." },
  { q: "Como o preço é calculado?", a: "O preço é baseado na metragem necessária para armazenar seus objetos. A cobrança mínima é de 1 m². Objetos menores que 1 m² pagam como 1 m². O sistema calcula tudo automaticamente com base no que você precisa guardar." },
  { q: "Posso guardar por poucos dias?", a: "Sim! Oferecemos diárias a partir de R$1,50 por m². Você pode guardar por 1 dia, uma semana ou o tempo que precisar." },
  { q: "Posso guardar por meses?", a: "Claro! Temos mensalidades a partir de R$45 por m². Quanto mais tempo, menor o valor proporcional por dia." },
  { q: "Quais objetos posso armazenar?", a: "Você pode guardar móveis, caixas, bicicletas, malas, equipamentos, estoque de e-commerce, ferramentas e itens pessoais em geral. Basta serem objetos permitidos pelos termos da plataforma." },
  { q: "Quais itens são proibidos?", a: "São proibidos: drogas, armas, explosivos, produtos perigosos, itens ilegais, perecíveis e animais vivos. A lista completa está nos termos de uso." },
  { q: "Como funciona a segurança?", a: "Todos os objetos devem ser cadastrados com foto. Ambas as partes aceitam termos de responsabilidade. O anfitrião tem direito de recusa e toda a intermediação é feita pela plataforma." },
  { q: "O que acontece se o objeto não for retirado?", a: "Objetos não retirados após o prazo contratual e o período adicional previsto nos termos poderão ser considerados abandonados conforme as regras da plataforma." },
  { q: "Como faço para anunciar meu espaço?", a: "É simples: cadastre seu espaço informando dimensões e tipo, publique fotos e aguarde solicitações. Você decide quais reservas aceitar." },
  { q: "Preciso medir meu objeto?", a: "Não! O sistema possui uma lista de objetos pré-cadastrados com medidas estimadas. Basta selecionar o que deseja guardar e o cálculo é automático." },
  { q: "Existe cobrança mínima?", a: "Sim, a cobrança mínima equivale a 1 m². Objetos que ocupem menos de 1 m² são cobrados como 1 m²." },
  { q: "Como funciona a taxa de serviço?", a: "Uma taxa de serviço fixa é adicionada no checkout para cobrir custos operacionais da plataforma. O valor é exibido antes da confirmação do pagamento." },
];

const FAQ = () => {
  return (
    <section id="faq" className="py-16 md:py-28 bg-secondary/50">
      <div className="container max-w-3xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3 md:mb-4">
            Perguntas frequentes
          </h2>
          <p className="text-muted-foreground text-sm md:text-lg">
            Tire suas dúvidas sobre o GuardaAí.
          </p>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="bg-card border rounded-xl px-4 md:px-6">
              <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline text-sm md:text-base py-3.5 md:py-4">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-xs md:text-sm leading-relaxed pb-3.5 md:pb-4">
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
