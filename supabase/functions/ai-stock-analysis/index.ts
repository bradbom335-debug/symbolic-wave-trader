import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ANALYSIS_TOOL = {
  type: "function",
  function: {
    name: "emit_stock_analysis",
    description:
      "Emit a structured technical + fundamental + sentiment analysis for a single stock, including detected chart patterns, short and long term price predictions, and an actionable recommendation.",
    parameters: {
      type: "object",
      properties: {
        symbol: { type: "string" },
        as_of: { type: "string", description: "ISO timestamp of the analysis." },
        summary: {
          type: "string",
          description: "1-2 sentence plain-English summary of the current setup.",
        },
        patterns: {
          type: "array",
          description: "Detected chart patterns ranked by confidence (0-1).",
          items: {
            type: "object",
            properties: {
              name: {
                type: "string",
                enum: [
                  "head_and_shoulders",
                  "inverse_head_and_shoulders",
                  "double_top",
                  "double_bottom",
                  "triple_top",
                  "triple_bottom",
                  "ascending_triangle",
                  "descending_triangle",
                  "symmetrical_triangle",
                  "bull_flag",
                  "bear_flag",
                  "bullish_pennant",
                  "bearish_pennant",
                  "cup_and_handle",
                  "rising_wedge",
                  "falling_wedge",
                  "channel_up",
                  "channel_down",
                ],
              },
              direction: { type: "string", enum: ["bullish", "bearish", "neutral"] },
              confidence: { type: "number", minimum: 0, maximum: 1 },
              start_index: { type: "number" },
              end_index: { type: "number" },
              target_price: { type: "number" },
              invalidation_price: { type: "number" },
              note: { type: "string" },
            },
            required: ["name", "direction", "confidence", "note"],
            additionalProperties: false,
          },
        },
        sentiment: {
          type: "object",
          properties: {
            score: {
              type: "number",
              minimum: -1,
              maximum: 1,
              description: "-1 very bearish, 0 neutral, +1 very bullish.",
            },
            label: {
              type: "string",
              enum: ["very_bearish", "bearish", "neutral", "bullish", "very_bullish"],
            },
            news_summary: { type: "string" },
            social_summary: { type: "string" },
            options_flow_summary: { type: "string" },
            unusual_options_activity: { type: "boolean" },
          },
          required: ["score", "label", "news_summary"],
          additionalProperties: false,
        },
        predictions: {
          type: "object",
          properties: {
            short_term_7d: {
              type: "object",
              properties: {
                target_price: { type: "number" },
                low: { type: "number" },
                high: { type: "number" },
                expected_change_pct: { type: "number" },
                confidence: { type: "number", minimum: 0, maximum: 1 },
                rationale: { type: "string" },
              },
              required: ["target_price", "expected_change_pct", "confidence", "rationale"],
              additionalProperties: false,
            },
            long_term_90d: {
              type: "object",
              properties: {
                target_price: { type: "number" },
                low: { type: "number" },
                high: { type: "number" },
                expected_change_pct: { type: "number" },
                confidence: { type: "number", minimum: 0, maximum: 1 },
                rationale: { type: "string" },
              },
              required: ["target_price", "expected_change_pct", "confidence", "rationale"],
              additionalProperties: false,
            },
          },
          required: ["short_term_7d", "long_term_90d"],
          additionalProperties: false,
        },
        recommendation: {
          type: "object",
          properties: {
            action: {
              type: "string",
              enum: ["strong_buy", "buy", "hold", "sell", "strong_sell"],
            },
            confidence: { type: "number", minimum: 0, maximum: 1 },
            time_horizon: {
              type: "string",
              enum: ["intraday", "swing", "position", "long_term"],
            },
            entry_zone: {
              type: "object",
              properties: {
                low: { type: "number" },
                high: { type: "number" },
              },
              additionalProperties: false,
            },
            stop_loss: { type: "number" },
            take_profits: { type: "array", items: { type: "number" } },
            rationale: { type: "string" },
          },
          required: ["action", "confidence", "time_horizon", "rationale"],
          additionalProperties: false,
        },
        key_levels: {
          type: "object",
          properties: {
            support: { type: "array", items: { type: "number" } },
            resistance: { type: "array", items: { type: "number" } },
          },
          additionalProperties: false,
        },
      },
      required: [
        "symbol",
        "summary",
        "patterns",
        "sentiment",
        "predictions",
        "recommendation",
      ],
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
    const symbol: string = (body.symbol || "AAPL").toString().toUpperCase();
    const currentPrice: number | undefined = body.currentPrice;
    const recentBars: Array<{ t?: string; o?: number; h?: number; l?: number; c: number; v?: number }> =
      Array.isArray(body.recentBars) ? body.recentBars.slice(-120) : [];
    const newsHeadlines: string[] = Array.isArray(body.newsHeadlines)
      ? body.newsHeadlines.slice(0, 12)
      : [];
    const optionsFlow: any = body.optionsFlow ?? null;

    const userPayload = {
      symbol,
      currentPrice,
      recentBars,
      newsHeadlines,
      optionsFlow,
    };

    const systemPrompt = `You are a senior quantitative equity analyst.
Analyze the supplied price series, news, and options flow for the given symbol.
- Detect classical chart patterns and rate confidence honestly.
- Produce realistic 7-day and 90-day price targets with low/high bands.
- Score sentiment from news and options flow.
- Output ONE call to emit_stock_analysis. Never write prose outside the tool call.
- If data is sparse, lower confidences and say so in rationale.`;

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
          { role: "user", content: JSON.stringify(userPayload) },
        ],
        tools: [ANALYSIS_TOOL],
        tool_choice: { type: "function", function: { name: "emit_stock_analysis" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limited. Try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Add funds in Workspace > Usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const t = await response.text();
      console.error("AI gateway error", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data?.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      console.error("No tool call returned", JSON.stringify(data).slice(0, 500));
      return new Response(JSON.stringify({ error: "Model returned no analysis" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let analysis: any;
    try {
      analysis = JSON.parse(toolCall.function.arguments);
    } catch (e) {
      return new Response(JSON.stringify({ error: "Bad analysis JSON" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    analysis.as_of = analysis.as_of || new Date().toISOString();
    analysis.symbol = symbol;

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-stock-analysis error", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
