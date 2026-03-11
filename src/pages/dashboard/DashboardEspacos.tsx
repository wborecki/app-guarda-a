import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Home, Plus, MapPin, Ruler, Edit2, Eye, Loader2, FileEdit } from "lucide-react";
import { EmptyState } from "@/components/guardaai/dashboard/EmptyState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Space = {
  id: string;
  location: string;
  space_type: string;
  width: number;
  length: number;
  height: number;
  volume: number;
  photos: string[];
  status: string;
  onboarding_step: number;
  created_at: string;
};

const typeLabels: Record<string, string> = {
  garagem: "Garagem",
  quarto: "Quarto vazio",
  deposito: "Depósito",
  "area-coberta": "Área coberta",
  galpao: "Pequeno galpão",
  comercial: "Espaço comercial",
};

const SpaceCard = ({ space }: { space: Space }) => {
  const isDraft = space.status === "draft";
  const thumb = space.photos?.[0];
  const shortLocation = space.location?.split(",").slice(0, 2).join(", ") || "Sem localização";

  return (
    <div className="flex gap-4 p-4 rounded-xl border border-border bg-card hover:shadow-sm transition-shadow">
      {/* Thumbnail */}
      <div className="w-20 h-20 rounded-lg bg-secondary shrink-0 overflow-hidden">
        {thumb ? (
          <img src={thumb} alt="Espaço" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Home size={24} className="text-muted-foreground/40" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-semibold text-foreground truncate">
            {typeLabels[space.space_type] || space.space_type || "Espaço"}
          </h3>
          <Badge
            variant={isDraft ? "secondary" : "default"}
            className={`shrink-0 text-[10px] ${isDraft ? "" : "bg-primary/10 text-primary border-primary/20"}`}
          >
            {isDraft ? "Rascunho" : "Publicado"}
          </Badge>
        </div>

        <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1 truncate">
          <MapPin size={11} className="shrink-0" /> {shortLocation}
        </p>

        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Ruler size={11} className="shrink-0" />
          {space.width}m × {space.length}m × {space.height}m
          {space.volume ? ` · ${Number(space.volume).toFixed(1)} m³` : ""}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-1.5 shrink-0">
        {isDraft ? (
          <Button size="sm" variant="outline" className="text-xs h-8 gap-1" asChild>
            <Link to={`/anunciar/finalizar?id=${space.id}`}>
              <FileEdit size={12} /> Continuar
            </Link>
          </Button>
        ) : (
          <Button size="sm" variant="outline" className="text-xs h-8 gap-1" asChild>
            <Link to={`/anunciar/finalizar?id=${space.id}`}>
              <Edit2 size={12} /> Editar
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

const DashboardEspacos = () => {
  const { user } = useAuth();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("spaces")
        .select("id, location, space_type, width, length, height, volume, photos, status, onboarding_step, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setSpaces((data as Space[]) || []);
      setLoading(false);
    };
    load();
  }, [user]);

  const published = spaces.filter(s => s.status === "published");
  const drafts = spaces.filter(s => s.status === "draft");

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Meus espaços</h1>
          <p className="text-muted-foreground text-sm">Gerencie seus espaços anunciados e rascunhos.</p>
        </div>
        <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground gap-1.5" asChild>
          <Link to="/anunciar"><Plus size={14} /> Novo espaço</Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-accent" size={28} />
        </div>
      ) : (
        <Tabs defaultValue={drafts.length > 0 && published.length === 0 ? "rascunhos" : "publicados"} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="publicados">
              Publicados{published.length > 0 && <span className="ml-1.5 text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">{published.length}</span>}
            </TabsTrigger>
            <TabsTrigger value="rascunhos">
              Rascunhos{drafts.length > 0 && <span className="ml-1.5 text-[10px] bg-accent/10 text-accent px-1.5 py-0.5 rounded-full">{drafts.length}</span>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="publicados">
            {published.length === 0 ? (
              <div className="rounded-2xl border bg-card">
                <EmptyState
                  icon={Eye}
                  title="Nenhum espaço publicado"
                  description="Seus espaços publicados aparecerão aqui. Finalize um rascunho ou anuncie um novo espaço."
                  actionLabel="Anunciar espaço"
                  actionHref="/anunciar"
                />
              </div>
            ) : (
              <div className="space-y-3">
                {published.map(s => <SpaceCard key={s.id} space={s} />)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="rascunhos">
            {drafts.length === 0 ? (
              <div className="rounded-2xl border bg-card">
                <EmptyState
                  icon={FileEdit}
                  title="Nenhum rascunho"
                  description="Quando você iniciar o cadastro de um espaço sem finalizar, ele aparecerá aqui."
                />
              </div>
            ) : (
              <div className="space-y-3">
                {drafts.map(s => <SpaceCard key={s.id} space={s} />)}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default DashboardEspacos;
