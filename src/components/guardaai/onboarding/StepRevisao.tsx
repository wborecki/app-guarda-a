import { Button } from "@/components/ui/button";
import { Eye, CheckCircle2, AlertCircle, ArrowRight, Edit2, PartyPopper, Shield, Save } from "lucide-react";
import { type StepProps, SPACE_TYPE_LABELS } from "./types";

interface StepRevisaoProps extends StepProps {
  completionItems: { label: string; done: boolean }[];
  isReadyToPublish: boolean;
  onPublish: () => void;
  onSaveDraft: () => void;
  setCurrentStep: (step: number) => void;
}

const STEP_LABELS = [
  { label: "Dados do espaço", step: 1, emoji: "🏠" },
  { label: "Disponibilidade e preço", step: 2, emoji: "📅" },
  { label: "Descrição", step: 3, emoji: "📝" },
  { label: "Fotos", step: 4, emoji: "📷" },
  { label: "Recebimento", step: 5, emoji: "💳" },
];

const StepRevisao = ({ space, completionItems, isReadyToPublish, onPublish, onSaveDraft, setCurrentStep }: StepRevisaoProps) => {
  const hasPayment = space && space.pix_key && space.beneficiary_name;
  const doneCount = completionItems.filter(i => i.done).length;
  const totalCount = completionItems.length;

  return (
    <div className="space-y-5">
      {/* Status overview */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Eye size={16} className="text-accent" /> Revisão final
          </h2>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            isReadyToPublish ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
          }`}>
            {doneCount}/{totalCount} completo
          </span>
        </div>

        {isReadyToPublish ? (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/15">
            <PartyPopper size={18} className="text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground">Tudo pronto para publicar!</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Revise os dados abaixo e publique quando estiver satisfeito. Você pode editar depois.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-accent/5 border border-accent/15">
            <AlertCircle size={18} className="text-accent shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground">Quase lá!</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Complete os itens pendentes abaixo para poder publicar seu anúncio.
              </p>
            </div>
          </div>
        )}

        {/* Checklist */}
        <div className="space-y-2">
          {completionItems.map((item, i) => (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
              item.done ? "border-primary/15 bg-primary/5" : "border-accent/20 bg-accent/5"
            }`}>
              {item.done ? (
                <CheckCircle2 size={16} className="text-primary shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-accent/40 shrink-0" />
              )}
              <span className="text-[13px] mr-auto">
                {STEP_LABELS[i]?.emoji}{" "}
              </span>
              <span className={`text-sm font-medium flex-1 ${item.done ? "text-foreground" : "text-foreground/80"}`}>
                {item.label}
              </span>
              <Button
                variant={item.done ? "ghost" : "outline"}
                size="sm"
                className={`text-xs h-7 px-2.5 ${!item.done ? "border-accent/30 text-accent hover:bg-accent/10" : "text-muted-foreground hover:text-foreground"}`}
                onClick={() => setCurrentStep(i + 1)}
              >
                <Edit2 size={11} className="mr-1" />
                {item.done ? "Editar" : "Completar"}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Summary card */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Resumo do anúncio</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
          {[
            { label: "Local", value: space.location },
            { label: "Tipo", value: SPACE_TYPE_LABELS[space.space_type] },
            { label: "Volume", value: space.volume ? `${Number(space.volume).toFixed(1)} m³` : null },
            { label: "Fotos", value: space.photos?.length ? `${space.photos.length} foto(s)` : null },
            { label: "Preço/m³/dia", value: (space as any).price_per_day ? `R$ ${Number((space as any).price_per_day).toFixed(2).replace(".", ",")}` : null },
            { label: "Recebimento", value: hasPayment ? "Configurado ✓" : null },
          ].filter(item => item.value).map((item, i) => (
            <div key={i} className="flex justify-between py-1.5 border-b border-border/30">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-medium text-foreground">{item.value}</span>
            </div>
          ))}
        </div>

        {/* Photos preview */}
        {space.photos && space.photos.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pt-1">
            {space.photos.map((url, i) => (
              <img key={i} src={url} alt={`Foto ${i + 1}`} className="w-16 h-16 rounded-lg object-cover border border-border shrink-0" />
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-3">
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
            <AlertCircle size={12} /> Complete os itens pendentes para publicar
          </p>
        )}
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onSaveDraft}
          className="w-full h-10 text-sm"
        >
          <Save size={14} className="mr-1.5" />
          Salvar rascunho e continuar depois
        </Button>
        <p className="text-[10px] text-muted-foreground text-center flex items-center justify-center gap-1">
          <Shield size={10} /> Seu anúncio pode ser editado a qualquer momento após a publicação.
        </p>
      </div>
    </div>
  );
};

export default StepRevisao;
