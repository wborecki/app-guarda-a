import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { FileText, ChevronDown, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";
import { type StepProps } from "./types";
import { useDebouncedField } from "./useDebouncedField";
import StepGuidance from "./StepGuidance";

const DESCRIPTION_EXAMPLES = [
  "Garagem coberta em prédio residencial, com portão eletrônico e acesso fácil. Ideal para guardar móveis, caixas ou bicicletas. Espaço seco e ventilado.",
  "Quarto vazio em apartamento térreo, com tranca e chave. Ótimo para guardar malas, instrumentos ou equipamentos. Acesso independente pelo corredor.",
  "Depósito em área comercial com câmera de segurança e portão de enrolar. Espaço amplo para estoque ou mudança. Disponível 24h.",
];

const RULES_EXAMPLES = [
  "Não armazenar líquidos, inflamáveis ou alimentos perecíveis",
  "Sem acesso entre 22h e 7h",
  "Itens devem estar embalados ou protegidos",
  "Proibido materiais tóxicos ou ilegais",
];

const SECURITY_EXAMPLES = [
  "Câmera de segurança",
  "Portão eletrônico",
  "Portaria 24h",
  "Alarme",
  "Tranca reforçada",
  "Condomínio fechado",
];

const StepDetalhes = ({ space, updateSpace, errors = {} }: StepProps) => {
  const [descLocal, setDescLocal] = useDebouncedField(space?.description || "", v => updateSpace({ description: v }));
  const [rulesLocal, setRulesLocal] = useDebouncedField(space?.rules || "", v => updateSpace({ rules: v }));
  const [securityLocal, setSecurityLocal] = useDebouncedField(space?.security_features || "", v => updateSpace({ security_features: v }));
  const [notesLocal, setNotesLocal] = useDebouncedField(space?.notes || "", v => updateSpace({ notes: v }));
  const [showExamples, setShowExamples] = useState(false);

  const applyRulesExample = () => {
    const text = RULES_EXAMPLES.join("\n");
    setRulesLocal(text);
    updateSpace({ rules: text });
  };

  const applySecurityExample = (example: string) => {
    const current = securityLocal ? securityLocal + ", " : "";
    const newVal = current + example;
    setSecurityLocal(newVal);
    updateSpace({ security_features: newVal });
  };

  return (
    <div className="space-y-5">
      <StepGuidance
        icon={FileText}
        title="Descreva seu espaço com clareza"
        subtitle="Uma boa descrição gera mais confiança e reservas. Seja honesto sobre as condições — isso evita problemas depois."
        tip="Anúncios com descrições detalhadas recebem até 3x mais reservas. Mencione o que cabe, se é coberto, se tem segurança."
      />

      {/* Description — main field */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <FileText size={16} className="text-accent" /> Descrição do espaço
          </h2>
          <button
            type="button"
            onClick={() => setShowExamples(!showExamples)}
            className="text-[11px] font-medium text-primary hover:underline flex items-center gap-1"
          >
            <Lightbulb size={11} />
            {showExamples ? "Ocultar exemplos" : "Ver exemplos"}
          </button>
        </div>

        {showExamples && (
          <div className="space-y-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
            <p className="text-[10px] font-semibold text-primary">💡 Exemplos de boas descrições:</p>
            {DESCRIPTION_EXAMPLES.map((ex, i) => (
              <button
                key={i}
                type="button"
                onClick={() => { setDescLocal(ex); updateSpace({ description: ex }); setShowExamples(false); }}
                className="w-full text-left p-2.5 rounded-lg bg-card border border-border/50 hover:border-primary/30 transition-colors"
              >
                <p className="text-[11px] text-muted-foreground leading-relaxed">{ex}</p>
                <p className="text-[10px] text-primary font-medium mt-1">Usar este exemplo →</p>
              </button>
            ))}
          </div>
        )}

        <div>
          <label className="text-xs font-medium text-foreground mb-1.5 block">
            Descrição <span className="text-destructive">*</span>
          </label>
          <Textarea
            placeholder="Descreva seu espaço: tipo, tamanho, o que cabe, condições, acesso..."
            value={descLocal}
            onChange={e => setDescLocal(e.target.value)}
            rows={4}
            className={`text-sm resize-none ${errors.description ? "border-destructive ring-1 ring-destructive/30" : ""}`}
          />
          {errors.description ? (
            <p className="text-[10px] text-destructive mt-1">{errors.description}</p>
          ) : (
            <p className="text-[10px] text-muted-foreground mt-1">
              Mencione: tipo de espaço, condições, o que cabe e como é o acesso.
            </p>
          )}
          {descLocal && descLocal.length < 30 && (
            <p className="text-[10px] text-accent mt-1">
              ✨ Tente adicionar mais detalhes — descrições com 50+ caracteres são mais atrativas.
            </p>
          )}
        </div>
      </div>

      {/* Rules & Security */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <p className="text-xs font-semibold text-foreground">
          Regras e segurança <span className="text-muted-foreground font-normal">(opcional, mas recomendado)</span>
        </p>
        
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-medium text-muted-foreground">
              Regras de uso do espaço
            </label>
            <button
              type="button"
              onClick={applyRulesExample}
              className="text-[10px] font-medium text-primary hover:underline"
            >
              Usar modelo padrão
            </button>
          </div>
          <Textarea
            placeholder="Ex: Não armazenar inflamáveis, alimentos ou materiais perigosos..."
            value={rulesLocal}
            onChange={e => setRulesLocal(e.target.value)}
            rows={3}
            className="text-sm resize-none"
          />
        </div>

        <div>
          <label className="text-[11px] font-medium text-muted-foreground mb-1.5 block">
            Recursos de segurança
          </label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {SECURITY_EXAMPLES.map(item => {
              const isSelected = securityLocal?.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => !isSelected && applySecurityExample(item)}
                  className={`text-[10px] px-2.5 py-1.5 rounded-lg border transition-colors ${
                    isSelected
                      ? "bg-primary/10 border-primary/20 text-primary font-medium"
                      : "border-border/60 text-muted-foreground hover:border-primary/20 hover:text-foreground"
                  }`}
                >
                  {isSelected ? "✓ " : "+ "}{item}
                </button>
              );
            })}
          </div>
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
