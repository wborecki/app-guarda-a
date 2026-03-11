import { CalendarDays } from "lucide-react";
import { EmptyState } from "@/components/guardaai/dashboard/EmptyState";

const DashboardAgenda = () => (
  <div className="w-full max-w-7xl mx-auto">
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">Agenda</h1>
      <p className="text-muted-foreground text-sm">Visualize entradas, saídas e compromissos ligados aos seus espaços e reservas.</p>
    </div>

    <div className="rounded-2xl border border-border/60 bg-card shadow-sm">
      <EmptyState
        icon={CalendarDays}
        title="Sua agenda está vazia"
        description="Quando você tiver reservas ou espaços anunciados, seus compromissos aparecerão aqui com datas de entrada e saída."
        actionLabel="Buscar espaço"
        actionHref="/"
      />
    </div>
  </div>
);

export default DashboardAgenda;
