import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: authData } = await supabaseClient.auth.getUser(token);
    const user = authData.user;
    if (!user) throw new Error("Usuário não autenticado");

    const { sessionId, reservationId } = await req.json();
    if (!sessionId || !reservationId) throw new Error("Parâmetros faltando");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return new Response(
        JSON.stringify({ verified: false, status: session.payment_status }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    await supabaseAdmin.from("reservations").update({ status: "confirmed" }).eq("id", reservationId);

    const { data: reservation } = await supabaseAdmin
      .from("reservations").select("*").eq("id", reservationId).single();

    if (reservation) {
      await supabaseAdmin.from("payments").insert({
        reservation_id: reservationId,
        payer_id: reservation.renter_id,
        recipient_id: reservation.host_id,
        amount: reservation.total_price,
        platform_fee: 0,
        status: "paid",
        payment_method: session.payment_method_types?.[0] || "card",
        paid_at: new Date().toISOString(),
      });
    }

    return new Response(
      JSON.stringify({ verified: true, status: "paid" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("verify-payment error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
