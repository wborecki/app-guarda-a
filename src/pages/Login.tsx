import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Home, Mail, Lock, ArrowRight } from "lucide-react";
import Header from "@/components/guardaai/Header";
import Footer from "@/components/guardaai/Footer";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-lg mx-auto">
          {/* Hero curta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Acesse sua conta
            </h1>
            <p className="text-muted-foreground text-base max-w-md mx-auto">
              Entre para acompanhar suas reservas, seus espaços anunciados e gerenciar tudo em um só lugar.
            </p>
          </motion.div>

          {/* Cards de contexto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 gap-4 mb-10"
          >
            <div className="p-5 rounded-2xl bg-primary/5 border border-primary/15 text-center">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Package size={20} className="text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">Quero guardar itens</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Acompanhe reservas, pagamentos e status.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-accent/5 border border-accent/15 text-center">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
                <Home size={20} className="text-accent" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">Quero anunciar espaço</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Gerencie espaços, solicitações e ganhos.
              </p>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-center text-xs text-muted-foreground mb-8"
          >
            Tudo em uma única conta. Guarde e anuncie com o mesmo login.
          </motion.p>

          {/* Formulário */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl bg-card border p-8"
          >
            <form
              onSubmit={(e) => e.preventDefault()}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="email">E-mail</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-9"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="password">Senha</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-9"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground group" size="lg">
                Entrar
                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>

            <div className="mt-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-3 text-muted-foreground">ou continue com</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full" type="button">
                Google
              </Button>
              <Button variant="outline" className="w-full" type="button">
                Apple
              </Button>
            </div>

            <div className="mt-6 text-center space-y-2">
              <a href="#" className="text-sm text-primary hover:underline">Esqueci minha senha</a>
              <p className="text-sm text-muted-foreground">
                Ainda não tem conta?{" "}
                <a href="#" className="text-primary font-medium hover:underline">Criar conta</a>
              </p>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
