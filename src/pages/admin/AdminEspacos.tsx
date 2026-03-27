import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { MapPin, CheckCircle2, XCircle, Eye } from "lucide-react";

type Space = {
  id: string;
  space_type: string;
  location: string;
  status: string;
  created_at: string;
  volume: number | null;
  user_id: string;
};

const statusColor: Record<string, string> = {
  published: "bg-green-100 text-green-700",
  draft: "bg-muted text-muted-foreground",
  review: "bg-yellow-100 text-yellow-700",
  rejected: "bg-destructive/10 text-destructive",
};

const AdminEspacos = () => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSpaces = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("spaces")
      .select("id, space_type, location, status, created_at, volume, user_id")
      .order("created_at", { ascending: false });
    setSpaces((data as Space[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchSpaces(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("spaces").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Atualizado", description: `Espaço ${status === "published" ? "publicado" : "atualizado"}.` });
      fetchSpaces();
    }
  };

  if (loading) {
    return <div className="space-y-3">{[1, 2, 3].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>;
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-foreground">Gestão de espaços</h2>
        <p className="text-sm text-muted-foreground">{spaces.length} espaço(s) cadastrado(s)</p>
      </div>

      <div className="space-y-2">
        {spaces.map((space) => (
          <div key={space.id} className="bg-card border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <MapPin size={14} className="text-primary flex-shrink-0" />
                <span className="text-sm font-semibold text-foreground truncate">
                  {space.space_type} — {space.location || "Sem localização"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{space.volume ? `${space.volume} m³` : "—"}</span>
                <span>·</span>
                <span>{new Date(space.created_at).toLocaleDateString("pt-BR")}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${statusColor[space.status] || statusColor.draft}`}>
                {space.status}
              </span>
              {space.status !== "published" && (
                <Button size="sm" variant="outline" onClick={() => updateStatus(space.id, "published")}>
                  <CheckCircle2 size={14} className="mr-1" /> Publicar
                </Button>
              )}
              {space.status === "published" && (
                <Button size="sm" variant="ghost" onClick={() => updateStatus(space.id, "draft")}>
                  <XCircle size={14} className="mr-1" /> Despublicar
                </Button>
              )}
            </div>
          </div>
        ))}
        {spaces.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-10">Nenhum espaço cadastrado.</p>
        )}
      </div>
    </div>
  );
};

export default AdminEspacos;
