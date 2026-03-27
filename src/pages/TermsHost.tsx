import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import Header from "@/components/guardaai/Header";
import Footer from "@/components/guardaai/Footer";
import BackButton from "@/components/guardaai/BackButton";

const clauses = [
  "É o responsável pelo espaço anunciado, declarando possuir legitimidade para disponibilizá-lo para uso, seja na condição de proprietário, possuidor, locatário autorizado ou titular de direito compatível com a oferta realizada.",
  "Declara que as informações do anúncio são verdadeiras, completas e atualizadas, incluindo localização, dimensões, capacidade, altura útil, condições de acesso, restrições, características físicas, segurança, cobertura, ventilação e demais elementos relevantes para contratação do espaço.",
  "Declara que o espaço ofertado possui condições mínimas de uso compatíveis com a finalidade anunciada e que não disponibilizará área cuja utilização para armazenamento seja proibida por lei, por contrato, por convenção condominial, por regulamento local ou por qualquer limitação jurídica ou material aplicável.",
  "Reconhece que a GuardaAí atua exclusivamente como plataforma digital de intermediação entre usuários, não sendo proprietária, locadora, depositária, administradora do imóvel, garantidora da legalidade do uso do espaço, nem responsável pela conduta do anfitrião, do locatário ou de terceiros.",
  "Assume integral responsabilidade pelas condições físicas, estruturais, de acesso, segurança e uso do espaço disponibilizado, bem como por quaisquer danos decorrentes de omissão, informação incorreta, vício, risco, inadequação, restrição não informada ou descumprimento de obrigações legais relacionadas ao local.",
  "Compromete-se a não aceitar, permitir ou manter, de forma consciente, armazenamento de itens proibidos pelas políticas da plataforma ou pela legislação aplicável, devendo comunicar à GuardaAí qualquer suspeita, irregularidade, risco ou violação identificada.",
  "Reconhece que a GuardaAí poderá exigir informações, documentos, fotos do espaço, comprovações adicionais e outras evidências para fins de cadastro, verificação, prevenção a fraude, segurança e conformidade da operação.",
  "Autoriza a GuardaAí a bloquear, suspender, desativar anúncios, impedir reservas, cancelar transações ou submeter casos à revisão manual sempre que houver indício de risco, irregularidade, fraude, violação de políticas internas ou possível uso indevido da plataforma.",
  "Reconhece que eventual aprovação cadastral, publicação do anúncio ou manutenção do espaço ativo na plataforma não representa certificação técnica, jurídica, regulatória ou securitária por parte da GuardaAí.",
  "Compromete-se a cooperar com a plataforma em processos de verificação, análise de incidentes, auditoria, atendimento a chamados, revisão de bloqueios, apuração de denúncias e cumprimento de obrigações legais ou ordens de autoridade competente.",
  "Obriga-se a indenizar integralmente a GuardaAí e terceiros por perdas, danos, custos, despesas, multas, condenações ou prejuízos decorrentes de informações falsas, uso irregular do espaço, violação de deveres legais, infração contratual ou descumprimento deste termo.",
  "Declara ter lido e aceitado integralmente este termo, bem como as políticas da plataforma aplicáveis ao anúncio e à disponibilização do espaço.",
];

const TermsHost = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO title="Termos do Anfitrião" description="Termos e condições para anfitriões na plataforma GuardaAí. Leia antes de anunciar seu espaço." canonical="/termos/anfitriao" />
      <Header />
      <main className="pt-24 pb-16">
        <div className="container max-w-3xl px-4 md:px-8">
          <BackButton label="Página anterior" fallbackTo="/" className="mb-6" />

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <FileText size={24} className="text-accent" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Termo de Responsabilidade do Anfitrião</h1>
                <p className="text-sm text-muted-foreground">Versão 1.0 · Última atualização: março de 2026</p>
              </div>
            </div>

            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground leading-relaxed mb-6">
                Ao disponibilizar espaço para armazenamento por meio da plataforma GuardaAí, o usuário declara, reconhece e concorda que:
              </p>

              <ol className="space-y-4">
                {clauses.map((clause, i) => (
                  <li key={i} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span>{clause}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-10 p-4 rounded-xl bg-secondary/50 border border-border/60">
              <p className="text-xs text-muted-foreground text-center">
                Este termo é parte integrante das condições de uso da plataforma GuardaAí. Ao publicar um anúncio, o anfitrião confirma ter lido e aceito integralmente este documento.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsHost;
