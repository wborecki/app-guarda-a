import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/guardaai/Header";
import Footer from "@/components/guardaai/Footer";

const clauses = [
  "É o único responsável pelos bens, objetos, materiais, produtos e itens que cadastrar, transportar, entregar, armazenar ou mantiver vinculados à reserva realizada por meio da plataforma.",
  "Declara que os itens armazenados são de origem lícita, de sua propriedade ou que possui autorização legítima para sua posse, guarda e armazenamento.",
  "Declara que não armazenará, sob nenhuma hipótese, itens proibidos pela lei, pela regulamentação aplicável ou pelas políticas da GuardaAí, incluindo, sem limitação: armas, munições, explosivos, substâncias ilícitas, combustíveis, materiais inflamáveis, tóxicos, corrosivos, biológicos, perecíveis, animais, itens furtados, produtos contrabandeados ou quaisquer materiais que possam representar risco à saúde, à segurança, ao espaço, ao anfitrião, a terceiros ou ao meio ambiente.",
  "Reconhece que a GuardaAí atua exclusivamente como plataforma digital de intermediação entre usuários, não sendo depositária, transportadora, seguradora, fiscalizadora presencial, proprietária dos espaços anunciados, nem responsável direta ou indireta pela natureza, estado, acondicionamento, legalidade, integridade, conservação, perda, deterioração, extravio, furto, roubo, dano, contaminação, apreensão, embargo, vazamento, incêndio, explosão ou qualquer evento relacionado aos itens armazenados.",
  "Assume integral responsabilidade civil, administrativa, regulatória e criminal pelos itens armazenados, inclusive por danos causados ao anfitrião, ao imóvel, à estrutura do espaço, a terceiros, à plataforma ou às autoridades públicas, decorrentes direta ou indiretamente do conteúdo, natureza ou acondicionamento dos bens.",
  "Autoriza a GuardaAí a solicitar fotos, descrições, documentos, informações complementares e outros elementos necessários para análise de conformidade, segurança e prevenção de risco, podendo a plataforma bloquear, suspender, cancelar ou submeter a revisão manual qualquer solicitação de reserva, a seu exclusivo critério, sempre que houver indício de violação às políticas da plataforma ou à legislação aplicável.",
  "Reconhece que sistemas automatizados de análise podem ser utilizados para identificar itens potencialmente proibidos ou de risco, e que tais sistemas podem gerar bloqueios preventivos, sujeitos ou não a revisão manual posterior.",
  "Compromete-se a fornecer informações verdadeiras, completas e atualizadas sobre os objetos armazenados, suas características, dimensões, quantidade, natureza e eventuais restrições de manuseio.",
  "Declara que é responsável pelo correto acondicionamento, embalagem, lacre, proteção e preparação dos itens antes do armazenamento, inclusive quanto à empilhabilidade, fragilidade, vedação, identificação e segurança.",
  "Reconhece que eventual aceitação da reserva, ausência de bloqueio, análise automática favorável ou revisão manual pela GuardaAí não implica validação jurídica, técnica, pericial ou material dos objetos armazenados, nem transfere à plataforma qualquer responsabilidade sobre tais itens.",
  "Obriga-se a indenizar integralmente a GuardaAí, o anfitrião e terceiros por quaisquer perdas, danos, despesas, custos, multas, sanções, condenações, honorários ou prejuízos decorrentes do descumprimento deste termo ou da inserção de itens proibidos, ilícitos, perigosos ou irregularmente declarados.",
  "Declara ter lido e aceitado integralmente este termo, bem como as políticas da plataforma aplicáveis à reserva e ao armazenamento.",
];

const TermsRenter = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container max-w-3xl px-4 md:px-8">
          <Button variant="ghost" size="sm" onClick={() => window.history.length > 1 ? navigate(-1) : navigate("/")} className="mb-6 gap-1.5 text-muted-foreground">
            <ArrowLeft size={16} /> Voltar
          </Button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText size={24} className="text-primary" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Termo de Responsabilidade do Locatário</h1>
                <p className="text-sm text-muted-foreground">Versão 1.0 · Última atualização: março de 2026</p>
              </div>
            </div>

            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground leading-relaxed mb-6">
                Ao utilizar a plataforma GuardaAí para reservar espaço e armazenar bens, o usuário declara, reconhece e concorda que:
              </p>

              <ol className="space-y-4">
                {clauses.map((clause, i) => (
                  <li key={i} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span>{clause}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-10 p-4 rounded-xl bg-secondary/50 border border-border/60">
              <p className="text-xs text-muted-foreground text-center">
                Este termo é parte integrante das condições de uso da plataforma GuardaAí. Ao prosseguir com uma reserva, o usuário confirma ter lido e aceito integralmente este documento.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsRenter;
