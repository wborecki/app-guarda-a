import { useState, useEffect, useCallback } from "react";
import { Menu, X, User, LogIn, LayoutDashboard, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import logo from "@/assets/guardaai-logo-transparent.png";

const anchorLinks = [
  { label: "Como funciona", hash: "#como-funciona" },
  { label: "Preços", hash: "#precos" },
  { label: "Segurança", hash: "#seguranca" },
  { label: "FAQ", hash: "#faq" },
  { label: "Fale conosco", hash: "#fale-conosco" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";
  const { user, displayName, loading } = useAuth();
  const { isAdmin } = useAdminCheck();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 1);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  // After navigating to home with a hash, scroll to it
  useEffect(() => {
    if (isHomePage && location.hash) {
      const id = location.hash.replace("#", "");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [isHomePage, location.hash]);

  const handleAnchorClick = useCallback((hash: string) => {
    setMobileOpen(false);
    if (isHomePage) {
      const id = hash.replace("#", "");
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/" + hash);
    }
  }, [isHomePage, navigate]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/97 backdrop-blur-md border-b border-border/60">
        <div className="container flex items-center justify-between h-[52px] md:h-[72px]">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="GuardaAí" className="h-[26px] md:h-9" />
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            {anchorLinks.map((link) => (
              <button
                key={link.hash}
                onClick={() => handleAnchorClick(link.hash)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors bg-transparent border-none cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
              <Link to="/quero-guardar">Quero guardar</Link>
            </Button>
            <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary/5" asChild>
              <Link to="/anunciar">Anunciar espaço</Link>
            </Button>

            {!loading && (
              <>
                {user ? (
                  <Button size="sm" variant="ghost" className="bg-secondary/80 hover:bg-secondary text-foreground gap-2" asChild>
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
                )}
                {isAdmin && (
                  <Button size="sm" variant="ghost" className="bg-secondary/80 hover:bg-secondary text-foreground gap-1.5" asChild>
                    <Link to="/admin">
                      <ShieldCheck size={16} />
                      Admin
                    </Link>
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Mobile: login icon + hamburger */}
          <div className="flex lg:hidden items-center gap-0">
            {!loading && (
              user ? (
                <Button size="icon" variant="ghost" className="h-9 w-9" asChild>
                  <Link to="/minha-conta">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-primary/10 text-primary text-[9px] font-medium">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                </Button>
              ) : (
                <Button size="icon" variant="ghost" className="h-9 w-9 text-muted-foreground" asChild>
                  <Link to="/entrar">
                    <LogIn size={18} />
                  </Link>
                </Button>
              )
            )}
            <button
              className="p-1.5 text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu — OUTSIDE header to avoid backdrop-filter containing block */}
      {mobileOpen && (
        <div className="lg:hidden fixed top-[52px] left-0 right-0 bottom-0 z-[60] bg-background overflow-y-auto">
          <nav className="container flex flex-col gap-0.5 pt-5 pb-8">
            {anchorLinks.map((link) => (
              <button
                key={link.hash}
                onClick={() => handleAnchorClick(link.hash)}
                className="text-left text-base font-medium text-foreground py-3.5 px-4 rounded-xl hover:bg-secondary transition-colors active:bg-secondary bg-transparent border-none cursor-pointer"
              >
                {link.label}
              </button>
            ))}

            <div className="border-t border-border my-4" />

            <div className="flex flex-col gap-3 px-4">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground h-12 text-base" asChild>
                <Link to="/quero-guardar" onClick={() => setMobileOpen(false)}>Quero guardar</Link>
              </Button>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/5 h-12 text-base" asChild>
                <Link to="/anunciar" onClick={() => setMobileOpen(false)}>Anunciar espaço</Link>
              </Button>

              {user ? (
                <>
                  <Button variant="ghost" className="text-foreground hover:bg-secondary gap-2 h-12 text-base" asChild>
                    <Link to="/minha-conta" onClick={() => setMobileOpen(false)}>
                      <LayoutDashboard size={18} />
                      Minha conta
                    </Link>
                  </Button>
                  {isAdmin && (
                    <Button variant="ghost" className="text-muted-foreground hover:text-foreground gap-2 h-12 text-base" asChild>
                      <Link to="/admin" onClick={() => setMobileOpen(false)}>
                        <ShieldCheck size={18} />
                        Painel admin
                      </Link>
                    </Button>
                  )}
                </>
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
    </>
  );
};

export default Header;
