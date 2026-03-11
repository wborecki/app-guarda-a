import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/guardaai-logo-negative.png";
import { useCallback } from "react";

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";

  const handleAnchor = useCallback((hash: string) => {
    if (isHomePage) {
      const id = hash.replace("#", "");
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/" + hash);
    }
  }, [isHomePage, navigate]);

  return (
    <footer className="bg-foreground text-background py-12 md:py-20">
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mb-10 md:mb-14">
          <div className="col-span-2 lg:col-span-1">
            <Link to="/">
              <img src={logo} alt="GuardaAí" className="h-12 md:h-16 mb-2 md:mb-3" />
            </Link>
            <p className="text-xs md:text-sm text-background/60 leading-relaxed">
              O jeito mais barato de guardar suas coisas.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 md:mb-4 text-xs md:text-sm">Para você</h4>
            <ul className="space-y-2 md:space-y-2.5 text-xs md:text-sm text-background/60">
              <li><button onClick={() => handleAnchor("#como-funciona")} className="hover:text-background transition-colors bg-transparent border-none cursor-pointer text-inherit">Como funciona</button></li>
              <li><button onClick={() => handleAnchor("#precos")} className="hover:text-background transition-colors bg-transparent border-none cursor-pointer text-inherit">Preços</button></li>
              <li><Link to="/quero-guardar" className="hover:text-background transition-colors">Quero guardar</Link></li>
              <li><button onClick={() => handleAnchor("#seguranca")} className="hover:text-background transition-colors bg-transparent border-none cursor-pointer text-inherit">Segurança</button></li>
              <li><Link to="/anunciar" className="hover:text-background transition-colors">Anunciar espaço</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 md:mb-4 text-xs md:text-sm">Sua conta</h4>
            <ul className="space-y-2 md:space-y-2.5 text-xs md:text-sm text-background/60">
              <li><Link to="/entrar" className="hover:text-background transition-colors">Entrar</Link></li>
              <li><Link to="/quero-guardar" className="hover:text-background transition-colors">Guardar itens</Link></li>
              <li><Link to="/anunciar" className="hover:text-background transition-colors">Anunciar espaço</Link></li>
              <li><button onClick={() => handleAnchor("#faq")} className="hover:text-background transition-colors bg-transparent border-none cursor-pointer text-inherit">FAQ</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 md:mb-4 text-xs md:text-sm">Institucional</h4>
            <ul className="space-y-2 md:space-y-2.5 text-xs md:text-sm text-background/60">
              <li><Link to="/termos/locatario" className="hover:text-background transition-colors">Termos do locatário</Link></li>
              <li><Link to="/termos/anfitriao" className="hover:text-background transition-colors">Termos do anfitrião</Link></li>
              <li><Link to="/itens-proibidos" className="hover:text-background transition-colors">Itens proibidos</Link></li>
              <li><button onClick={() => handleAnchor("#fale-conosco")} className="hover:text-background transition-colors bg-transparent border-none cursor-pointer text-inherit">Fale conosco</button></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 pt-5 md:pt-6 text-center">
          <p className="text-[10px] md:text-sm text-background/40">
            © {new Date().getFullYear()} GuardaAí. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
