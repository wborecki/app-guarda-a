import { Home, Plus } from "lucide-react";
import { EmptyState } from "@/components/guardaai/dashboard/EmptyState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DashboardEspacos = () => (
  <div className="max-w-5xl">
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Meus espaços</h1>
        <p className="text-muted-foreground text-sm">Gerencie seus espaços anunciados e acompanhe reservas recebidas.</p>
      </div>
    </div>

    <Tabs defaultValue="ativos" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="ativos">Ativos</TabsTrigger>
        <TabsTrigger value="inativos">Inativos</TabsTrigger>
        <TabsTrigger value="reservas">Reservas recebidas</TabsTrigger>
      </TabsList>

      <TabsContent value="ativos">
        <div className="rounded-2xl border bg-card">
          <EmptyState
            icon={Home}
            title="Nenhum espaço anunciado"
            description="Você ainda não anunciou nenhum espaço. Comece a ganhar disponibilizando seu espaço ocioso."
            actionLabel="Anunciar espaço"
            actionHref="/anunciar"
          />
        </div>
      </TabsContent>

      <TabsContent value="inativos">
        <div className="rounded-2xl border bg-card">
          <EmptyState
            icon={Home}
            title="Nenhum espaço inativo"
            description="Espaços pausados ou desativados aparecerão aqui."
          />
        </div>
      </TabsContent>

      <TabsContent value="reservas">
        <div className="rounded-2xl border bg-card">
          <EmptyState
            icon={Home}
            title="Nenhuma reserva recebida"
            description="Quando alguém reservar seu espaço, as solicitações aparecerão aqui."
          />
        </div>
      </TabsContent>
    </Tabs>
  </div>
);

export default DashboardEspacos;
