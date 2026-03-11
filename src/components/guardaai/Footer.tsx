import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/guardaai-logo-negative.png";

const Footer = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const anchor = (hash: string) => (isHomePage ? hash : `/${hash}`);

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
              <li><a href={anchor("#como-funciona")} className="hover:text-background transition-colors">Como funciona</a></li>
              <li><a href={anchor("#precos")} className="hover:text-background transition-colors">Preços</a></li>
              <li><a href={anchor("#simulador")} className="hover:text-background transition-colors">Simulador</a></li>
              <li><a href={anchor("#seguranca")} className="hover:text-background transition-colors">Segurança</a></li>
              <li><Link to="/anunciar" className="hover:text-background transition-colors">Anunciar espaço</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 md:mb-4 text-xs md:text-sm">Sua conta</h4>
            <ul className="space-y-2 md:space-y-2.5 text-xs md:text-sm text-background/60">
              <li><Link to="/entrar" className="hover:text-background transition-colors">Entrar</Link></li>
              <li><a href={anchor("#simulador")} className="hover:text-background transition-colors">Guardar itens</a></li>
              <li><Link to="/anunciar" className="hover:text-background transition-colors">Anunciar espaço</Link></li>
              <li><a href={anchor("#faq")} className="hover:text-background transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 md:mb-4 text-xs md:text-sm">Institucional</h4>
            <ul className="space-y-2 md:space-y-2.5 text-xs md:text-sm text-background/60">
              <li><Link to="/termos/locatario" className="hover:text-background transition-colors">Termos do locatário</Link></li>
              <li><Link to="/termos/anfitriao" className="hover:text-background transition-colors">Termos do anfitrião</Link></li>
              <li><Link to="/itens-proibidos" className="hover:text-background transition-colors">Itens proibidos</Link></li>
              <li><Link to="/contato" className="hover:text-background transition-colors">Contato</Link></li>
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