import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  Package,
  Home,
  CalendarDays,
  Wallet,
  ArrowRight,
  Search,
  Plus,
  TrendingUp,
  Clock,
  Inbox,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { OnboardingChecklist } from "@/components/guardaai/dashboard/OnboardingChecklist";

/* ── Stat Card ─────────────────────────────────────────── */
const StatCard = ({
  icon: Icon,
  label,
  value,
  subtitle,
  color,
}: {
  icon: any;
  label: string;
  value: string;
  subtitle?: string;
  color: string;
}) => (
  <div className="rounded-2xl border border-border/60 bg-card p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={20} />
      </div>
      <TrendingUp size={14} className="text-muted-foreground/40" />
    </div>
    <p className="text-3xl font-bold text-foreground tracking-tight">{value}</p>
    <p className="text-sm text-muted-foreground mt-1">{label}</p>
    {subtitle && <p className="text-xs text-muted-foreground/70 mt-0.5">{subtitle}</p>}
  </div>
);

/* ── Quick Action ──────────────────────────────────────── */
const QuickAction = ({
  icon: Icon,
  title,
  description,
  href,
}: {
  icon: any;
  title: string;
  description: string;
  href: string;
}) => (
  <Link
    to={href}
    className="flex items-center gap-4 p-4 rounded-xl border border-border/60 bg-card hover:border-primary/30 hover:shadow-sm transition-all group"
  >
    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
      <Icon size={20} className="text-primary" />
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
    </div>
    <ArrowRight
      size={16}
      className="text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0"
    />
  </Link>
);

/* ── Main Overview ─────────────────────────────────────── */
const DashboardOverview = () => {
  const { user, displayName } = useAuth();
  const firstName = displayName?.split(" ")[0] || "Olá";

  const [spacesCount, setSpacesCount] = useState<number | null>(null);
  const [publishedCount, setPublishedCount] = useState<number>(0);
  const [activeReservations, setActiveReservations] = useState<number | null>(null);
  const [upcomingReservations, setUpcomingReservations] = useState<number | null>(null);
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      const today = new Date().toISOString().split("T")[0];

      const [allSpaces, published, activeRes, upcomingRes, paymentsReceived, paymentsMade] = await Promise.all([
        supabase
          .from("spaces")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id),
        supabase
          .from("spaces")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("status", "published"),
        // Active reservations (as renter or host, status confirmed, within date range)
        supabase
          .from("reservations")
          .select("id", { count: "exact", head: true })
          .or(`renter_id.eq.${user.id},host_id.eq.${user.id}`)
          .in("status", ["confirmed", "active"])
          .lte("start_date", today)
          .gte("end_date", today),
        // Upcoming reservations (future start_date)
        supabase
          .from("reservations")
          .select("id", { count: "exact", head: true })
          .or(`renter_id.eq.${user.id},host_id.eq.${user.id}`)
          .in("status", ["confirmed", "pending"])
          .gt("start_date", today),
        // Payments received (as host)
        supabase
          .from("payments")
          .select("amount")
          .eq("recipient_id", user.id)
          .eq("status", "paid"),
        // Payments made (as renter) — not used for balance but could be useful
        supabase
          .from("payments")
          .select("amount")
          .eq("payer_id", user.id)
          .eq("status", "paid"),
      ]);

      setSpacesCount(allSpaces.count ?? 0);
      setPublishedCount(published.count ?? 0);
      setActiveReservations(activeRes.count ?? 0);
      setUpcomingReservations(upcomingRes.count ?? 0);

      // Calculate balance from received payments
      const totalReceived = (paymentsReceived.data ?? []).reduce(
        (sum, p) => sum + Number(p.amount || 0),
        0
      );
      setBalance(totalReceived);
    };
    fetchStats();
  }, [user]);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* ── Greeting ─────────────────────────────────── */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
          {greeting}, {firstName} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Aqui está o resumo da sua conta no GuardaAí.
        </p>
      </div>

      {/* ── Onboarding Checklist ──────────────────────── */}
      <OnboardingChecklist />

      {/* ── Stats Grid ───────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
        <StatCard
          icon={Package}
          label="Reservas ativas"
          value="0"
          subtitle="Em breve"
          color="bg-primary/10 text-primary"
        />
        <StatCard
          icon={Home}
          label="Espaços anunciados"
          value={spacesCount !== null ? String(spacesCount) : "—"}
          subtitle={
            spacesCount === null
              ? "Carregando..."
              : spacesCount === 0
              ? "Comece anunciando seu espaço"
              : `${publishedCount} publicado${publishedCount !== 1 ? "s" : ""}`
          }
          color="bg-accent/10 text-accent"
        />
        <StatCard
          icon={CalendarDays}
          label="Próximos eventos"
          value="0"
          subtitle="Em breve"
          color="bg-blue-100/80 text-blue-600"
        />
        <StatCard
          icon={Wallet}
          label="Saldo disponível"
          value="R$ 0"
          subtitle="Em breve"
          color="bg-emerald-100/80 text-emerald-600"
        />
      </div>

      {/* ── Bottom grid: Actions + Activity ──────────── */}
      <div className="grid lg:grid-cols-5 gap-5 md:gap-6">
        {/* Quick actions — takes 3 cols */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Ações rápidas</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <QuickAction
              icon={Search}
              title="Encontrar espaço"
              description="Busque espaços perto de você"
              href="/buscar"
            />
            <QuickAction
              icon={Plus}
              title="Anunciar espaço"
              description="Disponibilize e comece a ganhar"
              href="/anunciar"
            />
            <QuickAction
              icon={Package}
              title="Minhas reservas"
              description="Acompanhe reservas ativas"
              href="/minha-conta/reservas"
            />
            <QuickAction
              icon={Wallet}
              title="Financeiro"
              description="Pagamentos e recebimentos"
              href="/minha-conta/financeiro"
            />
          </div>
        </div>

        {/* Activity — takes 2 cols */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-border/60 bg-card h-full flex flex-col">
            <div className="flex items-center gap-2 px-5 pt-5 pb-3">
              <Clock size={16} className="text-muted-foreground" />
              <h2 className="text-base font-semibold text-foreground">Atividade recente</h2>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center px-5 pb-5 text-center">
              <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center mb-3">
                <Inbox size={20} className="text-muted-foreground/60" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Nenhuma atividade ainda</p>
              <p className="text-xs text-muted-foreground/60 mb-4 max-w-[220px]">
                Suas reservas e movimentações aparecerão aqui.
              </p>
              <div className="flex gap-2">
                <Button size="sm" className="h-8 text-xs" asChild>
                  <Link to="/buscar">Buscar espaço</Link>
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-xs" asChild>
                  <Link to="/anunciar">Anunciar</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
