import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symbol, timeframes = ['1m', '5m', '15m', '1h', '4h', '1d'] } = await req.json();

    if (!symbol) {
      throw new Error('Symbol is required');
    }

    const ALPHA_VANTAGE_KEY = Deno.env.get('ALPHA_VANTAGE_API_KEY');
    
    // Fetch data for all timeframes in parallel
    const promises = timeframes.map(async (timeframe: string) => {
      const interval = mapTimeframeToInterval(timeframe);
      const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval}&apikey=${ALPHA_VANTAGE_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      return {
        timeframe,
        data: parseTimeSeriesData(data, interval),
      };
    });

    const results = await Promise.all(promises);

    return new Response(
      JSON.stringify({
        symbol,
        timeframes: results,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in multi-timeframe-aggregator:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function mapTimeframeToInterval(timeframe: string): string {
  const mapping: Record<string, string> = {
    '1m': '1min',
    '5m': '5min',
    '15m': '15min',
    '30m': '30min',
    '1h': '60min',
    '4h': '60min', // Will need to aggregate
    '1d': 'daily',
  };
  return mapping[timeframe] || '5min';
}

function parseTimeSeriesData(data: any, interval: string): any[] {
  const timeSeriesKey = interval === 'daily' 
    ? 'Time Series (Daily)' 
    : `Time Series (${interval})`;
  
  const timeSeries = data[timeSeriesKey];
  
  if (!timeSeries) {
    return [];
  }

  return Object.entries(timeSeries).slice(0, 100).map(([timestamp, values]: [string, any]) => ({
    timestamp,
    open: parseFloat(values['1. open']),
    high: parseFloat(values['2. high']),
    low: parseFloat(values['3. low']),
    close: parseFloat(values['4. close']),
    volume: parseInt(values['5. volume']),
  }));
}
