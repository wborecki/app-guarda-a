import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Categories of prohibited items
const PROHIBITED_CATEGORIES = [
  "armas de fogo", "pistola", "revólver", "rifle", "espingarda", "metralhadora",
  "munição", "cartuchos", "projéteis",
  "explosivos", "dinamite", "granada", "fogos de artifício industriais", "pólvora",
  "drogas", "maconha", "cocaína", "crack", "heroína", "metanfetamina", "substâncias ilícitas",
  "combustível", "gasolina", "diesel", "querosene", "álcool combustível", "gás liquefeito", "botijão de gás",
  "produtos químicos perigosos", "ácido", "solvente industrial", "veneno", "pesticida", "agrotóxico",
  "material tóxico", "material corrosivo", "material radioativo", "material biológico",
  "animais vivos", "animais mortos",
  "alimentos perecíveis",
  "objetos roubados", "contrabando",
  "facas de combate", "espadas", "punhais", "armas brancas ofensivas",
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify JWT
    const token = authHeader.replace("Bearer ", "");
    const anonKey = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") || Deno.env.get("SUPABASE_ANON_KEY") || "";
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse request - expect base64 images
    const { images, reservationRef } = await req.json();

    if (!images || !Array.isArray(images) || images.length === 0) {
      return new Response(JSON.stringify({ error: "No images provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (images.length > 10) {
      return new Response(JSON.stringify({ error: "Maximum 10 images allowed" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build vision message with all images
    const imageContents = images.map((img: { base64: string; mimeType: string }, idx: number) => ({
      type: "image_url" as const,
      image_url: {
        url: `data:${img.mimeType};base64,${img.base64}`,
      },
    }));

    const systemPrompt = `You are a security compliance system for a storage rental platform called GuardaAí. Your job is to analyze photos of items that users want to store and determine if any prohibited or dangerous items are present.

PROHIBITED ITEMS (must be BLOCKED):
- Firearms (guns, pistols, revolvers, rifles, shotguns, machine guns, any type of gun)
- Ammunition (bullets, cartridges, shells, magazines)
- Explosives (dynamite, grenades, industrial fireworks, gunpowder, detonators)
- Illegal drugs and substances (marijuana, cocaine, crack, heroin, methamphetamine, any illicit substance)
- Flammable materials (gasoline, diesel, kerosene, fuel alcohol, liquefied gas, gas cylinders/tanks)
- Hazardous chemicals (acids, industrial solvents, poisons, pesticides)
- Toxic, corrosive, radioactive, or biological materials
- Live or dead animals
- Perishable food items
- Stolen goods or contraband
- Offensive weapons (combat knives, swords, daggers)

ALLOWED ITEMS (common storage items):
- Boxes, containers, suitcases, bags
- Furniture, appliances, electronics
- Documents, books, files
- Clothing, personal items
- Tools (common household/workshop tools)
- Sports equipment
- Musical instruments
- Art, decorations

DECISION RULES:
1. If ANY image clearly shows a prohibited item → verdict: "blocked"
2. If an image is ambiguous, unclear, or you cannot confidently determine the contents → verdict: "review"  
3. If ALL images clearly show only allowed items → verdict: "approved"
4. When in doubt, ALWAYS choose "review" over "approved". Safety first.
5. A single prohibited item in any photo blocks the entire submission.

You MUST respond using the provided tool/function.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze these ${images.length} photo(s) of items a user wants to store. Determine if any prohibited or dangerous items are present. Be conservative: if unsure, flag for review.`,
              },
              ...imageContents,
            ],
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "classify_items",
              description: "Classify the submitted item photos as approved, review, or blocked.",
              parameters: {
                type: "object",
                properties: {
                  verdict: {
                    type: "string",
                    enum: ["approved", "review", "blocked"],
                    description: "approved = all items clearly allowed. review = ambiguous or unclear items. blocked = prohibited items detected.",
                  },
                  confidence: {
                    type: "number",
                    description: "Confidence score from 0 to 1.",
                  },
                  reason: {
                    type: "string",
                    description: "Brief explanation of the decision in Portuguese (pt-BR).",
                  },
                  detected_items: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of items detected in the photos.",
                  },
                  flagged_items: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of prohibited or suspicious items detected, if any.",
                  },
                },
                required: ["verdict", "confidence", "reason", "detected_items", "flagged_items"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "classify_items" } },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Sistema sobrecarregado. Tente novamente em alguns instantes." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Serviço temporariamente indisponível." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // On AI failure, default to "review" (conservative)
      return new Response(JSON.stringify({
        verdict: "review",
        confidence: 0,
        reason: "Não foi possível concluir a análise automática. Seus itens serão avaliados manualmente.",
        detected_items: [],
        flagged_items: [],
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResult = await response.json();
    console.log("AI response:", JSON.stringify(aiResult));

    let classification = {
      verdict: "review" as string,
      confidence: 0,
      reason: "Análise inconclusiva. Itens encaminhados para revisão manual.",
      detected_items: [] as string[],
      flagged_items: [] as string[],
    };

    try {
      const toolCall = aiResult.choices?.[0]?.message?.tool_calls?.[0];
      if (toolCall?.function?.arguments) {
        const parsed = typeof toolCall.function.arguments === "string"
          ? JSON.parse(toolCall.function.arguments)
          : toolCall.function.arguments;
        
        classification = {
          verdict: parsed.verdict || "review",
          confidence: parsed.confidence || 0,
          reason: parsed.reason || "Análise concluída.",
          detected_items: parsed.detected_items || [],
          flagged_items: parsed.flagged_items || [],
        };

        // Safety net: low confidence approved → force review
        if (classification.verdict === "approved" && classification.confidence < 0.7) {
          classification.verdict = "review";
          classification.reason = "Confiança insuficiente na análise. Itens encaminhados para revisão manual.";
        }

        // Safety net: if flagged items exist but verdict is approved → force review
        if (classification.verdict === "approved" && classification.flagged_items.length > 0) {
          classification.verdict = "review";
          classification.reason = "Itens suspeitos detectados. Encaminhado para revisão manual.";
        }
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // Keep default "review" classification
    }

    // Store risk analysis in database
    const riskLevel = classification.verdict === "blocked" ? "high"
      : classification.verdict === "review" ? "medium"
      : "low";

    await supabase.from("risk_analyses").insert({
      user_id: user.id,
      reservation_ref: reservationRef || `TEMP-${Date.now()}`,
      status: classification.verdict === "approved" ? "approved"
        : classification.verdict === "blocked" ? "blocked"
        : "pending_review",
      risk_level: riskLevel,
      notes: JSON.stringify({
        reason: classification.reason,
        detected_items: classification.detected_items,
        flagged_items: classification.flagged_items,
        confidence: classification.confidence,
      }),
      reviewed_by: "auto",
      reviewed_at: new Date().toISOString(),
    });

    return new Response(JSON.stringify(classification), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("analyze-items error:", err);
    // On any error, default to review (conservative)
    return new Response(JSON.stringify({
      verdict: "review",
      confidence: 0,
      reason: "Erro na análise. Seus itens serão avaliados manualmente por segurança.",
      detected_items: [],
      flagged_items: [],
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
