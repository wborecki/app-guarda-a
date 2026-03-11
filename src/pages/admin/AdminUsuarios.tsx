import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Mail, Calendar } from "lucide-react";

type Profile = {
  id: string;
  user_id: string;
  display_name: string | null;
  phone: string | null;
  created_at: string;
};

const AdminUsuarios = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      setProfiles((data as Profile[]) || []);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) {
    return <div className="space-y-3">{[1, 2, 3].map(i => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>;
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-foreground">Usuários</h2>
        <p className="text-sm text-muted-foreground">{profiles.length} usuário(s) registrado(s)</p>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Nome</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden sm:table-cell">Telefone</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Cadastro</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((p) => (
                <tr key={p.id} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Users size={14} className="text-primary" />
                      </div>
                      <span className="font-medium text-foreground truncate max-w-[180px]">
                        {p.display_name || "Sem nome"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                    {p.phone || "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(p.created_at).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {profiles.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-10">Nenhum usuário registrado.</p>
        )}
      </div>
    </div>
  );
};

export default AdminUsuarios;
