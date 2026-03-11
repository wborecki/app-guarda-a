import { useAuth } from "@/hooks/useAuth";
import { Package, Home, CalendarDays, Wallet, ArrowRight, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const StatCard = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) => (
  <div className="rounded-2xl border bg-card p-5">
    <div className="flex items-center gap-3 mb-3">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={18} />
      </div>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
    <p className="text-2xl font-bold text-foreground">{value}</p>
  </div>
);

const QuickAction = ({ icon: Icon, title, description, href }: { icon: any; title: string; description: string; href: string }) => (
  <Link to={href} className="flex items-center gap-4 p-4 rounded-2xl border bg-card hover:bg-secondary/50 transition-colors group">
    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
      <Icon size={20} className="text-primary" />
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
    <ArrowRight size={16} className="text-muted-foreground group-hover:translate-x-1 transition-transform flex-shrink-0" />
  </Link>
);

const DashboardOverview = () => {
  const { displayName } = useAuth();
  const firstName = displayName?.split(" ")[0] || "Olá";

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
          Olá, {firstName} 👋
        </h1>
        <p className="text-muted-foreground">
          Aqui está o resumo da sua conta no GuardaAí.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Package} label="Reservas ativas" value="0" color="bg-primary/10 text-primary" />
        <StatCard icon={Home} label="Espaços anunciados" value="0" color="bg-accent/10 text-accent" />
        <StatCard icon={CalendarDays} label="Próximos eventos" value="0" color="bg-blue-50 text-blue-600" />
        <StatCard icon={Wallet} label="Saldo" value="R$ 0" color="bg-emerald-50 text-emerald-600" />
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Ações rápidas</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <QuickAction
            icon={Search}
            title="Encontrar espaço"
            description="Busque espaços perto de você para guardar itens"
            href="/"
          />
          <QuickAction
            icon={Plus}
            title="Anunciar espaço"
            description="Disponibilize seu espaço e comece a ganhar"
            href="/anunciar"
          />
          <QuickAction
            icon={Package}
            title="Minhas reservas"
            description="Acompanhe reservas ativas e passadas"
            href="/minha-conta/reservas"
          />
          <QuickAction
            icon={Wallet}
            title="Financeiro"
            description="Veja pagamentos, recebimentos e repasses"
            href="/minha-conta/financeiro"
          />
        </div>
      </div>

      {/* Activity section - empty state */}
      <div className="rounded-2xl border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Atividade recente</h2>
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground mb-4">
            Nenhuma atividade recente. Comece buscando um espaço ou anunciando o seu!
          </p>
          <div className="flex gap-3 justify-center">
            <Button size="sm" asChild>
              <Link to="/">Buscar espaço</Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link to="/anunciar">Anunciar espaço</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
