import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Ban, Flame, Skull, Bug, Beef, Swords, FlaskConical, Bomb, ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/guardaai/Header";
import Footer from "@/components/guardaai/Footer";

const categories = [
  { icon: Swords, title: "Armas e munições", items: ["Armas de fogo", "Armas brancas", "Munições de qualquer calibre", "Acessórios para armas"], color: "destructive" },
  { icon: Bomb, title: "Explosivos", items: ["Explosivos de qualquer tipo", "Fogos de artifício em grande quantidade", "Materiais detonantes"], color: "destructive" },
  { icon: Ban, title: "Drogas e substâncias ilícitas", items: ["Drogas ilícitas", "Substâncias controladas sem receita", "Produtos contrabandeados"], color: "destructive" },
  { icon: Flame, title: "Inflamáveis e combustíveis", items: ["Gasolina, diesel, álcool em volume", "Botijões de gás", "Solventes e aerossóis inflamáveis", "Líquidos inflamáveis"], color: "accent" },
  { icon: Skull, title: "Tóxicos e químicos perigosos", items: ["Produtos tóxicos", "Corrosivos (ácidos, bases)", "Pesticidas e venenos", "Materiais radioativos"], color: "accent" },
  { icon: FlaskConical, title: "Materiais biológicos", items: ["Materiais biológicos ou infectantes", "Resíduos hospitalares", "Substâncias de risco biológico"], color: "accent" },
  { icon: Bug, title: "Animais", items: ["Animais vivos de qualquer espécie", "Animais mortos ou partes", "Insetos e pragas"], color: "primary" },
  { icon: Beef, title: "Alimentos perecíveis", items: ["Alimentos que exigem refrigeração", "Produtos com prazo de validade curto", "Alimentos preparados"], color: "primary" },
  { icon: ShieldAlert, title: "Itens de origem ilícita", items: ["Produtos roubados ou furtados", "Mercadoria contrabandeada", "Itens sem comprovação de posse legítima"], color: "primary" },
];

const ProhibitedItems = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container max-w-4xl px-4 md:px-8">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-6 gap-1.5 text-muted-foreground">
            <ArrowLeft size={16} /> Voltar
          </Button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center mb-10">
              <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                <Ban size={28} className="text-destructive" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Política de Itens Proibidos</h1>
              <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
                Os seguintes itens não podem ser armazenados na plataforma GuardaAí. O descumprimento pode resultar em bloqueio da reserva, suspensão da conta e responsabilização legal.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              {categories.map((cat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-5 rounded-xl bg-card border hover:shadow-sm transition-shadow"
                >
                  <div className={`w-10 h-10 rounded-lg bg-${cat.color}/10 flex items-center justify-center mb-3`}>
                    <cat.icon size={20} className={`text-${cat.color}`} />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm mb-2">{cat.title}</h3>
                  <ul className="space-y-1">
                    {cat.items.map((item, j) => (
                      <li key={j} className="text-xs text-muted-foreground flex items-start gap-1.5">
                        <span className="text-destructive/50 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            <div className="p-5 rounded-xl bg-destructive/5 border border-destructive/15">
              <h3 className="font-semibold text-foreground text-sm mb-2 flex items-center gap-2">
                <ShieldAlert size={16} className="text-destructive" />
                Qualquer item que represente risco
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Além dos itens listados acima, é proibido armazenar qualquer objeto que possa representar risco ao imóvel, ao anfitrião, a terceiros, à plataforma ou ao meio ambiente. A GuardaAí reserva-se o direito de bloquear, cancelar ou submeter à revisão qualquer reserva quando houver indício de violação.
              </p>
            </div>

            <div className="mt-8 p-4 rounded-xl bg-secondary/50 border border-border/60 text-center">
              <p className="text-xs text-muted-foreground">
                A lista completa de restrições pode ser atualizada periodicamente. Versão 1.0 · Março de 2026.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProhibitedItems;
