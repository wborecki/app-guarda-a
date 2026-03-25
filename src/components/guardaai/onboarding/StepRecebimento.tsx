import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wallet, CheckCircle2, Shield, Clock, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import { type StepProps } from "./types";
import { useDebouncedField } from "./useDebouncedField";
import StepGuidance from "./StepGuidance";

const StepRecebimento = ({ space, updateSpace, errors = {} }: StepProps) => {
  const [pixKeyLocal, setPixKeyLocal] = useDebouncedField(space?.pix_key || "", v => updateSpace({ pix_key: v }));
  const [beneficiaryLocal, setBeneficiaryLocal] = useDebouncedField(space?.beneficiary_name || "", v => updateSpace({ beneficiary_name: v }));
  const [documentLocal, setDocumentLocal] = useDebouncedField(space?.document_number || "", v => updateSpace({ document_number: v }));

  const hasPayment = space && space.pix_key && space.beneficiary_name;

  return (
    <div className="space-y-5">
      <StepGuidance
        icon={Wallet}
        title="Configure seu recebimento"
        subtitle="Informe sua chave Pix para receber os pagamentos. O dinheiro cai direto na sua conta após a confirmação da reserva."
        tip="Confira se os dados estão corretos. Erros na chave Pix podem atrasar seus recebimentos."
      />

      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div>
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <CreditCard size={16} className="text-accent" /> Dados do Pix
          </h2>
        </div>

        {/* How it works */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 flex items-start gap-2">
            <Shield size={13} className="text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-[11px] font-medium text-foreground">Dados protegidos</p>
              <p className="text-[10px] text-muted-foreground">Usados apenas para transferir seus ganhos.</p>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-accent/5 border border-accent/10 flex items-start gap-2">
            <Clock size={13} className="text-accent mt-0.5 shrink-0" />
            <div>
              <p className="text-[11px] font-medium text-foreground">Receba rápido</p>
              <p className="text-[10px] text-muted-foreground">Pagamento liberado após check-in confirmado.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-foreground mb-1.5 block">
              Tipo de chave Pix <span className="text-destructive">*</span>
            </label>
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
            <label className="text-xs font-medium text-foreground mb-1.5 block">
              Chave Pix <span className="text-destructive">*</span>
            </label>
            <Input
              value={pixKeyLocal}
              onChange={e => setPixKeyLocal(e.target.value)}
              placeholder={
                space.pix_key_type === "cpf" ? "000.000.000-00" :
                space.pix_key_type === "email" ? "seu@email.com" :
                space.pix_key_type === "phone" ? "(11) 99999-9999" :
                "Informe sua chave Pix"
              }
              className={`h-10 text-sm ${errors.pix_key ? "border-destructive ring-1 ring-destructive/30" : ""}`}
            />
            {errors.pix_key && <p className="text-[10px] text-destructive mt-1">{errors.pix_key}</p>}
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
              placeholder="Nome completo como no banco"
              className={`h-10 text-sm ${errors.beneficiary_name ? "border-destructive ring-1 ring-destructive/30" : ""}`}
            />
            {errors.beneficiary_name && <p className="text-[10px] text-destructive mt-1">{errors.beneficiary_name}</p>}
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
