import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Users, ShieldAlert, Package, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type Stats = {
  totalSpaces: number;
  publishedSpaces: number;
  totalUsers: number;
  pendingAnalyses: number;
  pendingReviews: number;
};

const StatCard = ({ label, value, icon: Icon, accent }: { label: string; value: number | string; icon: any; accent?: string }) => (
  <div className="bg-card border rounded-2xl p-5 flex items-start gap-4">
    <div className={`h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 ${accent || "bg-primary/10"}`}>
      <Icon size={20} className={accent ? "text-white" : "text-primary"} />
    </div>
    <div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  </div>
);

const AdminOverview = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const [spacesRes, profilesRes, analysesRes, reviewsRes] = await Promise.all([
        supabase.from("spaces").select("status", { count: "exact" }),
        supabase.from("profiles").select("id", { count: "exact" }),
        supabase.from("risk_analyses").select("id", { count: "exact" }).eq("status", "pending"),
        supabase.from("review_requests").select("id", { count: "exact" }).eq("status", "pending"),
      ]);

      const allSpaces = spacesRes.data || [];
      setStats({
        totalSpaces: spacesRes.count || 0,
        publishedSpaces: allSpaces.filter((s: any) => s.status === "published").length,
        totalUsers: profilesRes.count || 0,
        pendingAnalyses: analysesRes.count || 0,
        pendingReviews: reviewsRes.count || 0,
      });
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-foreground">Visão geral</h2>
        <p className="text-sm text-muted-foreground">Métricas gerais da plataforma</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Espaços cadastrados" value={stats.totalSpaces} icon={MapPin} />
        <StatCard label="Espaços publicados" value={stats.publishedSpaces} icon={Package} />
        <StatCard label="Usuários registrados" value={stats.totalUsers} icon={Users} />
        <StatCard label="Análises pendentes" value={stats.pendingAnalyses} icon={ShieldAlert} accent="bg-accent" />
      </div>

      {stats.pendingReviews > 0 && (
        <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 flex items-center gap-3">
          <TrendingUp size={18} className="text-accent" />
          <p className="text-sm font-medium text-foreground">
            {stats.pendingReviews} solicitação(ões) de revisão aguardando resposta
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminOverview;
