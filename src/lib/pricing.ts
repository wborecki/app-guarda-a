/**
 * GuardaAí – Centralized pricing logic
 *
 * Rules:
 *  • Price is per m² per day, decreasing with longer periods.
 *  • Minimum billable area: 1 m².
 *  • Service fee: 12 % added at checkout.
 *  • Longer reservations = lower proportional daily rate.
 */

// ─── Rate tiers ────────────────────────────────────────────────────
export type RateTier = { minDays: number; maxDays: number; rate: number; label: string };

export const RATE_TIERS: RateTier[] = [
  { minDays: 1, maxDays: 6, rate: 2.5, label: "1–6 dias" },
  { minDays: 7, maxDays: 13, rate: 2.0, label: "7–13 dias" },
  { minDays: 14, maxDays: 29, rate: 1.8, label: "14–29 dias" },
  { minDays: 30, maxDays: Infinity, rate: 1.5, label: "30+ dias" },
];

export const SERVICE_FEE_RATE = 0.12; // 12 %
export const MIN_AREA = 1; // m²

// ─── Helpers ───────────────────────────────────────────────────────

/** Daily rate per m² based on the reservation length */
export function getDailyRate(days: number): number {
  for (const tier of RATE_TIERS) {
    if (days >= tier.minDays && days <= tier.maxDays) return tier.rate;
  }
  return RATE_TIERS[RATE_TIERS.length - 1].rate;
}

/** Returns the current tier for a given number of days */
export function getCurrentTier(days: number): RateTier {
  for (const tier of RATE_TIERS) {
    if (days >= tier.minDays && days <= tier.maxDays) return tier;
  }
  return RATE_TIERS[RATE_TIERS.length - 1];
}

/** Full price breakdown for a reservation */
export interface PriceBreakdown {
  area: number;          // m²
  days: number;
  dailyRate: number;     // R$/m²/day
  subtotal: number;      // area × dailyRate × days
  serviceFee: number;    // subtotal × 12%
  total: number;         // subtotal + serviceFee
  tierLabel: string;
}

export function calculatePrice(area: number, days: number): PriceBreakdown {
  const effectiveArea = Math.max(area, MIN_AREA);
  const dailyRate = getDailyRate(days);
  const subtotal = Math.round(effectiveArea * dailyRate * days * 100) / 100;
  const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE * 100) / 100;
  const total = Math.round((subtotal + serviceFee) * 100) / 100;
  const tier = getCurrentTier(days);

  return { area: effectiveArea, days, dailyRate, subtotal, serviceFee, total, tierLabel: tier.label };
}

/** Format currency BRL */
export function formatBRL(value: number): string {
  return `R$\u00A0${value.toFixed(2).replace(".", ",")}`;
}

/** Short pricing explanation used across the site */
export const PRICING_EXPLANATION =
  "O valor é calculado com base no espaço reservado e no período. Quanto maior o período, menor o valor proporcional por dia. A taxa de serviço (12%) é adicionada no checkout.";

export const PRICING_HINT_SHORT = "Reservas mais longas têm valor proporcional menor por dia.";
