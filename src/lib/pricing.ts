/**
 * GuardaAí – Centralized pricing logic (new model)
 *
 * Rules:
 *  • Host defines their own price per m³ per day.
 *  • Platform provides a suggested progressive table (NOT mandatory).
 *  • Minimum price: R$ 1.50 per m³ per day.
 *  • Minimum billable volume: 1 m³.
 *  • Minimum billable period: 1 day (hourly reservations are allowed but
 *    charged at least 1 full day).
 *  • NO service fee.
 *  • Optional cleaning fee for reservations > 7 days.
 *  • Cleaning fee suggestion: R$ 0.50/m³, min R$ 5, max R$ 20.
 */

// ─── Constants ─────────────────────────────────────────────────────
export const MIN_DAILY_RATE = 1.5; // R$/m³/day — floor
export const MIN_VOLUME = 1; // m³
export const MIN_DAYS = 1; // minimum billable days
export const CLEANING_FEE_RATE = 0.5; // R$/m³
export const CLEANING_FEE_MIN = 5; // R$
export const CLEANING_FEE_MAX = 20; // R$
export const CLEANING_FEE_THRESHOLD_DAYS = 7; // only for reservations > 7 days

// ─── Suggested progressive table (value per 1 m³ for N days) ──────
// This is a SUGGESTION only — hosts set their own price.
const SUGGESTED_TABLE: Record<number, number> = {
  1: 5.0,  2: 8.5,  3: 12.0,  4: 13.5,  5: 15.0,
  6: 17.0,  7: 19.0,  8: 21.0,  9: 23.0, 10: 25.0,
  11: 27.5, 12: 30.0, 13: 32.5, 14: 35.0, 15: 37.5,
  16: 38.0, 17: 38.5, 18: 39.0, 19: 39.5, 20: 40.0,
  21: 40.5, 22: 41.0, 23: 41.5, 24: 42.0, 25: 42.5,
  26: 43.0, 27: 43.5, 28: 44.0, 29: 44.5, 30: 45.0,
};

// ─── Helpers ───────────────────────────────────────────────────────

/** Suggested price per 1 m³ for a given number of days (capped at 30) */
export function getSuggestedPrice(days: number): number {
  const clamped = Math.min(Math.max(days, 1), 30);
  return SUGGESTED_TABLE[clamped] ?? SUGGESTED_TABLE[30];
}

/** Suggested daily rate per m³ for a given number of days */
export function getSuggestedDailyRate(days: number): number {
  return getSuggestedPrice(days) / Math.min(Math.max(days, 1), 30);
}

/** Calculate suggested cleaning fee for a given volume */
export function calculateSuggestedCleaningFee(volume: number): number {
  const raw = Math.round(volume * CLEANING_FEE_RATE * 100) / 100;
  return Math.min(Math.max(raw, CLEANING_FEE_MIN), CLEANING_FEE_MAX);
}

/** Check if cleaning fee applies (reservation > 7 days) */
export function cleaningFeeApplies(days: number): boolean {
  return days > CLEANING_FEE_THRESHOLD_DAYS;
}

/** Validate a host's daily rate meets minimum */
export function isValidDailyRate(rate: number): boolean {
  return rate >= MIN_DAILY_RATE;
}

// ─── Price breakdown ───────────────────────────────────────────────

export interface PriceBreakdown {
  volume: number;        // m³ (min 1)
  days: number;          // billable days (min 1)
  hours?: number;        // display hours for same-day reservations
  isHourly: boolean;     // true if user selected same-day but charged as 1 day min
  hostDailyRate: number; // R$/m³/day — set by host
  subtotal: number;      // hostDailyRate × volume × days
  cleaningFee: number;   // 0 if not applicable or not enabled
  total: number;         // subtotal + cleaningFee
}

/**
 * Calculate price based on host's daily rate.
 * If days < 1, charges as 1 day minimum.
 * Cleaning fee only applies if enabled and days > 7.
 */
export function calculatePrice(
  volume: number,
  days: number,
  hostDailyRate: number,
  options?: {
    hours?: number;
    cleaningFeeEnabled?: boolean;
    cleaningFeeAmount?: number;
  }
): PriceBreakdown {
  const effectiveVolume = Math.max(volume, MIN_VOLUME);
  const effectiveDays = Math.max(days, MIN_DAYS);
  const rate = Math.max(hostDailyRate, MIN_DAILY_RATE);
  const isHourly = days < 1 && (options?.hours ?? 0) > 0;

  const subtotal = Math.round(rate * effectiveVolume * effectiveDays * 100) / 100;

  let cleaningFee = 0;
  if (options?.cleaningFeeEnabled && cleaningFeeApplies(effectiveDays)) {
    cleaningFee = options.cleaningFeeAmount ?? calculateSuggestedCleaningFee(effectiveVolume);
  }

  const total = Math.round((subtotal + cleaningFee) * 100) / 100;

  return {
    volume: effectiveVolume,
    days: effectiveDays,
    hours: options?.hours,
    isHourly,
    hostDailyRate: rate,
    subtotal,
    cleaningFee,
    total,
  };
}

/** Format currency BRL */
export function formatBRL(value: number): string {
  return `R$\u00A0${value.toFixed(2).replace(".", ",")}`;
}

/** Short pricing explanation */
export const PRICING_EXPLANATION =
  "Os preços são definidos pelos anfitriões, com base no volume reservado (mínimo de 1 m³). A cobrança mínima é de 1 diária. Reservas por horas são permitidas, com cobrança mínima equivalente a 1 diária. Para reservas acima de 7 dias, pode haver taxa de limpeza opcional.";

export const PRICING_HINT_SHORT = "Preço definido pelo anfitrião. Reservas por hora com cobrança mínima de 1 diária.";

/** Key price points for display (suggestions) */
export const PRICE_HIGHLIGHTS = [
  { days: 1, label: "1 dia", suggestedRate: 5.0 },
  { days: 7, label: "7 dias", suggestedRate: 2.71 },
  { days: 15, label: "15 dias", suggestedRate: 2.50 },
  { days: 30, label: "30 dias", suggestedRate: 1.50 },
];

/** Rental type labels */
export const RENTAL_TYPE_LABELS: Record<string, string> = {
  hourly: "Por hora",
  daily: "Por dia",
  both: "Por hora e por dia",
};
