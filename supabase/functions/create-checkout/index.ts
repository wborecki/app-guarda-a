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
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: authData } = await supabaseClient.auth.getUser(token);
    const user = authData.user;
    if (!user?.email) throw new Error("Usuário não autenticado");

    const {
      spaceName, spaceLocation, volume, days,
      startDate, endDate, totalPrice, subtotal,
      cleaningFee, hostId, spaceId,
    } = await req.json();

    if (!totalPrice || totalPrice <= 0) throw new Error("Valor total inválido");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId: string | undefined;
    if (customers.data.length > 0) customerId = customers.data[0].id;

    const { data: reservation, error: resError } = await supabaseClient
      .from("reservations")
      .insert({
        renter_id: user.id,
        host_id: hostId || user.id,
        space_id: spaceId || null,
        start_date: startDate,
        end_date: endDate,
        volume: volume,
        total_price: totalPrice,
        status: "pending",
        notes: `Espaço: ${spaceName} | ${spaceLocation}`,
      })
      .select("id")
      .single();

    if (resError) throw new Error(`Erro ao criar reserva: ${resError.message}`);

    const lineItems: any[] = [
      {
        price_data: {
          currency: "brl",
          product_data: {
            name: `Reserva de espaço – ${spaceName}`,
            description: `${volume} m³ por ${days} dia${days !== 1 ? "s" : ""} · ${spaceLocation}`,
          },
          unit_amount: Math.round(subtotal * 100),
        },
        quantity: 1,
      },
    ];

    // Add cleaning fee line item if applicable
    if (cleaningFee && cleaningFee > 0) {
      lineItems.push({
        price_data: {
          currency: "brl",
          product_data: { name: "Taxa de limpeza" },
          unit_amount: Math.round(cleaningFee * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: lineItems,
      mode: "payment",
      payment_method_types: ["card"],
      metadata: {
        reservation_id: reservation.id,
        renter_id: user.id,
        host_id: hostId || user.id,
      },
      success_url: `${req.headers.get("origin")}/pagamento-sucesso?session_id={CHECKOUT_SESSION_ID}&reservation_id=${reservation.id}`,
      cancel_url: `${req.headers.get("origin")}/checkout`,
    });

    return new Response(
      JSON.stringify({ url: session.url, reservationId: reservation.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("create-checkout error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
