import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, strategy_id, trade_data } = await req.json();

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    const { data: { user } } = await supabaseClient.auth.getUser(token);

    if (!user) {
      throw new Error('Unauthorized');
    }

    if (action === 'validate_trade') {
      const validation = await validateTradeRisk(supabaseClient, user.id, strategy_id, trade_data);
      
      return new Response(
        JSON.stringify(validation),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } else if (action === 'check_portfolio_risk') {
      const riskMetrics = await calculatePortfolioRisk(supabaseClient, user.id);
      
      return new Response(
        JSON.stringify(riskMetrics),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } else if (action === 'emergency_stop') {
      await emergencyStopAll(supabaseClient, user.id);
      
      return new Response(
        JSON.stringify({ success: true, message: 'Emergency stop activated' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Unknown action' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in risk-manager:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function validateTradeRisk(supabase: any, userId: string, strategyId: string, tradeData: any) {
  // Get risk controls
  const { data: riskControls } = await supabase
    .from('risk_controls')
    .select('*')
    .eq('user_id', userId)
    .eq('strategy_id', strategyId)
    .single();

  if (!riskControls || !riskControls.is_enabled) {
    return { approved: true, warnings: [] };
  }

  if (riskControls.emergency_stop) {
    return { 
      approved: false, 
      reason: 'Emergency stop is active',
      warnings: ['Emergency stop engaged - all trading halted']
    };
  }

  const warnings: string[] = [];
  let approved = true;

  // Check position size
  const positionValue = tradeData.quantity * tradeData.price;
  if (positionValue > riskControls.max_position_size) {
    approved = false;
    warnings.push(`Position size ${positionValue} exceeds max ${riskControls.max_position_size}`);
  }

  // Check daily trades limit
  const today = new Date().toISOString().split('T')[0];
  const { data: todayTrades, count } = await supabase
    .from('paper_trades')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .gte('entry_time', today);

  if (count && count >= riskControls.max_trades_per_day) {
    approved = false;
    warnings.push(`Daily trade limit ${riskControls.max_trades_per_day} reached`);
  }

  // Check daily loss limit
  const { data: todayClosedTrades } = await supabase
    .from('paper_trades')
    .select('pnl')
    .eq('user_id', userId)
    .eq('status', 'closed')
    .gte('entry_time', today);

  if (todayClosedTrades) {
    const dailyPnL = todayClosedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    if (dailyPnL < -riskControls.max_daily_loss) {
      approved = false;
      warnings.push(`Daily loss limit ${riskControls.max_daily_loss} exceeded`);
    }
  }

  // Check total exposure
  const { data: openPositions } = await supabase
    .from('paper_trades')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'open');

  if (openPositions) {
    const totalExposure = openPositions.reduce((sum, p) => sum + (p.quantity * p.entry_price), 0);
    if (totalExposure + positionValue > riskControls.max_total_exposure) {
      approved = false;
      warnings.push(`Total exposure would exceed ${riskControls.max_total_exposure}`);
    }
  }

  return { 
    approved, 
    warnings,
    reason: warnings.length > 0 ? warnings[0] : null,
    risk_score: calculateRiskScore(warnings.length, positionValue, riskControls),
  };
}

async function calculatePortfolioRisk(supabase: any, userId: string) {
  const { data: openPositions } = await supabase
    .from('paper_trades')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'open');

  const { data: closedTrades } = await supabase
    .from('paper_trades')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'closed')
    .order('exit_time', { ascending: false })
    .limit(100);

  let totalExposure = 0;
  let totalUnrealizedPnL = 0;
  const symbolExposure: Record<string, number> = {};

  if (openPositions) {
    for (const pos of openPositions) {
      const exposure = pos.quantity * pos.entry_price;
      totalExposure += exposure;
      symbolExposure[pos.symbol] = (symbolExposure[pos.symbol] || 0) + exposure;
      
      // Simplified unrealized PnL calculation
      totalUnrealizedPnL += pos.pnl || 0;
    }
  }

  let totalRealizedPnL = 0;
  if (closedTrades) {
    totalRealizedPnL = closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
  }

  const riskMetrics = {
    total_exposure: totalExposure,
    open_positions: openPositions?.length || 0,
    unrealized_pnl: totalUnrealizedPnL,
    realized_pnl: totalRealizedPnL,
    total_pnl: totalUnrealizedPnL + totalRealizedPnL,
    symbol_concentration: symbolExposure,
    max_concentration: totalExposure > 0 
      ? Math.max(...Object.values(symbolExposure)) / totalExposure * 100 
      : 0,
  };

  return riskMetrics;
}

async function emergencyStopAll(supabase: any, userId: string) {
  // Set emergency stop on all risk controls
  await supabase
    .from('risk_controls')
    .update({ emergency_stop: true })
    .eq('user_id', userId);

  // Stop all running executions
  await supabase
    .from('strategy_executions')
    .update({ 
      status: 'stopped',
      stopped_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('status', 'running');

  // Deactivate all strategies
  await supabase
    .from('trading_strategies')
    .update({ is_active: false })
    .eq('user_id', userId);

  console.log(`Emergency stop activated for user ${userId}`);
}

function calculateRiskScore(warningCount: number, positionValue: number, riskControls: any): number {
  let score = 0;
  
  score += warningCount * 20;
  score += (positionValue / riskControls.max_position_size) * 30;
  
  return Math.min(100, score);
}
