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
    const { symbols } = await req.json();
    const NEWS_API_KEY = Deno.env.get('NEWS_API_KEY');
    const GOOGLE_CLOUD_API_KEY = Deno.env.get('GOOGLE_CLOUD_API_KEY');
    
    if (!NEWS_API_KEY || !GOOGLE_CLOUD_API_KEY) {
      throw new Error('NEWS_API_KEY or GOOGLE_CLOUD_API_KEY not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const results = [];

    for (const symbol of symbols) {
      try {
        // Fetch news from News API
        const newsUrl = `https://newsapi.org/v2/everything?q=${symbol}&sortBy=publishedAt&pageSize=10&apiKey=${NEWS_API_KEY}`;
        const newsResponse = await fetch(newsUrl);
        const newsData = await newsResponse.json();

        if (newsData.articles) {
          for (const article of newsData.articles) {
            // Analyze sentiment using Google Natural Language API
            const sentiment = await analyzeSentiment(article.title + ' ' + article.description, GOOGLE_CLOUD_API_KEY);
            
            // Extract entities
            const entities = await extractEntities(article.title + ' ' + article.description, GOOGLE_CLOUD_API_KEY);
            
            // Store in database
            const { data, error } = await supabase.from('market_news').insert({
              title: article.title,
              description: article.description,
              content: article.content,
              url: article.url,
              source: article.source.name,
              published_at: article.publishedAt,
              symbols: [symbol],
              entities: entities,
              sentiment_score: sentiment.score,
              sentiment_magnitude: sentiment.magnitude,
              topics: []
            }).select();

            if (!error && data) {
              results.push(data[0]);
            }
          }
        }
      } catch (error) {
        console.error(`Error processing news for ${symbol}:`, error);
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return new Response(
      JSON.stringify({ success: true, processed: results.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('News sentiment aggregator error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function analyzeSentiment(text: string, apiKey: string) {
  const url = `https://language.googleapis.com/v1/documents:analyzeSentiment?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      document: {
        type: 'PLAIN_TEXT',
        content: text
      },
      encodingType: 'UTF8'
    })
  });

  const data = await response.json();
  
  return {
    score: data.documentSentiment?.score || 0,
    magnitude: data.documentSentiment?.magnitude || 0
  };
}

async function extractEntities(text: string, apiKey: string) {
  const url = `https://language.googleapis.com/v1/documents:analyzeEntities?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      document: {
        type: 'PLAIN_TEXT',
        content: text
      },
      encodingType: 'UTF8'
    })
  });

  const data = await response.json();
  
  return {
    entities: data.entities?.slice(0, 10).map((e: any) => ({
      name: e.name,
      type: e.type,
      salience: e.salience
    })) || []
  };
}
