import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Wallet, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import SuggestedPricingTable from "@/components/guardaai/SuggestedPricingTable";
import { type StepProps, type AvailabilitySchedule, WEEKDAYS } from "./types";

const StepDisponibilidade = ({ space, updateSpace }: StepProps) => {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <CalendarCheck size={16} className="text-accent" /> Disponibilidade e acesso
        </h2>

        {/* Rental type */}
        <div>
          <label className="text-[11px] font-semibold text-muted-foreground uppercase mb-2 block">Tipo de locação aceita</label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: "daily", label: "Por dia", desc: "Reservas de 1+ dias" },
              { value: "hourly", label: "Por hora", desc: "Reservas de poucas horas" },
              { value: "both", label: "Ambos", desc: "Aceita hora e diária" },
            ].map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => updateSpace({ rental_type: opt.value } as any)}
                className={`flex flex-col items-start px-4 py-2.5 rounded-xl border text-left transition-colors ${
                  (space as any).rental_type === opt.value
                    ? "border-accent bg-accent/10 text-accent-foreground"
                    : "border-border bg-secondary/40 text-muted-foreground hover:border-accent/40"
                }`}
              >
                <span className="text-xs font-semibold">{opt.label}</span>
                <span className="text-[10px] text-muted-foreground">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="rounded-lg border border-border bg-secondary/20 p-4 space-y-3">
          <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Wallet size={14} className="text-accent" /> Defina o preço do seu espaço
          </h3>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Você pode definir livremente o valor da sua locação. A GuardaAí sugere uma referência, mas a decisão final é sua. Mínimo: R$ 1,50/m³/dia.
          </p>

          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase mb-1.5 block">
              Preço por m³/dia (R$)
            </label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
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
                className="w-32 h-10 text-sm"
              />
              <span className="text-[10px] text-muted-foreground leading-relaxed">
                Sugestão: R$ 5,00 (1 dia)<br className="sm:hidden" />
                <span className="hidden sm:inline"> · </span>R$ 2,71 (7 dias) · R$ 1,50 (30 dias)
              </span>
            </div>
            {(space as any).price_per_day > 0 && (space as any).price_per_day < 1.5 && (
              <p className="text-[10px] text-destructive mt-1 flex items-center gap-1">
                <AlertCircle size={10} /> O valor mínimo é R$ 1,50 por m³/dia.
              </p>
            )}
          </div>

          <p className="text-[10px] text-muted-foreground italic">
            Reservas por horas são permitidas, com cobrança mínima equivalente a 1 diária.
          </p>

          {/* Suggested progressive table */}
          <div className="mt-2">
            <SuggestedPricingTable
              onApply={() => {
                updateSpace({ price_per_day: 5.0 } as any);
                toast({ title: "Tabela sugerida aplicada", description: "Preço base definido como R$ 5,00/m³/dia. Descontos progressivos serão aplicados conforme a duração da reserva." });
              }}
            />
          </div>
        </div>

        {/* Cleaning fee */}
        <div className="rounded-lg border border-border bg-secondary/20 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-foreground">Taxa de limpeza (opcional)</h3>
              <p className="text-[10px] text-muted-foreground">Apenas para reservas acima de 7 dias.</p>
            </div>
            <Switch
              checked={(space as any).cleaning_fee_enabled || false}
              onCheckedChange={checked => {
                const updates: any = { cleaning_fee_enabled: checked };
                if (checked && !(space as any).cleaning_fee_amount) {
                  const vol = space.volume || 1;
                  const suggested = Math.min(Math.max(Math.round(vol * 0.5 * 100) / 100, 5), 20);
                  updates.cleaning_fee_amount = suggested;
                }
                updateSpace(updates);
              }}
            />
          </div>
          {(space as any).cleaning_fee_enabled && (
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase mb-1.5 block">
                Valor da taxa (R$)
              </label>
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
                  className="w-28 h-10 text-sm"
                />
                <span className="text-[10px] text-muted-foreground">
                  Sugestão: R$ 0,50/m³ · Mín. R$ 5 · Máx. R$ 20
                </span>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="text-[11px] font-semibold text-muted-foreground uppercase mb-1.5 block">Tipo de disponibilidade</label>
          <Select value={space.availability} onValueChange={v => updateSpace({ availability: v })}>
            <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="continuous">Contínua / Indeterminada</SelectItem>
              <SelectItem value="weekdays">Apenas dias úteis</SelectItem>
              <SelectItem value="weekends">Apenas finais de semana</SelectItem>
              <SelectItem value="custom">Personalizada</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {(space.availability === "custom" || space.availability === "weekdays" || space.availability === "weekends") && (
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase mb-2 block">Dias disponíveis</label>
            <div className="flex flex-wrap gap-2">
              {WEEKDAYS.map(d => {
                const selected = (space.available_days || []).includes(d.value);
                return (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => {
                      const newDays = selected
                        ? (space.available_days || []).filter(v => v !== d.value)
                        : [...(space.available_days || []), d.value];
                      updateSpace({ available_days: newDays });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selected ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Availability schedule per day */}
        <div>
          <label className="text-[11px] font-semibold text-muted-foreground uppercase mb-2 block">
            Horários de atendimento por dia
          </label>
          <p className="text-[10px] text-muted-foreground mb-3">
            Defina em quais horários você pode receber e devolver itens em cada dia da semana.
          </p>
          <div className="space-y-2">
            {WEEKDAYS.map(d => {
              const schedule = ((space as any).availability_schedule || {}) as AvailabilitySchedule;
              const slot = schedule[d.value] || { start: "", end: "" };
              const isEnabled = !!slot.start && !!slot.end;
              return (
                <div key={d.value} className="flex items-center gap-2">
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
                    className="scale-[0.75]"
                  />
                  <span className={`w-8 text-xs font-medium ${isEnabled ? "text-foreground" : "text-muted-foreground/50"}`}>
                    {d.label}
                  </span>
                  {isEnabled && (
                    <div className="flex items-center gap-1.5">
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
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 text-xs text-primary"
            onClick={() => {
              const allSchedule: AvailabilitySchedule = {};
              WEEKDAYS.forEach(d => { allSchedule[d.value] = { start: "08:00", end: "18:00" }; });
              updateSpace({ availability_schedule: allSchedule } as any);
            }}
          >
            Preencher todos (08:00–18:00)
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase mb-1.5 block">Horário de acesso geral</label>
            <Select value={space.access_hours} onValueChange={v => updateSpace({ access_hours: v })}>
              <SelectTrigger className="h-10 text-sm"><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="livre">Livre / Sem restrição</SelectItem>
                <SelectItem value="comercial">Horário comercial</SelectItem>
                <SelectItem value="combinado">A combinar</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase mb-1.5 block">Tipo de acesso</label>
            <Select value={space.access_type} onValueChange={v => updateSpace({ access_type: v })}>
              <SelectTrigger className="h-10 text-sm"><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="independente">Independente</SelectItem>
                <SelectItem value="acompanhado">Acompanhado</SelectItem>
                <SelectItem value="combinar">A combinar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepDisponibilidade;
