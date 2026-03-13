/**
 * Utilities for encoding/decoding search params in URL query strings.
 * This replaces the fragile location.state approach so searches survive page reloads.
 */

import type { StorageMode } from "@/data/vehicleCategories";

export interface SearchParams {
  location: string;
  days: number;
  hours?: number;
  totalVol: number;
  deliveryDate?: string;
  deliveryTime?: string;
  pickupDate?: string;
  pickupTime?: string;
  mode?: StorageMode;
  vehicleId?: string;
}

/** Encode search params into a URLSearchParams string */
export function encodeSearchParams(params: SearchParams): string {
  const sp = new URLSearchParams();
  if (params.location) sp.set("loc", params.location);
  if (params.days) sp.set("days", String(params.days));
  if (params.hours) sp.set("hours", String(params.hours));
  if (params.totalVol) sp.set("vol", String(params.totalVol));
  if (params.deliveryDate) sp.set("from", params.deliveryDate);
  if (params.deliveryTime) sp.set("fromT", params.deliveryTime);
  if (params.pickupDate) sp.set("to", params.pickupDate);
  if (params.pickupTime) sp.set("toT", params.pickupTime);
  if (params.mode && params.mode !== "objects") sp.set("mode", params.mode);
  if (params.vehicleId) sp.set("vid", params.vehicleId);
  return sp.toString();
}

/** Decode search params from URL query string, with fallback to location.state for backward compat */
export function decodeSearchParams(
  searchString: string,
  locationState?: any
): SearchParams {
  const sp = new URLSearchParams(searchString);

  const location = sp.get("loc") || locationState?.location || "Não informado";
  const days = Number(sp.get("days")) || locationState?.days || 1;
  const hours = Number(sp.get("hours")) || locationState?.hours || 0;
  const totalVol = Number(sp.get("vol")) || locationState?.totalVol || 0;
  const deliveryDate = sp.get("from") || locationState?.deliveryDate || undefined;
  const deliveryTime = sp.get("fromT") || locationState?.deliveryTime || undefined;
  const pickupDate = sp.get("to") || locationState?.pickupDate || undefined;
  const pickupTime = sp.get("toT") || locationState?.pickupTime || undefined;
  const mode = (sp.get("mode") as StorageMode) || locationState?.mode || "objects";
  const vehicleId = sp.get("vid") || locationState?.vehicleId || undefined;

  return { location, days, hours, totalVol, deliveryDate, deliveryTime, pickupDate, pickupTime, mode, vehicleId };
}
