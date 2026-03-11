import { useState, useEffect } from "react";
import { format, differenceInDays } from "date-fns";
import { pt } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";

interface DateRangePickerProps {
  deliveryDate?: Date;
  pickupDate?: Date;
  onDeliveryChange: (date: Date | undefined) => void;
  onPickupChange: (date: Date | undefined) => void;
  className?: string;
  /** Compact mode for inline search bars — hides outer label and day count pill */
  compact?: boolean;
}

export default function DateRangePicker({
  deliveryDate,
  pickupDate,
  onDeliveryChange,
  onPickupChange,
  className,
  compact = false,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"start" | "end">("start");

  const days =
    deliveryDate && pickupDate
      ? Math.max(differenceInDays(pickupDate, deliveryDate), 1)
      : 0;

  const range: DateRange | undefined =
    deliveryDate && pickupDate
      ? { from: deliveryDate, to: pickupDate }
      : deliveryDate
      ? { from: deliveryDate, to: undefined }
      : undefined;

  useEffect(() => {
    if (open) {
      setStep(!deliveryDate ? "start" : "end");
    }
  }, [open]);

  const handleSelect = (selectedRange: DateRange | undefined) => {
    if (!selectedRange) return;

    if (step === "start") {
      onDeliveryChange(selectedRange.from);
      onPickupChange(undefined);
      setStep("end");
    } else {
      if (selectedRange.from && selectedRange.to) {
        onDeliveryChange(selectedRange.from);
        onPickupChange(selectedRange.to);
        setTimeout(() => setOpen(false), 300);
      } else if (selectedRange.from) {
        onDeliveryChange(selectedRange.from);
        onPickupChange(undefined);
        setStep("end");
      }
    }
  };

  const triggerLabel = () => {
    if (deliveryDate && pickupDate) {
      return (
        <span className="flex items-center gap-1.5 text-sm">
          <span className="font-medium">{format(deliveryDate, "dd/MM", { locale: pt })}</span>
          <ArrowRight size={12} className="text-muted-foreground" />
          <span className="font-medium">{format(pickupDate, "dd/MM", { locale: pt })}</span>
          <span className="ml-1 px-1.5 py-0.5 rounded bg-primary/10 text-primary text-xs font-bold">
            {days} {days === 1 ? "dia" : "dias"}
          </span>
        </span>
      );
    }
    if (deliveryDate) {
      return (
        <span className="flex items-center gap-1.5 text-sm">
          <span className="font-medium">{format(deliveryDate, "dd/MM", { locale: pt })}</span>
          <ArrowRight size={12} className="text-muted-foreground" />
          <span className="text-muted-foreground">Retirada</span>
        </span>
      );
    }
    return <span className="text-muted-foreground text-sm">{compact ? "Quando?" : "Selecione as datas"}</span>;
  };

  return (
    <div className={className}>
      {!compact && (
        <label className="text-sm font-medium text-foreground mb-2 block">
          Período da reserva
        </label>
      )}
      {compact && (
        <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
          <CalendarIcon size={12} className="text-primary" />
          Quando?
        </label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              compact ? "h-10 md:h-10" : "h-11 md:h-10",
              !deliveryDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
            {triggerLabel()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start" sideOffset={4}>
          <div className="p-3 pb-1.5 border-b border-border/40">
            <p className="text-xs font-semibold text-foreground">
              {step === "start" ? "📅 Selecione a data de entrada" : "📅 Selecione a data de retirada"}
            </p>
            {deliveryDate && step === "end" && (
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Entrada: {format(deliveryDate, "dd 'de' MMMM", { locale: pt })}
              </p>
            )}
          </div>
          <Calendar
            mode="range"
            selected={range}
            onSelect={handleSelect}
            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            numberOfMonths={1}
            className="p-3 pointer-events-auto"
            locale={pt}
          />
          {days > 0 && (
            <div className="px-3 pb-3 pt-0">
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-primary/5 border border-primary/10">
                <span className="text-xs text-muted-foreground">Total do período</span>
                <span className="text-sm font-bold text-primary">
                  {days} {days === 1 ? "dia" : "dias"}
                </span>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {/* Day count pill below — only in non-compact mode */}
      {!compact && days > 0 && (
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <CalendarIcon size={12} className="text-primary" />
          <span>
            {format(deliveryDate!, "dd/MM/yyyy", { locale: pt })} → {format(pickupDate!, "dd/MM/yyyy", { locale: pt })}
          </span>
          <span className="font-bold text-primary">· {days} {days === 1 ? "dia" : "dias"}</span>
        </div>
      )}
    </div>
  );
}
