import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AlphaVantageQuoteResponse {
  'Global Quote': {
    '01. symbol': string;
    '02. open': string;
    '03. high': string;
    '04. low': string;
    '05. price': string;
    '06. volume': string;
    '07. latest trading day': string;
    '08. previous close': string;
    '09. change': string;
    '10. change percent': string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symbol, operation } = await req.json();
    const ALPHA_VANTAGE_API_KEY = Deno.env.get('ALPHA_VANTAGE_API_KEY');
    
    if (!ALPHA_VANTAGE_API_KEY) {
      throw new Error('ALPHA_VANTAGE_API_KEY not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let response;

    switch (operation) {
      case 'quote':
        response = await fetchQuote(symbol, ALPHA_VANTAGE_API_KEY, supabase);
        break;
      case 'indicators':
        response = await fetchIndicators(symbol, ALPHA_VANTAGE_API_KEY, supabase);
        break;
      case 'fundamentals':
        response = await fetchFundamentals(symbol, ALPHA_VANTAGE_API_KEY, supabase);
        break;
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Alpha Vantage integration error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function fetchQuote(symbol: string, apiKey: string, supabase: any) {
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
  
  const response = await fetch(url);
  const data: AlphaVantageQuoteResponse = await response.json();
  
  if (!data['Global Quote'] || Object.keys(data['Global Quote']).length === 0) {
    throw new Error('No data returned from Alpha Vantage');
  }

  const quote = data['Global Quote'];
  
  // Store in market_data_history
  await supabase.from('market_data_history').insert({
    symbol,
    timeframe: '1d',
    timestamp: new Date(quote['07. latest trading day']),
    open: parseFloat(quote['02. open']),
    high: parseFloat(quote['03. high']),
    low: parseFloat(quote['04. low']),
    close: parseFloat(quote['05. price']),
    volume: parseInt(quote['06. volume']),
    data_source: 'alpha_vantage'
  }).select();

  return {
    symbol: quote['01. symbol'],
    price: parseFloat(quote['05. price']),
    open: parseFloat(quote['02. open']),
    high: parseFloat(quote['03. high']),
    low: parseFloat(quote['04. low']),
    volume: parseInt(quote['06. volume']),
    change: parseFloat(quote['09. change']),
    changePercent: quote['10. change percent']
  };
}

async function fetchIndicators(symbol: string, apiKey: string, supabase: any) {
  const indicators = ['RSI', 'MACD', 'SMA', 'EMA', 'BBANDS'];
  const results: any = {};

  for (const indicator of indicators) {
    try {
      let url = '';
      
      switch (indicator) {
        case 'RSI':
          url = `https://www.alphavantage.co/query?function=RSI&symbol=${symbol}&interval=daily&time_period=14&series_type=close&apikey=${apiKey}`;
          break;
        case 'MACD':
          url = `https://www.alphavantage.co/query?function=MACD&symbol=${symbol}&interval=daily&series_type=close&apikey=${apiKey}`;
          break;
        case 'SMA':
          url = `https://www.alphavantage.co/query?function=SMA&symbol=${symbol}&interval=daily&time_period=20&series_type=close&apikey=${apiKey}`;
          break;
        case 'EMA':
          url = `https://www.alphavantage.co/query?function=EMA&symbol=${symbol}&interval=daily&time_period=20&series_type=close&apikey=${apiKey}`;
          break;
        case 'BBANDS':
          url = `https://www.alphavantage.co/query?function=BBANDS&symbol=${symbol}&interval=daily&time_period=20&series_type=close&apikey=${apiKey}`;
          break;
      }

      const response = await fetch(url);
      const data = await response.json();
      
      // Rate limit: Free tier allows 5 calls/minute
      await new Promise(resolve => setTimeout(resolve, 12000));

      const technicalKey = `Technical Analysis: ${indicator}`;
      if (data[technicalKey]) {
        const latestDate = Object.keys(data[technicalKey])[0];
        results[indicator] = data[technicalKey][latestDate];

        // Store in database
        await supabase.from('technical_indicators').insert({
          symbol,
          timestamp: new Date(latestDate),
          indicator_type: indicator,
          timeframe: 'daily',
          values: data[technicalKey][latestDate]
        }).select();
      }
    } catch (error) {
      console.error(`Error fetching ${indicator}:`, error);
      results[indicator] = { error: error.message };
    }
  }

  return results;
}

async function fetchFundamentals(symbol: string, apiKey: string, supabase: any) {
  const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKey}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  return {
    companyName: data.Name,
    sector: data.Sector,
    industry: data.Industry,
    marketCap: data.MarketCapitalization,
    pe: data.PERatio,
    eps: data.EPS,
    dividend: data.DividendYield,
    description: data.Description
  };
}
