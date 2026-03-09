import { Link } from "react-router-dom";
import logo from "@/assets/guardaai-logo-negative.png";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12 md:py-20">
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mb-10 md:mb-14">
          <div className="col-span-2 lg:col-span-1">
            <img src={logo} alt="GuardaAí" className="h-12 md:h-16 mb-2 md:mb-3" />
            <p className="text-xs md:text-sm text-background/60 leading-relaxed">
              O jeito mais barato de guardar suas coisas.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 md:mb-4 text-xs md:text-sm">Para você</h4>
            <ul className="space-y-2 md:space-y-2.5 text-xs md:text-sm text-background/60">
              <li><a href="#como-funciona" className="hover:text-background transition-colors">Como funciona</a></li>
              <li><a href="#precos" className="hover:text-background transition-colors">Preços</a></li>
              <li><a href="#simulador" className="hover:text-background transition-colors">Simulador</a></li>
              <li><a href="#seguranca" className="hover:text-background transition-colors">Segurança</a></li>
              <li><Link to="/anunciar" className="hover:text-background transition-colors">Anunciar espaço</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 md:mb-4 text-xs md:text-sm">Sua conta</h4>
            <ul className="space-y-2 md:space-y-2.5 text-xs md:text-sm text-background/60">
              <li><Link to="/entrar" className="hover:text-background transition-colors">Entrar</Link></li>
              <li><a href="#simulador" className="hover:text-background transition-colors">Guardar itens</a></li>
              <li><Link to="/anunciar" className="hover:text-background transition-colors">Anunciar espaço</Link></li>
              <li><a href="#faq" className="hover:text-background transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 md:mb-4 text-xs md:text-sm">Institucional</h4>
            <ul className="space-y-2 md:space-y-2.5 text-xs md:text-sm text-background/60">
              <li><a href="#" className="hover:text-background transition-colors">Termos de uso</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Privacidade</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Contato</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Instagram</a></li>
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
