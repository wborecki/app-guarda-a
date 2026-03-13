import { PRICE_HIGHLIGHTS, getSuggestedDailyRate } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface SuggestedPricingTableProps {
  onApply?: () => void;
  showApplyButton?: boolean;
}

const DAYS_COLUMNS = [1, 2, 3, 5, 7, 10, 14, 21, 30];

const SuggestedPricingTable = ({ onApply, showApplyButton = true }: SuggestedPricingTableProps) => {
  return (
    <details className="group">
      <summary className="text-[11px] font-semibold text-primary cursor-pointer hover:underline select-none">
        Ver tabela de referência sugerida
      </summary>
      <div className="mt-2 rounded-lg border border-border/50 bg-card p-3">
        <p className="text-[10px] text-muted-foreground mb-2">
          A GuardaAí sugere uma tabela progressiva: quanto maior a duração da reserva, menor o valor diário por m³.
          {showApplyButton && " Se você aplicar, o preço base será definido como "}
          {showApplyButton && <strong>R$ 5,00/m³/dia</strong>}
          {showApplyButton && " e descontos progressivos serão aplicados automaticamente conforme a duração."}
        </p>

        <div className="grid grid-cols-4 gap-1.5">
          {PRICE_HIGHLIGHTS.map((h, i) => (
            <div key={i} className="text-center p-2 rounded-lg bg-secondary/60 border border-border/30">
              <p className="text-[9px] text-muted-foreground">{h.label}</p>
              <p className="text-xs font-bold text-foreground">R$ {h.suggestedRate.toFixed(2).replace(".", ",")}</p>
              <p className="text-[8px] text-muted-foreground/60">/m³/dia</p>
            </div>
          ))}
        </div>

        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-[9px] text-muted-foreground">
            <thead>
              <tr className="border-b border-border/40">
                <th className="text-left py-1 font-semibold">Dias</th>
                {DAYS_COLUMNS.map(d => (
                  <th key={d} className="text-center py-1 font-semibold">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-1 font-medium text-foreground">R$/m³/dia</td>
                {DAYS_COLUMNS.map(d => (
                  <td key={d} className="text-center py-1">
                    {getSuggestedDailyRate(d).toFixed(2).replace(".", ",")}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {showApplyButton && onApply && (
          <div className="mt-3 flex items-center gap-3">
            <Button
              type="button"
              size="sm"
              className="bg-accent hover:bg-accent/90 text-accent-foreground text-[11px] font-semibold h-8 px-4"
              onClick={onApply}
            >
              <Check size={12} className="mr-1" />
              Aplicar tabela sugerida
            </Button>
            <p className="text-[9px] text-muted-foreground/70 italic flex-1">
              Ao aplicar, seu preço base será R$ 5,00/m³/dia. Você pode alterar a qualquer momento.
            </p>
          </div>
        )}
      </div>
    </details>
  );
};

export default SuggestedPricingTable;
