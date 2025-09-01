import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Atom, Zap, Target, Waves, Brain, TrendingUp, AlertTriangle, Activity } from 'lucide-react';

interface QuantumResonanceDetectorProps {
  priceData: number[];
  timeStamps: string[];
  symbol: string;
}

export const QuantumResonanceDetector: React.FC<QuantumResonanceDetectorProps> = ({
  priceData,
  timeStamps,
  symbol
}) => {
  const [quantumDepth, setQuantumDepth] = useState(7);
  const [coherenceThreshold, setCoherenceThreshold] = useState(0.75);
  const [entanglementMode, setEntanglementMode] = useState<'wave' | 'particle' | 'superposition'>('superposition');

  // Quantum state calculation using wave functions
  const quantumStates = useMemo(() => {
    return priceData.map((price, idx) => {
      // Normalize price to quantum amplitude
      const amplitude = (price - Math.min(...priceData)) / (Math.max(...priceData) - Math.min(...priceData));
      
      // Calculate quantum phase
      const phase = (2 * Math.PI * idx) / priceData.length;
      
      // Wave function components
      const realPart = amplitude * Math.cos(phase);
      const imagPart = amplitude * Math.sin(phase);
      
      // Probability density |ψ|²
      const probability = realPart * realPart + imagPart * imagPart;
      
      // Quantum uncertainty (Heisenberg principle)
      const uncertainty = Math.sqrt(probability * (1 - probability));
      
      return {
        time: timeStamps[idx],
        price,
        amplitude,
        phase,
        realPart,
        imagPart,
        probability,
        uncertainty,
        index: idx
      };
    });
  }, [priceData, timeStamps]);

  // Quantum entanglement detection between price points
  const entanglementMatrix = useMemo(() => {
    const matrix: number[][] = [];
    const windowSize = Math.min(50, priceData.length);
    
    for (let i = 0; i < windowSize; i++) {
      matrix[i] = [];
      for (let j = 0; j < windowSize; j++) {
        if (i === j) {
          matrix[i][j] = 1;
        } else {
          const state1 = quantumStates[i];
          const state2 = quantumStates[j];
          
          // Calculate quantum correlation
          const correlation = Math.abs(
            state1.realPart * state2.realPart + state1.imagPart * state2.imagPart
          );
          
          matrix[i][j] = correlation;
        }
      }
    }
    
    return matrix;
  }, [quantumStates, priceData.length]);

  // Quantum coherence measurement
  const coherenceAnalysis = useMemo(() => {
    return quantumStates.map((state, idx) => {
      if (idx === 0) return { ...state, coherence: 0, decoherence: 0 };
      
      const prevState = quantumStates[idx - 1];
      
      // Phase coherence
      const phaseDiff = Math.abs(state.phase - prevState.phase);
      const phaseCoherence = Math.cos(phaseDiff);
      
      // Amplitude coherence
      const ampDiff = Math.abs(state.amplitude - prevState.amplitude);
      const ampCoherence = 1 / (1 + ampDiff);
      
      // Combined coherence
      const coherence = (phaseCoherence + ampCoherence) / 2;
      
      // Decoherence rate
      const decoherence = 1 - coherence;
      
      return {
        ...state,
        coherence,
        decoherence,
        phaseCoherence,
        ampCoherence
      };
    });
  }, [quantumStates]);

  // Quantum tunneling probability (price breaking through resistance/support)
  const tunnelingProbability = useMemo(() => {
    return priceData.map((price, idx) => {
      if (idx < 10) return 0;
      
      // Calculate recent support/resistance levels
      const recentPrices = priceData.slice(Math.max(0, idx - 20), idx);
      const resistance = Math.max(...recentPrices);
      const support = Math.min(...recentPrices);
      
      // Barrier height and width
      const barrierHeight = Math.abs(price - (price > (resistance + support) / 2 ? resistance : support));
      const barrierWidth = Math.abs(resistance - support);
      
      // Quantum tunneling probability (simplified)
      const energy = quantumStates[idx].probability;
      const tunneling = Math.exp(-2 * Math.sqrt(2 * barrierHeight * barrierWidth) / energy);
      
      return Math.min(1, tunneling);
    });
  }, [priceData, quantumStates]);

  // Quantum field resonance detection
  const resonanceFields = useMemo(() => {
    const fields = [];
    const fieldSize = Math.floor(priceData.length / quantumDepth);
    
    for (let i = 0; i < quantumDepth; i++) {
      const start = i * fieldSize;
      const end = Math.min(start + fieldSize, priceData.length);
      const fieldData = quantumStates.slice(start, end);
      
      if (fieldData.length === 0) continue;
      
      // Field energy calculation
      const totalEnergy = fieldData.reduce((sum, state) => sum + state.probability, 0);
      const avgEnergy = totalEnergy / fieldData.length;
      
      // Field coherence
      const coherenceSum = fieldData.reduce((sum, state) => {
        const coherent = coherenceAnalysis[state.index];
        return sum + (coherent?.coherence || 0);
      }, 0);
      const avgCoherence = coherenceSum / fieldData.length;
      
      // Field resonance strength
      const resonanceStrength = avgEnergy * avgCoherence;
      
      fields.push({
        field: i + 1,
        start,
        end,
        energy: avgEnergy,
        coherence: avgCoherence,
        resonance: resonanceStrength,
        dataPoints: fieldData.length
      });
    }
    
    return fields.sort((a, b) => b.resonance - a.resonance);
  }, [quantumStates, coherenceAnalysis, quantumDepth, priceData.length]);

  // Quantum market signals
  const quantumSignals = useMemo(() => {
    return coherenceAnalysis.map((state, idx) => {
      const tunneling = tunnelingProbability[idx];
      const fieldResonance = resonanceFields.find(f => idx >= f.start && idx < f.end)?.resonance || 0;
      
      let signal = 'NEUTRAL';
      let confidence = 0;
      
      // High coherence + high tunneling = strong signal
      if (state.coherence > coherenceThreshold && tunneling > 0.3) {
        signal = state.price > priceData[Math.max(0, idx - 1)] ? 'BUY' : 'SELL';
        confidence = (state.coherence + tunneling + fieldResonance) * 100 / 3;
      }
      
      // Superposition collapse detection
      const isCollapse = state.uncertainty < 0.1 && state.coherence > 0.8;
      
      return {
        ...state,
        signal,
        confidence: Math.min(95, confidence),
        tunneling,
        fieldResonance,
        isCollapse
      };
    });
  }, [coherenceAnalysis, tunnelingProbability, resonanceFields, coherenceThreshold, priceData]);

  // Quantum radar data for visualization
  const quantumRadar = useMemo(() => {
    const recent = quantumSignals.slice(-10);
    
    return [
      {
        subject: 'Coherence',
        value: recent.reduce((sum, s) => sum + s.coherence, 0) / recent.length * 100,
        fullMark: 100
      },
      {
        subject: 'Tunneling',
        value: recent.reduce((sum, s) => sum + s.tunneling, 0) / recent.length * 100,
        fullMark: 100
      },
      {
        subject: 'Field Resonance',
        value: recent.reduce((sum, s) => sum + s.fieldResonance, 0) / recent.length * 100,
        fullMark: 100
      },
      {
        subject: 'Amplitude',
        value: recent.reduce((sum, s) => sum + s.amplitude, 0) / recent.length * 100,
        fullMark: 100
      },
      {
        subject: 'Probability',
        value: recent.reduce((sum, s) => sum + s.probability, 0) / recent.length * 100,
        fullMark: 100
      },
      {
        subject: 'Uncertainty',
        value: (1 - recent.reduce((sum, s) => sum + s.uncertainty, 0) / recent.length) * 100,
        fullMark: 100
      }
    ];
  }, [quantumSignals]);

  // Overall quantum score
  const quantumScore = useMemo(() => {
    const recentSignals = quantumSignals.slice(-20);
    const avgCoherence = recentSignals.reduce((sum, s) => sum + s.coherence, 0) / recentSignals.length;
    const avgTunneling = recentSignals.reduce((sum, s) => sum + s.tunneling, 0) / recentSignals.length;
    const avgResonance = recentSignals.reduce((sum, s) => sum + s.fieldResonance, 0) / recentSignals.length;
    
    return ((avgCoherence + avgTunneling + avgResonance) / 3) * 100;
  }, [quantumSignals]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Atom className="h-6 w-6 text-primary animate-spin" />
                Quantum Resonance Detector: {symbol}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Wave Function Analysis • Quantum Coherence • Tunneling Probability • Field Resonance
              </p>
            </div>
            <Badge 
              variant="default" 
              className={`px-3 py-1 ${
                quantumScore > 70 ? 'bg-resonance/20 text-resonance' :
                quantumScore > 40 ? 'bg-temporal/20 text-temporal' :
                'bg-chaos/20 text-chaos'
              }`}
            >
              Quantum Score: {quantumScore.toFixed(1)}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{quantumScore.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">Quantum Coherence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-temporal">
                {resonanceFields.length}
              </div>
              <div className="text-xs text-muted-foreground">Resonance Fields</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-resonance">
                {quantumSignals.filter(s => s.isCollapse).length}
              </div>
              <div className="text-xs text-muted-foreground">Wave Collapses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">
                {quantumSignals.filter(s => s.confidence > 70).length}
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
            <Waves className="h-5 w-5" />
            Quantum Parameters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Quantum Depth</label>
              <select 
                value={quantumDepth} 
                onChange={(e) => setQuantumDepth(Number(e.target.value))}
                className="w-full mt-1 p-2 border rounded-md bg-background"
              >
                {[3,5,7,9,11].map(d => (
                  <option key={d} value={d}>{d} Fields</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Coherence Threshold</label>
              <input 
                type="range" 
                min="0.1" 
                max="1.0" 
                step="0.05" 
                value={coherenceThreshold}
                onChange={(e) => setCoherenceThreshold(Number(e.target.value))}
                className="w-full mt-2"
              />
              <div className="text-xs text-center mt-1">{coherenceThreshold}</div>
            </div>
            <div>
              <label className="text-sm font-medium">Entanglement Mode</label>
              <select 
                value={entanglementMode} 
                onChange={(e) => setEntanglementMode(e.target.value as any)}
                className="w-full mt-1 p-2 border rounded-md bg-background"
              >
                <option value="wave">Wave</option>
                <option value="particle">Particle</option>
                <option value="superposition">Superposition</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="coherence" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="coherence">Quantum Coherence</TabsTrigger>
          <TabsTrigger value="tunneling">Tunneling</TabsTrigger>
          <TabsTrigger value="fields">Resonance Fields</TabsTrigger>
          <TabsTrigger value="radar">Quantum Radar</TabsTrigger>
          <TabsTrigger value="signals">Quantum Signals</TabsTrigger>
        </TabsList>

        {/* Quantum Coherence */}
        <TabsContent value="coherence">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Quantum Coherence Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={coherenceAnalysis.slice(-50)}>
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
                      dataKey="coherence" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      name="Coherence"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="decoherence" 
                      stroke="hsl(var(--chaos))" 
                      strokeWidth={2}
                      name="Decoherence"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="uncertainty" 
                      stroke="hsl(var(--temporal))" 
                      strokeWidth={1}
                      strokeDasharray="3 3"
                      name="Uncertainty"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tunneling Analysis */}
        <TabsContent value="tunneling">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Quantum Tunneling Probability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceData.slice(-50).map((price, idx) => ({
                    time: timeStamps[timeStamps.length - 50 + idx],
                    price,
                    tunneling: tunnelingProbability[tunnelingProbability.length - 50 + idx] * 100
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="time" 
                      tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                    />
                    <YAxis 
                      yAxisId="left"
                      tick={{ fill: 'hsl(var(--foreground))' }} 
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      tick={{ fill: 'hsl(var(--foreground))' }} 
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="price" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      name="Price"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="tunneling" 
                      stroke="hsl(var(--resonance))" 
                      strokeWidth={3}
                      name="Tunneling Probability (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resonance Fields */}
        <TabsContent value="fields">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quantum Resonance Fields
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {resonanceFields.map((field, idx) => (
                  <div key={idx} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Field {field.field}</h4>
                      <Badge 
                        variant={field.resonance > 0.5 ? 'default' : 'outline'}
                        className={field.resonance > 0.5 ? 'bg-resonance/20 text-resonance' : ''}
                      >
                        Resonance: {(field.resonance * 100).toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Energy:</span>
                        <span className="ml-2 font-mono">{field.energy.toFixed(4)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Coherence:</span>
                        <span className="ml-2 font-mono">{field.coherence.toFixed(4)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Data Points:</span>
                        <span className="ml-2 font-mono">{field.dataPoints}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Range:</span>
                        <span className="ml-2 font-mono">{field.start}-{field.end}</span>
                      </div>
                    </div>
                    <Progress 
                      value={field.resonance * 100} 
                      className="mt-2 h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quantum Radar */}
        <TabsContent value="radar">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Quantum State Radar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={quantumRadar}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis 
                      dataKey="subject"
                      tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                    />
                    <PolarRadiusAxis 
                      angle={0}
                      tick={{ fill: 'hsl(var(--foreground))', fontSize: 10 }}
                      domain={[0, 100]}
                    />
                    <Radar 
                      name="Quantum State" 
                      dataKey="value" 
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quantum Signals */}
        <TabsContent value="signals">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Quantum Trading Signals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quantumSignals.slice(-10).reverse().map((signal, idx) => (
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
                      {signal.isCollapse && (
                        <Badge variant="outline" className="bg-temporal/20 text-temporal">
                          Wave Collapse
                        </Badge>
                      )}
                      <div>
                        <div className="font-medium">${signal.price.toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">{signal.time}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{signal.confidence.toFixed(1)}%</div>
                      <div className="text-xs text-muted-foreground">
                        Coherence: {signal.coherence.toFixed(3)}
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