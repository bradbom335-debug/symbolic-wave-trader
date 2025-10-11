import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Find predictions that need evaluation
    const { data: predictions, error: fetchError } = await supabase
      .from('agent_predictions')
      .select('*')
      .is('evaluated', null)
      .lt('prediction_time', getTargetTime('1h'))
      .limit(100);

    if (fetchError) throw fetchError;

    const results = [];

    for (const prediction of predictions || []) {
      try {
        // Get actual price data
        const targetTime = getTargetTime(prediction.target_timeframe, prediction.prediction_time);
        
        const { data: actualData, error: priceError } = await supabase
          .from('market_data_history')
          .select('close')
          .eq('symbol', prediction.symbol)
          .gte('timestamp', targetTime)
          .order('timestamp', { ascending: true })
          .limit(1)
          .single();

        if (priceError || !actualData) continue;

        const predictionPrice = prediction.market_data_snapshot?.price || 0;
        const actualPrice = actualData.close;
        const priceChange = ((actualPrice - predictionPrice) / predictionPrice) * 100;

        let actualDirection = 'neutral';
        if (priceChange > 0.5) actualDirection = 'bullish';
        else if (priceChange < -0.5) actualDirection = 'bearish';

        const directionalAccuracy = prediction.direction === actualDirection;
        const magnitudeError = Math.abs(prediction.confidence * 100 - Math.abs(priceChange));

        // Store outcome
        const { error: outcomeError } = await supabase
          .from('prediction_outcomes')
          .insert({
            prediction_id: prediction.id,
            actual_direction: actualDirection,
            actual_price_change: priceChange,
            directional_accuracy,
            magnitude_error: magnitudeError
          });

        if (!outcomeError) {
          results.push({ prediction_id: prediction.id, accuracy: directionalAccuracy });
        }

      } catch (error) {
        console.error(`Error evaluating prediction ${prediction.id}:`, error);
      }
    }

    // Update agent performance metrics
    await updateAgentPerformance(supabase);

    return new Response(
      JSON.stringify({ success: true, evaluated: results.length, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Outcome tracker error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function getTargetTime(timeframe: string, fromTime?: string): Date {
  const baseTime = fromTime ? new Date(fromTime) : new Date();
  const now = new Date();

  switch (timeframe) {
    case '1h':
      return new Date(now.getTime() - 60 * 60 * 1000);
    case '24h':
      return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    case '7d':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    default:
      return new Date(now.getTime() - 60 * 60 * 1000);
  }
}

async function updateAgentPerformance(supabase: any) {
  // Get all agents
  const { data: agents } = await supabase.from('ai_agents').select('id');

  const periodEnd = new Date();
  const periodStart = new Date(periodEnd.getTime() - 30 * 24 * 60 * 60 * 1000); // Last 30 days

  for (const agent of agents || []) {
    // Get predictions with outcomes
    const { data: predictions } = await supabase
      .from('agent_predictions')
      .select('*, prediction_outcomes(*)')
      .eq('agent_id', agent.id)
      .gte('prediction_time', periodStart.toISOString())
      .lte('prediction_time', periodEnd.toISOString());

    if (!predictions || predictions.length === 0) continue;

    const withOutcomes = predictions.filter(p => p.prediction_outcomes && p.prediction_outcomes.length > 0);
    const correctPredictions = withOutcomes.filter(p => p.prediction_outcomes[0].directional_accuracy).length;
    const totalPredictions = withOutcomes.length;
    const accuracy = totalPredictions > 0 ? correctPredictions / totalPredictions : 0;
    const avgConfidence = predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length;

    // Store performance metrics
    await supabase.from('agent_performance').upsert({
      agent_id: agent.id,
      period_start: periodStart.toISOString(),
      period_end: periodEnd.toISOString(),
      total_predictions: totalPredictions,
      correct_predictions: correctPredictions,
      accuracy,
      avg_confidence: avgConfidence,
      confidence_calibration: Math.abs(avgConfidence - accuracy),
      performance_by_symbol: {},
      performance_by_timeframe: {}
    }, {
      onConflict: 'agent_id,period_start,period_end'
    });
  }
}
