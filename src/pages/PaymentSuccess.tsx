import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SEO from "@/components/SEO";
import { useAuth } from "@/hooks/useAuth";
import { formatBRL } from "@/lib/pricing";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [reservation, setReservation] = useState<any>(null);

  const sessionId = searchParams.get("session_id");
  const reservationId = searchParams.get("reservation_id");

  useEffect(() => {
    if (!sessionId || !reservationId || !user) return;

    const verify = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("verify-payment", {
          body: { sessionId, reservationId },
        });

        if (error || !data?.verified) {
          console.error("Verification failed:", error || data);
          setStatus("error");
          return;
        }

        // Fetch reservation details
        const { data: res } = await supabase
          .from("reservations")
          .select("*")
          .eq("id", reservationId)
          .single();

        setReservation(res);
        setStatus("success");
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("error");
      }
    };

    verify();
  }, [sessionId, reservationId, user]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <SEO title="Pagamento" description="Status do pagamento da sua reserva." noIndex />

      {status === "loading" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-4">
          <Loader2 size={48} className="mx-auto text-primary animate-spin" />
          <p className="text-muted-foreground">Verificando pagamento...</p>
        </motion.div>
      )}

      {status === "success" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="w-full max-w-lg"
        >
          <Card className="border-primary/20 shadow-xl overflow-hidden">
            <div className="bg-primary/10 py-8 flex flex-col items-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 300 }}>
                <CheckCircle2 size={56} className="text-primary" />
              </motion.div>
              <h1 className="text-xl font-bold text-foreground mt-4">Pagamento confirmado!</h1>
              <p className="text-sm text-muted-foreground mt-1">Sua reserva foi criada com sucesso.</p>
            </div>
            <CardContent className="p-6 space-y-4">
              {reservation && (
                <div className="rounded-lg bg-secondary/50 p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Volume</span>
                    <span className="font-medium text-foreground">{reservation.volume} m³</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-border/50">
                    <span className="font-bold text-foreground">Total pago</span>
                    <span className="font-extrabold text-primary text-lg">{formatBRL(Number(reservation.total_price))}</span>
                  </div>
                </div>
              )}
              <p className="text-xs text-muted-foreground text-center leading-relaxed">
                Enviamos os detalhes para <strong>{user?.email}</strong>.<br />
                Acompanhe sua reserva na sua conta.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="flex-1" onClick={() => navigate("/minha-conta/reservas")}>
                  Minhas reservas
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => navigate("/")}>
                  Ir para o início
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {status === "error" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg"
        >
          <Card className="border-destructive/20 shadow-xl overflow-hidden">
            <div className="bg-destructive/10 py-8 flex flex-col items-center">
              <XCircle size={56} className="text-destructive" />
              <h1 className="text-xl font-bold text-foreground mt-4">Erro na verificação</h1>
              <p className="text-sm text-muted-foreground mt-1">Não foi possível confirmar seu pagamento.</p>
            </div>
            <CardContent className="p-6 space-y-4">
              <p className="text-xs text-muted-foreground text-center leading-relaxed">
                Se o valor foi cobrado, entre em contato conosco. Seu pagamento será verificado manualmente.
              </p>
              <div className="flex gap-3">
                <Button className="flex-1" onClick={() => navigate("/contato")}>
                  Falar com suporte
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => navigate("/")}>
                  Voltar ao início
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default PaymentSuccess;
