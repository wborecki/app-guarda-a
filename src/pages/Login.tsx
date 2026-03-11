import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Home, Mail, Lock, ArrowRight, User, Eye, EyeOff } from "lucide-react";
import Header from "@/components/guardaai/Header";
import Footer from "@/components/guardaai/Footer";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

type AuthMode = "login" | "signup" | "forgot";

const Login = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const title = mode === "login" ? "Acesse sua conta" : mode === "signup" ? "Crie sua conta" : "Recuperar acesso";
  const subtitle = mode === "login"
    ? "Entre para acompanhar suas reservas e espaços anunciados."
    : mode === "signup"
    ? "Crie uma conta única para guardar itens e anunciar espaço."
    : "Informe seu e-mail e enviaremos instruções para redefinir sua senha.";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-lg mx-auto">
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
              className="grid grid-cols-2 gap-4 mb-8"
            >
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/15 text-center">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <Package size={18} className="text-primary" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-0.5">Guardar itens</h3>
                <p className="text-xs text-muted-foreground">Reservas, pagamentos e status.</p>
              </div>
              <div className="p-4 rounded-2xl bg-accent/5 border border-accent/15 text-center">
                <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-2">
                  <Home size={18} className="text-accent" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-0.5">Anunciar espaço</h3>
                <p className="text-xs text-muted-foreground">Espaços, solicitações e ganhos.</p>
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
