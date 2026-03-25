import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wallet, CheckCircle2, Shield } from "lucide-react";
import { type StepProps } from "./types";
import { useDebouncedField } from "./useDebouncedField";

const StepRecebimento = ({ space, updateSpace, errors = {} }: StepProps) => {
  const [pixKeyLocal, setPixKeyLocal] = useDebouncedField(space?.pix_key || "", v => updateSpace({ pix_key: v }));
  const [beneficiaryLocal, setBeneficiaryLocal] = useDebouncedField(space?.beneficiary_name || "", v => updateSpace({ beneficiary_name: v }));
  const [documentLocal, setDocumentLocal] = useDebouncedField(space?.document_number || "", v => updateSpace({ document_number: v }));

  const hasPayment = space && space.pix_key && space.beneficiary_name;

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div>
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Wallet size={16} className="text-accent" /> Como você quer receber?
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Informe sua chave Pix para receber os pagamentos das reservas.
          </p>
        </div>

        <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 flex items-start gap-2">
          <Shield size={14} className="text-primary mt-0.5 shrink-0" />
          <p className="text-[11px] text-foreground">
            Seus dados financeiros são <strong>protegidos</strong> e usados apenas para transferir seus ganhos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-foreground mb-1.5 block">
              Tipo de chave Pix <span className="text-destructive">*</span>
            </label>
            <Select value={space.pix_key_type} onValueChange={v => updateSpace({ pix_key_type: v })}>
              <SelectTrigger className="h-10 text-sm"><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cpf">CPF</SelectItem>
                <SelectItem value="cnpj">CNPJ</SelectItem>
                <SelectItem value="email">E-mail</SelectItem>
                <SelectItem value="phone">Telefone</SelectItem>
                <SelectItem value="random">Chave aleatória</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-foreground mb-1.5 block">
              Chave Pix <span className="text-destructive">*</span>
            </label>
            <Input
              value={pixKeyLocal}
              onChange={e => setPixKeyLocal(e.target.value)}
              placeholder="Informe sua chave Pix"
              className="h-10 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-foreground mb-1.5 block">
              Nome do titular <span className="text-destructive">*</span>
            </label>
            <Input
              value={beneficiaryLocal}
              onChange={e => setBeneficiaryLocal(e.target.value)}
              placeholder="Nome completo"
              className="h-10 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground mb-1.5 block">
              CPF ou CNPJ <span className="text-muted-foreground font-normal">(opcional)</span>
            </label>
            <Input
              value={documentLocal}
              onChange={e => setDocumentLocal(e.target.value)}
              placeholder="000.000.000-00"
              className="h-10 text-sm"
            />
          </div>
        </div>

        {hasPayment && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-primary/5 border border-primary/20">
            <CheckCircle2 size={14} className="text-primary" />
            <span className="text-xs text-primary font-medium">Recebimento configurado ✓</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepRecebimento;
