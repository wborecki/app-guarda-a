import { Textarea } from "@/components/ui/textarea";
import { FileText, ChevronDown } from "lucide-react";
import { type StepProps } from "./types";
import { useDebouncedField } from "./useDebouncedField";

const StepDetalhes = ({ space, updateSpace, errors = {} }: StepProps) => {
  const [descLocal, setDescLocal] = useDebouncedField(space?.description || "", v => updateSpace({ description: v }));
  const [rulesLocal, setRulesLocal] = useDebouncedField(space?.rules || "", v => updateSpace({ rules: v }));
  const [securityLocal, setSecurityLocal] = useDebouncedField(space?.security_features || "", v => updateSpace({ security_features: v }));
  const [notesLocal, setNotesLocal] = useDebouncedField(space?.notes || "", v => updateSpace({ notes: v }));

  return (
    <div className="space-y-5">
      {/* Description — main field */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div>
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <FileText size={16} className="text-accent" /> Descreva seu espaço
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Uma boa descrição ajuda a atrair mais reservas. Seja objetivo e honesto.
          </p>
        </div>

        <div>
          <label className="text-xs font-medium text-foreground mb-1.5 block">
            Descrição <span className="text-destructive">*</span>
          </label>
          <Textarea
            placeholder="Ex: Garagem coberta em prédio residencial, com portão eletrônico e acesso fácil. Ideal para guardar móveis ou caixas..."
            value={descLocal}
            onChange={e => setDescLocal(e.target.value)}
            rows={4}
            className="text-sm resize-none"
          />
          <p className="text-[10px] text-muted-foreground mt-1">
            Dica: Mencione o tipo de espaço, condições e o que cabe nele.
          </p>
        </div>
      </div>

      {/* Optional details — progressive disclosure */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-3">
        <p className="text-xs font-semibold text-foreground">Informações adicionais <span className="text-muted-foreground font-normal">(opcional)</span></p>
        
        <div>
          <label className="text-[11px] font-medium text-muted-foreground mb-1.5 block">
            Regras de uso
          </label>
          <Textarea
            placeholder="Ex: Não armazenar líquidos, inflamáveis ou alimentos perecíveis..."
            value={rulesLocal}
            onChange={e => setRulesLocal(e.target.value)}
            rows={2}
            className="text-sm resize-none"
          />
        </div>

        <div>
          <label className="text-[11px] font-medium text-muted-foreground mb-1.5 block">
            Segurança do local
          </label>
          <Textarea
            placeholder="Ex: Câmera, portão eletrônico, portaria 24h, alarme..."
            value={securityLocal}
            onChange={e => setSecurityLocal(e.target.value)}
            rows={2}
            className="text-sm resize-none"
          />
        </div>

        <details className="group">
          <summary className="text-[11px] font-semibold text-primary cursor-pointer hover:underline select-none flex items-center gap-1">
            <ChevronDown size={12} className="group-open:rotate-180 transition-transform" />
            Observações extras
          </summary>
          <div className="mt-2">
            <Textarea
              placeholder="Qualquer informação adicional relevante para o locatário..."
              value={notesLocal}
              onChange={e => setNotesLocal(e.target.value)}
              rows={2}
              className="text-sm resize-none"
            />
          </div>
        </details>
      </div>
    </div>
  );
};

export default StepDetalhes;
