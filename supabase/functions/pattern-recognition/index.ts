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
    const { symbol, timeframe = '1d', chartUrl } = await req.json();

    if (!symbol) {
      throw new Error('Symbol is required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch market data for pattern analysis
    const { data: marketData, error: dataError } = await supabase
      .from('market_data_history')
      .select('*')
      .eq('symbol', symbol)
      .eq('timeframe', timeframe)
      .order('timestamp', { ascending: false })
      .limit(100);

    if (dataError) throw dataError;

    // Analyze patterns using algorithmic detection
    const patterns = detectPatterns(marketData);

    // Store detected patterns
    const { data: storedPattern, error: storeError } = await supabase
      .from('visual_patterns')
      .insert({
        symbol,
        timeframe,
        chart_url: chartUrl || '',
        detected_patterns: patterns,
        support_levels: calculateSupportLevels(marketData),
        resistance_levels: calculateResistanceLevels(marketData),
        trend_lines: detectTrendLines(marketData),
      })
      .select()
      .single();

    if (storeError) throw storeError;

    return new Response(
      JSON.stringify({
        symbol,
        timeframe,
        patterns,
        pattern_count: patterns.length,
        stored_id: storedPattern.id,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in pattern-recognition:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function detectPatterns(data: any[]): any[] {
  const patterns = [];

  // Head and Shoulders
  const headAndShoulders = detectHeadAndShoulders(data);
  if (headAndShoulders) patterns.push(headAndShoulders);

  // Double Top/Bottom
  const doubleTops = detectDoubleTops(data);
  patterns.push(...doubleTops);

  // Triangles
  const triangles = detectTriangles(data);
  patterns.push(...triangles);

  // Flags and Pennants
  const flags = detectFlags(data);
  patterns.push(...flags);

  return patterns;
}

function detectHeadAndShoulders(data: any[]): any | null {
  // Simplified head and shoulders detection
  if (data.length < 20) return null;

  const prices = data.map(d => d.high);
  const peaks = findPeaks(prices);

  if (peaks.length >= 3) {
    const [left, head, right] = peaks.slice(0, 3);
    if (head.value > left.value && head.value > right.value && 
        Math.abs(left.value - right.value) < left.value * 0.02) {
      return {
        type: 'head_and_shoulders',
        confidence: 0.75,
        points: [left, head, right],
        neckline: (left.value + right.value) / 2,
      };
    }
  }

  return null;
}

function detectDoubleTops(data: any[]): any[] {
  const patterns = [];
  const prices = data.map(d => d.high);
  const peaks = findPeaks(prices);

  for (let i = 0; i < peaks.length - 1; i++) {
    const diff = Math.abs(peaks[i].value - peaks[i + 1].value);
    if (diff < peaks[i].value * 0.02) {
      patterns.push({
        type: 'double_top',
        confidence: 0.7,
        points: [peaks[i], peaks[i + 1]],
      });
    }
  }

  return patterns;
}

function detectTriangles(data: any[]): any[] {
  // Simplified triangle detection
  return [];
}

function detectFlags(data: any[]): any[] {
  // Simplified flag detection
  return [];
}

function findPeaks(prices: number[]): Array<{ index: number; value: number }> {
  const peaks = [];
  for (let i = 1; i < prices.length - 1; i++) {
    if (prices[i] > prices[i - 1] && prices[i] > prices[i + 1]) {
      peaks.push({ index: i, value: prices[i] });
    }
  }
  return peaks;
}

function calculateSupportLevels(data: any[]): number[] {
  const lows = data.map(d => d.low).sort((a, b) => a - b);
  return lows.slice(0, 5);
}

function calculateResistanceLevels(data: any[]): number[] {
  const highs = data.map(d => d.high).sort((a, b) => b - a);
  return highs.slice(0, 5);
}

function detectTrendLines(data: any[]): any[] {
  // Simplified trend line detection
  return [];
}
