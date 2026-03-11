import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserCircle, Mail, Phone, Shield, FileText, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const DashboardPerfil = () => {
  const { user, displayName, signOut } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      // Load profile from database
      supabase
        .from("profiles")
        .select("display_name, phone")
        .eq("user_id", user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setName(data.display_name || "");
            setPhone(data.phone || "");
          }
        });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: name, phone })
      .eq("user_id", user.id);
    setSaving(false);
    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Perfil atualizado!" });
    }
  };

  const initials = displayName
    ? displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">Perfil e configurações</h1>
        <p className="text-muted-foreground text-sm">Gerencie seus dados pessoais e preferências.</p>
      </div>

      {/* Avatar + basic info */}
      <div className="rounded-2xl border bg-card p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{displayName || "Usuário"}</h3>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <UserCircle size={14} />
              Nome completo
            </label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Mail size={14} />
              E-mail
            </label>
            <Input value={user?.email || ""} disabled className="bg-secondary" />
            <p className="text-xs text-muted-foreground">O e-mail não pode ser alterado por aqui.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Phone size={14} />
              Telefone
            </label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(00) 00000-0000" />
          </div>

          <Button onClick={handleSave} disabled={saving} className="mt-2">
            {saving ? "Salvando..." : "Salvar alterações"}
          </Button>
        </div>
      </div>

      {/* Links section */}
      <div className="rounded-2xl border bg-card p-6 mb-6">
        <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <FileText size={16} />
          Termos e documentos
        </h3>
        <div className="space-y-2">
          <Link to="/termos/locatario" className="text-sm text-primary hover:underline block">
            Termos de uso — Locatário
          </Link>
          <Link to="/termos/anfitriao" className="text-sm text-primary hover:underline block">
            Termos de uso — Anfitrião
          </Link>
          <Link to="/itens-proibidos" className="text-sm text-primary hover:underline block">
            Lista de itens proibidos
          </Link>
        </div>
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl border border-destructive/20 bg-card p-6">
        <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <Shield size={16} />
          Segurança
        </h3>
        <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/5" onClick={signOut}>
          <LogOut size={16} className="mr-2" />
          Sair da conta
        </Button>
      </div>
    </div>
  );
};

export default DashboardPerfil;
