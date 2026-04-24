import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const TOOL = {
  type: "function",
  function: {
    name: "emit_portfolio_optimization",
    description: "Emit a structured portfolio analysis with rebalancing and risk-aligned suggestions.",
    parameters: {
      type: "object",
      properties: {
        overall_score: { type: "number", minimum: 0, maximum: 100 },
        diversification_score: { type: "number", minimum: 0, maximum: 100 },
        risk_score: { type: "number", minimum: 0, maximum: 100, description: "Higher means riskier." },
        concentration_warning: { type: "string" },
        sector_exposure: {
          type: "array",
          items: {
            type: "object",
            properties: {
              sector: { type: "string" },
              weight_pct: { type: "number" },
              comment: { type: "string" },
            },
            required: ["sector", "weight_pct"],
            additionalProperties: false,
          },
        },
        suggestions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              action: { type: "string", enum: ["buy", "sell", "trim", "add", "hold", "hedge"] },
              symbol: { type: "string" },
              target_weight_pct: { type: "number" },
              rationale: { type: "string" },
              priority: { type: "string", enum: ["low", "medium", "high"] },
            },
            required: ["action", "symbol", "rationale", "priority"],
            additionalProperties: false,
          },
        },
        rebalanced_allocation: {
          type: "array",
          items: {
            type: "object",
            properties: {
              symbol: { type: "string" },
              current_weight_pct: { type: "number" },
              target_weight_pct: { type: "number" },
            },
            required: ["symbol", "current_weight_pct", "target_weight_pct"],
            additionalProperties: false,
          },
        },
        summary: { type: "string" },
      },
      required: ["overall_score", "diversification_score", "risk_score", "suggestions", "summary"],
      additionalProperties: false,
    },
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const body = await req.json().catch(() => ({}));
    const holdings = Array.isArray(body.holdings) ? body.holdings : [];
    const riskTolerance: string = body.riskTolerance || "moderate";
    const goals: string = body.goals || "long-term capital growth";

    if (holdings.length === 0) {
      return new Response(JSON.stringify({ error: "No holdings provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `You are a senior portfolio strategist.
Analyze holdings, sector exposure, concentration, and risk vs. goals.
Output ONLY one call to emit_portfolio_optimization.
Be specific and actionable. Use realistic weights summing to 100.`;

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
          { role: "user", content: JSON.stringify({ holdings, riskTolerance, goals }) },
        ],
        tools: [TOOL],
        tool_choice: { type: "function", function: { name: "emit_portfolio_optimization" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data?.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      return new Response(JSON.stringify({ error: "Model returned no analysis" }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const parsed = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("portfolio-optimizer error", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
