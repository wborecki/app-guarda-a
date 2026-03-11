import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Package, MapPin, Calendar, ArrowRight } from "lucide-react";
import { EmptyState } from "@/components/guardaai/dashboard/EmptyState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatBRL } from "@/lib/pricing";

interface Reservation {
  id: string;
  start_date: string;
  end_date: string;
  volume: number;
  total_price: number;
  status: string;
  notes: string | null;
  created_at: string;
}

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Pendente", variant: "outline" },
  confirmed: { label: "Confirmada", variant: "default" },
  active: { label: "Ativa", variant: "default" },
  completed: { label: "Finalizada", variant: "secondary" },
  cancelled: { label: "Cancelada", variant: "destructive" },
};

const ReservationCard = ({ reservation }: { reservation: Reservation }) => {
  const status = statusLabels[reservation.status] || { label: reservation.status, variant: "outline" as const };
  const spaceName = reservation.notes?.split("|")[0]?.replace("Espaço:", "").trim() || "Espaço";
  const location = reservation.notes?.split("|")[1]?.trim() || "";

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-semibold text-foreground truncate">{spaceName}</h4>
            {location && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <MapPin size={11} className="flex-shrink-0" />
                <span className="truncate">{location}</span>
              </p>
            )}
          </div>
          <Badge variant={status.variant} className="text-[10px] flex-shrink-0 ml-2">
            {status.label}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs">
          <div>
            <p className="text-muted-foreground">Período</p>
            <p className="font-medium text-foreground flex items-center gap-1">
              <Calendar size={11} />
              {format(new Date(reservation.start_date), "dd/MM", { locale: ptBR })}
              <ArrowRight size={9} />
              {format(new Date(reservation.end_date), "dd/MM", { locale: ptBR })}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Volume</p>
            <p className="font-medium text-foreground">{reservation.volume} m³</p>
          </div>
          <div>
            <p className="text-muted-foreground">Total</p>
            <p className="font-semibold text-primary">{formatBRL(Number(reservation.total_price))}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const DashboardReservas = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("reservations")
        .select("id, start_date, end_date, volume, total_price, status, notes, created_at")
        .or(`renter_id.eq.${user.id},host_id.eq.${user.id}`)
        .order("created_at", { ascending: false });
      setReservations(data || []);
      setLoading(false);
    };
    fetch();
  }, [user]);

  const today = new Date().toISOString().split("T")[0];
  const active = reservations.filter(
    (r) => ["confirmed", "active"].includes(r.status) && r.start_date <= today && r.end_date >= today
  );
  const future = reservations.filter(
    (r) => ["confirmed", "pending"].includes(r.status) && r.start_date > today
  );
  const completed = reservations.filter(
    (r) => ["completed", "cancelled"].includes(r.status) || (["confirmed", "active"].includes(r.status) && r.end_date < today)
  );

  const renderList = (list: Reservation[], emptyTitle: string, emptyDesc: string, showAction = true) => (
    <div className="rounded-2xl border border-border/60 bg-card shadow-sm">
      {list.length === 0 ? (
        <EmptyState
          icon={Package}
          title={emptyTitle}
          description={emptyDesc}
          {...(showAction ? { actionLabel: "Buscar espaço", actionHref: "/buscar" } : {})}
        />
      ) : (
        <div className="p-4 space-y-3">
          {list.map((r) => (
            <ReservationCard key={r.id} reservation={r} />
          ))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">Minhas reservas</h1>
          <p className="text-muted-foreground text-sm">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">Minhas reservas</h1>
        <p className="text-muted-foreground text-sm">
          Acompanhe suas reservas de espaços para armazenamento.
          {reservations.length > 0 && ` ${reservations.length} reserva${reservations.length !== 1 ? "s" : ""} no total.`}
        </p>
      </div>

      <Tabs defaultValue="ativas" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="ativas">
            Ativas {active.length > 0 && `(${active.length})`}
          </TabsTrigger>
          <TabsTrigger value="futuras">
            Futuras {future.length > 0 && `(${future.length})`}
          </TabsTrigger>
          <TabsTrigger value="finalizadas">
            Finalizadas {completed.length > 0 && `(${completed.length})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ativas">
          {renderList(active, "Nenhuma reserva ativa", "Você ainda não tem reservas em andamento. Encontre um espaço perto de você para guardar seus itens.")}
        </TabsContent>

        <TabsContent value="futuras">
          {renderList(future, "Nenhuma reserva agendada", "Você não tem reservas futuras no momento.")}
        </TabsContent>

        <TabsContent value="finalizadas">
          {renderList(completed, "Nenhuma reserva finalizada", "Suas reservas concluídas aparecerão aqui.", false)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardReservas;
