import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";
import { type StepProps } from "./types";
import { useDebouncedField } from "./useDebouncedField";

const StepDetalhes = ({ space, updateSpace }: StepProps) => {
  const [descLocal, setDescLocal] = useDebouncedField(space?.description || "", v => updateSpace({ description: v }));
  const [rulesLocal, setRulesLocal] = useDebouncedField(space?.rules || "", v => updateSpace({ rules: v }));
  const [securityLocal, setSecurityLocal] = useDebouncedField(space?.security_features || "", v => updateSpace({ security_features: v }));
  const [notesLocal, setNotesLocal] = useDebouncedField(space?.notes || "", v => updateSpace({ notes: v }));

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <FileText size={16} className="text-accent" /> Detalhes do espaço
        </h2>

        <div>
          <label className="text-[11px] font-semibold text-muted-foreground uppercase mb-1.5 block">Descrição do espaço</label>
          <Textarea
            placeholder="Descreva seu espaço para que os clientes entendam o que estão reservando..."
            value={descLocal}
            onChange={e => setDescLocal(e.target.value)}
            rows={3}
            className="text-sm resize-none"
          />
        </div>

        <div>
          <label className="text-[11px] font-semibold text-muted-foreground uppercase mb-1.5 block">Regras do espaço</label>
          <Textarea
            placeholder="Ex: Não armazenar líquidos, não ultrapassar o limite do espaço..."
            value={rulesLocal}
            onChange={e => setRulesLocal(e.target.value)}
            rows={2}
            className="text-sm resize-none"
          />
        </div>

        <div>
          <label className="text-[11px] font-semibold text-muted-foreground uppercase mb-1.5 block">Recursos de segurança</label>
          <Textarea
            placeholder="Ex: Câmera, portão eletrônico, alarme, portaria..."
            value={securityLocal}
            onChange={e => setSecurityLocal(e.target.value)}
            rows={2}
            className="text-sm resize-none"
          />
        </div>

        <div>
          <label className="text-[11px] font-semibold text-muted-foreground uppercase mb-1.5 block">Observações adicionais</label>
          <Textarea
            placeholder="Qualquer informação extra relevante..."
            value={notesLocal}
            onChange={e => setNotesLocal(e.target.value)}
            rows={2}
            className="text-sm resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default StepDetalhes;
