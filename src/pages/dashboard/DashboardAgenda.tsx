import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { CalendarDays, Package, ArrowRight, MapPin } from "lucide-react";
import { EmptyState } from "@/components/guardaai/dashboard/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { format, eachDayOfInterval, isSameDay, parseISO } from "date-fns";
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
  renter_id: string;
  host_id: string;
}

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Pendente", variant: "outline" },
  confirmed: { label: "Confirmada", variant: "default" },
  active: { label: "Ativa", variant: "default" },
  completed: { label: "Finalizada", variant: "secondary" },
  cancelled: { label: "Cancelada", variant: "destructive" },
};

const DashboardAgenda = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    if (!user) return;
    const fetchReservations = async () => {
      const { data } = await supabase
        .from("reservations")
        .select("id, start_date, end_date, volume, total_price, status, notes, renter_id, host_id")
        .or(`renter_id.eq.${user.id},host_id.eq.${user.id}`)
        .in("status", ["pending", "confirmed", "active"])
        .order("start_date", { ascending: true });
      setReservations(data || []);
      setLoading(false);
    };
    fetchReservations();
  }, [user]);

  // Build a map of dates that have events
  const eventDays = useMemo(() => {
    const days = new Map<string, { type: "start" | "end" | "both"; count: number }>();
    reservations.forEach((r) => {
      const startKey = r.start_date;
      const endKey = r.end_date;

      const existing_start = days.get(startKey);
      if (existing_start) {
        days.set(startKey, {
          type: existing_start.type === "end" ? "both" : "start",
          count: existing_start.count + 1,
        });
      } else {
        days.set(startKey, { type: "start", count: 1 });
      }

      const existing_end = days.get(endKey);
      if (existing_end) {
        days.set(endKey, {
          type: existing_end.type === "start" ? "both" : "end",
          count: existing_end.count + 1,
        });
      } else {
        days.set(endKey, { type: "end", count: 1 });
      }
    });
    return days;
  }, [reservations]);

  // Reservations active on the selected date
  const selectedReservations = useMemo(() => {
    if (!selectedDate) return [];
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    return reservations.filter((r) => r.start_date <= dateStr && r.end_date >= dateStr);
  }, [selectedDate, reservations]);

  // Events on the selected date (entries/exits)
  const selectedEvents = useMemo(() => {
    if (!selectedDate) return [];
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const events: { reservation: Reservation; type: "entry" | "exit"; role: "host" | "renter" }[] = [];
    reservations.forEach((r) => {
      const role = r.host_id === user?.id ? "host" : "renter";
      if (r.start_date === dateStr) {
        events.push({ reservation: r, type: "entry", role });
      }
      if (r.end_date === dateStr) {
        events.push({ reservation: r, type: "exit", role });
      }
    });
    return events;
  }, [selectedDate, reservations, user]);

  // Custom day rendering with dots
  const modifiers = useMemo(() => {
    const startDays: Date[] = [];
    const endDays: Date[] = [];
    const activeDays: Date[] = [];

    reservations.forEach((r) => {
      startDays.push(parseISO(r.start_date));
      endDays.push(parseISO(r.end_date));
      try {
        const interval = eachDayOfInterval({
          start: parseISO(r.start_date),
          end: parseISO(r.end_date),
        });
        activeDays.push(...interval);
      } catch {}
    });

    return { startDay: startDays, endDay: endDays, activeDay: activeDays };
  }, [reservations]);

  const modifiersStyles = {
    startDay: {
      backgroundColor: "hsl(var(--primary) / 0.15)",
      borderRadius: "50%",
      fontWeight: 700,
      color: "hsl(var(--primary))",
    },
    endDay: {
      backgroundColor: "hsl(var(--destructive) / 0.12)",
      borderRadius: "50%",
      fontWeight: 700,
      color: "hsl(var(--destructive))",
    },
    activeDay: {
      backgroundColor: "hsl(var(--primary) / 0.06)",
    },
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">Agenda</h1>
          <p className="text-muted-foreground text-sm">Carregando...</p>
        </div>
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">Agenda</h1>
          <p className="text-muted-foreground text-sm">Visualize entradas, saídas e compromissos ligados aos seus espaços e reservas.</p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card shadow-sm">
          <EmptyState
            icon={CalendarDays}
            title="Sua agenda está vazia"
            description="Quando você tiver reservas ativas, seus compromissos aparecerão aqui com datas de entrada e saída."
            actionLabel="Buscar espaço"
            actionHref="/buscar"
          />
        </div>
      </div>
    );
  }

  const spaceName = (r: Reservation) =>
    r.notes?.split("|")[0]?.replace("Espaço:", "").trim() || "Espaço";
  const location = (r: Reservation) =>
    r.notes?.split("|")[1]?.trim() || "";

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">Agenda</h1>
        <p className="text-muted-foreground text-sm">
          {reservations.length} reserva{reservations.length !== 1 ? "s" : ""} ativa{reservations.length !== 1 ? "s" : ""}.
          Clique em um dia para ver detalhes.
        </p>
      </div>

      <div className="grid lg:grid-cols-[auto_1fr] gap-6">
        {/* Calendar */}
        <Card className="self-start">
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={ptBR}
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
              className="rounded-md"
            />
            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-4 px-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-primary/20 border border-primary/30" />
                Entrada
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-destructive/15 border border-destructive/30" />
                Saída
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-primary/10" />
                Período ativo
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Day details */}
        <div className="space-y-4">
          {selectedDate && (
            <h2 className="text-lg font-semibold text-foreground">
              {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
            </h2>
          )}

          {/* Entry/exit events */}
          {selectedEvents.length > 0 && (
            <div className="space-y-2">
              {selectedEvents.map((event, i) => (
                <Card key={`${event.reservation.id}-${event.type}-${i}`} className={`border-l-4 ${
                  event.type === "entry" ? "border-l-primary" : "border-l-destructive"
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={event.type === "entry" ? "default" : "destructive"} className="text-[10px]">
                            {event.type === "entry" ? "📦 Entrada" : "📤 Saída"}
                          </Badge>
                          <Badge variant="outline" className="text-[10px]">
                            {event.role === "host" ? "Anfitrião" : "Locatário"}
                          </Badge>
                        </div>
                        <h4 className="text-sm font-semibold text-foreground">
                          {spaceName(event.reservation)}
                        </h4>
                        {location(event.reservation) && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <MapPin size={11} />
                            {location(event.reservation)}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span>{event.reservation.volume} m³</span>
                          <span>·</span>
                          <span>{formatBRL(Number(event.reservation.total_price))}</span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            {format(parseISO(event.reservation.start_date), "dd/MM", { locale: ptBR })}
                            <ArrowRight size={10} />
                            {format(parseISO(event.reservation.end_date), "dd/MM", { locale: ptBR })}
                          </span>
                        </div>
                      </div>
                      <Badge variant={statusLabels[event.reservation.status]?.variant || "outline"} className="text-[10px] flex-shrink-0">
                        {statusLabels[event.reservation.status]?.label || event.reservation.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Active reservations on this day (no entry/exit) */}
          {selectedEvents.length === 0 && selectedReservations.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Reservas ativas neste dia</p>
              {selectedReservations.map((r) => (
                <Card key={r.id} className="border-l-4 border-l-primary/30">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-semibold text-foreground">{spaceName(r)}</h4>
                        {location(r) && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <MapPin size={11} />
                            {location(r)}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span>{r.volume} m³</span>
                          <span>·</span>
                          <span>{formatBRL(Number(r.total_price))}</span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            {format(parseISO(r.start_date), "dd/MM", { locale: ptBR })}
                            <ArrowRight size={10} />
                            {format(parseISO(r.end_date), "dd/MM", { locale: ptBR })}
                          </span>
                        </div>
                      </div>
                      <Badge variant={statusLabels[r.status]?.variant || "outline"} className="text-[10px] flex-shrink-0">
                        {statusLabels[r.status]?.label || r.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* No events on this day */}
          {selectedReservations.length === 0 && selectedEvents.length === 0 && selectedDate && (
            <Card>
              <CardContent className="p-6 text-center">
                <CalendarDays size={28} className="mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">Nenhum compromisso neste dia.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardAgenda;
