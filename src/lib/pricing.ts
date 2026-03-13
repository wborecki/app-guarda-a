/**
 * GuardaAí – Centralized pricing logic (official table)
 *
 * Rules:
 *  • Price follows a fixed progressive table per 1 m³.
 *  • Minimum billable volume: 1 m³.
 *  • Service fee: fixed R$ 28,00 per reservation.
 *  • Longer reservations = lower proportional daily cost.
 *  • Volume (m³) allows stacking — more efficient than area.
 *  • Hourly pricing: proportional to daily rate (daily / 24).
 */

// ─── Official progressive table (value for 1 m³) ──────────────────
const PRICE_TABLE: Record<number, number> = {
  1: 5.0,
  2: 8.5,
  3: 12.0,
  4: 13.5,
  5: 15.0,
  6: 17.0,
  7: 19.0,
  8: 21.0,
  9: 23.0,
  10: 25.0,
  11: 27.5,
  12: 30.0,
  13: 32.5,
  14: 35.0,
  15: 37.5,
  16: 38.0,
  17: 38.5,
  18: 39.0,
  19: 39.5,
  20: 40.0,
  21: 40.5,
  22: 41.0,
  23: 41.5,
  24: 42.0,
  25: 42.5,
  26: 43.0,
  27: 43.5,
  28: 44.0,
  29: 44.5,
  30: 45.0,
};

export const SERVICE_FEE = 28.0; // R$ fixed per reservation
export const MIN_VOLUME = 1; // m³
export const MONTHLY_PRICE = 45.0; // R$/m³ for 30 days
export const ANNUAL_PRICE = 40.0; // R$/m³ "a partir de" for long-term
export const HOURLY_RATE = Math.round((PRICE_TABLE[1] / 24) * 100) / 100; // R$/m³/hora (≈ R$ 0.21)

// ─── Helpers ───────────────────────────────────────────────────────

/** Price per 1 m³ for a given number of days (capped at 30) */
export function getTablePrice(days: number): number {
  const clamped = Math.min(Math.max(days, 1), 30);
  return PRICE_TABLE[clamped] ?? PRICE_TABLE[30];
}

/** Effective daily rate per m³ for a given number of days */
export function getDailyRate(days: number): number {
  return getTablePrice(days) / Math.min(Math.max(days, 1), 30);
}

/** Full price breakdown for a reservation */
export interface PriceBreakdown {
  volume: number;        // m³
  days: number;
  hours?: number;        // hours (for hourly reservations)
  isHourly: boolean;     // true if hourly pricing applies
  pricePerM3: number;    // table value for 1 m³ at this # of days (or hourly equivalent)
  dailyRate: number;     // pricePerM3 / days (effective per-day rate)
  hourlyRate?: number;   // effective per-hour rate (when hourly)
  subtotal: number;      // pricePerM3 × volume
  serviceFee: number;    // R$ 28,00 fixed
  total: number;         // subtotal + serviceFee
}

export function calculatePrice(volume: number, days: number): PriceBreakdown {
  const effectiveVolume = Math.max(volume, MIN_VOLUME);
  const effectiveDays = Math.max(days, 1);
  const pricePerM3 = getTablePrice(effectiveDays);
  const dailyRate = Math.round((pricePerM3 / Math.min(effectiveDays, 30)) * 100) / 100;
  const subtotal = Math.round(pricePerM3 * effectiveVolume * 100) / 100;
  const total = Math.round((subtotal + SERVICE_FEE) * 100) / 100;

  return {
    volume: effectiveVolume, days: effectiveDays, isHourly: false,
    pricePerM3, dailyRate, subtotal, serviceFee: SERVICE_FEE, total,
  };
}

/** Hourly pricing: proportional to the daily rate for 1 day */
export function calculateHourlyPrice(volume: number, hours: number): PriceBreakdown {
  const effectiveVolume = Math.max(volume, MIN_VOLUME);
  const effectiveHours = Math.max(hours, 1);
  const hourlyRate = HOURLY_RATE;
  const pricePerM3 = Math.round(hourlyRate * effectiveHours * 100) / 100;
  const subtotal = Math.round(pricePerM3 * effectiveVolume * 100) / 100;
  const total = Math.round((subtotal + SERVICE_FEE) * 100) / 100;

  return {
    volume: effectiveVolume,
    days: 0,
    hours: effectiveHours,
    isHourly: true,
    pricePerM3,
    dailyRate: 0,
    hourlyRate,
    subtotal,
    serviceFee: SERVICE_FEE,
    total,
  };
}

/** Smart price calculation: uses hourly if hours > 0 and days === 0, otherwise daily */
export function calculateSmartPrice(volume: number, days: number, hours?: number): PriceBreakdown {
  if (days === 0 && hours && hours > 0) {
    return calculateHourlyPrice(volume, hours);
  }
  return calculatePrice(volume, days);
}

/** Format currency BRL */
export function formatBRL(value: number): string {
  return `R$\u00A0${value.toFixed(2).replace(".", ",")}`;
}

/** Short pricing explanation used across the site */
export const PRICING_EXPLANATION =
  "O valor é calculado com base no volume reservado (mínimo de 1 m³) e no tempo da reserva. Objetos podem ser empilhados, otimizando o espaço. Quanto maior o período, menor o valor proporcional por dia. Reservas por hora são proporcionais à diária. A taxa de serviço fixa de R$ 28,00 é adicionada no checkout.";

export const PRICING_HINT_SHORT = "Reservas mais longas têm valor proporcional menor por dia. Também disponível por hora.";

/** Key price points for display */
export const PRICE_HIGHLIGHTS = [
  { days: 0, hours: 1, label: "1 hora", price: HOURLY_RATE },
  { days: 1, hours: 0, label: "1 dia", price: 5.0 },
  { days: 7, hours: 0, label: "7 dias", price: 19.0 },
  { days: 30, hours: 0, label: "30 dias", price: 45.0 },
];

/** Rental type labels */
export const RENTAL_TYPE_LABELS: Record<string, string> = {
  hourly: "Por hora",
  daily: "Por dia",
  both: "Por hora e por dia",
};
