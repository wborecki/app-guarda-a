import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useEffect } from "react";
import {
  LayoutDashboard, MapPin, ShieldAlert, Users, ArrowLeft, Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import SEO from "@/components/SEO";

const navItems = [
  { label: "Visão geral", href: "/admin", icon: LayoutDashboard },
  { label: "Espaços", href: "/admin/espacos", icon: MapPin },
  { label: "Análises de risco", href: "/admin/analises", icon: ShieldAlert },
  { label: "Usuários", href: "/admin/usuarios", icon: Users },
];

const AdminLayout = () => {
  const { isAdmin, loading } = useAdminCheck();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAdmin) navigate("/", { replace: true });
  }, [isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Verificando permissões...</div>
      </div>
    );
  }
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen flex bg-background">
      <SEO title="Admin · GuardaAí" noIndex />

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-60 bg-card border-r flex flex-col transition-transform lg:translate-x-0 lg:static",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-14 flex items-center gap-2 px-4 border-b">
          <ShieldAlert size={20} className="text-primary" />
          <span className="font-bold text-foreground">Admin</span>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden">
            <ArrowLeft size={18} />
          </button>
        </div>
        <nav className="flex-1 py-3 px-2 space-y-0.5">
          {navItems.map((item) => {
            const active = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t">
          <Button variant="outline" size="sm" className="w-full" onClick={() => navigate("/")}>
            <ArrowLeft size={14} className="mr-2" /> Voltar ao site
          </Button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-card border-b flex items-center px-4 gap-3 sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
            <Menu size={20} />
          </button>
          <h1 className="text-sm font-bold text-foreground">Painel Administrativo</h1>
        </header>
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
