import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import LocationAutocomplete from "@/components/guardaai/LocationAutocomplete";
import { MapPin, Ruler, Home, Shield, Edit2, Car, DoorOpen, Check } from "lucide-react";
import { type StepProps, SPACE_TYPE_LABELS } from "./types";
import { vehicleCategories, vehicleGroups } from "@/data/vehicleCategories";

const InfoItem = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-secondary/40">
    <Icon size={13} className="text-muted-foreground mt-0.5 shrink-0" />
    <div>
      <p className="text-[10px] text-muted-foreground uppercase">{label}</p>
      <p className="text-xs font-medium text-foreground">{value}</p>
    </div>
  </div>
);

const SPACE_USE_OPTIONS = [
  { value: "objects", label: "Apenas objetos" },
  { value: "vehicles", label: "Apenas veículos" },
  { value: "both", label: "Objetos e veículos" },
];

const StepResumo = ({ space, updateSpace }: StepProps) => {
  const [editingBasic, setEditingBasic] = useState(false);

  const spaceUse = (space as any).space_use || "objects";
  const acceptsVehicles = spaceUse === "vehicles" || spaceUse === "both";
  const vehicleCompat: string[] = ((space as any).vehicle_compatible as string[]) || [];

  const toggleVehicle = (id: string) => {
    const next = vehicleCompat.includes(id)
      ? vehicleCompat.filter(v => v !== id)
      : [...vehicleCompat, id];
    updateSpace({ vehicle_compatible: next } as any);
  };

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
            <InfoItem icon={Car} label="Uso" value={SPACE_USE_OPTIONS.find(o => o.value === spaceUse)?.label || "Objetos"} />
            {acceptsVehicles && (
              <InfoItem icon={DoorOpen} label="Portão" value={
                [(space as any).gate_width && `L: ${(space as any).gate_width}m`, (space as any).gate_height && `A: ${(space as any).gate_height}m`].filter(Boolean).join(" · ") || "—"
              } />
            )}
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

            {/* Space use selector */}
            <div className="pt-2 border-t border-border/50">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase mb-1.5 block">Uso do espaço</label>
              <Select value={spaceUse} onValueChange={v => updateSpace({ space_use: v } as any)}>
                <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SPACE_USE_OPTIONS.map(o => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Vehicle fields — only when accepts vehicles */}
            {acceptsVehicles && (
              <div className="space-y-3 pt-2 border-t border-border/50">
                <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Car size={13} className="text-accent" /> Veículos compatíveis
                </h3>

                {/* Gate dimensions */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-muted-foreground mb-1 block flex items-center gap-1">
                      <DoorOpen size={10} /> Largura portão (m)
                    </label>
                    <Input
                      type="number" step="0.1" min="0"
                      value={(space as any).gate_width || ""}
                      onChange={e => updateSpace({ gate_width: parseFloat(e.target.value) || null } as any)}
                      placeholder="Ex: 2.5"
                      className="h-10 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground mb-1 block flex items-center gap-1">
                      <DoorOpen size={10} /> Altura portão (m)
                    </label>
                    <Input
                      type="number" step="0.1" min="0"
                      value={(space as any).gate_height || ""}
                      onChange={e => updateSpace({ gate_height: parseFloat(e.target.value) || null } as any)}
                      placeholder="Ex: 2.2"
                      className="h-10 text-sm"
                    />
                  </div>
                </div>

                {/* Vehicle categories */}
                <p className="text-[10px] text-muted-foreground">Selecione os tipos de veículo que seu espaço comporta:</p>
                {vehicleGroups.map(group => (
                  <div key={group}>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1.5">{group}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {vehicleCategories.filter(v => v.grupo === group).map(v => {
                        const selected = vehicleCompat.includes(v.id);
                        return (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => toggleVehicle(v.id)}
                            className={`text-[11px] px-2.5 py-1.5 rounded-lg border transition-colors flex items-center gap-1 ${
                              selected
                                ? "bg-primary/10 border-primary/30 text-primary font-semibold"
                                : "border-border/60 text-muted-foreground hover:border-primary/20"
                            }`}
                          >
                            <span>{v.icon}</span>
                            <span>{v.nome.split("(")[0].trim()}</span>
                            {selected && <Check size={10} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StepResumo;
