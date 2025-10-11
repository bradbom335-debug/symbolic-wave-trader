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

    // Extract entities from recent news
    const { data: news } = await supabase
      .from('market_news')
      .select('*')
      .gte('published_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('published_at', { ascending: false })
      .limit(100);

    const nodeMap = new Map();
    const edges = [];

    for (const article of news || []) {
      // Create nodes for symbols
      for (const symbol of article.symbols || []) {
        if (!nodeMap.has(`asset_${symbol}`)) {
          const { data } = await supabase
            .from('kg_nodes')
            .upsert({
              entity_type: 'asset',
              entity_name: symbol,
              description: `Stock symbol ${symbol}`,
              metadata: {},
              importance_score: 0.7
            }, {
              onConflict: 'entity_type,entity_name'
            })
            .select()
            .single();
          
          if (data) nodeMap.set(`asset_${symbol}`, data.id);
        }
      }

      // Create nodes for entities
      if (article.entities && article.entities.entities) {
        for (const entity of article.entities.entities) {
          const entityKey = `${entity.type}_${entity.name}`;
          if (!nodeMap.has(entityKey)) {
            const { data } = await supabase
              .from('kg_nodes')
              .upsert({
                entity_type: entity.type.toLowerCase(),
                entity_name: entity.name,
                description: `Entity from news: ${entity.name}`,
                metadata: { salience: entity.salience },
                importance_score: entity.salience
              }, {
                onConflict: 'entity_type,entity_name'
              })
              .select()
              .single();
            
            if (data) nodeMap.set(entityKey, data.id);
          }

          // Create edges between symbols and entities
          for (const symbol of article.symbols || []) {
            const sourceId = nodeMap.get(`asset_${symbol}`);
            const targetId = nodeMap.get(entityKey);
            
            if (sourceId && targetId) {
              edges.push({
                source_node_id: sourceId,
                target_node_id: targetId,
                relationship_type: 'mentions',
                weight: entity.salience,
                confidence: article.sentiment_score ? Math.abs(article.sentiment_score) : 0.5,
                evidence: [{ article_url: article.url, published_at: article.published_at }]
              });
            }
          }
        }
      }
    }

    // Analyze correlations between assets
    const symbols = Array.from(nodeMap.keys())
      .filter(k => k.startsWith('asset_'))
      .map(k => k.replace('asset_', ''));

    for (let i = 0; i < symbols.length; i++) {
      for (let j = i + 1; j < symbols.length; j++) {
        const correlation = await calculateCorrelation(supabase, symbols[i], symbols[j]);
        
        if (Math.abs(correlation) > 0.5) {
          const sourceId = nodeMap.get(`asset_${symbols[i]}`);
          const targetId = nodeMap.get(`asset_${symbols[j]}`);
          
          if (sourceId && targetId) {
            edges.push({
              source_node_id: sourceId,
              target_node_id: targetId,
              relationship_type: 'correlates',
              weight: Math.abs(correlation),
              confidence: 0.8,
              evidence: [{ type: 'price_correlation', value: correlation }]
            });
          }
        }
      }
    }

    // Store edges
    const storedEdges = [];
    for (const edge of edges) {
      const { data, error } = await supabase
        .from('kg_edges')
        .upsert(edge, {
          onConflict: 'source_node_id,target_node_id,relationship_type'
        })
        .select();
      
      if (!error && data) storedEdges.push(data[0]);
    }

    return new Response(
      JSON.stringify({
        success: true,
        nodes_created: nodeMap.size,
        edges_created: storedEdges.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Knowledge graph builder error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function calculateCorrelation(supabase: any, symbol1: string, symbol2: string): Promise<number> {
  // Get last 30 days of price data
  const { data: data1 } = await supabase
    .from('market_data_history')
    .select('close')
    .eq('symbol', symbol1)
    .eq('timeframe', '1d')
    .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    .order('timestamp', { ascending: true });

  const { data: data2 } = await supabase
    .from('market_data_history')
    .select('close')
    .eq('symbol', symbol2)
    .eq('timeframe', '1d')
    .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    .order('timestamp', { ascending: true });

  if (!data1 || !data2 || data1.length < 10 || data2.length < 10) {
    return 0;
  }

  // Calculate returns
  const returns1 = [];
  const returns2 = [];
  
  for (let i = 1; i < Math.min(data1.length, data2.length); i++) {
    returns1.push((data1[i].close - data1[i-1].close) / data1[i-1].close);
    returns2.push((data2[i].close - data2[i-1].close) / data2[i-1].close);
  }

  // Calculate correlation coefficient
  const mean1 = returns1.reduce((a, b) => a + b, 0) / returns1.length;
  const mean2 = returns2.reduce((a, b) => a + b, 0) / returns2.length;

  let numerator = 0;
  let sumSq1 = 0;
  let sumSq2 = 0;

  for (let i = 0; i < returns1.length; i++) {
    const diff1 = returns1[i] - mean1;
    const diff2 = returns2[i] - mean2;
    numerator += diff1 * diff2;
    sumSq1 += diff1 * diff1;
    sumSq2 += diff2 * diff2;
  }

  const denominator = Math.sqrt(sumSq1 * sumSq2);
  return denominator === 0 ? 0 : numerator / denominator;
}
