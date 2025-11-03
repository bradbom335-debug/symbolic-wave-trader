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
    const { strategy_id, symbol, start_date, end_date, initial_capital = 10000 } = await req.json();

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // Get strategy details
    const { data: strategy, error: strategyError } = await supabaseClient
      .from('trading_strategies')
      .select('*')
      .eq('id', strategy_id)
      .single();

    if (strategyError || !strategy) {
      throw new Error('Strategy not found');
    }

    // Fetch historical market data
    const { data: marketData, error: dataError } = await supabaseClient
      .from('market_data_history')
      .select('*')
      .eq('symbol', symbol)
      .gte('timestamp', start_date)
      .lte('timestamp', end_date)
      .eq('timeframe', strategy.timeframe)
      .order('timestamp', { ascending: true });

    if (dataError || !marketData || marketData.length === 0) {
      throw new Error('Insufficient historical data for backtest');
    }

    console.log(`Running backtest for ${symbol} with ${marketData.length} data points`);

    // Run backtest simulation
    const backtestResult = await runBacktest(strategy, marketData, initial_capital);

    // Store backtest results
    const { data: result, error: insertError } = await supabaseClient
      .from('backtest_results')
      .insert({
        strategy_id,
        symbol,
        timeframe: strategy.timeframe,
        start_date,
        end_date,
        initial_capital,
        ...backtestResult,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error storing backtest results:', insertError);
      throw insertError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        backtest_id: result.id,
        results: backtestResult,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in backtesting-engine:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function runBacktest(strategy: any, marketData: any[], initialCapital: number) {
  let capital = initialCapital;
  let position: any = null;
  const trades: any[] = [];
  const equityCurve: any[] = [];
  let winningTrades = 0;
  let losingTrades = 0;
  let maxDrawdown = 0;
  let peak = initialCapital;

  const entryRules = strategy.entry_rules || [];
  const exitRules = strategy.exit_rules || [];
  const riskRules = strategy.risk_rules || {};

  for (let i = 1; i < marketData.length; i++) {
    const currentBar = marketData[i];
    const prevBar = marketData[i - 1];

    // Check exit conditions first if we have a position
    if (position) {
      const shouldExit = evaluateExitRules(exitRules, currentBar, prevBar, position, marketData.slice(Math.max(0, i - 20), i));
      
      if (shouldExit) {
        const exitPrice = currentBar.close;
        const pnl = position.type === 'long' 
          ? (exitPrice - position.entry_price) * position.quantity
          : (position.entry_price - exitPrice) * position.quantity;

        capital += pnl;
        
        trades.push({
          entry_time: position.entry_time,
          exit_time: currentBar.timestamp,
          entry_price: position.entry_price,
          exit_price: exitPrice,
          type: position.type,
          quantity: position.quantity,
          pnl,
          pnl_percent: (pnl / (position.entry_price * position.quantity)) * 100,
        });

        if (pnl > 0) winningTrades++;
        else losingTrades++;

        position = null;
      }
    }

    // Check entry conditions if we don't have a position
    if (!position) {
      const signalData = evaluateEntryRules(entryRules, currentBar, prevBar, marketData.slice(Math.max(0, i - 20), i));
      
      if (signalData.shouldEnter) {
        const positionSize = calculatePositionSize(capital, riskRules);
        const quantity = Math.floor(positionSize / currentBar.close);

        if (quantity > 0 && (quantity * currentBar.close) <= capital) {
          position = {
            type: signalData.direction,
            entry_price: currentBar.close,
            entry_time: currentBar.timestamp,
            quantity,
            stop_loss: currentBar.close * (1 - (riskRules.stop_loss_percent || 2) / 100),
            take_profit: currentBar.close * (1 + (riskRules.take_profit_percent || 5) / 100),
          };
          capital -= quantity * currentBar.close;
        }
      }
    }

    // Update equity curve
    const currentEquity = position 
      ? capital + (position.quantity * currentBar.close)
      : capital;
    
    equityCurve.push({
      timestamp: currentBar.timestamp,
      equity: currentEquity,
    });

    // Track drawdown
    if (currentEquity > peak) peak = currentEquity;
    const drawdown = ((peak - currentEquity) / peak) * 100;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;
  }

  const totalTrades = trades.length;
  const finalCapital = capital + (position ? position.quantity * marketData[marketData.length - 1].close : 0);
  const totalReturn = ((finalCapital - initialCapital) / initialCapital) * 100;
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

  const avgWin = winningTrades > 0 
    ? trades.filter(t => t.pnl > 0).reduce((sum, t) => sum + t.pnl, 0) / winningTrades 
    : 0;
  const avgLoss = losingTrades > 0 
    ? Math.abs(trades.filter(t => t.pnl < 0).reduce((sum, t) => sum + t.pnl, 0) / losingTrades)
    : 0;
  const profitFactor = avgLoss > 0 ? avgWin / avgLoss : 0;

  const returns = trades.map(t => (t.pnl / (t.entry_price * t.quantity)));
  const avgReturn = returns.length > 0 ? returns.reduce((a, b) => a + b, 0) / returns.length : 0;
  const stdDev = returns.length > 0 
    ? Math.sqrt(returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length)
    : 0;
  const sharpeRatio = stdDev > 0 ? (avgReturn / stdDev) * Math.sqrt(252) : 0;

  return {
    final_capital: finalCapital,
    total_trades: totalTrades,
    winning_trades: winningTrades,
    losing_trades: losingTrades,
    win_rate: winRate,
    profit_factor: profitFactor,
    sharpe_ratio: sharpeRatio,
    max_drawdown: maxDrawdown,
    total_return: totalReturn,
    avg_trade_return: avgReturn * 100,
    trades_data: trades,
    equity_curve: equityCurve,
    metrics: {
      avg_win: avgWin,
      avg_loss: avgLoss,
      largest_win: trades.length > 0 ? Math.max(...trades.map(t => t.pnl)) : 0,
      largest_loss: trades.length > 0 ? Math.min(...trades.map(t => t.pnl)) : 0,
    },
  };
}

function evaluateEntryRules(rules: any[], currentBar: any, prevBar: any, historicalData: any[]): { shouldEnter: boolean, direction: string } {
  if (!rules || rules.length === 0) return { shouldEnter: false, direction: '' };

  let bullishSignals = 0;
  let bearishSignals = 0;

  for (const rule of rules) {
    const result = evaluateRule(rule, currentBar, prevBar, historicalData);
    if (result === 'bullish') bullishSignals++;
    if (result === 'bearish') bearishSignals++;
  }

  if (bullishSignals >= rules.length * 0.6) {
    return { shouldEnter: true, direction: 'long' };
  } else if (bearishSignals >= rules.length * 0.6) {
    return { shouldEnter: true, direction: 'short' };
  }

  return { shouldEnter: false, direction: '' };
}

function evaluateExitRules(rules: any[], currentBar: any, prevBar: any, position: any, historicalData: any[]): boolean {
  if (!rules || rules.length === 0) {
    // Default exit: check stop loss and take profit
    if (position.type === 'long') {
      return currentBar.close <= position.stop_loss || currentBar.close >= position.take_profit;
    } else {
      return currentBar.close >= position.stop_loss || currentBar.close <= position.take_profit;
    }
  }

  let exitSignals = 0;

  for (const rule of rules) {
    if (evaluateRule(rule, currentBar, prevBar, historicalData) === 'exit') {
      exitSignals++;
    }
  }

  return exitSignals > 0;
}

function evaluateRule(rule: any, currentBar: any, prevBar: any, historicalData: any[]): string {
  const { type, params } = rule;

  switch (type) {
    case 'price_above_ma':
      const ma = calculateSMA(historicalData, params.period || 20);
      return currentBar.close > ma ? 'bullish' : 'bearish';
    
    case 'rsi_oversold':
      const rsi = calculateRSI(historicalData, params.period || 14);
      return rsi < (params.threshold || 30) ? 'bullish' : '';
    
    case 'rsi_overbought':
      const rsiOB = calculateRSI(historicalData, params.period || 14);
      return rsiOB > (params.threshold || 70) ? 'bearish' : '';
    
    case 'volume_surge':
      const avgVolume = historicalData.slice(-20).reduce((sum, bar) => sum + bar.volume, 0) / 20;
      return currentBar.volume > avgVolume * (params.multiplier || 1.5) ? 'bullish' : '';
    
    default:
      return '';
  }
}

function calculateSMA(data: any[], period: number): number {
  if (data.length < period) return 0;
  const sum = data.slice(-period).reduce((acc, bar) => acc + bar.close, 0);
  return sum / period;
}

function calculateRSI(data: any[], period: number = 14): number {
  if (data.length < period + 1) return 50;
  
  let gains = 0;
  let losses = 0;
  
  for (let i = data.length - period; i < data.length; i++) {
    const change = data[i].close - data[i - 1].close;
    if (change > 0) gains += change;
    else losses -= change;
  }
  
  const avgGain = gains / period;
  const avgLoss = losses / period;
  
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

function calculatePositionSize(capital: number, riskRules: any): number {
  const maxPositionPercent = riskRules.max_position_percent || 10;
  return capital * (maxPositionPercent / 100);
}
