import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ContactSection = () => {
  return (
    <section id="fale-conosco" className="py-14 md:py-20">
      <div className="container max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-5">
            <MessageCircle size={14} />
            Atendimento
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
            Fale conosco
          </h2>

          <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-lg mx-auto leading-relaxed">
            Tem alguma dúvida? Nossa assistente virtual está disponível 24h para ajudar você com reservas, preços, segurança e muito mais.
          </p>

          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-12 text-base font-semibold rounded-xl" asChild>
            <Link to="/fale-conosco">
              <MessageCircle size={18} className="mr-2" />
              Iniciar conversa
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
