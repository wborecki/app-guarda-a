import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Search, Mail, ArrowRight, Package } from "lucide-react";
import { motion } from "framer-motion";
import SEO from "@/components/SEO";
import Header from "@/components/guardaai/Header";
import Footer from "@/components/guardaai/Footer";

const suggestions = [
  { label: "Buscar espaços", href: "/quero-guardar", icon: Search, description: "Encontre um espaço perto de você" },
  { label: "Anunciar espaço", href: "/anunciar", icon: Package, description: "Ganhe dinheiro com seu espaço ocioso" },
  { label: "Fale conosco", href: "/contato", icon: Mail, description: "Tire dúvidas com nossa equipe" },
];

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SEO title="Página não encontrada" noIndex />
      <Header />

      <main className="flex-1 flex items-center justify-center px-5 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-lg w-full"
        >
          {/* Illustration */}
          <div className="relative mx-auto w-40 h-40 sm:w-48 sm:h-48 mb-8">
            <div className="absolute inset-0 rounded-full bg-primary/10" />
            <div className="absolute inset-3 rounded-full bg-primary/5 flex items-center justify-center">
              <span className="text-7xl sm:text-8xl font-black text-primary/80">404</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Página não encontrada
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mb-8 max-w-sm mx-auto">
            A página <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{location.pathname}</span> não existe ou foi movida.
          </p>

          <Button asChild size="lg" className="rounded-full px-8 mb-10">
            <Link to="/">
              <Home size={16} className="mr-2" />
              Voltar ao início
            </Link>
          </Button>

          {/* Navigation suggestions */}
          <div className="border-t pt-8">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Talvez você esteja procurando
            </p>
            <div className="space-y-2">
              {suggestions.map((s) => (
                <Link
                  key={s.href}
                  to={s.href}
                  className="flex items-center gap-3 p-3 rounded-xl bg-card border hover:border-primary/40 hover:shadow-sm transition-all group text-left"
                >
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <s.icon size={16} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{s.label}</p>
                    <p className="text-xs text-muted-foreground">{s.description}</p>
                  </div>
                  <ArrowRight size={14} className="text-muted-foreground/50 group-hover:text-primary transition-colors flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
