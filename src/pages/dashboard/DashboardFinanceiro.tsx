import { Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { EmptyState } from "@/components/guardaai/dashboard/EmptyState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DashboardFinanceiro = () => (
  <div className="max-w-5xl">
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-foreground mb-1">Financeiro</h1>
      <p className="text-muted-foreground text-sm">Acompanhe pagamentos, recebimentos e repasses.</p>
    </div>

    {/* Summary cards */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div className="rounded-2xl border bg-card p-5">
        <div className="flex items-center gap-2 mb-2">
          <ArrowDownRight size={16} className="text-primary" />
          <span className="text-sm text-muted-foreground">Pagamentos realizados</span>
        </div>
        <p className="text-xl font-bold text-foreground">R$ 0,00</p>
      </div>
      <div className="rounded-2xl border bg-card p-5">
        <div className="flex items-center gap-2 mb-2">
          <ArrowUpRight size={16} className="text-emerald-600" />
          <span className="text-sm text-muted-foreground">Valores recebidos</span>
        </div>
        <p className="text-xl font-bold text-foreground">R$ 0,00</p>
      </div>
      <div className="rounded-2xl border bg-card p-5">
        <div className="flex items-center gap-2 mb-2">
          <Wallet size={16} className="text-accent" />
          <span className="text-sm text-muted-foreground">Saldo disponível</span>
        </div>
        <p className="text-xl font-bold text-foreground">R$ 0,00</p>
      </div>
    </div>

    <Tabs defaultValue="todos">
      <TabsList className="mb-6">
        <TabsTrigger value="todos">Todos</TabsTrigger>
        <TabsTrigger value="pagamentos">Pagamentos</TabsTrigger>
        <TabsTrigger value="recebimentos">Recebimentos</TabsTrigger>
      </TabsList>

      <TabsContent value="todos">
        <div className="rounded-2xl border bg-card">
          <EmptyState
            icon={Wallet}
            title="Nenhuma movimentação"
            description="Seu histórico financeiro aparecerá aqui quando você fizer uma reserva ou receber pagamentos por seus espaços."
          />
        </div>
      </TabsContent>
      <TabsContent value="pagamentos">
        <div className="rounded-2xl border bg-card">
          <EmptyState icon={Wallet} title="Nenhum pagamento" description="Pagamentos por reservas aparecerão aqui." />
        </div>
      </TabsContent>
      <TabsContent value="recebimentos">
        <div className="rounded-2xl border bg-card">
          <EmptyState icon={Wallet} title="Nenhum recebimento" description="Recebimentos por espaços anunciados aparecerão aqui." />
        </div>
      </TabsContent>
    </Tabs>
  </div>
);

export default DashboardFinanceiro;
