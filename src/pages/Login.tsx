import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Warehouse, Home, Mail, Lock, ArrowRight, User, Eye, EyeOff, Car } from "lucide-react";
import BackButton from "@/components/guardaai/BackButton";
import Header from "@/components/guardaai/Header";
import Footer from "@/components/guardaai/Footer";
import SEO from "@/components/SEO";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

type AuthMode = "login" | "signup" | "forgot";

const Login = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      navigate("/minha-conta", { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Preencha todos os campos", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({
        title: "Erro ao entrar",
        description: error.message === "Invalid login credentials"
          ? "E-mail ou senha incorretos."
          : error.message,
        variant: "destructive",
      });
    } else {
      navigate("/minha-conta", { replace: true });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) {
      toast({ title: "Preencha todos os campos", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "A senha deve ter pelo menos 6 caracteres", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: window.location.origin,
      },
    });
    setLoading(false);
    if (error) {
      toast({ title: "Erro ao criar conta", description: error.message, variant: "destructive" });
    } else {
      toast({
        title: "Conta criada!",
        description: "Verifique seu e-mail para confirmar o cadastro.",
      });
      setMode("login");
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({ title: "Informe seu e-mail", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({
        title: "E-mail enviado",
        description: "Verifique sua caixa de entrada para redefinir a senha.",
      });
      setMode("login");
    }
  };

  const handleGoogle = async () => {
    setSocialLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast({ title: "Erro ao entrar com Google", description: String(result.error), variant: "destructive" });
      }
    } catch (e: any) {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    } finally {
      setSocialLoading(false);
    }
  };

  const title = mode === "login" ? "Acesse sua conta" : mode === "signup" ? "Crie sua conta" : "Recuperar acesso";
  const subtitle = mode === "login"
    ? "Entre para acompanhar suas reservas e espaços anunciados."
    : mode === "signup"
    ? "Crie uma conta única para guardar objetos ou veículos e anunciar espaço."
    : "Informe seu e-mail e enviaremos instruções para redefinir sua senha.";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO title="Entrar" description="Acesse sua conta GuardaAí para gerenciar reservas, espaços e mensagens." canonical="/entrar" noIndex />
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-lg mx-auto">
          <BackButton label="Início" fallbackTo="/" className="mb-6" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{title}</h1>
            <p className="text-muted-foreground text-base max-w-md mx-auto">{subtitle}</p>
          </motion.div>

          {mode !== "forgot" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-3 gap-3 mb-8"
            >
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/15 text-center">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <Warehouse size={18} className="text-primary" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-0.5">Guardar objetos</h3>
                <p className="text-xs text-muted-foreground">Caixas, móveis, estoque e mais.</p>
              </div>
              <div className="p-4 rounded-2xl bg-accent/5 border border-accent/15 text-center">
                <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-2">
                  <Car size={18} className="text-accent" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-0.5">Guardar veículos</h3>
                <p className="text-xs text-muted-foreground">Carros, motos, barcos e mais.</p>
              </div>
              <div className="p-4 rounded-2xl bg-secondary border border-border/60 text-center">
                <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-2">
                  <Home size={18} className="text-foreground" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-0.5">Anunciar espaço</h3>
                <p className="text-xs text-muted-foreground">Ganhe renda com espaço ocioso.</p>
              </div>
            </motion.div>
          )}

          {mode !== "forgot" && (
            <p className="text-center text-xs text-muted-foreground mb-6">
              Tudo em uma única conta. Guarde e anuncie com o mesmo login.
            </p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl bg-card border p-8"
          >
            {/* Tabs login / signup */}
            {mode !== "forgot" && (
              <div className="flex mb-6 bg-secondary rounded-xl p-1">
                <button
                  className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    mode === "login" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setMode("login")}
                >
                  Entrar
                </button>
                <button
                  className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    mode === "signup" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setMode("signup")}
                >
                  Criar conta
                </button>
              </div>
            )}

            {/* Social login buttons */}
            {mode !== "forgot" && (
              <div className="space-y-2 mb-5">
                <Button
                  variant="outline"
                  className="w-full h-11 gap-3 font-medium"
                  onClick={handleGoogle}
                  disabled={socialLoading || loading}
                  type="button"
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
            )}

            {/* Divider */}
            {mode !== "forgot" && (
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground font-medium">ou use seu e-mail</span>
                <div className="flex-1 h-px bg-border" />
              </div>
            )}

            <form onSubmit={mode === "login" ? handleLogin : mode === "signup" ? handleSignup : handleForgot} className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground" htmlFor="name">Nome completo</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input id="name" type="text" placeholder="Seu nome" className="pl-9" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="email">E-mail</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="seu@email.com" className="pl-9" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>

              {mode !== "forgot" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground" htmlFor="password">Senha</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-9 pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground group" size="lg" disabled={loading}>
                {loading ? "Aguarde..." : mode === "login" ? "Entrar" : mode === "signup" ? "Criar conta" : "Enviar link de recuperação"}
                {!loading && <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />}
              </Button>
            </form>

            {mode === "login" && (
              <div className="mt-4 text-center">
                <button onClick={() => setMode("forgot")} className="text-sm text-primary hover:underline">
                  Esqueci minha senha
                </button>
              </div>
            )}

            {mode === "forgot" && (
              <div className="mt-4 text-center">
                <button onClick={() => setMode("login")} className="text-sm text-primary hover:underline">
                  ← Voltar para login
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
