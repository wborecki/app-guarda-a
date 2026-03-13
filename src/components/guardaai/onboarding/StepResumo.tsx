import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import LocationAutocomplete from "@/components/guardaai/LocationAutocomplete";
import { MapPin, Ruler, Home, Shield, Edit2 } from "lucide-react";
import { type StepProps, SPACE_TYPE_LABELS } from "./types";

const InfoItem = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-secondary/40">
    <Icon size={13} className="text-muted-foreground mt-0.5 shrink-0" />
    <div>
      <p className="text-[10px] text-muted-foreground uppercase">{label}</p>
      <p className="text-xs font-medium text-foreground">{value}</p>
    </div>
  </div>
);

const StepResumo = ({ space, updateSpace }: StepProps) => {
  const [editingBasic, setEditingBasic] = useState(false);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Home size={16} className="text-accent" /> Resumo do espaço
          </h2>
          <Button variant="ghost" size="sm" onClick={() => setEditingBasic(!editingBasic)}>
            <Edit2 size={14} className="mr-1" /> {editingBasic ? "Fechar" : "Editar"}
          </Button>
        </div>

        {!editingBasic ? (
          <div className="grid grid-cols-2 gap-3">
            <InfoItem icon={MapPin} label="Localização" value={space.location || "—"} />
            <InfoItem icon={Home} label="Tipo" value={SPACE_TYPE_LABELS[space.space_type] || space.space_type || "—"} />
            <InfoItem icon={Ruler} label="Dimensões" value={`${space.width}m × ${space.length}m × ${space.height}m`} />
            <InfoItem icon={Ruler} label="Volume" value={space.volume ? `${Number(space.volume).toFixed(1)} m³` : "—"} />
            <InfoItem icon={Shield} label="Coberto" value={space.covered ? "Sim" : "Não"} />
            <InfoItem icon={Shield} label="Fechado" value={space.closed ? "Sim" : "Não"} />
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase mb-1 block">Localização</label>
              <LocationAutocomplete
                value={space.location}
                onChange={v => updateSpace({ location: v })}
                placeholder="Endereço ou região"
                className="h-10 text-sm"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase mb-1 block">Tipo de espaço</label>
              <Select value={space.space_type} onValueChange={v => updateSpace({ space_type: v })}>
                <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="garagem">Garagem</SelectItem>
                  <SelectItem value="quarto">Quarto vazio</SelectItem>
                  <SelectItem value="deposito">Depósito</SelectItem>
                  <SelectItem value="area-coberta">Área coberta</SelectItem>
                  <SelectItem value="galpao">Pequeno galpão</SelectItem>
                  <SelectItem value="comercial">Espaço comercial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: "height", label: "Altura (m)" },
                { key: "width", label: "Largura (m)" },
                { key: "length", label: "Compr. (m)" },
              ].map(d => (
                <div key={d.key}>
                  <label className="text-[10px] text-muted-foreground mb-1 block">{d.label}</label>
                  <Input
                    type="number" step="0.1" min="0"
                    value={(space as any)[d.key]}
                    onChange={e => updateSpace({ [d.key]: parseFloat(e.target.value) || 0 })}
                    className="h-10 text-sm"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              {[
                { key: "covered", label: "Coberto" },
                { key: "closed", label: "Fechado" },
                { key: "easy_access", label: "Fácil acesso" },
              ].map(t => (
                <div key={t.key} className="flex items-center gap-2">
                  <Switch
                    checked={(space as any)[t.key]}
                    onCheckedChange={v => updateSpace({ [t.key]: v })}
                    className="scale-[0.85]"
                  />
                  <Label className="text-xs">{t.label}</Label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepResumo;
