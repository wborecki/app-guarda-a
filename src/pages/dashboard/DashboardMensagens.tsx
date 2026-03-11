import { MessageSquare } from "lucide-react";
import { EmptyState } from "@/components/guardaai/dashboard/EmptyState";

const DashboardMensagens = () => (
  <div className="max-w-5xl">
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-foreground mb-1">Mensagens</h1>
      <p className="text-muted-foreground text-sm">Comunicação com anfitriões, locatários e suporte.</p>
    </div>

    <div className="rounded-2xl border bg-card">
      <EmptyState
        icon={MessageSquare}
        title="Nenhuma mensagem"
        description="Suas conversas com anfitriões e locatários aparecerão aqui. Inicie uma reserva para começar a trocar mensagens."
        actionLabel="Buscar espaço"
        actionHref="/"
      />
    </div>
  </div>
);

export default DashboardMensagens;
