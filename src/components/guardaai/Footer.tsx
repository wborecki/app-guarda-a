import React, { useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/guardaai-logo-negative.png";

const Footer = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>((props, ref) => {
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
    <footer ref={ref} {...props} className="bg-foreground text-background py-10 md:py-20">
      <div className="container px-5 md:px-8">
        {/* ── Mobile: stacked layout ── */}
        <div className="md:hidden space-y-8 mb-8">
          {/* Brand */}
          <div className="text-center">
            <Link to="/" className="inline-block">
              <img src={logo} alt="GuardaAí" className="h-10 mb-2 mx-auto" />
            </Link>
            <p className="text-[12px] text-background/50 leading-relaxed max-w-[240px] mx-auto">
              Guarde objetos e veículos com segurança, perto de você.
            </p>
          </div>

          {/* Links grid — 2 cols */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2.5 text-[11px] uppercase tracking-wider text-background/70">Para você</h4>
              <ul className="space-y-2 text-[12.5px] text-background/50">
                <li><button onClick={() => handleAnchor("#como-funciona")} className="hover:text-background transition-colors bg-transparent border-none cursor-pointer text-inherit p-0">Como funciona</button></li>
                <li><button onClick={() => handleAnchor("#precos")} className="hover:text-background transition-colors bg-transparent border-none cursor-pointer text-inherit p-0">Preços</button></li>
                <li><button onClick={() => handleAnchor("#seguranca")} className="hover:text-background transition-colors bg-transparent border-none cursor-pointer text-inherit p-0">Segurança</button></li>
                <li><button onClick={() => handleAnchor("#faq")} className="hover:text-background transition-colors bg-transparent border-none cursor-pointer text-inherit p-0">FAQ</button></li>
                <li><button onClick={() => handleAnchor("#fale-conosco")} className="hover:text-background transition-colors bg-transparent border-none cursor-pointer text-inherit p-0">Fale conosco</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2.5 text-[11px] uppercase tracking-wider text-background/70">Ações</h4>
              <ul className="space-y-2 text-[12.5px] text-background/50">
                <li><Link to="/quero-guardar" className="hover:text-background transition-colors">Quero guardar</Link></li>
                <li><Link to="/anunciar" className="hover:text-background transition-colors">Anunciar espaço</Link></li>
                <li><Link to="/entrar" className="hover:text-background transition-colors">Entrar</Link></li>
              </ul>
            </div>
          </div>

          {/* Institucional — full width */}
          <div>
            <h4 className="font-semibold mb-2.5 text-[11px] uppercase tracking-wider text-background/70">Institucional</h4>
            <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-[12px] text-background/50">
              <li><Link to="/termos/locatario" className="hover:text-background transition-colors">Termos do locatário</Link></li>
              <li><Link to="/termos/anfitriao" className="hover:text-background transition-colors">Termos do anfitrião</Link></li>
              <li><Link to="/itens-proibidos" className="hover:text-background transition-colors">Itens proibidos</Link></li>
            </ul>
          </div>
        </div>

        {/* ── Desktop: original 4-col grid ── */}
        <div className="hidden md:grid grid-cols-4 gap-10 mb-14">
          <div>
            <Link to="/">
              <img src={logo} alt="GuardaAí" className="h-16 mb-3" />
            </Link>
            <p className="text-sm text-background/60 leading-relaxed">
              Guarde objetos e veículos por menos.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm">Para você</h4>
            <ul className="space-y-2.5 text-sm text-background/60">
              <li><button onClick={() => handleAnchor("#como-funciona")} className="hover:text-background transition-colors bg-transparent border-none cursor-pointer text-inherit p-0">Como funciona</button></li>
              <li><button onClick={() => handleAnchor("#precos")} className="hover:text-background transition-colors bg-transparent border-none cursor-pointer text-inherit p-0">Preços</button></li>
              <li><button onClick={() => handleAnchor("#seguranca")} className="hover:text-background transition-colors bg-transparent border-none cursor-pointer text-inherit p-0">Segurança</button></li>
              <li><button onClick={() => handleAnchor("#faq")} className="hover:text-background transition-colors bg-transparent border-none cursor-pointer text-inherit p-0">FAQ</button></li>
              <li><button onClick={() => handleAnchor("#fale-conosco")} className="hover:text-background transition-colors bg-transparent border-none cursor-pointer text-inherit p-0">Fale conosco</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm">Ações</h4>
            <ul className="space-y-2.5 text-sm text-background/60">
              <li><Link to="/quero-guardar" className="hover:text-background transition-colors">Quero guardar</Link></li>
              <li><Link to="/anunciar" className="hover:text-background transition-colors">Anunciar espaço</Link></li>
              <li><Link to="/entrar" className="hover:text-background transition-colors">Entrar</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm">Institucional</h4>
            <ul className="space-y-2.5 text-sm text-background/60">
              <li><Link to="/termos/locatario" className="hover:text-background transition-colors">Termos do locatário</Link></li>
              <li><Link to="/termos/anfitriao" className="hover:text-background transition-colors">Termos do anfitrião</Link></li>
              <li><Link to="/itens-proibidos" className="hover:text-background transition-colors">Itens proibidos</Link></li>
              <li><button onClick={() => handleAnchor("#fale-conosco")} className="hover:text-background transition-colors bg-transparent border-none cursor-pointer text-inherit p-0">Fale conosco</button></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 pt-4 md:pt-6 text-center" style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}>
          <p className="text-[10px] md:text-sm text-background/40">
            © {new Date().getFullYear()} GuardaAí. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
