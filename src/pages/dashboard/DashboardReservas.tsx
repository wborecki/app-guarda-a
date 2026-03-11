import { Package } from "lucide-react";
import { EmptyState } from "@/components/guardaai/dashboard/EmptyState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DashboardReservas = () => (
  <div className="w-full max-w-7xl mx-auto">
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">Minhas reservas</h1>
      <p className="text-muted-foreground text-sm">Acompanhe suas reservas de espaços para armazenamento.</p>
    </div>

    <Tabs defaultValue="ativas" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="ativas">Ativas</TabsTrigger>
        <TabsTrigger value="futuras">Futuras</TabsTrigger>
        <TabsTrigger value="finalizadas">Finalizadas</TabsTrigger>
      </TabsList>

      <TabsContent value="ativas">
        <div className="rounded-2xl border border-border/60 bg-card shadow-sm">
          <EmptyState
            icon={Package}
            title="Nenhuma reserva ativa"
            description="Você ainda não tem reservas em andamento. Encontre um espaço perto de você para guardar seus itens."
            actionLabel="Buscar espaço"
            actionHref="/buscar"
          />
        </div>
      </TabsContent>

      <TabsContent value="futuras">
        <div className="rounded-2xl border border-border/60 bg-card shadow-sm">
          <EmptyState
            icon={Package}
            title="Nenhuma reserva agendada"
            description="Você não tem reservas futuras no momento."
            actionLabel="Buscar espaço"
            actionHref="/"
          />
        </div>
      </TabsContent>

      <TabsContent value="finalizadas">
        <div className="rounded-2xl border border-border/60 bg-card shadow-sm">
          <EmptyState
            icon={Package}
            title="Nenhuma reserva finalizada"
            description="Suas reservas concluídas aparecerão aqui."
          />
        </div>
      </TabsContent>
    </Tabs>
  </div>
);

export default DashboardReservas;
