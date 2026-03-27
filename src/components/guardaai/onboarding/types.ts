import { MapPin, Ruler, Home, CalendarCheck, FileText, Camera, Wallet, Eye } from "lucide-react";

export const STEPS = [
  { id: 1, label: "Resumo", icon: Home },
  { id: 2, label: "Disponibilidade", icon: CalendarCheck },
  { id: 3, label: "Detalhes", icon: FileText },
  { id: 4, label: "Fotos", icon: Camera },
  { id: 5, label: "Recebimento", icon: Wallet },
  { id: 6, label: "Revisão", icon: Eye },
];

export const WEEKDAYS = [
  { value: "seg", label: "Seg" },
  { value: "ter", label: "Ter" },
  { value: "qua", label: "Qua" },
  { value: "qui", label: "Qui" },
  { value: "sex", label: "Sex" },
  { value: "sab", label: "Sáb" },
  { value: "dom", label: "Dom" },
];

export const PHOTO_TIPS = [
  "Visão geral do espaço",
  "Entrada / acesso",
  "Espaço interno",
  "Condições do local",
];

export type AvailabilitySlot = { start: string; end: string };
export type AvailabilitySchedule = Record<string, AvailabilitySlot>;

export type SpaceData = {
  id: string;
  location: string;
  space_type: string;
  space_category: string;
  height: number;
  width: number;
  length: number;
  volume: number;
  covered: boolean;
  closed: boolean;
  easy_access: boolean;
  availability: string;
  access_hours: string;
  access_type: string;
  available_days: string[];
  description: string;
  notes: string;
  rules: string;
  security_features: string;
  photos: string[];
  pix_key: string;
  pix_key_type: string;
  beneficiary_name: string;
  document_number: string;
  status: string;
  onboarding_step: number;
  rental_type: string;
  availability_schedule: AvailabilitySchedule;
  price_per_day: number;
  cleaning_fee_enabled: boolean;
  cleaning_fee_amount: number;
};

export const SPACE_TYPE_LABELS: Record<string, string> = {
  garagem: "Garagem",
  quarto: "Quarto vazio",
  deposito: "Depósito",
  "area-coberta": "Área coberta",
  galpao: "Pequeno galpão",
  comercial: "Espaço comercial",
};

export interface StepProps {
  space: SpaceData;
  updateSpace: (updates: Partial<SpaceData>) => Promise<void>;
  errors?: Record<string, string>;
}
