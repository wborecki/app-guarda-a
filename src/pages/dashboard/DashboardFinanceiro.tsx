import { Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { EmptyState } from "@/components/guardaai/dashboard/EmptyState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DashboardFinanceiro = () => (
  <div className="w-full max-w-7xl mx-auto">
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">Financeiro</h1>
      <p className="text-muted-foreground text-sm">Acompanhe pagamentos, recebimentos e repasses.</p>
    </div>

    {/* Summary cards */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-5 mb-8">
      <div className="rounded-2xl border border-border/60 bg-card p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <ArrowDownRight size={18} className="text-primary" />
          </div>
        </div>
        <p className="text-2xl font-bold text-foreground tracking-tight">R$ 0,00</p>
        <p className="text-sm text-muted-foreground mt-1">Pagamentos realizados</p>
      </div>
      <div className="rounded-2xl border border-border/60 bg-card p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100/80 flex items-center justify-center">
            <ArrowUpRight size={18} className="text-emerald-600" />
          </div>
        </div>
        <p className="text-2xl font-bold text-foreground tracking-tight">R$ 0,00</p>
        <p className="text-sm text-muted-foreground mt-1">Valores recebidos</p>
      </div>
      <div className="rounded-2xl border border-border/60 bg-card p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
            <Wallet size={18} className="text-accent" />
          </div>
        </div>
        <p className="text-2xl font-bold text-foreground tracking-tight">R$ 0,00</p>
        <p className="text-sm text-muted-foreground mt-1">Saldo disponível</p>
      </div>
    </div>

    <Tabs defaultValue="todos">
      <TabsList className="mb-6">
        <TabsTrigger value="todos">Todos</TabsTrigger>
        <TabsTrigger value="pagamentos">Pagamentos</TabsTrigger>
        <TabsTrigger value="recebimentos">Recebimentos</TabsTrigger>
      </TabsList>

      <TabsContent value="todos">
        <div className="rounded-2xl border border-border/60 bg-card shadow-sm">
          <EmptyState
            icon={Wallet}
            title="Nenhuma movimentação"
            description="Seu histórico financeiro aparecerá aqui quando você fizer uma reserva ou receber pagamentos por seus espaços."
          />
        </div>
      </TabsContent>
      <TabsContent value="pagamentos">
        <div className="rounded-2xl border border-border/60 bg-card shadow-sm">
          <EmptyState icon={Wallet} title="Nenhum pagamento" description="Pagamentos por reservas aparecerão aqui." />
        </div>
      </TabsContent>
      <TabsContent value="recebimentos">
        <div className="rounded-2xl border border-border/60 bg-card shadow-sm">
          <EmptyState icon={Wallet} title="Nenhum recebimento" description="Recebimentos por espaços anunciados aparecerão aqui." />
        </div>
      </TabsContent>
    </Tabs>
  </div>
);

export default DashboardFinanceiro;
