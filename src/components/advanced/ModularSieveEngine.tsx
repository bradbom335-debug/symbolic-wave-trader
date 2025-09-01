import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { Brain, Zap, Target, Filter, TrendingUp, AlertTriangle, Activity } from 'lucide-react';

interface ModularSieveProps {
  symbol: string;
  priceData: number[];
  timeStamps: string[];
}

// Prime numbers for harmonic projection
const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];

// Moduli for recursive sieving (primorials)
const MODULI = [6, 10, 30, 60, 210];

export const ModularSieveEngine: React.FC<ModularSieveProps> = ({ 
  symbol, 
  priceData, 
  timeStamps 
}) => {
  const [activeModulus, setActiveModulus] = useState(30);
  const [sieveDepth, setSieveDepth] = useState(3);
  const [resonanceThreshold, setResonanceThreshold] = useState(0.8);
  const [isProcessing, setIsProcessing] = useState(false);

  // Modular encoding function
  const encodeModular = (value: number, modulus: number): number => {
    return Math.floor(Math.abs(value * 1000)) % modulus;
  };

  // Calculate entropy for residue class
  const calculateEntropy = (data: number[]): number => {
    const freq: { [key: number]: number } = {};
    data.forEach(val => {
      freq[val] = (freq[val] || 0) + 1;
    });
    
    const total = data.length;
    let entropy = 0;
    Object.values(freq).forEach(count => {
      const p = count / total;
      if (p > 0) entropy -= p * Math.log2(p);
    });
    
    return entropy;
  };

  // Detect composite arms (high entropy, low signal arms)
  const detectCompositeArms = (modulus: number): number[] => {
    const armData: { [key: number]: number[] } = {};
    
    // Group data by residue class
    priceData.forEach((price, idx) => {
      const residue = encodeModular(price, modulus);
      if (!armData[residue]) armData[residue] = [];
      armData[residue].push(price);
    });

    // Find high-entropy arms (composite-dense)
    const compositeArms: number[] = [];
    Object.keys(armData).forEach(arm => {
      const armNum = parseInt(arm);
      const entropy = calculateEntropy(armData[armNum]);
      const variance = calculateVariance(armData[armNum]);
      
      // High entropy + high variance = composite arm
      if (entropy > 2.5 && variance > 0.3) {
        compositeArms.push(armNum);
      }
    });

    return compositeArms;
  };

  // Calculate variance
  const calculateVariance = (data: number[]): number => {
    if (data.length === 0) return 0;
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / data.length;
    return variance / (mean * mean); // Coefficient of variation
  };

  // Recursive modular sieve
  const recursiveModularSieve = useMemo(() => {
    let survivingIndices = new Set(priceData.map((_, idx) => idx));
    const sieveResults: { [modulus: number]: number[] } = {};

    MODULI.slice(0, sieveDepth).forEach(modulus => {
      const compositeArms = detectCompositeArms(modulus);
      sieveResults[modulus] = compositeArms;
      
      // Filter out indices in composite arms
      survivingIndices = new Set([...survivingIndices].filter(idx => {
        const residue = encodeModular(priceData[idx], modulus);
        return !compositeArms.includes(residue);
      }));
    });

    return {
      survivingIndices: [...survivingIndices],
      sieveResults
    };
  }, [priceData, sieveDepth]);

  // Harmonic Neural Network projection
  const harmonicProjection = useMemo(() => {
    return priceData.map((price, idx) => {
      let zetaSum = 0;
      
      PRIMES.slice(0, 10).forEach((prime, i) => {
        const weight = 1 / Math.sqrt(i + 1); // Decaying weights
        const harmonic = Math.cos(Math.log(price) / Math.log(prime));
        zetaSum += weight * harmonic;
      });
      
      return {
        time: timeStamps[idx],
        price,
        zeta: zetaSum / 10, // Normalize
        index: idx,
        isSurviving: recursiveModularSieve.survivingIndices.includes(idx)
      };
    });
  }, [priceData, timeStamps, recursiveModularSieve]);

  // Generate trading signals
  const tradingSignals = useMemo(() => {
    return harmonicProjection.map((point, idx) => {
      if (!point.isSurviving) return { ...point, signal: 'NEUTRAL', confidence: 0 };
      
      let signal = 'NEUTRAL';
      let confidence = 0;
      
      if (point.zeta > resonanceThreshold) {
        signal = 'BUY';
        confidence = Math.min(95, (point.zeta - resonanceThreshold) * 100);
      } else if (point.zeta < -resonanceThreshold) {
        signal = 'SELL';
        confidence = Math.min(95, Math.abs(point.zeta + resonanceThreshold) * 100);
      }
      
      return { ...point, signal, confidence };
    });
  }, [harmonicProjection, resonanceThreshold]);

  // Modular spiral data for visualization
  const modularSpiralData = useMemo(() => {
    return priceData.slice(-100).map((price, idx) => {
      const residue = encodeModular(price, activeModulus);
      const theta = (2 * Math.PI * residue) / activeModulus;
      const r = Math.sqrt(idx + 1);
      
      return {
        x: r * Math.cos(theta),
        y: r * Math.sin(theta),
        price,
        residue,
        index: idx,
        isComposite: recursiveModularSieve.sieveResults[activeModulus]?.includes(residue) || false
      };
    });
  }, [priceData, activeModulus, recursiveModularSieve]);

  // Calculate overall resonance score
  const overallResonance = useMemo(() => {
    const survivingPoints = harmonicProjection.filter(p => p.isSurviving);
    if (survivingPoints.length === 0) return 0;
    
    const avgZeta = survivingPoints.reduce((sum, p) => sum + Math.abs(p.zeta), 0) / survivingPoints.length;
    return Math.min(100, avgZeta * 100);
  }, [harmonicProjection]);

  // Current market phase
  const currentPhase = useMemo(() => {
    const recentSignals = tradingSignals.slice(-10);
    const buySignals = recentSignals.filter(s => s.signal === 'BUY').length;
    const sellSignals = recentSignals.filter(s => s.signal === 'SELL').length;
    
    if (buySignals > sellSignals + 2) return 'BULLISH_RESONANCE';
    if (sellSignals > buySignals + 2) return 'BEARISH_RESONANCE';
    return 'QUANTUM_EQUILIBRIUM';
  }, [tradingSignals]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-primary" />
                Modular Sieve Analysis: {symbol}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Harmonic Neural Network • Recursive Modular Filtering • Zeta Entropy Analysis
              </p>
            </div>
            <Badge 
              variant="default" 
              className={`px-3 py-1 ${
                currentPhase === 'BULLISH_RESONANCE' ? 'bg-resonance/20 text-resonance' :
                currentPhase === 'BEARISH_RESONANCE' ? 'bg-chaos/20 text-chaos' :
                'bg-temporal/20 text-temporal'
              }`}
            >
              {currentPhase.replace('_', ' ')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{overallResonance.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">Neural Resonance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-temporal">
                {recursiveModularSieve.survivingIndices.length}
              </div>
              <div className="text-xs text-muted-foreground">Surviving Signals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-resonance">{sieveDepth}</div>
              <div className="text-xs text-muted-foreground">Sieve Layers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">
                {tradingSignals.filter(s => s.confidence > 70).length}
              </div>
              <div className="text-xs text-muted-foreground">High Confidence</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Sieve Parameters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Active Modulus</label>
              <select 
                value={activeModulus} 
                onChange={(e) => setActiveModulus(Number(e.target.value))}
                className="w-full mt-1 p-2 border rounded-md bg-background"
              >
                {MODULI.map(m => (
                  <option key={m} value={m}>Mod {m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Sieve Depth</label>
              <select 
                value={sieveDepth} 
                onChange={(e) => setSieveDepth(Number(e.target.value))}
                className="w-full mt-1 p-2 border rounded-md bg-background"
              >
                {[1,2,3,4,5].map(d => (
                  <option key={d} value={d}>{d} Layers</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Resonance Threshold</label>
              <input 
                type="range" 
                min="0.1" 
                max="1.0" 
                step="0.1" 
                value={resonanceThreshold}
                onChange={(e) => setResonanceThreshold(Number(e.target.value))}
                className="w-full mt-2"
              />
              <div className="text-xs text-center mt-1">{resonanceThreshold}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="spiral" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="spiral">Modular Spiral</TabsTrigger>
          <TabsTrigger value="harmonic">Harmonic Analysis</TabsTrigger>
          <TabsTrigger value="signals">Trading Signals</TabsTrigger>
          <TabsTrigger value="sieve">Sieve Results</TabsTrigger>
        </TabsList>

        {/* Modular Spiral Visualization */}
        <TabsContent value="spiral">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Modular Spiral Field (Mod {activeModulus})
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Price data mapped to modular residue classes. Red points are composite-dense arms.
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      type="number" 
                      dataKey="x" 
                      domain={['dataMin', 'dataMax']}
                      tick={{ fill: 'hsl(var(--foreground))' }}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="y" 
                      domain={['dataMin', 'dataMax']}
                      tick={{ fill: 'hsl(var(--foreground))' }}
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload[0]) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-card border rounded-lg p-3 shadow-lg">
                              <p className="font-medium">Residue Class: {data.residue}</p>
                              <p className="text-sm">Price: ${data.price?.toFixed(2)}</p>
                              <p className="text-sm">
                                Status: {data.isComposite ? 'Composite' : 'Prime-aligned'}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Scatter 
                      data={modularSpiralData.filter(d => !d.isComposite)} 
                      fill="#10b981"
                      name="Prime-aligned"
                    />
                    <Scatter 
                      data={modularSpiralData.filter(d => d.isComposite)} 
                      fill="#ef4444"
                      name="Composite-dense"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Harmonic Analysis */}
        <TabsContent value="harmonic">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Zeta Harmonic Projection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={harmonicProjection.slice(-50)}>
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
                      dataKey="zeta" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 3 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="hsl(var(--temporal))" 
                      strokeWidth={1}
                      strokeDasharray="5 5"
                      yAxisId="right"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trading Signals */}
        <TabsContent value="signals">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Neural Trading Signals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tradingSignals.slice(-10).reverse().map((signal, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={signal.signal === 'BUY' ? 'default' : signal.signal === 'SELL' ? 'destructive' : 'outline'}
                        className={
                          signal.signal === 'BUY' ? 'bg-resonance/20 text-resonance' :
                          signal.signal === 'SELL' ? 'bg-chaos/20 text-chaos' :
                          'bg-muted/20 text-muted-foreground'
                        }
                      >
                        {signal.signal}
                      </Badge>
                      <div>
                        <div className="font-medium">${signal.price.toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">{signal.time}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{signal.confidence.toFixed(1)}%</div>
                      <div className="text-xs text-muted-foreground">
                        Zeta: {signal.zeta.toFixed(3)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sieve Results */}
        <TabsContent value="sieve">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Recursive Sieve Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(recursiveModularSieve.sieveResults).map(([modulus, compositeArms]) => (
                  <div key={modulus} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Modulus {modulus}</h4>
                      <Badge variant="outline">
                        {compositeArms.length} composite arms
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Filtered residue classes: {compositeArms.join(', ')}
                    </div>
                    <Progress 
                      value={(compositeArms.length / Number(modulus)) * 100} 
                      className="h-2"
                    />
                  </div>
                ))}
                
                <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <span className="font-medium">Neural Synthesis</span>
                  </div>
                  <div className="text-sm">
                    <strong>{recursiveModularSieve.survivingIndices.length}</strong> time points 
                    survived all {sieveDepth} sieve layers, representing 
                    <strong> {((recursiveModularSieve.survivingIndices.length / priceData.length) * 100).toFixed(1)}%</strong> 
                    of total data as prime-aligned signals.
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