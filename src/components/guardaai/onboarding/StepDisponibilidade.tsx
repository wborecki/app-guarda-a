import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CalendarCheck, Clock, DoorOpen, ChevronDown, Copy, Wallet, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import SuggestedPricingTable from "@/components/guardaai/SuggestedPricingTable";
import { type StepProps, type AvailabilitySchedule, WEEKDAYS } from "./types";

const AVAILABILITY_PRESETS = [
  { value: "always", label: "Sempre disponível", desc: "24h, todos os dias", icon: "🟢" },
  { value: "weekdays-commercial", label: "Dias úteis, horário comercial", desc: "Seg a Sex, 08h–18h", icon: "🏢" },
  { value: "all-commercial", label: "Todos os dias, horário comercial", desc: "Seg a Dom, 08h–18h", icon: "📅" },
  { value: "to-arrange", label: "A combinar", desc: "Vocês combinam direto", icon: "🤝" },
  { value: "custom", label: "Personalizar horários", desc: "Defina dia a dia", icon: "⚙️" },
];

const TIME_PRESETS = [
  { label: "08h – 18h", start: "08:00", end: "18:00" },
  { label: "09h – 19h", start: "09:00", end: "19:00" },
  { label: "24 horas", start: "00:00", end: "23:59" },
];

function buildScheduleFromPreset(preset: string): { availability: string; schedule: AvailabilitySchedule; days: string[] } {
  const allDays = WEEKDAYS.map(d => d.value);
  const weekdays = ["seg", "ter", "qua", "qui", "sex"];

  switch (preset) {
    case "always": {
      const schedule: AvailabilitySchedule = {};
      allDays.forEach(d => { schedule[d] = { start: "00:00", end: "23:59" }; });
      return { availability: "continuous", schedule, days: allDays };
    }
    case "weekdays-commercial": {
      const schedule: AvailabilitySchedule = {};
      weekdays.forEach(d => { schedule[d] = { start: "08:00", end: "18:00" }; });
      return { availability: "weekdays", schedule, days: weekdays };
    }
    case "all-commercial": {
      const schedule: AvailabilitySchedule = {};
      allDays.forEach(d => { schedule[d] = { start: "08:00", end: "18:00" }; });
      return { availability: "continuous", schedule, days: allDays };
    }
    case "to-arrange":
      return { availability: "custom", schedule: {}, days: [] };
    default:
      return { availability: "custom", schedule: {}, days: [] };
  }
}

function detectPreset(space: StepProps["space"]): string {
  const schedule = (space.availability_schedule || {}) as AvailabilitySchedule;
  const keys = Object.keys(schedule);
  const allDays = WEEKDAYS.map(d => d.value);
  const weekdays = ["seg", "ter", "qua", "qui", "sex"];

  if (keys.length === 7 && keys.every(k => schedule[k]?.start === "00:00" && (schedule[k]?.end === "23:59" || schedule[k]?.end === "24:00"))) return "always";
  if (keys.length === 5 && weekdays.every(k => keys.includes(k)) && keys.every(k => schedule[k]?.start === "08:00" && schedule[k]?.end === "18:00")) return "weekdays-commercial";
  if (keys.length === 7 && keys.every(k => schedule[k]?.start === "08:00" && schedule[k]?.end === "18:00")) return "all-commercial";
  if (keys.length === 0 && space.availability === "custom") return "to-arrange";
  if (keys.length > 0) return "custom";
  return "";
}

const StepDisponibilidade = ({ space, updateSpace, errors = {} }: StepProps) => {
  const currentPreset = detectPreset(space);
  const [selectedPreset, setSelectedPreset] = useState(currentPreset || "");
  const isCustom = selectedPreset === "custom";

  const handlePresetSelect = (preset: string) => {
    setSelectedPreset(preset);
    if (preset !== "custom") {
      const { availability, schedule, days } = buildScheduleFromPreset(preset);
      updateSpace({
        availability,
        availability_schedule: schedule,
        available_days: days,
        access_hours: preset === "to-arrange" ? "combinado" : preset === "always" ? "livre" : "comercial",
      } as any);
    }
  };

  const schedule = ((space as any).availability_schedule || {}) as AvailabilitySchedule;

  const applyTimeToAll = (start: string, end: string) => {
    const newSchedule: AvailabilitySchedule = {};
    WEEKDAYS.forEach(d => { newSchedule[d.value] = { start, end }; });
    updateSpace({
      availability_schedule: newSchedule,
      available_days: WEEKDAYS.map(d => d.value),
    } as any);
    toast({ title: "Horário aplicado a todos os dias" });
  };

  const copyFromDay = (sourceDay: string) => {
    const source = schedule[sourceDay];
    if (!source) return;
    const newSchedule: AvailabilitySchedule = {};
    WEEKDAYS.forEach(d => { newSchedule[d.value] = { ...source }; });
    updateSpace({
      availability_schedule: newSchedule,
      available_days: WEEKDAYS.map(d => d.value),
    } as any);
    toast({ title: `Horário de ${WEEKDAYS.find(w => w.value === sourceDay)?.label} copiado para todos` });
  };

  return (
    <div className="space-y-5">
      {/* Section 1: Availability preset */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div>
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <CalendarCheck size={16} className="text-accent" /> Quando seu espaço está disponível?
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Escolha a opção que melhor descreve sua rotina. Você pode mudar depois.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {AVAILABILITY_PRESETS.map(preset => (
            <button
              key={preset.value}
              type="button"
              onClick={() => handlePresetSelect(preset.value)}
              className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${
                selectedPreset === preset.value
                  ? "border-accent bg-accent/5 ring-1 ring-accent/20"
                  : "border-border hover:border-accent/30 hover:bg-secondary/30"
              }`}
            >
              <span className="text-lg mt-0.5">{preset.icon}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${selectedPreset === preset.value ? "text-foreground" : "text-foreground/80"}`}>
                  {preset.label}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{preset.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Custom schedule editor */}
        {isCustom && (
          <div className="space-y-3 pt-2 border-t border-border/50">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-foreground">Defina os horários por dia</p>
            </div>

            {/* Quick apply buttons */}
            <div className="flex flex-wrap gap-2">
              <span className="text-[11px] text-muted-foreground self-center mr-1">Aplicar a todos:</span>
              {TIME_PRESETS.map(tp => (
                <Button
                  key={tp.label}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-[11px] h-7 px-2.5"
                  onClick={() => applyTimeToAll(tp.start, tp.end)}
                >
                  {tp.label}
                </Button>
              ))}
            </div>

            {/* Day rows */}
            <div className="space-y-1.5">
              {WEEKDAYS.map(d => {
                const slot = schedule[d.value] || { start: "", end: "" };
                const isEnabled = !!slot.start && !!slot.end;
                return (
                  <div key={d.value} className={`flex items-center gap-2 p-2.5 rounded-lg transition-colors ${isEnabled ? "bg-accent/5 border border-accent/10" : "bg-secondary/30 border border-transparent"}`}>
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={checked => {
                        const newSchedule = { ...schedule };
                        if (checked) {
                          newSchedule[d.value] = { start: "08:00", end: "18:00" };
                        } else {
                          delete newSchedule[d.value];
                        }
                        updateSpace({ availability_schedule: newSchedule } as any);
                      }}
                      className="scale-[0.8]"
                    />
                    <span className={`text-xs font-medium w-8 ${isEnabled ? "text-foreground" : "text-muted-foreground"}`}>
                      {d.label}
                    </span>
                    {isEnabled && (
                      <>
                        <Input
                          type="time"
                          value={slot.start}
                          onChange={e => {
                            const newSchedule = { ...schedule, [d.value]: { ...slot, start: e.target.value } };
                            updateSpace({ availability_schedule: newSchedule } as any);
                          }}
                          className="w-24 h-8 text-xs"
                        />
                        <span className="text-[10px] text-muted-foreground">às</span>
                        <Input
                          type="time"
                          value={slot.end}
                          onChange={e => {
                            const newSchedule = { ...schedule, [d.value]: { ...slot, end: e.target.value } };
                            updateSpace({ availability_schedule: newSchedule } as any);
                          }}
                          className="w-24 h-8 text-xs"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                          title="Copiar para todos os dias"
                          onClick={() => copyFromDay(d.value)}
                        >
                          <Copy size={12} />
                        </Button>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Section 2: Access type */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-3">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <DoorOpen size={14} className="text-accent" /> Como o locatário acessa o espaço?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {[
            { value: "independente", label: "Acesso independente", desc: "Chave, código ou portão" },
            { value: "acompanhado", label: "Acompanhado", desc: "Você estará presente" },
            { value: "combinar", label: "A combinar", desc: "Definem juntos" },
          ].map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => updateSpace({ access_type: opt.value })}
              className={`p-3 rounded-xl border text-left transition-all ${
                space.access_type === opt.value
                  ? "border-accent bg-accent/5 ring-1 ring-accent/20"
                  : "border-border hover:border-accent/30"
              }`}
            >
              <p className="text-xs font-semibold text-foreground">{opt.label}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Section 3: Pricing */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Wallet size={14} className="text-accent" /> Quanto cobrar?
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Defina o valor por m³/dia. A GuardaAí sugere preços, mas você decide.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
          <div className="flex-1">
            <label className="text-[11px] font-medium text-muted-foreground mb-1.5 block">
              Preço por m³/dia (R$)
            </label>
            <Input
              type="number"
              step="0.10"
              min="1.50"
              value={(space as any).price_per_day || ""}
              onChange={e => {
                const val = parseFloat(e.target.value);
                updateSpace({ price_per_day: isNaN(val) ? 0 : val } as any);
              }}
              placeholder="Ex: 5.00"
              className="w-full sm:w-36 h-10 text-sm"
            />
            {(space as any).price_per_day > 0 && (space as any).price_per_day < 1.5 && (
              <p className="text-[10px] text-destructive mt-1 flex items-center gap-1">
                <AlertCircle size={10} /> Mínimo: R$ 1,50/m³/dia
              </p>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs h-9 whitespace-nowrap"
            onClick={() => {
              updateSpace({ price_per_day: 5.0 } as any);
              toast({ title: "Preço sugerido aplicado", description: "R$ 5,00/m³/dia com descontos progressivos." });
            }}
          >
            Usar preço sugerido (R$ 5,00)
          </Button>
        </div>

        <SuggestedPricingTable showApplyButton={false} />

        {/* Cleaning fee (progressive disclosure) */}
        <details className="group pt-2 border-t border-border/40">
          <summary className="text-[11px] font-semibold text-primary cursor-pointer hover:underline select-none flex items-center gap-1">
            <ChevronDown size={12} className="group-open:rotate-180 transition-transform" />
            Taxa de limpeza (opcional)
          </summary>
          <div className="mt-3 space-y-3 pl-1">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Cobrar taxa de limpeza para reservas acima de 7 dias?</p>
              <Switch
                checked={(space as any).cleaning_fee_enabled || false}
                onCheckedChange={checked => {
                  const updates: any = { cleaning_fee_enabled: checked };
                  if (checked && !(space as any).cleaning_fee_amount) {
                    const vol = space.volume || 1;
                    updates.cleaning_fee_amount = Math.min(Math.max(Math.round(vol * 0.5 * 100) / 100, 5), 20);
                  }
                  updateSpace(updates);
                }}
              />
            </div>
            {(space as any).cleaning_fee_enabled && (
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  step="0.50"
                  min="5"
                  max="20"
                  value={(space as any).cleaning_fee_amount || ""}
                  onChange={e => {
                    const val = parseFloat(e.target.value);
                    updateSpace({ cleaning_fee_amount: isNaN(val) ? 0 : val } as any);
                  }}
                  className="w-28 h-9 text-sm"
                />
                <span className="text-[10px] text-muted-foreground">
                  Mín. R$ 5 · Máx. R$ 20
                </span>
              </div>
            )}
          </div>
        </details>
      </div>

      {/* Section 4: Rental type */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-3">
        <h3 className="text-sm font-bold text-foreground">Tipo de locação</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { value: "daily", label: "Diária", desc: "Reservas de 1+ dias" },
            { value: "hourly", label: "Por hora", desc: "Reservas curtas" },
            { value: "both", label: "Ambos", desc: "Aceita diária e hora" },
          ].map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => updateSpace({ rental_type: opt.value } as any)}
              className={`px-4 py-2.5 rounded-xl border text-left transition-all ${
                (space as any).rental_type === opt.value
                  ? "border-accent bg-accent/5 ring-1 ring-accent/20"
                  : "border-border hover:border-accent/30"
              }`}
            >
              <span className="text-xs font-semibold text-foreground">{opt.label}</span>
              <span className="text-[10px] text-muted-foreground ml-1.5">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepDisponibilidade;
