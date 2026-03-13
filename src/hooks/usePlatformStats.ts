import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PlatformStats {
  spaces_count: number;
  reservations_count: number;
  cities_count: number;
}

const FALLBACK: PlatformStats = { spaces_count: 150, reservations_count: 2400, cities_count: 12 };
const CACHE_KEY = "guardaai_platform_stats";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function usePlatformStats() {
  const [stats, setStats] = useState<PlatformStats>(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, ts } = JSON.parse(cached);
        if (Date.now() - ts < CACHE_TTL) return data;
      }
    } catch {}
    return FALLBACK;
  });

  useEffect(() => {
    supabase.rpc("get_platform_stats").then(({ data, error }) => {
      if (!error && data) {
        const parsed = typeof data === "string" ? JSON.parse(data) : data;
        // Use fallback minimums so counters never show 0
        const result: PlatformStats = {
          spaces_count: Math.max(parsed.spaces_count ?? 0, FALLBACK.spaces_count),
          reservations_count: Math.max(parsed.reservations_count ?? 0, FALLBACK.reservations_count),
          cities_count: Math.max(parsed.cities_count ?? 0, FALLBACK.cities_count),
        };
        setStats(result);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ data: result, ts: Date.now() }));
        } catch {}
      }
    });
  }, []);

  return stats;
}
