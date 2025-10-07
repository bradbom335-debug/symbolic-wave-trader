import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Free API endpoints
const FREE_APIS = {
  // Alpha Vantage - free tier
  alpha_vantage: 'https://www.alphavantage.co/query',
  // Yahoo Finance alternative (free)
  yahoo_finance: 'https://query1.finance.yahoo.com/v8/finance/chart',
  // CoinGecko (crypto, free)
  coingecko: 'https://api.coingecko.com/api/v3',
  // Polygon.io (stocks, free tier)
  polygon: 'https://api.polygon.io/v2',
  // News API (free tier)
  news_api: 'https://newsapi.org/v2/everything',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symbol, data_type, timeframe } = await req.json();

    let aggregatedData: any = {
      symbol,
      timestamp: new Date().toISOString(),
      sources: []
    };

    // Fetch from multiple sources in parallel
    const fetchPromises = [];

    // Yahoo Finance (no API key required)
    fetchPromises.push(
      fetchYahooFinance(symbol, timeframe)
        .then(data => {
          aggregatedData.sources.push({ source: 'yahoo', data });
          aggregatedData.price_data = data;
        })
        .catch(err => console.error('Yahoo Finance error:', err))
    );

    // CoinGecko for crypto
    if (symbol.match(/USD|BTC|ETH/)) {
      fetchPromises.push(
        fetchCoinGecko(symbol)
          .then(data => {
            aggregatedData.sources.push({ source: 'coingecko', data });
            aggregatedData.crypto_data = data;
          })
          .catch(err => console.error('CoinGecko error:', err))
      );
    }

    // Wait for all fetches
    await Promise.allSettled(fetchPromises);

    // Aggregate and normalize data
    const normalized = normalizeMarketData(aggregatedData);

    return new Response(
      JSON.stringify({
        success: true,
        data: normalized,
        sources_used: aggregatedData.sources.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in market-data-aggregator:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

// Fetch from Yahoo Finance
async function fetchYahooFinance(symbol: string, timeframe: string): Promise<any> {
  const interval = timeframe === '1d' ? '1d' : '1h';
  const range = timeframe === '1d' ? '5d' : '1d';
  
  const url = `${FREE_APIS.yahoo_finance}/${symbol}?interval=${interval}&range=${range}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  if (data.chart?.result?.[0]) {
    const result = data.chart.result[0];
    const timestamps = result.timestamp || [];
    const quotes = result.indicators?.quote?.[0] || {};
    
    return {
      timestamps,
      open: quotes.open || [],
      high: quotes.high || [],
      low: quotes.low || [],
      close: quotes.close || [],
      volume: quotes.volume || []
    };
  }
  
  return null;
}

// Fetch from CoinGecko
async function fetchCoinGecko(symbol: string): Promise<any> {
  // Convert symbol to CoinGecko ID
  const coinId = symbol.toLowerCase().replace(/usd|usdt/, '');
  
  const url = `${FREE_APIS.coingecko}/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_vol=true&include_24hr_change=true&include_market_cap=true`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  return data[coinId] || null;
}

// Normalize data from different sources
function normalizeMarketData(rawData: any): any {
  const normalized: any = {
    symbol: rawData.symbol,
    timestamp: rawData.timestamp,
    current_price: null,
    change_24h: null,
    volume_24h: null,
    market_cap: null,
    ohlcv: []
  };

  // Extract from Yahoo Finance
  if (rawData.price_data) {
    const { close, volume, timestamps, high, low, open } = rawData.price_data;
    
    if (close && close.length > 0) {
      normalized.current_price = close[close.length - 1];
      
      if (close.length > 1) {
        normalized.change_24h = ((close[close.length - 1] - close[0]) / close[0]) * 100;
      }
      
      // Create OHLCV array
      normalized.ohlcv = timestamps.map((ts: number, i: number) => ({
        timestamp: ts * 1000,
        open: open?.[i],
        high: high?.[i],
        low: low?.[i],
        close: close?.[i],
        volume: volume?.[i]
      }));
    }
    
    if (volume && volume.length > 0) {
      normalized.volume_24h = volume.reduce((a: number, b: number) => a + b, 0);
    }
  }

  // Extract from CoinGecko
  if (rawData.crypto_data) {
    normalized.current_price = normalized.current_price || rawData.crypto_data.usd;
    normalized.change_24h = normalized.change_24h || rawData.crypto_data.usd_24h_change;
    normalized.volume_24h = normalized.volume_24h || rawData.crypto_data.usd_24h_vol;
    normalized.market_cap = rawData.crypto_data.usd_market_cap;
  }

  return normalized;
}
