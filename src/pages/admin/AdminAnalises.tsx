import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ShieldAlert, CheckCircle2, AlertTriangle, Ban } from "lucide-react";

type Analysis = {
  id: string;
  reservation_ref: string;
  status: string;
  risk_level: string | null;
  notes: string | null;
  created_at: string;
  user_id: string;
};

const riskBadge: Record<string, { bg: string; label: string }> = {
  low: { bg: "bg-green-100 text-green-700", label: "Baixo" },
  medium: { bg: "bg-yellow-100 text-yellow-700", label: "Médio" },
  high: { bg: "bg-destructive/10 text-destructive", label: "Alto" },
};

const AdminAnalises = () => {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAnalyses = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("risk_analyses")
      .select("*")
      .order("created_at", { ascending: false });
    setAnalyses((data as Analysis[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchAnalyses(); }, []);

  const updateAnalysis = async (id: string, status: string, risk_level: string) => {
    const { error } = await supabase
      .from("risk_analyses")
      .update({ status, risk_level, reviewed_at: new Date().toISOString(), reviewed_by: "admin" })
      .eq("id", id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Atualizado" });
      fetchAnalyses();
    }
  };

  if (loading) {
    return <div className="space-y-3">{[1, 2, 3].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>;
  }

  const pending = analyses.filter(a => a.status === "pending");
  const resolved = analyses.filter(a => a.status !== "pending");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-foreground">Análises de risco</h2>
        <p className="text-sm text-muted-foreground">{pending.length} pendente(s) · {resolved.length} resolvida(s)</p>
      </div>

      {pending.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <AlertTriangle size={14} className="text-accent" /> Pendentes
          </h3>
          {pending.map((a) => (
            <div key={a.id} className="bg-card border border-accent/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">Reserva {a.reservation_ref}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date(a.created_at).toLocaleDateString("pt-BR")}
                  {a.notes && ` · ${a.notes.slice(0, 60)}...`}
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button size="sm" onClick={() => updateAnalysis(a.id, "approved", "low")}>
                  <CheckCircle2 size={14} className="mr-1" /> Aprovar
                </Button>
                <Button size="sm" variant="destructive" onClick={() => updateAnalysis(a.id, "blocked", "high")}>
                  <Ban size={14} className="mr-1" /> Bloquear
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {resolved.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground">Resolvidas</h3>
          {resolved.map((a) => (
            <div key={a.id} className="bg-card border rounded-xl p-4 flex items-center gap-3 opacity-70">
              <ShieldAlert size={16} className="text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{a.reservation_ref}</p>
              </div>
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${riskBadge[a.risk_level || "low"]?.bg || riskBadge.low.bg}`}>
                {a.status} · {riskBadge[a.risk_level || "low"]?.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {analyses.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-10">Nenhuma análise registrada.</p>
      )}
    </div>
  );
};

export default AdminAnalises;
