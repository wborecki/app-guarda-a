import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { differenceInDays } from "date-fns";
import { encodeSearchParams } from "@/lib/searchParams";
import { useStorageMode } from "@/contexts/StorageModeContext";
import LocationAutocomplete from "@/components/guardaai/LocationAutocomplete";
import DateRangePicker from "@/components/guardaai/DateRangePicker";
import ItemAutocomplete from "@/components/guardaai/ItemAutocomplete";
import VehicleAutocomplete from "@/components/guardaai/VehicleAutocomplete";
import StorageModeSelector from "@/components/guardaai/StorageModeSelector";
import type { ItemDimension } from "@/data/itemDimensions";
import { type VehicleCategory, vehicleVolume } from "@/data/vehicleCategories";

interface HeroSearchFormProps {
  variant: "desktop" | "mobile";
}

const HeroSearchForm = ({ variant }: HeroSearchFormProps) => {
  const navigate = useNavigate();
  const { mode, setMode } = useStorageMode();
  const [location, setLocation] = useState("");
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>();
  const [pickupDate, setPickupDate] = useState<Date | undefined>();
  const [selectedItem, setSelectedItem] = useState<ItemDimension | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleCategory | null>(null);

  const days = deliveryDate && pickupDate ? Math.max(differenceInDays(pickupDate, deliveryDate), 1) : 0;

  const itemVolume = selectedItem
    ? (selectedItem.altura * selectedItem.largura * selectedItem.comprimento) / 1_000_000
    : 0;

  const totalVol = mode === "vehicles"
    ? (selectedVehicle ? vehicleVolume(selectedVehicle) : 0)
    : itemVolume;

  const handleSearch = () => {
    const qs = encodeSearchParams({
      location: location || "São Paulo",
      days: days || 1,
      totalVol,
      deliveryDate: deliveryDate?.toISOString(),
      pickupDate: pickupDate?.toISOString(),
      mode,
      vehicleId: selectedVehicle?.id,
    });
    navigate(`/buscar?${qs}`);
  };

  const thirdFieldLabel = mode === "vehicles" ? "Veículo" : "O que guardar";

  if (variant === "mobile") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.45 }}
        className="rounded-2xl bg-card border border-border/60 shadow-xl shadow-foreground/[0.03] mb-5"
      >
        <div className="p-4 space-y-3">
          {/* Mode selector */}
          <div className="flex justify-center">
            <StorageModeSelector value={mode} onChange={setMode} size="sm" />
          </div>

          <div>
            <label className="text-[10.5px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-1.5 block">
              Localização
            </label>
            <LocationAutocomplete
              value={location}
              onChange={setLocation}
              placeholder="Onde quer guardar?"
              className="h-11 text-[14px] rounded-xl border-border/70"
            />
          </div>
          <div>
            <DateRangePicker
              deliveryDate={deliveryDate}
              pickupDate={pickupDate}
              onDeliveryChange={setDeliveryDate}
              onPickupChange={setPickupDate}
              compact
            />
          </div>
          <div>
            <label className="text-[10.5px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-1.5 block">
              {thirdFieldLabel}
            </label>
            {mode === "vehicles" ? (
              <VehicleAutocomplete value={selectedVehicle} onChange={setSelectedVehicle} />
            ) : (
              <ItemAutocomplete value={selectedItem} onChange={setSelectedItem} />
            )}
          </div>
          <Button
            onClick={handleSearch}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-12 text-[15px] rounded-xl font-bold gap-2.5 shadow-lg shadow-accent/20 mt-1"
          >
            <Search size={17} />
            Buscar espaços
          </Button>
        </div>
      </motion.div>
    );
  }

  // Desktop variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.45 }}
      className="rounded-2xl bg-card border border-border shadow-2xl shadow-foreground/[0.08] mb-5 overflow-visible"
    >
      {/* Mode selector row */}
      <div className="px-5 pt-3 pb-0 flex items-center">
        <StorageModeSelector value={mode} onChange={setMode} size="sm" />
      </div>

      <div className="p-2.5 overflow-visible">
        <div className="flex items-stretch gap-0">
          <div className="flex-[1.4] min-w-0 px-4 py-3 rounded-xl hover:bg-muted/40 transition-colors">
            <label className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
              Localização
            </label>
            <LocationAutocomplete
              value={location}
              onChange={setLocation}
              placeholder="Onde quer guardar?"
              compactGps
              className="border-0 shadow-none bg-transparent h-9 px-0 text-[15px] font-medium placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <div className="w-px self-stretch my-3 bg-border" />
          <div className="flex-[1.1] min-w-0 px-4 py-3 rounded-xl hover:bg-muted/40 transition-colors">
            <DateRangePicker
              deliveryDate={deliveryDate}
              pickupDate={pickupDate}
              onDeliveryChange={setDeliveryDate}
              onPickupChange={setPickupDate}
              compact
            />
          </div>
          <div className="w-px self-stretch my-3 bg-border" />
          <div className="relative flex-[1.2] min-w-0 px-4 py-3 rounded-xl hover:bg-muted/40 transition-colors">
            <label className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
              {thirdFieldLabel}
            </label>
            {mode === "vehicles" ? (
              <VehicleAutocomplete value={selectedVehicle} onChange={setSelectedVehicle} compact />
            ) : (
              <ItemAutocomplete value={selectedItem} onChange={setSelectedItem} compact />
            )}
          </div>
          <div className="flex items-center pl-3 pr-1">
            <Button
              onClick={handleSearch}
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground h-[44px] px-7 rounded-xl shadow-lg shadow-accent/25 text-[15px] font-bold gap-2.5 transition-all hover:shadow-xl hover:shadow-accent/30 hover:scale-[1.02]"
            >
              <Search size={18} />
              Buscar
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HeroSearchForm;
