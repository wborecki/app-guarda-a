import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  CheckCircle2,
  LogIn,
  UserPlus,
  Mail,
  Eye,
  EyeOff,
  LogOut,
} from "lucide-react";

type AuthTab = "login" | "signup";

const CheckoutAuth = () => {
  const { user, displayName, signOut, loading } = useAuth();
  const { toast } = useToast();

  const [tab, setTab] = useState<AuthTab>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup fields
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const handleGoogle = async () => {
    setSubmitting(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.href,
      });
      if (result.error) {
        toast({ title: "Erro ao entrar com Google", description: String(result.error), variant: "destructive" });
      }
    } catch (e: any) {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEmailLogin = async () => {
    if (!loginEmail || !loginPassword) {
      toast({ title: "Preencha e-mail e senha", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Erro ao entrar", description: error.message, variant: "destructive" });
    }
  };

  const handleEmailSignup = async () => {
    if (!signupName || !signupEmail || !signupPassword) {
      toast({ title: "Preencha nome, e-mail e senha", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.signUp({
      email: signupEmail,
      password: signupPassword,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          full_name: signupName,
          phone: signupPhone,
        },
      },
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Erro ao criar conta", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Conta criada!", description: "Verifique seu e-mail para confirmar." });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 flex items-center justify-center h-32">
          <span className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </CardContent>
      </Card>
    );
  }

  // ─── AUTHENTICATED ─────────────────────────────────────
  if (user) {
    return (
      <Card className="border-primary/20">
        <CardContent className="p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 size={20} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground text-sm">Conectado como</p>
              <p className="text-sm text-muted-foreground truncate">{displayName || user.email}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={signOut} className="text-muted-foreground text-xs gap-1">
              <LogOut size={14} />
              Sair
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ─── NOT AUTHENTICATED ─────────────────────────────────
  return (
    <Card>
      <CardContent className="p-5 sm:p-6">
        <h2 className="font-bold text-foreground mb-1 flex items-center gap-2 text-base">
          <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">1</span>
          Acesse sua conta para continuar
        </h2>
        <p className="text-xs text-muted-foreground mb-5">Identifique-se para concluir sua reserva.</p>

        {/* Social buttons */}
        <div className="space-y-2 mb-5">
          <Button
            variant="outline"
            className="w-full h-11 gap-3 font-medium"
            onClick={handleGoogle}
            disabled={submitting}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continuar com Google
          </Button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground font-medium">ou</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 gap-1 bg-secondary rounded-lg p-1 mb-5">
          <button
            onClick={() => setTab("login")}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === "login"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LogIn size={14} />
            Entrar
          </button>
          <button
            onClick={() => setTab("signup")}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === "signup"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <UserPlus size={14} />
            Criar conta
          </button>
        </div>

        <AnimatePresence mode="wait">
          {tab === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="space-y-3"
            >
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">E-mail</label>
                <Input
                  type="email"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Senha</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="Sua senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <Button className="w-full" disabled={submitting} onClick={handleEmailLogin}>
                {submitting ? "Entrando..." : "Entrar"}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Esqueceu a senha?{" "}
                <button className="text-primary font-medium hover:underline">Recuperar</button>
              </p>
            </motion.div>
          )}

          {tab === "signup" && (
            <motion.div
              key="signup"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="space-y-3"
            >
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Nome completo *</label>
                <Input
                  value={signupName}
                  onChange={e => setSignupName(e.target.value)}
                  placeholder="Seu nome completo"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">E-mail *</label>
                <Input
                  type="email"
                  value={signupEmail}
                  onChange={e => setSignupEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Telefone / WhatsApp</label>
                <Input
                  type="tel"
                  value={signupPhone}
                  onChange={e => setSignupPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Senha *</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={signupPassword}
                    onChange={e => setSignupPassword(e.target.value)}
                    placeholder="Crie uma senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <Button className="w-full" disabled={submitting} onClick={handleEmailSignup}>
                {submitting ? "Criando..." : "Criar conta e continuar"}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default CheckoutAuth;
