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
    const { strategy_id, action, execution_mode = 'paper' } = await req.json();

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

    // Get strategy
    const { data: strategy, error: strategyError } = await supabaseClient
      .from('trading_strategies')
      .select('*')
      .eq('id', strategy_id)
      .eq('user_id', user.id)
      .single();

    if (strategyError || !strategy) {
      throw new Error('Strategy not found');
    }

    if (action === 'start') {
      // Create new execution session
      const { data: execution, error: execError } = await supabaseClient
        .from('strategy_executions')
        .insert({
          strategy_id,
          user_id: user.id,
          execution_mode,
          status: 'running',
        })
        .select()
        .single();

      if (execError) throw execError;

      // Update strategy status
      await supabaseClient
        .from('trading_strategies')
        .update({ is_active: true, status: execution_mode })
        .eq('id', strategy_id);

      return new Response(
        JSON.stringify({
          success: true,
          execution_id: execution.id,
          message: `Strategy execution started in ${execution_mode} mode`,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } else if (action === 'stop') {
      // Stop execution
      const { data: executions } = await supabaseClient
        .from('strategy_executions')
        .select('*')
        .eq('strategy_id', strategy_id)
        .eq('status', 'running');

      if (executions && executions.length > 0) {
        await supabaseClient
          .from('strategy_executions')
          .update({ 
            status: 'stopped',
            stopped_at: new Date().toISOString(),
          })
          .eq('strategy_id', strategy_id)
          .eq('status', 'running');
      }

      await supabaseClient
        .from('trading_strategies')
        .update({ is_active: false })
        .eq('id', strategy_id);

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Strategy execution stopped',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } else if (action === 'pause') {
      await supabaseClient
        .from('strategy_executions')
        .update({ status: 'paused' })
        .eq('strategy_id', strategy_id)
        .eq('status', 'running');

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Strategy execution paused',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } else if (action === 'execute_signal') {
      // Execute trading signal (for paper trading)
      const { signal } = await req.json();
      
      const result = await executePaperTrade(supabaseClient, strategy, signal, user.id);

      return new Response(
        JSON.stringify({
          success: true,
          trade: result,
        }),
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
    console.error('Error in strategy-executor:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function executePaperTrade(supabase: any, strategy: any, signal: any, userId: string) {
  const { symbol, direction, price, quantity, stop_loss, take_profit } = signal;

  const { data: trade, error } = await supabase
    .from('paper_trades')
    .insert({
      strategy_id: strategy.id,
      user_id: userId,
      symbol,
      trade_type: direction,
      entry_price: price,
      quantity,
      stop_loss,
      take_profit,
      entry_time: new Date().toISOString(),
      entry_reason: signal.reason || 'Strategy signal',
    })
    .select()
    .single();

  if (error) throw error;

  // Update execution stats
  await supabase
    .from('strategy_executions')
    .update({ 
      total_trades: supabase.raw('total_trades + 1'),
    })
    .eq('strategy_id', strategy.id)
    .eq('status', 'running');

  return trade;
}
