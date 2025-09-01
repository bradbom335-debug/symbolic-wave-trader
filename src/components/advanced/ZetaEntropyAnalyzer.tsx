import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, ScatterChart, Scatter } from 'recharts';
import { Infinity, Zap, Brain, Target, TrendingUp, AlertTriangle, Activity, Waves } from 'lucide-react';

interface ZetaEntropyAnalyzerProps {
  priceData: number[];
  timeStamps: string[];
  symbol: string;
}

export const ZetaEntropyAnalyzer: React.FC<ZetaEntropyAnalyzerProps> = ({
  priceData,
  timeStamps,
  symbol
}) => {
  const [zetaDepth, setZetaDepth] = useState(10);
  const [entropyWindow, setEntropyWindow] = useState(20);
  const [criticalThreshold, setCriticalThreshold] = useState(0.5);

  // Riemann Zeta function approximation
  const riemannZeta = (s: number, terms: number = 1000): number => {
    let sum = 0;
    for (let n = 1; n <= terms; n++) {
      sum += 1 / Math.pow(n, s);
    }
    return sum;
  };

  // Calculate prime counting function π(x)
  const primeCountingFunction = (x: number): number => {
    if (x < 2) return 0;
    const primes = [2];
    for (let i = 3; i <= x; i += 2) {
      let isPrime = true;
      for (let j = 0; j < primes.length && primes[j] * primes[j] <= i; j++) {
        if (i % primes[j] === 0) {
          isPrime = false;
          break;
        }
      }
      if (isPrime) primes.push(i);
    }
    return primes.length;
  };

  // Market entropy calculation using Shannon entropy
  const calculateMarketEntropy = (prices: number[]): number => {
    if (prices.length === 0) return 0;
    
    // Discretize price movements into bins
    const returns = prices.slice(1).map((price, idx) => price - prices[idx]);
    const minReturn = Math.min(...returns);
    const maxReturn = Math.max(...returns);
    const range = maxReturn - minReturn;
    
    if (range === 0) return 0;
    
    const bins = 10;
    const binSize = range / bins;
    const distribution = Array(bins).fill(0);
    
    returns.forEach(ret => {
      const binIndex = Math.min(bins - 1, Math.floor((ret - minReturn) / binSize));
      distribution[binIndex]++;
    });
    
    // Calculate Shannon entropy
    let entropy = 0;
    const total = returns.length;
    distribution.forEach(count => {
      if (count > 0) {
        const p = count / total;
        entropy -= p * Math.log2(p);
      }
    });
    
    return entropy / Math.log2(bins); // Normalize to [0,1]
  };

  // Zeta field energy calculation
  const zetaFieldAnalysis = useMemo(() => {
    return priceData.map((price, idx) => {
      const window = priceData.slice(Math.max(0, idx - entropyWindow + 1), idx + 1);
      
      // Normalize price for zeta calculation
      const normalizedPrice = (price - Math.min(...priceData)) / (Math.max(...priceData) - Math.min(...priceData)) + 1;
      
      // Calculate various zeta values
      const zeta2 = riemannZeta(2, 100); // ζ(2) = π²/6
      const zeta3 = riemannZeta(3, 100); // Apéry's constant
      const zetaN = riemannZeta(normalizedPrice + 1, 100);
      
      // Market entropy
      const entropy = calculateMarketEntropy(window);
      
      // Prime gap analysis
      const priceAsInt = Math.floor(price);
      const primeCount = primeCountingFunction(priceAsInt);
      const primeGap = priceAsInt > 2 ? priceAsInt - primeCount : 0;
      
      // Zeta field energy
      const fieldEnergy = zetaN / (zeta2 * Math.sqrt(entropy + 0.001));
      
      // Critical line proximity (Re(s) = 1/2 for non-trivial zeros)
      const criticalLineDistance = Math.abs(normalizedPrice - 0.5);
      
      return {
        time: timeStamps[idx],
        price,
        entropy,
        zetaN,
        fieldEnergy,
        primeGap,
        criticalLineDistance,
        normalizedPrice,
        index: idx
      };
    });
  }, [priceData, timeStamps, entropyWindow]);

  // Entropy collapse detection
  const entropyCollapses = useMemo(() => {
    const collapses: any[] = [];
    
    zetaFieldAnalysis.forEach((point, idx) => {
      if (idx < 5) return;
      
      const recentEntropy = zetaFieldAnalysis.slice(idx - 5, idx + 1).map(p => p.entropy);
      const avgEntropy = recentEntropy.reduce((a, b) => a + b, 0) / recentEntropy.length;
      const entropyChange = point.entropy - avgEntropy;
      
      // Detect sudden entropy collapse (order emerging from chaos)
      if (entropyChange < -0.3 && point.entropy < 0.3) {
        collapses.push({
          ...point,
          severity: Math.abs(entropyChange),
          type: 'ENTROPY_COLLAPSE'
        });
      }
      
      // Detect entropy explosion (chaos emerging from order)
      if (entropyChange > 0.4 && point.entropy > 0.7) {
        collapses.push({
          ...point,
          severity: entropyChange,
          type: 'ENTROPY_EXPLOSION'
        });
      }
    });
    
    return collapses;
  }, [zetaFieldAnalysis]);

  // Critical line analysis (where zeta zeros are hypothesized to lie)
  const criticalLineAnalysis = useMemo(() => {
    return zetaFieldAnalysis.map(point => {
      const isCritical = point.criticalLineDistance < criticalThreshold;
      const zetaZeroProximity = Math.exp(-point.criticalLineDistance * 10);
      
      // Hypothetical non-trivial zero influence
      const zeroInfluence = zetaZeroProximity * Math.sin(2 * Math.PI * point.normalizedPrice * 14.134725); // First zero imaginary part
      
      return {
        ...point,
        isCritical,
        zetaZeroProximity,
        zeroInfluence
      };
    });
  }, [zetaFieldAnalysis, criticalThreshold]);

  // Market predictions based on zeta entropy
  const zetaPredictions = useMemo(() => {
    return criticalLineAnalysis.map((point, idx) => {
      if (idx === 0) return { ...point, prediction: 0, confidence: 0, signal: 'NEUTRAL' };
      
      const prevPoint = criticalLineAnalysis[idx - 1];
      
      // Prediction based on field energy change and entropy
      const energyDelta = point.fieldEnergy - prevPoint.fieldEnergy;
      const entropyDelta = point.entropy - prevPoint.entropy;
      
      // Combined prediction signal
      let prediction = 0;
      let signal = 'NEUTRAL';
      
      if (point.isCritical) {
        // Near critical line - high probability of market movement
        prediction = energyDelta * (1 - point.entropy);
        
        if (prediction > 0.1) signal = 'BUY';
        else if (prediction < -0.1) signal = 'SELL';
      }
      
      // Confidence based on zeta zero proximity and entropy stability
      const confidence = point.zetaZeroProximity * (1 - Math.abs(entropyDelta)) * 100;
      
      return {
        ...point,
        prediction,
        confidence: Math.min(95, confidence),
        signal,
        energyDelta,
        entropyDelta
      };
    });
  }, [criticalLineAnalysis]);

  // Aggregate analytics
  const aggregateAnalytics = useMemo(() => {
    const recentAnalysis = zetaPredictions.slice(-50);
    
    const avgEntropy = recentAnalysis.reduce((sum, p) => sum + p.entropy, 0) / recentAnalysis.length;
    const avgFieldEnergy = recentAnalysis.reduce((sum, p) => sum + p.fieldEnergy, 0) / recentAnalysis.length;
    const criticalPoints = recentAnalysis.filter(p => p.isCritical).length;
    const highConfidenceSignals = recentAnalysis.filter(p => p.confidence > 70).length;
    
    return {
      avgEntropy,
      avgFieldEnergy,
      criticalPoints,
      highConfidenceSignals,
      marketPhase: avgEntropy > 0.6 ? 'CHAOTIC' : avgEntropy < 0.3 ? 'ORDERED' : 'TRANSITIONAL'
    };
  }, [zetaPredictions]);

  // Zeta entropy correlation matrix
  const correlationMatrix = useMemo(() => {
    const recent = zetaFieldAnalysis.slice(-100);
    const metrics = ['entropy', 'fieldEnergy', 'primeGap', 'criticalLineDistance'];
    const matrix: { [key: string]: { [key: string]: number } } = {};
    
    metrics.forEach(metric1 => {
      matrix[metric1] = {};
      metrics.forEach(metric2 => {
        if (metric1 === metric2) {
          matrix[metric1][metric2] = 1;
        } else {
          const values1 = recent.map(p => (p as any)[metric1]);
          const values2 = recent.map(p => (p as any)[metric2]);
          
          const mean1 = values1.reduce((a, b) => a + b, 0) / values1.length;
          const mean2 = values2.reduce((a, b) => a + b, 0) / values2.length;
          
          let num = 0, den1 = 0, den2 = 0;
          values1.forEach((v1, i) => {
            const v2 = values2[i];
            num += (v1 - mean1) * (v2 - mean2);
            den1 += (v1 - mean1) ** 2;
            den2 += (v2 - mean2) ** 2;
          });
          
          matrix[metric1][metric2] = num / Math.sqrt(den1 * den2) || 0;
        }
      });
    });
    
    return matrix;
  }, [zetaFieldAnalysis]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Infinity className="h-6 w-6 text-primary" />
                Zeta Entropy Analyzer: {symbol}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Riemann Zeta Function • Shannon Entropy • Critical Line Hypothesis • Prime Field Analysis
              </p>
            </div>
            <Badge 
              variant="default" 
              className={`px-3 py-1 ${
                aggregateAnalytics.marketPhase === 'ORDERED' ? 'bg-resonance/20 text-resonance' :
                aggregateAnalytics.marketPhase === 'CHAOTIC' ? 'bg-chaos/20 text-chaos' :
                'bg-temporal/20 text-temporal'
              }`}
            >
              {aggregateAnalytics.marketPhase} PHASE
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {(aggregateAnalytics.avgEntropy * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">Market Entropy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-temporal">
                {aggregateAnalytics.criticalPoints}
              </div>
              <div className="text-xs text-muted-foreground">Critical Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-resonance">
                {entropyCollapses.length}
              </div>
              <div className="text-xs text-muted-foreground">Entropy Events</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">
                {(aggregateAnalytics.avgFieldEnergy * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">Field Energy</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Zeta Parameters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Zeta Computation Depth</label>
              <select 
                value={zetaDepth} 
                onChange={(e) => setZetaDepth(Number(e.target.value))}
                className="w-full mt-1 p-2 border rounded-md bg-background"
              >
                {[5, 10, 15, 20, 25].map(d => (
                  <option key={d} value={d}>{d} Terms</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Entropy Window</label>
              <select 
                value={entropyWindow} 
                onChange={(e) => setEntropyWindow(Number(e.target.value))}
                className="w-full mt-1 p-2 border rounded-md bg-background"
              >
                {[10, 15, 20, 25, 30].map(w => (
                  <option key={w} value={w}>{w} Points</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Critical Threshold</label>
              <input 
                type="range" 
                min="0.1" 
                max="1.0" 
                step="0.1" 
                value={criticalThreshold}
                onChange={(e) => setCriticalThreshold(Number(e.target.value))}
                className="w-full mt-2"
              />
              <div className="text-xs text-center mt-1">{criticalThreshold}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="entropy" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="entropy">Entropy Field</TabsTrigger>
          <TabsTrigger value="zeta">Zeta Analysis</TabsTrigger>
          <TabsTrigger value="critical">Critical Line</TabsTrigger>
          <TabsTrigger value="events">Entropy Events</TabsTrigger>
          <TabsTrigger value="predictions">Zeta Predictions</TabsTrigger>
        </TabsList>

        {/* Entropy Field */}
        <TabsContent value="entropy">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Waves className="h-5 w-5" />
                Market Entropy Field
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={zetaFieldAnalysis.slice(-50)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="time" 
                      tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                    />
                    <YAxis tick={{ fill: 'hsl(var(--foreground))' }} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="entropy" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary))"
                      fillOpacity={0.3}
                      strokeWidth={2}
                      name="Market Entropy"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="fieldEnergy" 
                      stroke="hsl(var(--resonance))" 
                      strokeWidth={2}
                      name="Field Energy"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Zeta Analysis */}
        <TabsContent value="zeta">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Infinity className="h-5 w-5" />
                Riemann Zeta Field Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={zetaFieldAnalysis.slice(-50)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="time" 
                      tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                    />
                    <YAxis tick={{ fill: 'hsl(var(--foreground))' }} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="zetaN" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      name="ζ(n)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="primeGap" 
                      stroke="hsl(var(--temporal))" 
                      strokeWidth={2}
                      name="Prime Gap"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="fieldEnergy" 
                      stroke="hsl(var(--resonance))" 
                      strokeWidth={2}
                      name="Field Energy"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Critical Line */}
        <TabsContent value="critical">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Critical Line Hypothesis (Re(s) = 1/2)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      type="number"
                      dataKey="criticalLineDistance"
                      domain={[0, 1]}
                      tick={{ fill: 'hsl(var(--foreground))' }}
                      name="Distance from Critical Line"
                    />
                    <YAxis 
                      type="number"
                      dataKey="zetaZeroProximity"
                      domain={[0, 1]}
                      tick={{ fill: 'hsl(var(--foreground))' }}
                      name="Zero Proximity"
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Scatter 
                      data={criticalLineAnalysis.slice(-50).filter(p => p.isCritical)} 
                      fill="hsl(var(--resonance))"
                      name="Critical Points"
                    />
                    <Scatter 
                      data={criticalLineAnalysis.slice(-50).filter(p => !p.isCritical)} 
                      fill="hsl(var(--muted-foreground))"
                      name="Non-Critical Points"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Entropy Events */}
        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Entropy Collapse/Explosion Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {entropyCollapses.slice(-10).map((event, idx) => (
                  <div key={idx} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={event.type === 'ENTROPY_COLLAPSE' ? 'default' : 'destructive'}
                          className={
                            event.type === 'ENTROPY_COLLAPSE' 
                              ? 'bg-resonance/20 text-resonance' 
                              : 'bg-chaos/20 text-chaos'
                          }
                        >
                          {event.type.replace('_', ' ')}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{event.time}</span>
                      </div>
                      <span className="font-medium">${event.price.toFixed(2)}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Severity:</span>
                        <span className="ml-2 font-mono">{event.severity.toFixed(4)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Entropy:</span>
                        <span className="ml-2 font-mono">{event.entropy.toFixed(4)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Field Energy:</span>
                        <span className="ml-2 font-mono">{event.fieldEnergy.toFixed(4)}</span>
                      </div>
                    </div>
                    <Progress 
                      value={event.severity * 100} 
                      className="mt-2 h-2"
                    />
                  </div>
                ))}
                
                {entropyCollapses.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No significant entropy events detected in recent data
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Zeta Predictions */}
        <TabsContent value="predictions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Zeta-Based Market Predictions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {zetaPredictions.slice(-10).reverse().map((pred, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={pred.signal === 'BUY' ? 'default' : pred.signal === 'SELL' ? 'destructive' : 'outline'}
                        className={
                          pred.signal === 'BUY' ? 'bg-resonance/20 text-resonance' :
                          pred.signal === 'SELL' ? 'bg-chaos/20 text-chaos' :
                          'bg-muted/20 text-muted-foreground'
                        }
                      >
                        {pred.signal}
                      </Badge>
                      {pred.isCritical && (
                        <Badge variant="outline" className="bg-temporal/20 text-temporal">
                          Critical Line
                        </Badge>
                      )}
                      <div>
                        <div className="font-medium">${pred.price.toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">{pred.time}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{pred.confidence.toFixed(1)}%</div>
                      <div className="text-xs text-muted-foreground">
                        Entropy: {pred.entropy.toFixed(3)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};