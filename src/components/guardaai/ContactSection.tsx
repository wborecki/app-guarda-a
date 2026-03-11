import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ContactSection = () => {
  return (
    <section id="fale-conosco" className="py-10 md:py-20">
      <div className="container max-w-3xl px-5 md:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/8 text-primary text-[11px] font-semibold mb-4">
            <MessageCircle size={13} />
            Atendimento
          </div>

          <h2 className="text-[1.4rem] md:text-4xl font-bold text-foreground mb-2 md:mb-4 tracking-tight leading-tight">
            Fale conosco
          </h2>

          <p className="text-muted-foreground text-[13px] md:text-lg mb-6 md:mb-8 max-w-lg mx-auto leading-relaxed">
            Tem alguma dúvida? Nossa assistente virtual está disponível 24h para ajudar você.
          </p>

          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 md:px-8 h-11 md:h-12 text-[14px] md:text-base font-semibold rounded-xl" asChild>
            <Link to="/fale-conosco">
              <MessageCircle size={16} className="mr-1.5" />
              Iniciar conversa
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
