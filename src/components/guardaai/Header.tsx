import { useState, useEffect } from "react";
import { Menu, X, User, LogIn, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import logo from "@/assets/guardaai-logo-transparent.png";

const navLinks = [
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Preços", href: "#precos" },
  { label: "Simulador", href: "#simulador" },
  { label: "Segurança", href: "#seguranca" },
  { label: "Anunciar espaço", href: "/anunciar", isRoute: true },
  { label: "FAQ", href: "#faq" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isHostPage = location.pathname === "/anunciar";
  const { user, displayName, loading } = useAuth();

  const initials = displayName
    ? displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b">
      <div className="container flex items-center justify-between h-14 md:h-[72px]">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="GuardaAí" className="h-8 md:h-9" />
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) =>
            link.isRoute ? (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={isHomePage ? link.href : `/${link.href}`}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            )
          )}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
            {isHomePage ? (
              <a href="#simulador">Quero guardar</a>
            ) : (
              <Link to="/#simulador">Quero guardar</Link>
            )}
          </Button>
          <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary/5" asChild>
            <Link to="/anunciar">Anunciar espaço</Link>
          </Button>

          {/* Auth state */}
          {!loading && (
            user ? (
              <Button size="sm" variant="ghost" className="text-foreground hover:bg-secondary gap-2" asChild>
                <Link to="/minha-conta">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-medium">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="max-w-[100px] truncate text-sm">{displayName || "Minha conta"}</span>
                </Link>
              </Button>
            ) : (
              <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground gap-1.5" asChild>
                <Link to="/entrar">
                  <User size={16} />
                  Entrar
                </Link>
              </Button>
            )
          )}
        </div>

        {/* Mobile: login icon + hamburger */}
        <div className="flex lg:hidden items-center gap-1">
          {!loading && (
            user ? (
              <Button size="icon" variant="ghost" className="h-10 w-10" asChild>
                <Link to="/minha-conta">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-medium">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </Button>
            ) : (
              <Button size="icon" variant="ghost" className="h-10 w-10 text-muted-foreground" asChild>
                <Link to="/entrar">
                  <LogIn size={20} />
                </Link>
              </Button>
            )
          )}
          <button
            className="p-2 text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-14 z-40 bg-background/98 backdrop-blur-lg overflow-y-auto">
          <nav className="container flex flex-col gap-1 pt-6 pb-8">
            {navLinks.map((link) =>
              link.isRoute ? (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-base font-medium text-foreground py-3.5 px-4 rounded-xl hover:bg-secondary transition-colors active:bg-secondary"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={isHostPage ? `/${link.href}` : link.href}
                  className="text-base font-medium text-foreground py-3.5 px-4 rounded-xl hover:bg-secondary transition-colors active:bg-secondary"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              )
            )}

            <div className="border-t border-border my-4" />

            <div className="flex flex-col gap-3 px-4">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground h-12 text-base" asChild>
                {isHostPage ? (
                  <Link to="/#simulador" onClick={() => setMobileOpen(false)}>Quero guardar</Link>
                ) : (
                  <a href="#simulador" onClick={() => setMobileOpen(false)}>Quero guardar</a>
                )}
              </Button>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/5 h-12 text-base" asChild>
                <Link to="/anunciar" onClick={() => setMobileOpen(false)}>Anunciar espaço</Link>
              </Button>

              {user ? (
                <Button variant="ghost" className="text-foreground hover:bg-secondary gap-2 h-12 text-base" asChild>
                  <Link to="/minha-conta" onClick={() => setMobileOpen(false)}>
                    <LayoutDashboard size={18} />
                    Minha conta
                  </Link>
                </Button>
              ) : (
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground gap-2 h-12 text-base" asChild>
                  <Link to="/entrar" onClick={() => setMobileOpen(false)}>
                    <User size={18} />
                    Entrar na minha conta
                  </Link>
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
