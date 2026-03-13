import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Home, Plus, MapPin, Ruler, Edit2, Eye, Loader2, FileEdit, Trash2, EyeOff, MoreVertical } from "lucide-react";
import { EmptyState } from "@/components/guardaai/dashboard/EmptyState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import SuggestedPricingTable from "@/components/guardaai/SuggestedPricingTable";

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
  price_per_day: number | null;
};

const typeLabels: Record<string, string> = {
  garagem: "Garagem",
  quarto: "Quarto vazio",
  deposito: "Depósito",
  "area-coberta": "Área coberta",
  galpao: "Pequeno galpão",
  comercial: "Espaço comercial",
};

const SpaceCard = ({ space, onDelete, onToggleStatus, onApplySuggestedPrice }: { space: Space; onDelete: (id: string) => void; onToggleStatus: (id: string, newStatus: string) => void; onApplySuggestedPrice: (id: string) => void }) => {
  const isDraft = space.status === "draft";
  const isInactive = space.status === "inactive";
  const thumb = space.photos?.[0];
  const shortLocation = space.location?.split(",").slice(0, 2).join(", ") || "Sem localização";
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <>
      <div className="flex gap-4 p-4 rounded-xl border border-border/60 bg-card hover:shadow-sm transition-shadow">
        <div className="w-20 h-20 rounded-lg bg-secondary shrink-0 overflow-hidden">
          {thumb ? (
            <img src={thumb} alt="Espaço" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Home size={24} className="text-muted-foreground/40" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-sm font-semibold text-foreground truncate">
              {typeLabels[space.space_type] || space.space_type || "Espaço"}
            </h3>
            <Badge
              variant={isDraft ? "secondary" : isInactive ? "outline" : "default"}
              className={`shrink-0 text-[10px] ${
                isDraft ? "" : isInactive ? "text-muted-foreground" : "bg-primary/10 text-primary border-primary/20"
              }`}
            >
              {isDraft ? "Rascunho" : isInactive ? "Inativo" : "Publicado"}
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

        <div className="flex items-start gap-1 shrink-0">
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {space.status === "published" && (
                <DropdownMenuItem onClick={() => onToggleStatus(space.id, "inactive")} className="gap-2 text-xs">
                  <EyeOff size={13} /> Desativar
                </DropdownMenuItem>
              )}
              {space.status === "inactive" && (
                <DropdownMenuItem onClick={() => onToggleStatus(space.id, "published")} className="gap-2 text-xs">
                  <Eye size={13} /> Reativar
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setConfirmDelete(true)} className="gap-2 text-xs text-destructive focus:text-destructive">
                <Trash2 size={13} /> Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Suggested pricing table per space */}
      {!isDraft && (
        <div className="ml-24 mr-4 mb-1">
          <SuggestedPricingTable
            onApply={() => onApplySuggestedPrice(space.id)}
          />
        </div>
      )}

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir espaço?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação é permanente e não pode ser desfeita. Todos os dados deste espaço serão removidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(space.id)}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

const DashboardEspacos = () => {
  const { user } = useAuth();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadSpaces();
  }, [user]);

  const loadSpaces = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("spaces")
      .select("id, location, space_type, width, length, height, volume, photos, status, onboarding_step, created_at, price_per_day")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setSpaces((data as Space[]) || []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("spaces").delete().eq("id", id);
    if (error) {
      toast({ title: "Erro ao excluir", description: error.message, variant: "destructive" });
    } else {
      setSpaces(prev => prev.filter(s => s.id !== id));
      toast({ title: "Espaço excluído" });
    }
  };

  const handleToggleStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from("spaces").update({ status: newStatus, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) {
      toast({ title: "Erro ao atualizar", description: error.message, variant: "destructive" });
    } else {
      setSpaces(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
      toast({ title: newStatus === "inactive" ? "Espaço desativado" : "Espaço reativado" });
    }
  };

  const handleApplySuggestedPrice = async (id: string) => {
    const { error } = await supabase.from("spaces").update({ price_per_day: 5.0, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) {
      toast({ title: "Erro ao aplicar", description: error.message, variant: "destructive" });
    } else {
      setSpaces(prev => prev.map(s => s.id === id ? { ...s, price_per_day: 5.0 } : s));
      toast({ title: "Tabela sugerida aplicada", description: "Preço base definido como R$ 5,00/m³/dia." });
    }
  };

  const published = spaces.filter(s => s.status === "published");
  const drafts = spaces.filter(s => s.status === "draft");
  const inactive = spaces.filter(s => s.status === "inactive");

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">Meus espaços</h1>
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
        <Tabs defaultValue={drafts.length > 0 && published.length === 0 && inactive.length === 0 ? "rascunhos" : "publicados"} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="publicados">
              Publicados{published.length > 0 && <span className="ml-1.5 text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">{published.length}</span>}
            </TabsTrigger>
            <TabsTrigger value="rascunhos">
              Rascunhos{drafts.length > 0 && <span className="ml-1.5 text-[10px] bg-accent/10 text-accent px-1.5 py-0.5 rounded-full">{drafts.length}</span>}
            </TabsTrigger>
            <TabsTrigger value="inativos">
              Inativos{inactive.length > 0 && <span className="ml-1.5 text-[10px] bg-muted-foreground/10 text-muted-foreground px-1.5 py-0.5 rounded-full">{inactive.length}</span>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="publicados">
            {published.length === 0 ? (
              <div className="rounded-2xl border border-border/60 bg-card shadow-sm">
                <EmptyState icon={Eye} title="Nenhum espaço publicado" description="Seus espaços publicados aparecerão aqui." actionLabel="Anunciar espaço" actionHref="/anunciar" />
              </div>
            ) : (
              <div className="space-y-3">{published.map(s => <SpaceCard key={s.id} space={s} onDelete={handleDelete} onToggleStatus={handleToggleStatus} onApplySuggestedPrice={handleApplySuggestedPrice} />)}</div>
            )}
          </TabsContent>

          <TabsContent value="rascunhos">
            {drafts.length === 0 ? (
              <div className="rounded-2xl border border-border/60 bg-card shadow-sm">
                <EmptyState icon={FileEdit} title="Nenhum rascunho" description="Rascunhos de espaços não finalizados aparecerão aqui." />
              </div>
            ) : (
              <div className="space-y-3">{drafts.map(s => <SpaceCard key={s.id} space={s} onDelete={handleDelete} onToggleStatus={handleToggleStatus} />)}</div>
            )}
          </TabsContent>

          <TabsContent value="inativos">
            {inactive.length === 0 ? (
              <div className="rounded-2xl border border-border/60 bg-card shadow-sm">
                <EmptyState icon={EyeOff} title="Nenhum espaço inativo" description="Espaços desativados aparecerão aqui. Você pode reativá-los a qualquer momento." />
              </div>
            ) : (
              <div className="space-y-3">{inactive.map(s => <SpaceCard key={s.id} space={s} onDelete={handleDelete} onToggleStatus={handleToggleStatus} />)}</div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default DashboardEspacos;
