import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import LocationAutocomplete from "@/components/guardaai/LocationAutocomplete";
import { MapPin, Ruler, Home, Shield, Car, DoorOpen, Check, ChevronDown } from "lucide-react";
import { type StepProps, SPACE_TYPE_LABELS } from "./types";
import { vehicleCategories, vehicleGroups } from "@/data/vehicleCategories";

const SPACE_USE_OPTIONS = [
  { value: "objects", label: "Apenas objetos" },
  { value: "vehicles", label: "Apenas veículos" },
  { value: "both", label: "Objetos e veículos" },
];

const StepResumo = ({ space, updateSpace, errors = {} }: StepProps) => {
  const spaceUse = (space as any).space_use || "objects";
  const acceptsVehicles = spaceUse === "vehicles" || spaceUse === "both";
  const vehicleCompat: string[] = ((space as any).vehicle_compatible as string[]) || [];

  const toggleVehicle = (id: string) => {
    const next = vehicleCompat.includes(id)
      ? vehicleCompat.filter(v => v !== id)
      : [...vehicleCompat, id];
    updateSpace({ vehicle_compatible: next } as any);
  };

  const volume = space.height && space.width && space.length
    ? (space.height * space.width * space.length)
    : 0;

  return (
    <div className="space-y-5">
      {/* Location & type — essential */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div>
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Home size={16} className="text-accent" /> Sobre o seu espaço
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Informe o básico para que locatários encontrem seu espaço.
          </p>
        </div>

        <div>
          <label className="text-xs font-medium text-foreground mb-1.5 block">
            Localização <span className="text-destructive">*</span>
          </label>
          <LocationAutocomplete
            value={space.location}
            onChange={v => updateSpace({ location: v })}
            placeholder="Bairro, cidade ou endereço"
            className="h-10 text-sm"
          />
          <p className="text-[10px] text-muted-foreground mt-1">Não exibimos o endereço exato publicamente.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-foreground mb-1.5 block">
              Tipo de espaço <span className="text-destructive">*</span>
            </label>
            <Select value={space.space_type} onValueChange={v => updateSpace({ space_type: v })}>
              <SelectTrigger className="h-10 text-sm"><SelectValue placeholder="Selecione" /></SelectTrigger>
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
          <div>
            <label className="text-xs font-medium text-foreground mb-1.5 block">
              Para que tipo de itens?
            </label>
            <Select value={spaceUse} onValueChange={v => updateSpace({ space_use: v } as any)}>
              <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                {SPACE_USE_OPTIONS.map(o => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Dimensions */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Ruler size={14} className="text-accent" /> Dimensões do espaço
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Medidas aproximadas são suficientes. O volume é calculado automaticamente.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { key: "width", label: "Largura (m)" },
            { key: "length", label: "Comprimento (m)" },
            { key: "height", label: "Altura (m)" },
          ].map(d => (
            <div key={d.key}>
              <label className="text-[11px] text-muted-foreground mb-1 block">{d.label}</label>
              <Input
                type="number" step="0.1" min="0"
                value={(space as any)[d.key] || ""}
                onChange={e => {
                  const val = parseFloat(e.target.value) || 0;
                  const dims = {
                    width: space.width, length: space.length, height: space.height,
                    [d.key]: val,
                  };
                  const newVol = (dims.width || 0) * (dims.length || 0) * (dims.height || 0);
                  updateSpace({ [d.key]: val, volume: Math.round(newVol * 10) / 10 });
                }}
                placeholder="0.0"
                className="h-10 text-sm"
              />
            </div>
          ))}
        </div>

        {volume > 0 && (
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-accent/5 border border-accent/10">
            <Ruler size={13} className="text-accent" />
            <span className="text-xs font-medium text-foreground">
              Volume total: <strong>{volume.toFixed(1)} m³</strong>
            </span>
          </div>
        )}

        <div className="flex flex-wrap gap-4">
          {[
            { key: "covered", label: "Coberto" },
            { key: "closed", label: "Fechado" },
            { key: "easy_access", label: "Fácil acesso" },
          ].map(t => (
            <div key={t.key} className="flex items-center gap-2">
              <Switch
                checked={(space as any)[t.key] || false}
                onCheckedChange={v => updateSpace({ [t.key]: v })}
                className="scale-[0.85]"
              />
              <Label className="text-xs">{t.label}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Vehicle compatibility — progressive disclosure */}
      {acceptsVehicles && (
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Car size={14} className="text-accent" /> Veículos compatíveis
          </h3>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block flex items-center gap-1">
                <DoorOpen size={10} /> Largura do portão (m)
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
                <DoorOpen size={10} /> Altura do portão (m)
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

          <p className="text-[10px] text-muted-foreground">Selecione os veículos que cabem no espaço:</p>
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
  );
};

export default StepResumo;
