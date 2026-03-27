import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  reviewer_name: string;
  reservation_id: string;
}

export function useReviews(spaceId?: string | null, hostId?: string | null) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [avgRating, setAvgRating] = useState(0);
  const [canReview, setCanReview] = useState(false);
  const [eligibleReservationId, setEligibleReservationId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = useCallback(async () => {
    setLoading(true);

    // Fetch reviews for this space or host
    let query = supabase
      .from("reviews")
      .select("id, rating, comment, created_at, reviewer_id, reservation_id")
      .order("created_at", { ascending: false })
      .limit(20);

    if (spaceId) {
      query = query.eq("space_id", spaceId);
    } else if (hostId) {
      query = query.eq("host_id", hostId);
    } else {
      setLoading(false);
      return;
    }

    const { data: reviewsData } = await query;

    if (reviewsData && reviewsData.length > 0) {
      // Fetch reviewer profiles
      const reviewerIds = [...new Set(reviewsData.map((r) => r.reviewer_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name")
        .in("user_id", reviewerIds);

      const profileMap = new Map(
        (profiles || []).map((p) => [p.user_id, p.display_name || "Usuário"])
      );

      const mapped: Review[] = reviewsData.map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        created_at: r.created_at,
        reviewer_name: profileMap.get(r.reviewer_id) || "Usuário",
        reservation_id: r.reservation_id,
      }));

      setReviews(mapped);

      const avg =
        mapped.reduce((sum, r) => sum + r.rating, 0) / mapped.length;
      setAvgRating(Math.round(avg * 10) / 10);
    } else {
      setReviews([]);
      setAvgRating(0);
    }

    setLoading(false);
  }, [spaceId, hostId]);

  // Check if current user can leave a review (has a completed reservation they haven't reviewed)
  useEffect(() => {
    if (!user || (!spaceId && !hostId)) return;

    const checkEligibility = async () => {
      // Find completed reservations by this user for this space/host
      let resQuery = supabase
        .from("reservations")
        .select("id")
        .eq("renter_id", user.id)
        .in("status", ["completed", "confirmed"]);

      if (hostId) {
        resQuery = resQuery.eq("host_id", hostId);
      }

      const { data: reservations } = await resQuery;

      if (!reservations || reservations.length === 0) {
        setCanReview(false);
        return;
      }

      // Check which ones already have reviews
      const resIds = reservations.map((r) => r.id);
      const { data: existingReviews } = await supabase
        .from("reviews")
        .select("reservation_id")
        .eq("reviewer_id", user.id)
        .in("reservation_id", resIds);

      const reviewedIds = new Set(
        (existingReviews || []).map((r) => r.reservation_id)
      );
      const unreviewedRes = reservations.find((r) => !reviewedIds.has(r.id));

      if (unreviewedRes) {
        setCanReview(true);
        setEligibleReservationId(unreviewedRes.id);
      } else {
        setCanReview(false);
      }
    };

    checkEligibility();
  }, [user, spaceId, hostId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const submitReview = async (rating: number, comment: string) => {
    if (!user || !eligibleReservationId) return false;

    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert({
      reservation_id: eligibleReservationId,
      space_id: spaceId || null,
      reviewer_id: user.id,
      host_id: hostId || user.id,
      rating,
      comment,
    });

    setSubmitting(false);

    if (error) {
      console.error("Review error:", error);
      return false;
    }

    setCanReview(false);
    setEligibleReservationId(null);
    await fetchReviews();
    return true;
  };

  return {
    reviews,
    avgRating,
    totalReviews: reviews.length,
    loading,
    canReview,
    submitting,
    submitReview,
  };
}
