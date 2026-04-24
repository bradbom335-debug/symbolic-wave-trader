import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Brain,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Target,
  Zap,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

type Action = 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell';
type SentimentLabel = 'very_bearish' | 'bearish' | 'neutral' | 'bullish' | 'very_bullish';

interface Pattern {
  name: string;
  direction: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  target_price?: number;
  invalidation_price?: number;
  note: string;
}

interface Prediction {
  target_price: number;
  low?: number;
  high?: number;
  expected_change_pct: number;
  confidence: number;
  rationale: string;
}

interface Analysis {
  symbol: string;
  as_of?: string;
  summary: string;
  patterns: Pattern[];
  sentiment: {
    score: number;
    label: SentimentLabel;
    news_summary: string;
    social_summary?: string;
    options_flow_summary?: string;
    unusual_options_activity?: boolean;
  };
  predictions: {
    short_term_7d: Prediction;
    long_term_90d: Prediction;
  };
  recommendation: {
    action: Action;
    confidence: number;
    time_horizon: string;
    entry_zone?: { low?: number; high?: number };
    stop_loss?: number;
    take_profits?: number[];
    rationale: string;
  };
  key_levels?: { support?: number[]; resistance?: number[] };
}

interface Props {
  symbol?: string;
  currentPrice?: number;
}

const actionStyle: Record<Action, { label: string; cls: string }> = {
  strong_buy: { label: 'STRONG BUY', cls: 'bg-[hsl(var(--terminal-green))]/20 text-[hsl(var(--terminal-green))] border-[hsl(var(--terminal-green))]/40' },
  buy: { label: 'BUY', cls: 'bg-[hsl(var(--terminal-green))]/15 text-[hsl(var(--terminal-green))] border-[hsl(var(--terminal-green))]/30' },
  hold: { label: 'HOLD', cls: 'bg-[hsl(var(--terminal-amber))]/15 text-[hsl(var(--terminal-amber))] border-[hsl(var(--terminal-amber))]/30' },
  sell: { label: 'SELL', cls: 'bg-[hsl(var(--terminal-red))]/15 text-[hsl(var(--terminal-red))] border-[hsl(var(--terminal-red))]/30' },
  strong_sell: { label: 'STRONG SELL', cls: 'bg-[hsl(var(--terminal-red))]/20 text-[hsl(var(--terminal-red))] border-[hsl(var(--terminal-red))]/40' },
};

function generateMockBars(price = 150) {
  const bars: { c: number }[] = [];
  let p = price;
  for (let i = 0; i < 80; i++) {
    p = p + (Math.random() - 0.5) * p * 0.02;
    bars.push({ c: +p.toFixed(2) });
  }
  return bars;
}

export const AIStockAnalysis = ({ symbol = 'AAPL', currentPrice = 178.45 }: Props) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke('ai-stock-analysis', {
        body: {
          symbol,
          currentPrice,
          recentBars: generateMockBars(currentPrice),
          newsHeadlines: [
            `${symbol} beats quarterly earnings expectations`,
            `Analysts upgrade ${symbol} on strong guidance`,
            `Sector rotation favoring tech this week`,
          ],
          optionsFlow: {
            call_put_ratio: 1.6,
            unusual_volume: true,
            largest_trades: ['Sweep BUY 5000 calls strike +5%'],
          },
        },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      setAnalysis(data as Analysis);
    } catch (e: any) {
      const msg = e?.message || 'Failed to analyze';
      setError(msg);
      toast({ title: 'AI analysis failed', description: msg, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol]);

  const sentimentPct = useMemo(() => {
    if (!analysis) return 50;
    return Math.round(((analysis.sentiment.score + 1) / 2) * 100);
  }, [analysis]);

  const sentimentColor = (s: number) =>
    s > 0.2 ? 'text-[hsl(var(--terminal-green))]' :
    s < -0.2 ? 'text-[hsl(var(--terminal-red))]' :
    'text-[hsl(var(--terminal-amber))]';

  const dirIcon = (d: Pattern['direction']) =>
    d === 'bullish' ? <TrendingUp className="h-2.5 w-2.5 text-[hsl(var(--terminal-green))]" /> :
    d === 'bearish' ? <TrendingDown className="h-2.5 w-2.5 text-[hsl(var(--terminal-red))]" /> :
    <Minus className="h-2.5 w-2.5 text-[hsl(var(--terminal-amber))]" />;

  return (
    <Card className="h-full flex flex-col bg-[hsl(var(--terminal-bg-panel))] border-[hsl(var(--terminal-bg-elevated))]">
      <div className="p-1.5 border-b border-[hsl(var(--terminal-bg-elevated))] flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <Brain className="h-3 w-3 text-[hsl(var(--terminal-blue))]" />
          <h3 className="text-[10px] font-mono uppercase tracking-wider text-[hsl(var(--terminal-text-dim))]">
            AI Analysis
          </h3>
          <Badge variant="outline" className="text-[8px] font-mono px-1 py-0 h-3.5">
            {symbol}
          </Badge>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="h-5 w-5"
          onClick={fetchAnalysis}
          disabled={loading}
        >
          <RefreshCw className={`h-2.5 w-2.5 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-1.5 space-y-1.5 min-h-0">
        {loading && !analysis && (
          <div className="text-[9px] font-mono text-[hsl(var(--terminal-text-dim))] animate-pulse">
            Analyzing patterns, sentiment, and forecasts…
          </div>
        )}
        {error && !loading && (
          <div className="text-[9px] font-mono text-[hsl(var(--terminal-red))] flex items-center gap-1">
            <AlertTriangle className="h-2.5 w-2.5" /> {error}
          </div>
        )}

        {analysis && (
          <>
            {/* Recommendation */}
            <div className="bg-[hsl(var(--terminal-bg-elevated))]/50 rounded p-1.5">
              <div className="flex items-center justify-between mb-1">
                <Badge className={`text-[9px] font-mono px-1.5 py-0 h-4 border ${actionStyle[analysis.recommendation.action].cls}`}>
                  {actionStyle[analysis.recommendation.action].label}
                </Badge>
                <span className="text-[9px] font-mono text-[hsl(var(--terminal-text-dim))]">
                  {analysis.recommendation.time_horizon} · {Math.round(analysis.recommendation.confidence * 100)}%
                </span>
              </div>
              <Progress value={analysis.recommendation.confidence * 100} className="h-1" />
              <div className="text-[9px] font-mono text-foreground mt-1 leading-snug">
                {analysis.recommendation.rationale}
              </div>
              {(analysis.recommendation.entry_zone || analysis.recommendation.stop_loss) && (
                <div className="grid grid-cols-3 gap-1 mt-1">
                  {analysis.recommendation.entry_zone?.low != null && (
                    <div className="text-[8px] font-mono">
                      <div className="text-[hsl(var(--terminal-text-dim))]">ENTRY</div>
                      <div className="text-[hsl(var(--terminal-blue))]">
                        {analysis.recommendation.entry_zone.low.toFixed(2)}
                        {analysis.recommendation.entry_zone.high != null && `-${analysis.recommendation.entry_zone.high.toFixed(2)}`}
                      </div>
                    </div>
                  )}
                  {analysis.recommendation.stop_loss != null && (
                    <div className="text-[8px] font-mono">
                      <div className="text-[hsl(var(--terminal-text-dim))]">STOP</div>
                      <div className="text-[hsl(var(--terminal-red))]">{analysis.recommendation.stop_loss.toFixed(2)}</div>
                    </div>
                  )}
                  {analysis.recommendation.take_profits?.[0] != null && (
                    <div className="text-[8px] font-mono">
                      <div className="text-[hsl(var(--terminal-text-dim))]">TP</div>
                      <div className="text-[hsl(var(--terminal-green))]">
                        {analysis.recommendation.take_profits.map(tp => tp.toFixed(2)).join(' · ')}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Predictions */}
            <div className="grid grid-cols-2 gap-1">
              {(['short_term_7d', 'long_term_90d'] as const).map((k) => {
                const p = analysis.predictions[k];
                const positive = p.expected_change_pct >= 0;
                return (
                  <div key={k} className="bg-[hsl(var(--terminal-bg-elevated))]/50 rounded p-1.5">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[8px] font-mono text-[hsl(var(--terminal-text-dim))] uppercase">
                        {k === 'short_term_7d' ? '7D Target' : '90D Target'}
                      </span>
                      <Target className="h-2.5 w-2.5 text-[hsl(var(--terminal-blue))]" />
                    </div>
                    <div className="text-[12px] font-mono font-bold text-foreground">
                      ${p.target_price.toFixed(2)}
                    </div>
                    <div className={`text-[9px] font-mono ${positive ? 'text-[hsl(var(--terminal-green))]' : 'text-[hsl(var(--terminal-red))]'}`}>
                      {positive ? '+' : ''}{p.expected_change_pct.toFixed(2)}%
                    </div>
                    <Progress value={p.confidence * 100} className="h-1 mt-1" />
                    <div className="text-[8px] font-mono text-[hsl(var(--terminal-text-dim))] mt-0.5">
                      conf {Math.round(p.confidence * 100)}%
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sentiment */}
            <div className="bg-[hsl(var(--terminal-bg-elevated))]/50 rounded p-1.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-mono text-[hsl(var(--terminal-text-dim))] uppercase">Sentiment</span>
                <span className={`text-[10px] font-mono font-bold ${sentimentColor(analysis.sentiment.score)}`}>
                  {analysis.sentiment.label.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <div className="relative h-1 bg-[hsl(var(--terminal-bg))] rounded overflow-hidden mb-1">
                <div
                  className="absolute top-0 bottom-0 bg-gradient-to-r from-[hsl(var(--terminal-red))] via-[hsl(var(--terminal-amber))] to-[hsl(var(--terminal-green))]"
                  style={{ left: 0, width: `${sentimentPct}%` }}
                />
              </div>
              <div className="text-[8px] font-mono text-foreground leading-snug">
                {analysis.sentiment.news_summary}
              </div>
              {analysis.sentiment.options_flow_summary && (
                <div className="text-[8px] font-mono text-[hsl(var(--terminal-text-dim))] mt-1 flex items-start gap-1">
                  <Zap className="h-2.5 w-2.5 text-[hsl(var(--terminal-amber))] flex-shrink-0 mt-0.5" />
                  <span>{analysis.sentiment.options_flow_summary}</span>
                  {analysis.sentiment.unusual_options_activity && (
                    <Badge className="text-[7px] px-1 py-0 h-3 ml-1 bg-[hsl(var(--terminal-amber))]/20 text-[hsl(var(--terminal-amber))] border-[hsl(var(--terminal-amber))]/40">UOA</Badge>
                  )}
                </div>
              )}
            </div>

            {/* Patterns */}
            <div>
              <div className="text-[9px] font-mono text-[hsl(var(--terminal-text-dim))] uppercase mb-1">
                Detected Patterns
              </div>
              {analysis.patterns.length === 0 ? (
                <div className="text-[8px] font-mono text-[hsl(var(--terminal-text-dim))]">
                  No high-confidence patterns.
                </div>
              ) : (
                <div className="space-y-1">
                  {analysis.patterns.slice(0, 5).map((p, i) => (
                    <div key={i} className="bg-[hsl(var(--terminal-bg-elevated))]/40 rounded p-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {dirIcon(p.direction)}
                          <span className="text-[9px] font-mono text-foreground">
                            {p.name.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <span className="text-[8px] font-mono text-[hsl(var(--terminal-text-dim))]">
                          {Math.round(p.confidence * 100)}%
                        </span>
                      </div>
                      <Progress value={p.confidence * 100} className="h-0.5 mt-0.5" />
                      <div className="text-[8px] font-mono text-[hsl(var(--terminal-text-dim))] mt-0.5 leading-snug">
                        {p.note}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Key Levels */}
            {(analysis.key_levels?.support?.length || analysis.key_levels?.resistance?.length) && (
              <div className="grid grid-cols-2 gap-1">
                <div className="bg-[hsl(var(--terminal-bg-elevated))]/40 rounded p-1">
                  <div className="text-[8px] font-mono text-[hsl(var(--terminal-text-dim))] uppercase">Support</div>
                  <div className="text-[9px] font-mono text-[hsl(var(--terminal-green))]">
                    {analysis.key_levels?.support?.slice(0, 3).map(v => v.toFixed(2)).join(' · ') || '—'}
                  </div>
                </div>
                <div className="bg-[hsl(var(--terminal-bg-elevated))]/40 rounded p-1">
                  <div className="text-[8px] font-mono text-[hsl(var(--terminal-text-dim))] uppercase">Resistance</div>
                  <div className="text-[9px] font-mono text-[hsl(var(--terminal-red))]">
                    {analysis.key_levels?.resistance?.slice(0, 3).map(v => v.toFixed(2)).join(' · ') || '—'}
                  </div>
                </div>
              </div>
            )}

            <div className="text-[8px] font-mono text-[hsl(var(--terminal-text-dim))] italic leading-snug pt-0.5">
              {analysis.summary}
            </div>
          </>
        )}
      </div>
    </Card>
  );
};
