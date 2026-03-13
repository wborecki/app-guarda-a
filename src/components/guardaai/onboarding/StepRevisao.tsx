import { Button } from "@/components/ui/button";
import { Eye, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { type StepProps, SPACE_TYPE_LABELS } from "./types";

interface StepRevisaoProps extends StepProps {
  completionItems: { label: string; done: boolean }[];
  isReadyToPublish: boolean;
  onPublish: () => void;
  onSaveDraft: () => void;
  setCurrentStep: (step: number) => void;
}

const StepRevisao = ({ space, completionItems, isReadyToPublish, onPublish, onSaveDraft, setCurrentStep }: StepRevisaoProps) => {
  const hasPayment = space && space.pix_key && space.beneficiary_name;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-5 space-y-5">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <Eye size={16} className="text-accent" /> Revisão final
        </h2>

        {/* Checklist */}
        <div className="space-y-2">
          {completionItems.map((item, i) => (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border ${item.done ? "border-primary/20 bg-primary/5" : "border-destructive/20 bg-destructive/5"}`}>
              {item.done ? (
                <CheckCircle2 size={16} className="text-primary shrink-0" />
              ) : (
                <AlertCircle size={16} className="text-destructive shrink-0" />
              )}
              <span className={`text-sm font-medium ${item.done ? "text-foreground" : "text-destructive"}`}>
                {item.label}
              </span>
              {!item.done && (
                <Button variant="ghost" size="sm" className="ml-auto text-xs" onClick={() => setCurrentStep(i + 1)}>
                  Completar
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="border-t border-border pt-4 space-y-2">
          <h3 className="text-sm font-semibold text-foreground">Resumo do anúncio</h3>
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 text-xs">
            <div><span className="text-muted-foreground">Local:</span> <span className="font-medium text-foreground">{space.location || "—"}</span></div>
            <div><span className="text-muted-foreground">Tipo:</span> <span className="font-medium text-foreground">{SPACE_TYPE_LABELS[space.space_type] || "—"}</span></div>
            <div><span className="text-muted-foreground">Volume:</span> <span className="font-medium text-foreground">{space.volume ? `${Number(space.volume).toFixed(1)} m³` : "—"}</span></div>
            <div><span className="text-muted-foreground">Fotos:</span> <span className="font-medium text-foreground">{space.photos?.length || 0} foto(s)</span></div>
            <div><span className="text-muted-foreground">Recebimento:</span> <span className="font-medium text-foreground">{hasPayment ? "Configurado" : "Pendente"}</span></div>
            <div><span className="text-muted-foreground">Preço/m³/dia:</span> <span className="font-medium text-foreground">{(space as any).price_per_day ? `R$ ${Number((space as any).price_per_day).toFixed(2).replace(".", ",")}` : "—"}</span></div>
            <div><span className="text-muted-foreground">Taxa limpeza:</span> <span className="font-medium text-foreground">{(space as any).cleaning_fee_enabled ? `R$ ${Number((space as any).cleaning_fee_amount || 0).toFixed(2).replace(".", ",")}` : "Não"}</span></div>
          </div>
        </div>

        {/* Photos preview */}
        {space.photos && space.photos.length > 0 && (
          <div className="flex gap-2 overflow-x-auto">
            {space.photos.map((url, i) => (
              <img key={i} src={url} alt={`Foto ${i + 1}`} className="w-20 h-20 rounded-lg object-cover border border-border shrink-0" />
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2.5 pt-2">
          <Button
            type="button"
            size="lg"
            disabled={!isReadyToPublish}
            onClick={onPublish}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold h-12 text-sm group"
          >
            <CheckCircle2 size={16} className="mr-1.5" />
            Publicar espaço
            <ArrowRight size={16} className="ml-1.5 group-hover:translate-x-1 transition-transform" />
          </Button>
          {!isReadyToPublish && (
            <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
              <AlertCircle size={12} /> Complete todas as etapas para publicar
            </p>
          )}
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onSaveDraft}
            className="w-full h-10 text-sm"
          >
            Salvar rascunho e sair
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StepRevisao;
