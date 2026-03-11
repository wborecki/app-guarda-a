import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/guardaai/Header";
import Footer from "@/components/guardaai/Footer";

const Contact = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container max-w-2xl px-4 md:px-8">
          <Button variant="ghost" size="sm" onClick={() => window.history.length > 1 ? navigate(-1) : navigate("/")} className="mb-6 gap-1.5 text-muted-foreground">
            <ArrowLeft size={16} /> Voltar
          </Button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Contato</h1>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-lg">
                Tem dúvidas, sugestões ou precisa de ajuda? Entre em contato com a equipe GuardaAí pelos canais abaixo.
              </p>
            </div>

            <div className="grid gap-4">
              {/* Email */}
              <a
                href="mailto:contato@guardaai.com"
                className="flex items-center gap-4 p-5 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all group"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                  <Mail size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">E-mail</p>
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">contato@guardaai.com</p>
                </div>
              </a>

              {/* Phone */}
              <a
                href="tel:+55119945418626"
                className="flex items-center gap-4 p-5 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all group"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                  <Phone size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Telefone / WhatsApp</p>
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">(11) 9 94541-8626</p>
                </div>
              </a>
            </div>

            <div className="mt-10 p-4 rounded-xl bg-secondary/50 border border-border/60">
              <p className="text-xs text-muted-foreground text-center leading-relaxed">
                Nosso horário de atendimento é de segunda a sexta, das 9h às 18h. Responderemos o mais breve possível.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;