import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wallet, CheckCircle2 } from "lucide-react";
import { type StepProps } from "./types";
import { useDebouncedField } from "./useDebouncedField";

const StepRecebimento = ({ space, updateSpace }: StepProps) => {
  const [pixKeyLocal, setPixKeyLocal] = useDebouncedField(space?.pix_key || "", v => updateSpace({ pix_key: v }));
  const [beneficiaryLocal, setBeneficiaryLocal] = useDebouncedField(space?.beneficiary_name || "", v => updateSpace({ beneficiary_name: v }));
  const [documentLocal, setDocumentLocal] = useDebouncedField(space?.document_number || "", v => updateSpace({ document_number: v }));

  const hasPayment = space && space.pix_key && space.beneficiary_name;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <Wallet size={16} className="text-accent" /> Dados de recebimento
        </h2>
        <p className="text-xs text-muted-foreground">
          Configure como você vai receber os pagamentos das reservas.
        </p>

        <div>
          <label className="text-[11px] font-semibold text-muted-foreground uppercase mb-1.5 block">Tipo de chave Pix</label>
          <Select value={space.pix_key_type} onValueChange={v => updateSpace({ pix_key_type: v })}>
            <SelectTrigger className="h-10 text-sm"><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
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
          <label className="text-[11px] font-semibold text-muted-foreground uppercase mb-1.5 block">Chave Pix</label>
          <Input
            value={pixKeyLocal}
            onChange={e => setPixKeyLocal(e.target.value)}
            placeholder="Informe sua chave Pix"
            className="h-10 text-sm"
          />
        </div>

        <div>
          <label className="text-[11px] font-semibold text-muted-foreground uppercase mb-1.5 block">Nome do favorecido</label>
          <Input
            value={beneficiaryLocal}
            onChange={e => setBeneficiaryLocal(e.target.value)}
            placeholder="Nome completo do titular"
            className="h-10 text-sm"
          />
        </div>

        <div>
          <label className="text-[11px] font-semibold text-muted-foreground uppercase mb-1.5 block">CPF ou CNPJ</label>
          <Input
            value={documentLocal}
            onChange={e => setDocumentLocal(e.target.value)}
            placeholder="000.000.000-00"
            className="h-10 text-sm"
          />
        </div>

        {hasPayment && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-primary/5 border border-primary/20">
            <CheckCircle2 size={14} className="text-primary" />
            <span className="text-xs text-primary font-medium">Recebimento configurado</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepRecebimento;
