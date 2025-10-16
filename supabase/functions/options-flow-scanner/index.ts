import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symbol, minPremium = 50000, lookbackHours = 24 } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // In production, this would integrate with options data providers
    // For now, we'll demonstrate the data structure

    const cutoffTime = new Date(Date.now() - lookbackHours * 60 * 60 * 1000);

    // Query existing unusual options activity
    const { data: existingFlows, error: queryError } = await supabase
      .from('options_flow')
      .select('*')
      .gte('detected_at', cutoffTime.toISOString())
      .eq('is_unusual', true)
      .order('detected_at', { ascending: false })
      .limit(100);

    if (queryError) throw queryError;

    // Detect unusual activity based on criteria:
    // 1. Premium > threshold
    // 2. Volume spike (would need historical data)
    // 3. Unusual trade types (sweeps, blocks)
    const unusualFlows = existingFlows?.filter(flow => {
      const premium = flow.premium || 0;
      const isLargePremium = premium >= minPremium;
      const isUnusualType = ['sweep', 'block'].includes(flow.trade_type);
      
      return isLargePremium || isUnusualType;
    }) || [];

    // Calculate aggregate sentiment
    const sentiment = {
      bullish: unusualFlows.filter(f => f.sentiment === 'bullish').length,
      bearish: unusualFlows.filter(f => f.sentiment === 'bearish').length,
      neutral: unusualFlows.filter(f => f.sentiment === 'neutral').length,
    };

    const totalPremium = unusualFlows.reduce((sum, f) => sum + (f.premium || 0), 0);

    return new Response(
      JSON.stringify({
        flows: unusualFlows,
        summary: {
          total_flows: unusualFlows.length,
          total_premium: totalPremium,
          sentiment,
          timeframe: `${lookbackHours}h`,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in options-flow-scanner:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
