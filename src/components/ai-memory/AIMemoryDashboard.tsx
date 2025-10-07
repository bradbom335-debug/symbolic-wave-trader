import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Brain, Database, Network, Zap, Activity, TrendingUp, Eye, Cpu } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MemoryMetrics {
  total_contexts: number;
  compression_ratio: number;
  retrieval_latency: number;
  semantic_coherence: number;
  agent_consensus: number;
}

interface ConsensusResult {
  decision: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  agent_predictions: any[];
  consensus_reached: boolean;
}

export const AIMemoryDashboard: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState<MemoryMetrics>({
    total_contexts: 0,
    compression_ratio: 0.72,
    retrieval_latency: 45,
    semantic_coherence: 0.89,
    agent_consensus: 0.85
  });
  const [consensusResult, setConsensusResult] = useState<ConsensusResult | null>(null);
  const [sessionId] = useState(() => crypto.randomUUID());

  // Store market context in AI memory
  const storeMarketContext = async (marketData: any) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-memory-context', {
        body: {
          operation: 'store_context',
          data: {
            session_id: sessionId,
            context_level: 'medium',
            content: JSON.stringify(marketData),
            metadata: {
              timestamp: Date.now(),
              type: 'market_analysis'
            }
          }
        }
      });

      if (error) throw error;

      setMetrics(prev => ({
        ...prev,
        total_contexts: prev.total_contexts + 1,
        compression_ratio: data.compression_ratio
      }));

      toast({
        title: 'Context Stored',
        description: `Compression: ${(data.compression_ratio * 100).toFixed(1)}%`,
      });
    } catch (error) {
      console.error('Store context error:', error);
      toast({
        title: 'Error',
        description: 'Failed to store context',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get multi-agent consensus prediction
  const getConsensusPrediction = async (symbol: string, marketData: any) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('multi-agent-consensus', {
        body: {
          symbol,
          market_data: marketData,
          operation: 'consensus_prediction'
        }
      });

      if (error) throw error;

      setConsensusResult(data.consensus ? {
        decision: data.consensus,
        confidence: data.confidence,
        agent_predictions: data.agent_predictions || [],
        consensus_reached: data.consensus_reached
      } : null);

      setMetrics(prev => ({
        ...prev,
        agent_consensus: data.confidence || prev.agent_consensus
      }));

      toast({
        title: 'Consensus Reached',
        description: `${data.consensus.toUpperCase()} with ${(data.confidence * 100).toFixed(1)}% confidence`,
      });
    } catch (error) {
      console.error('Consensus error:', error);
      toast({
        title: 'Error',
        description: 'Failed to get consensus',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Test with sample data
  const runDemoAnalysis = async () => {
    const sampleMarketData = {
      price: 178.50,
      volume: 45000000,
      change_24h: 2.3,
      rsi: 68,
      macd: 1.2
    };

    await storeMarketContext(sampleMarketData);
    await getConsensusPrediction('AAPL', sampleMarketData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Brain className="h-7 w-7 text-primary animate-neural-pulse" />
                AI Memory Operating System
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Hierarchical Context Management • Multi-Agent Consensus • Semantic Compression
              </p>
            </div>
            <Button 
              onClick={runDemoAnalysis}
              disabled={isLoading}
              className="bg-gradient-neural hover:bg-gradient-neural/90"
            >
              {isLoading ? (
                <>
                  <Cpu className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Run Analysis
                </>
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Contexts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{metrics.total_contexts}</div>
              <Database className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Compression
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{(metrics.compression_ratio * 100).toFixed(0)}%</div>
              <Activity className="h-5 w-5 text-resonance" />
            </div>
            <Progress value={metrics.compression_ratio * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Latency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{metrics.retrieval_latency}ms</div>
              <Zap className="h-5 w-5 text-temporal" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Coherence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{(metrics.semantic_coherence * 100).toFixed(0)}%</div>
              <Network className="h-5 w-5 text-accent" />
            </div>
            <Progress value={metrics.semantic_coherence * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Consensus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{(metrics.agent_consensus * 100).toFixed(0)}%</div>
              <TrendingUp className="h-5 w-5 text-resonance" />
            </div>
            <Progress value={metrics.agent_consensus * 100} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="consensus" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="consensus">Multi-Agent Consensus</TabsTrigger>
          <TabsTrigger value="memory">Memory Hierarchy</TabsTrigger>
          <TabsTrigger value="agents">Agent Analysis</TabsTrigger>
          <TabsTrigger value="system">System Status</TabsTrigger>
        </TabsList>

        {/* Consensus Tab */}
        <TabsContent value="consensus">
          <Card>
            <CardHeader>
              <CardTitle>Byzantine Fault Tolerant Consensus</CardTitle>
            </CardHeader>
            <CardContent>
              {consensusResult ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="text-sm text-muted-foreground">Consensus Decision</div>
                      <div className="text-2xl font-bold">
                        <Badge 
                          variant={consensusResult.decision === 'bullish' ? 'default' : consensusResult.decision === 'bearish' ? 'destructive' : 'secondary'}
                          className="text-lg px-4 py-1"
                        >
                          {consensusResult.decision.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Confidence</div>
                      <div className="text-2xl font-bold text-primary">
                        {(consensusResult.confidence * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Agent Predictions</h4>
                    <div className="space-y-2">
                      {consensusResult.agent_predictions.map((pred, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-primary" />
                            <span className="font-medium">{pred.agent_id}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant={pred.direction === 'bullish' ? 'default' : pred.direction === 'bearish' ? 'destructive' : 'secondary'}>
                              {pred.direction}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {(pred.confidence * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg">
                    {consensusResult.consensus_reached ? (
                      <>
                        <Zap className="h-5 w-5 text-resonance" />
                        <span className="text-sm">2/3 Byzantine Threshold Reached ✓</span>
                      </>
                    ) : (
                      <>
                        <Activity className="h-5 w-5 text-chaos" />
                        <span className="text-sm">Consensus Not Reached</span>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Network className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No consensus data available. Run an analysis to see results.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Memory Tab */}
        <TabsContent value="memory">
          <Card>
            <CardHeader>
              <CardTitle>Hierarchical Memory Architecture</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Short-term (L1)', 'Medium-term (L2)', 'Long-term (L3)', 'Super Index (L4)'].map((level, idx) => (
                  <div key={idx} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{level}</span>
                      <Badge variant="outline">{Math.pow(2, idx + 4)} contexts</Badge>
                    </div>
                    <Progress value={100 - (idx * 20)} className="h-2" />
                    <div className="mt-2 text-xs text-muted-foreground">
                      Access time: {Math.pow(10, idx)} ms • Capacity: {Math.pow(10, idx + 3)} tokens
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Agents Tab */}
        <TabsContent value="agents">
          <Card>
            <CardHeader>
              <CardTitle>Specialized Analysis Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'Technical Analyst', type: 'technical', icon: Activity, color: 'primary' },
                  { name: 'Fundamental Analyst', type: 'fundamental', icon: Database, color: 'resonance' },
                  { name: 'Sentiment Analyst', type: 'sentiment', icon: TrendingUp, color: 'temporal' },
                  { name: 'Quantum Resonance', type: 'quantum', icon: Zap, color: 'accent' },
                  { name: 'Harmonic Neural', type: 'harmonic', icon: Brain, color: 'primary' }
                ].map((agent, idx) => {
                  const Icon = agent.icon;
                  return (
                    <div key={idx} className="p-4 border rounded-lg hover:border-primary/50 transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg bg-${agent.color}/10`}>
                          <Icon className={`h-5 w-5 text-${agent.color}`} />
                        </div>
                        <div>
                          <div className="font-medium">{agent.name}</div>
                          <div className="text-xs text-muted-foreground">{agent.type}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <Badge variant="outline" className="text-xs">Active</Badge>
                        <span className="text-xs text-muted-foreground">Weight: {(0.15 + idx * 0.05).toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Energy Optimization</div>
                    <div className="text-2xl font-bold text-resonance">94.7%</div>
                    <Progress value={94.7} className="mt-2" />
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Graph Compression</div>
                    <div className="text-2xl font-bold text-temporal">75.3%</div>
                    <Progress value={75.3} className="mt-2" />
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Sync Latency</div>
                    <div className="text-2xl font-bold text-accent">23ms</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Fault Tolerance</div>
                    <div className="text-2xl font-bold text-primary">f &lt; n/3</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
