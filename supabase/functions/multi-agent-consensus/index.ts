import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Agent {
  id: string;
  type: 'technical' | 'fundamental' | 'sentiment' | 'quantum' | 'harmonic';
  weight: number;
}

interface Prediction {
  agent_id: string;
  direction: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  reasoning: string;
  timestamp: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symbol, market_data, operation } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Define agent ensemble
    const agents: Agent[] = [
      { id: 'technical_analyst', type: 'technical', weight: 0.25 },
      { id: 'fundamental_analyst', type: 'fundamental', weight: 0.20 },
      { id: 'sentiment_analyst', type: 'sentiment', weight: 0.15 },
      { id: 'quantum_resonance', type: 'quantum', weight: 0.20 },
      { id: 'harmonic_neural', type: 'harmonic', weight: 0.20 }
    ];

    switch (operation) {
      case 'consensus_prediction': {
        // Run Byzantine Fault Tolerant consensus
        const predictions = await Promise.all(
          agents.map(agent => getAgentPrediction(agent, symbol, market_data, LOVABLE_API_KEY))
        );

        // Apply PBFT consensus algorithm
        const consensus = await bftConsensus(predictions, agents);
        
        return new Response(
          JSON.stringify({
            success: true,
            consensus: consensus.decision,
            confidence: consensus.confidence,
            agent_predictions: predictions,
            consensus_reached: consensus.agreement_count >= Math.ceil(agents.length * 2/3),
            fault_tolerance: Math.floor((agents.length - 1) / 3)
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'agent_analysis': {
        // Get detailed analysis from specific agent
        const agent = agents.find(a => a.id === market_data.agent_id);
        if (!agent) throw new Error('Agent not found');
        
        const analysis = await getAgentPrediction(agent, symbol, market_data, LOVABLE_API_KEY);
        
        return new Response(
          JSON.stringify({ success: true, analysis }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  } catch (error) {
    console.error('Error in multi-agent-consensus:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

// Get prediction from individual agent
async function getAgentPrediction(
  agent: Agent,
  symbol: string,
  marketData: any,
  apiKey: string
): Promise<Prediction> {
  const systemPrompts = {
    technical: `You are a technical analysis expert. Analyze price action, volume, indicators (RSI, MACD, Bollinger Bands).
    Focus on: chart patterns, support/resistance, momentum, trend strength.`,
    
    fundamental: `You are a fundamental analysis expert. Analyze company fundamentals, earnings, valuation metrics.
    Focus on: P/E ratio, revenue growth, competitive position, market conditions.`,
    
    sentiment: `You are a market sentiment analyst. Analyze news, social media, options flow, insider trading.
    Focus on: bullish/bearish sentiment, fear/greed index, market psychology.`,
    
    quantum: `You are a quantum market analyst. Use quantum resonance detection and wave function analysis.
    Focus on: coherence states, tunneling probability, entanglement patterns, superposition zones.`,
    
    harmonic: `You are a harmonic neural network specialist. Use prime number patterns and Fibonacci sequences.
    Focus on: modular resonance, zeta field energy, prime attractor alignment, fibonacci retracements.`
  };

  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [{
        role: 'system',
        content: systemPrompts[agent.type] + `\n\nRespond in JSON format: {
          "direction": "bullish" | "bearish" | "neutral",
          "confidence": 0.0-1.0,
          "reasoning": "detailed explanation",
          "key_signals": ["signal1", "signal2", ...]
        }`
      }, {
        role: 'user',
        content: `Analyze ${symbol} with the following data:\n${JSON.stringify(marketData, null, 2)}`
      }],
    }),
  });

  const result = await response.json();
  let analysis;
  
  try {
    // Try to parse JSON from response
    const content = result.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : {
      direction: 'neutral',
      confidence: 0.5,
      reasoning: content
    };
  } catch (e) {
    analysis = {
      direction: 'neutral',
      confidence: 0.5,
      reasoning: result.choices[0].message.content
    };
  }

  return {
    agent_id: agent.id,
    ...analysis,
    timestamp: Date.now()
  };
}

// Byzantine Fault Tolerant Consensus
async function bftConsensus(
  predictions: Prediction[],
  agents: Agent[]
): Promise<any> {
  // Count votes weighted by agent importance
  let bullish_weight = 0;
  let bearish_weight = 0;
  let neutral_weight = 0;

  predictions.forEach((pred, i) => {
    const agent = agents[i];
    const weighted_confidence = pred.confidence * agent.weight;
    
    if (pred.direction === 'bullish') {
      bullish_weight += weighted_confidence;
    } else if (pred.direction === 'bearish') {
      bearish_weight += weighted_confidence;
    } else {
      neutral_weight += weighted_confidence;
    }
  });

  // Determine consensus
  const total_weight = bullish_weight + bearish_weight + neutral_weight;
  const agreement_threshold = total_weight * 0.66; // 2/3 Byzantine threshold

  let decision: 'bullish' | 'bearish' | 'neutral';
  let confidence: number;
  let agreement_count: number;

  if (bullish_weight >= agreement_threshold) {
    decision = 'bullish';
    confidence = bullish_weight / total_weight;
    agreement_count = predictions.filter(p => p.direction === 'bullish').length;
  } else if (bearish_weight >= agreement_threshold) {
    decision = 'bearish';
    confidence = bearish_weight / total_weight;
    agreement_count = predictions.filter(p => p.direction === 'bearish').length;
  } else {
    decision = 'neutral';
    confidence = Math.max(bullish_weight, bearish_weight, neutral_weight) / total_weight;
    agreement_count = predictions.filter(p => p.direction === decision).length;
  }

  return {
    decision,
    confidence,
    agreement_count,
    total_agents: agents.length,
    vote_distribution: {
      bullish: bullish_weight / total_weight,
      bearish: bearish_weight / total_weight,
      neutral: neutral_weight / total_weight
    }
  };
}
