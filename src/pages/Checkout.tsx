import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft, MapPin, Shield, Lock, CreditCard, QrCode,
  CheckCircle2, Info, Copy, ChevronRight, Smartphone
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { calculatePrice, formatBRL, PRICING_HINT_SHORT, SERVICE_FEE } from "@/lib/pricing";

type PaymentMethod = "credit" | "debit" | "pix";

const STEPS = [
  { key: "space", label: "Espaço" },
  { key: "review", label: "Reserva" },
  { key: "payment", label: "Pagamento" },
];

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const state = location.state as any;
  const space = state?.space;
  const reservedArea = Math.max(state?.reservedArea || 1, 1);
  const days = Math.max(state?.days || 1, 1);
  const simulation = state?.simulation;

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit");
  const [confirmed, setConfirmed] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");
  const [notes, setNotes] = useState("");

  // Card form
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [installments, setInstallments] = useState("1");

  if (!space) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Reserva não encontrada</p>
          <Button onClick={() => navigate("/")}>Voltar ao início</Button>
        </div>
      </div>
    );
  }

  const bp = calculatePrice(reservedArea, days);
  const reservationId = `GA-${Date.now().toString(36).toUpperCase().slice(-6)}`;

  const handlePay = () => {
    if (!name.trim() || !email.trim() || !phone.trim()) {
      toast({ title: "Preencha seus dados", description: "Nome, e-mail e telefone são obrigatórios.", variant: "destructive" });
      return;
    }
    if (paymentMethod !== "pix" && (!cardNumber.trim() || !cardName.trim() || !cardExpiry.trim() || !cardCvv.trim())) {
      toast({ title: "Preencha os dados do cartão", description: "Todos os campos do cartão são obrigatórios.", variant: "destructive" });
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setConfirmed(true);
    }, 2200);
  };

  // ─── SUCCESS STATE ────────────────────────────────────────────
  if (confirmed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="w-full max-w-lg"
        >
          <Card className="border-primary/20 shadow-xl overflow-hidden">
            <div className="bg-primary/10 py-8 flex flex-col items-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
              >
                <CheckCircle2 size={56} className="text-primary" />
              </motion.div>
              <h1 className="text-xl font-bold text-foreground mt-4">Reserva confirmada!</h1>
              <p className="text-sm text-muted-foreground mt-1">Seu espaço foi reservado com sucesso.</p>
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="rounded-lg bg-secondary/50 p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Nº da reserva</span>
                  <span className="font-bold text-foreground">{reservationId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Espaço</span>
                  <span className="font-medium text-foreground truncate max-w-[180px]">{space.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Área reservada</span>
                  <span className="font-medium text-foreground">{reservedArea} m²</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Período</span>
                  <span className="font-medium text-foreground">{days} {days === 1 ? "dia" : "dias"}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-border/50">
                  <span className="font-bold text-foreground">Total pago</span>
                  <span className="font-extrabold text-primary text-lg">{formatBRL(bp.total)}</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center leading-relaxed">
                Enviamos os detalhes para <strong>{email}</strong>.<br />
                Você também pode acompanhar na sua conta.
              </p>

              <div className="flex flex-col gap-2 pt-2">
                <Button className="w-full" onClick={() => navigate("/")}>
                  Voltar ao início
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // ─── CHECKOUT PAGE ────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background pb-28 lg:pb-8">
      {/* Header */}
      <div className="bg-card border-b sticky top-0 z-30">
        <div className="container py-3 flex items-center gap-3 max-w-5xl">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="flex-shrink-0">
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-base font-bold text-foreground">Finalizar reserva</h1>
          {/* Step indicator */}
          <div className="hidden sm:flex items-center gap-1 ml-auto">
            {STEPS.map((s, i) => (
              <div key={s.key} className="flex items-center gap-1">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${i === 2 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                  {s.label}
                </span>
                {i < STEPS.length - 1 && <ChevronRight size={12} className="text-muted-foreground/40" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container max-w-5xl py-6">
        <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-8">
          {/* ═══ LEFT — Forms ═══ */}
          <div className="space-y-6">
            {/* Client data */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardContent className="p-5 sm:p-6">
                  <h2 className="font-bold text-foreground mb-4 flex items-center gap-2 text-base">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">1</span>
                    Seus dados
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Nome completo *</label>
                      <Input value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome completo" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">E-mail *</label>
                      <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@exemplo.com" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Telefone / WhatsApp *</label>
                      <Input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(11) 99999-9999" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">CPF</label>
                      <Input value={cpf} onChange={e => setCpf(e.target.value)} placeholder="000.000.000-00" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Observações</label>
                      <Input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Alguma informação extra (opcional)" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Payment method */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <Card>
                <CardContent className="p-5 sm:p-6">
                  <h2 className="font-bold text-foreground mb-4 flex items-center gap-2 text-base">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">2</span>
                    Forma de pagamento
                  </h2>

                  {/* Tabs */}
                  <div className="grid grid-cols-3 gap-2 mb-5">
                    {([
                      { key: "credit" as const, label: "Crédito", icon: CreditCard },
                      { key: "debit" as const, label: "Débito", icon: CreditCard },
                      { key: "pix" as const, label: "Pix", icon: QrCode },
                    ]).map(m => (
                      <button
                        key={m.key}
                        onClick={() => setPaymentMethod(m.key)}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                          paymentMethod === m.key
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border bg-card text-muted-foreground hover:border-primary/30"
                        }`}
                      >
                        <m.icon size={20} />
                        <span>{m.label}</span>
                      </button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    {/* Card form */}
                    {(paymentMethod === "credit" || paymentMethod === "debit") && (
                      <motion.div
                        key="card"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 overflow-hidden"
                      >
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Número do cartão</label>
                          <Input value={cardNumber} onChange={e => setCardNumber(e.target.value)} placeholder="0000 0000 0000 0000" maxLength={19} />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Nome no cartão</label>
                          <Input value={cardName} onChange={e => setCardName(e.target.value)} placeholder="Como está no cartão" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Validade</label>
                            <Input value={cardExpiry} onChange={e => setCardExpiry(e.target.value)} placeholder="MM/AA" maxLength={5} />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">CVV</label>
                            <Input type="password" value={cardCvv} onChange={e => setCardCvv(e.target.value)} placeholder="•••" maxLength={4} />
                          </div>
                        </div>
                        {paymentMethod === "credit" && (
                          <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Parcelas</label>
                            <select
                              value={installments}
                              onChange={e => setInstallments(e.target.value)}
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              <option value="1">1× de {formatBRL(bp.total)} (à vista)</option>
                              {bp.total >= 50 && <option value="2">2× de {formatBRL(bp.total / 2)}</option>}
                              {bp.total >= 90 && <option value="3">3× de {formatBRL(bp.total / 3)}</option>}
                            </select>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* Pix */}
                    {paymentMethod === "pix" && (
                      <motion.div
                        key="pix"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="text-center py-6 space-y-4">
                          <div className="w-44 h-44 mx-auto bg-secondary rounded-xl flex items-center justify-center border border-border">
                            <QrCode size={100} className="text-muted-foreground/30" />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Clique em <strong>"Confirmar e pagar"</strong> para gerar o QR Code Pix.
                          </p>
                          <div className="flex items-center gap-2 justify-center">
                            <Smartphone size={14} className="text-primary" />
                            <span className="text-xs text-muted-foreground">Escaneie com o app do seu banco</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>

            {/* Trust badges */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: Lock, text: "Pagamento seguro" },
                  { icon: Shield, text: "Dados protegidos" },
                  { icon: CheckCircle2, text: "Intermediação GuardaAí" },
                  { icon: CreditCard, text: "Confirmação imediata" },
                ].map(({ icon: Icon, text }, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-card border border-border/60">
                    <Icon size={16} className="text-primary flex-shrink-0" />
                    <span className="text-[11px] text-muted-foreground leading-tight font-medium">{text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Desktop CTA */}
            <div className="hidden lg:block">
              <Button
                size="lg"
                disabled={processing}
                onClick={handlePay}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-base h-14 shadow-lg"
              >
                {processing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-accent-foreground/40 border-t-accent-foreground rounded-full animate-spin" />
                    Processando...
                  </span>
                ) : (
                  `Confirmar e pagar · ${formatBRL(bp.total)}`
                )}
              </Button>
              <button onClick={() => navigate(-1)} className="w-full text-center text-sm text-primary font-semibold mt-3 hover:underline">
                ← Voltar para editar reserva
              </button>
            </div>
          </div>

          {/* ═══ RIGHT — Sticky Summary ═══ */}
          <div className="mt-6 lg:mt-0">
            <div className="lg:sticky lg:top-20 space-y-4">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
                <Card className="border-primary/20 shadow-md">
                  <CardContent className="p-5">
                    <h3 className="font-bold text-foreground mb-4 text-base">Resumo da reserva</h3>

                    {/* Space info */}
                    <div className="flex gap-3 mb-4 pb-4 border-b border-border/50">
                      <img
                        src={space.photos?.[0]}
                        alt={space.name}
                        className="w-20 h-16 rounded-lg object-cover flex-shrink-0 bg-muted"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-foreground text-sm truncate">{space.name}</p>
                        <p className="text-xs text-muted-foreground">{space.type}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <MapPin size={10} className="text-primary" />
                          <span className="truncate">{space.neighborhood}, {space.city}</span>
                        </div>
                      </div>
                    </div>

                    {/* Reservation details */}
                    <div className="space-y-2 mb-4 pb-4 border-b border-border/50">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Área reservada</span>
                        <span className="text-foreground font-medium">{reservedArea} m²</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Período</span>
                        <span className="text-foreground font-medium">{days} {days === 1 ? "dia" : "dias"}</span>
                      </div>
                      {simulation?.deliveryDate && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Entrada</span>
                          <span className="text-foreground font-medium text-xs">{simulation.deliveryDate}</span>
                        </div>
                      )}
                      {simulation?.pickupDate && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Retirada</span>
                          <span className="text-foreground font-medium text-xs">{simulation.pickupDate}</span>
                        </div>
                      )}
                      {space.owner && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Anunciante</span>
                          <span className="text-foreground font-medium">{space.owner}</span>
                        </div>
                      )}
                    </div>

                    {/* Financial breakdown */}
                    <div className="space-y-2 mb-4 pb-4 border-b border-border/50">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Valores</h4>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Preço do espaço</span>
                        <span className="text-foreground font-medium">{formatBRL(bp.subtotal)}</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground/70 pl-0.5">
                        {reservedArea} m² × {days} {days === 1 ? "dia" : "dias"} → {formatBRL(bp.pricePerM2)}/m²
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Taxa de serviço (fixa)</span>
                        <span className="text-foreground font-medium">{formatBRL(SERVICE_FEE)}</span>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-foreground">Total final</span>
                      <span className="text-2xl font-extrabold text-primary">{formatBRL(bp.total)}</span>
                    </div>

                    {/* Hint */}
                    <div className="flex items-start gap-1.5 p-2.5 rounded-lg bg-secondary/50">
                      <Info size={12} className="text-muted-foreground/50 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{PRICING_HINT_SHORT}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t p-4 z-30 lg:hidden">
        <div className="container max-w-5xl">
          <Button
            size="lg"
            disabled={processing}
            onClick={handlePay}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-base h-13 shadow-lg"
          >
            {processing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-accent-foreground/40 border-t-accent-foreground rounded-full animate-spin" />
                Processando...
              </span>
            ) : (
              `Confirmar e pagar · ${formatBRL(bp.total)}`
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
