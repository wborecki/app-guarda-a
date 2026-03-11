import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Você é a assistente virtual da GuardaAí, uma plataforma brasileira de autoarmazenamento compartilhado (peer-to-peer storage).

Seu papel é ajudar os usuários com dúvidas sobre:
- Como funciona a plataforma (buscar espaços, reservar, guardar itens)
- Preços (base de R$45/m³ por mês)
- Segurança (fotos obrigatórias, termos de responsabilidade, intermediação digital)
- Anunciar espaço como anfitrião
- Pagamentos e reservas
- Itens proibidos (drogas, armas, explosivos, perecíveis, animais, itens ilegais)
- Termos de uso e políticas

Diretrizes:
- Seja sempre educada, clara e objetiva
- Responda em português do Brasil
- Use um tom amigável e profissional
- Se não souber algo específico, sugira que o usuário entre em contato pelo e-mail contato@guardaai.com
- Nunca invente informações sobre preços ou políticas que não foram mencionadas acima
- Mantenha respostas concisas (máximo 3-4 parágrafos)
- Use markdown quando ajudar na clareza (listas, negrito)`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Muitas solicitações. Tente novamente em alguns segundos." }), {
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
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erro no serviço de atendimento." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat-support error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
