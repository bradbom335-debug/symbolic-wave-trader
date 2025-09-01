import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar } from 'recharts';
import { Brain, Zap, Waves, Network, Cpu, Target, TrendingUp, Activity } from 'lucide-react';

interface HarmonicNeuralNetworkProps {
  priceData: number[];
  timeStamps: string[];
  symbol: string;
}

// Fibonacci sequence for neural weighting
const FIBONACCI = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610];

// Prime numbers for harmonic resonance
const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71];

export const HarmonicNeuralNetwork: React.FC<HarmonicNeuralNetworkProps> = ({
  priceData,
  timeStamps,
  symbol
}) => {
  const [networkDepth, setNetworkDepth] = useState(5);
  const [learningRate, setLearningRate] = useState(0.01);
  const [resonanceMode, setResonanceMode] = useState<'fibonacci' | 'prime' | 'hybrid'>('hybrid');
  const [isTraining, setIsTraining] = useState(false);

  // Neuron activation function (symbolic cosine resonance)
  const neuronActivation = (input: number, weight: number, bias: number): number => {
    return Math.cos((input * weight + bias) * Math.PI / 180);
  };

  // Zeta function approximation for harmonic field energy
  const zetaApproximation = (s: number): number => {
    let sum = 0;
    for (let n = 1; n <= 1000; n++) {
      sum += 1 / Math.pow(n, s);
    }
    return sum;
  };

  // Neural weight initialization using harmonic ratios
  const initializeWeights = useMemo(() => {
    const weights: number[][] = [];
    
    for (let layer = 0; layer < networkDepth; layer++) {
      const layerWeights: number[] = [];
      const neuronCount = Math.max(3, networkDepth - layer + 2);
      
      for (let neuron = 0; neuron < neuronCount; neuron++) {
        let weight = 1;
        
        switch (resonanceMode) {
          case 'fibonacci':
            weight = FIBONACCI[neuron % FIBONACCI.length] / 100;
            break;
          case 'prime':
            weight = PRIMES[neuron % PRIMES.length] / 100;
            break;
          case 'hybrid':
            weight = (FIBONACCI[neuron % FIBONACCI.length] * PRIMES[neuron % PRIMES.length]) / 10000;
            break;
        }
        
        layerWeights.push(weight);
      }
      weights.push(layerWeights);
    }
    
    return weights;
  }, [networkDepth, resonanceMode]);

  // Forward propagation through harmonic neural layers
  const forwardPropagate = (input: number, weights: number[][]): number[] => {
    let activations = [input];
    
    weights.forEach((layerWeights, layerIndex) => {
      const layerActivations: number[] = [];
      
      layerWeights.forEach((weight, neuronIndex) => {
        const bias = Math.sin((layerIndex + 1) * Math.PI / 6); // Harmonic bias
        const lastActivation = activations[activations.length - 1];
        const inputValue = Array.isArray(lastActivation) ? lastActivation[0] : lastActivation;
        const activation = neuronActivation(inputValue, weight, bias);
        layerActivations.push(activation);
      });
      
      activations.push(layerActivations.length === 1 ? layerActivations[0] : layerActivations);
    });
    
    return activations.flat();
  };

  // Generate harmonic neural predictions
  const neuralPredictions = useMemo(() => {
    return priceData.map((price, idx) => {
      const normalizedPrice = Math.log(price) / 10; // Log-normalize for stability
      const activations = forwardPropagate(normalizedPrice, initializeWeights);
      
      // Extract prediction from final layer
      const finalActivation = activations[activations.length - 1];
      const prediction = Array.isArray(finalActivation) ? finalActivation[0] : finalActivation;
      
      // Harmonic resonance score
      const resonanceScore = Math.abs(prediction) * 100;
      
      // Phase alignment calculation
      const phaseAlignment = Math.cos(prediction * Math.PI);
      
      return {
        time: timeStamps[idx],
        price,
        prediction: prediction * price, // Scale back to price domain
        resonance: resonanceScore,
        phase: phaseAlignment,
        neuralOutput: prediction,
        activations: activations.slice(0, -1) // All except final
      };
    });
  }, [priceData, timeStamps, initializeWeights]);

  // Market momentum calculation using harmonic derivatives
  const marketMomentum = useMemo(() => {
    return neuralPredictions.map((pred, idx) => {
      if (idx === 0) return { ...pred, momentum: 0, acceleration: 0 };
      
      const prevPred = neuralPredictions[idx - 1];
      const momentum = pred.neuralOutput - prevPred.neuralOutput;
      
      let acceleration = 0;
      if (idx > 1) {
        const prevMomentum = prevPred.neuralOutput - neuralPredictions[idx - 2].neuralOutput;
        acceleration = momentum - prevMomentum;
      }
      
      return {
        ...pred,
        momentum,
        acceleration
      };
    });
  }, [neuralPredictions]);

  // Neural layer analysis
  const layerAnalysis = useMemo(() => {
    const analysis = initializeWeights.map((layerWeights, layerIndex) => {
      const avgWeight = layerWeights.reduce((a, b) => a + b, 0) / layerWeights.length;
      const maxWeight = Math.max(...layerWeights);
      const minWeight = Math.min(...layerWeights);
      const variance = layerWeights.reduce((acc, w) => acc + Math.pow(w - avgWeight, 2), 0) / layerWeights.length;
      
      return {
        layer: layerIndex + 1,
        neurons: layerWeights.length,
        avgWeight: avgWeight,
        maxWeight: maxWeight,
        minWeight: minWeight,
        variance: variance,
        efficiency: 1 / (1 + variance) // Lower variance = higher efficiency
      };
    });
    
    return analysis;
  }, [initializeWeights]);

  // Resonance field energy distribution
  const resonanceDistribution = useMemo(() => {
    const buckets = Array(10).fill(0);
    
    neuralPredictions.forEach(pred => {
      const bucket = Math.min(9, Math.floor(pred.resonance / 10));
      buckets[bucket]++;
    });
    
    return buckets.map((count, idx) => ({
      range: `${idx * 10}-${(idx + 1) * 10}%`,
      count,
      percentage: (count / neuralPredictions.length) * 100
    }));
  }, [neuralPredictions]);

  // Harmonic frequency analysis
  const harmonicFrequencies = useMemo(() => {
    const frequencies = PRIMES.slice(0, 8).map((prime, idx) => {
      let strength = 0;
      
      neuralPredictions.forEach(pred => {
        const harmonicValue = Math.cos(Math.log(pred.price) / Math.log(prime));
        strength += Math.abs(harmonicValue);
      });
      
      return {
        frequency: `Prime ${prime}`,
        strength: strength / neuralPredictions.length,
        prime: prime
      };
    });
    
    return frequencies.sort((a, b) => b.strength - a.strength);
  }, [neuralPredictions]);

  // Network performance metrics
  const performanceMetrics = useMemo(() => {
    const predictions = neuralPredictions.slice(1); // Skip first
    const actualChanges = priceData.slice(1).map((price, idx) => price - priceData[idx]);
    const predictedChanges = predictions.map(p => p.prediction - p.price);
    
    // Calculate correlation
    const meanActual = actualChanges.reduce((a, b) => a + b, 0) / actualChanges.length;
    const meanPredicted = predictedChanges.reduce((a, b) => a + b, 0) / predictedChanges.length;
    
    let numerator = 0;
    let denomActual = 0;
    let denomPredicted = 0;
    
    actualChanges.forEach((actual, idx) => {
      const predicted = predictedChanges[idx];
      numerator += (actual - meanActual) * (predicted - meanPredicted);
      denomActual += Math.pow(actual - meanActual, 2);
      denomPredicted += Math.pow(predicted - meanPredicted, 2);
    });
    
    const correlation = numerator / Math.sqrt(denomActual * denomPredicted);
    
    // Calculate RMSE
    const rmse = Math.sqrt(
      actualChanges.reduce((acc, actual, idx) => {
        return acc + Math.pow(actual - predictedChanges[idx], 2);
      }, 0) / actualChanges.length
    );
    
    return {
      correlation: isNaN(correlation) ? 0 : correlation,
      rmse,
      accuracy: Math.max(0, (1 - rmse / (Math.max(...actualChanges) - Math.min(...actualChanges))) * 100),
      networkEfficiency: layerAnalysis.reduce((acc, layer) => acc + layer.efficiency, 0) / layerAnalysis.length
    };
  }, [neuralPredictions, priceData, layerAnalysis]);

  // Train network (simulated)
  const trainNetwork = async () => {
    setIsTraining(true);
    
    // Simulate training process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsTraining(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-primary animate-neural-pulse" />
                Harmonic Neural Network: {symbol}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Symbolic Resonance Learning • Fibonacci-Prime Weighted Layers • Zeta Field Analysis
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/10">
                {networkDepth} Layers
              </Badge>
              <Badge variant="outline" className="bg-temporal/10">
                {resonanceMode.toUpperCase()} Mode
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {performanceMetrics.accuracy.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">Neural Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-resonance">
                {performanceMetrics.correlation.toFixed(3)}
              </div>
              <div className="text-xs text-muted-foreground">Correlation</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-temporal">
                {(performanceMetrics.networkEfficiency * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">Network Efficiency</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">
                {harmonicFrequencies[0]?.prime || 0}
              </div>
              <div className="text-xs text-muted-foreground">Dominant Frequency</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Network className="h-5 w-5" />
            Network Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Network Depth</label>
              <select 
                value={networkDepth} 
                onChange={(e) => setNetworkDepth(Number(e.target.value))}
                className="w-full mt-1 p-2 border rounded-md bg-background"
              >
                {[3,4,5,6,7,8].map(d => (
                  <option key={d} value={d}>{d} Layers</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Resonance Mode</label>
              <select 
                value={resonanceMode} 
                onChange={(e) => setResonanceMode(e.target.value as any)}
                className="w-full mt-1 p-2 border rounded-md bg-background"
              >
                <option value="fibonacci">Fibonacci</option>
                <option value="prime">Prime</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Learning Rate</label>
              <input 
                type="range" 
                min="0.001" 
                max="0.1" 
                step="0.001" 
                value={learningRate}
                onChange={(e) => setLearningRate(Number(e.target.value))}
                className="w-full mt-2"
              />
              <div className="text-xs text-center mt-1">{learningRate}</div>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={trainNetwork}
                disabled={isTraining}
                className="w-full bg-gradient-neural hover:bg-gradient-neural/90"
              >
                {isTraining ? (
                  <>
                    <Cpu className="h-4 w-4 mr-2 animate-spin" />
                    Training...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Train Network
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="predictions" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="predictions">Neural Predictions</TabsTrigger>
          <TabsTrigger value="layers">Layer Analysis</TabsTrigger>
          <TabsTrigger value="harmonics">Harmonic Field</TabsTrigger>
          <TabsTrigger value="resonance">Resonance Map</TabsTrigger>
          <TabsTrigger value="momentum">Phase Momentum</TabsTrigger>
        </TabsList>

        {/* Neural Predictions */}
        <TabsContent value="predictions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Neural Price Predictions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={neuralPredictions.slice(-50)}>
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
                      dataKey="price" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      name="Actual Price"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="prediction" 
                      stroke="hsl(var(--resonance))" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Neural Prediction"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Layer Analysis */}
        <TabsContent value="layers">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Neural Layer Architecture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {layerAnalysis.map((layer, idx) => (
                  <div key={idx} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Layer {layer.layer}</h4>
                      <Badge variant="outline">{layer.neurons} neurons</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Avg Weight:</span>
                        <span className="ml-2 font-mono">{layer.avgWeight.toFixed(4)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Variance:</span>
                        <span className="ml-2 font-mono">{layer.variance.toFixed(4)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Efficiency:</span>
                        <span className="ml-2 font-mono">{(layer.efficiency * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                    <Progress 
                      value={layer.efficiency * 100} 
                      className="mt-2 h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Harmonic Field */}
        <TabsContent value="harmonics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Waves className="h-5 w-5" />
                Harmonic Frequency Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={harmonicFrequencies}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="frequency" 
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
                    <Bar 
                      dataKey="strength" 
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resonance Distribution */}
        <TabsContent value="resonance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Resonance Energy Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={resonanceDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="range" 
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
                    <Bar 
                      dataKey="count" 
                      fill="hsl(var(--temporal))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Phase Momentum */}
        <TabsContent value="momentum">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Neural Phase Momentum
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={marketMomentum.slice(-50)}>
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
                      dataKey="momentum" 
                      stroke="hsl(var(--resonance))" 
                      strokeWidth={2}
                      name="Momentum"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="acceleration" 
                      stroke="hsl(var(--chaos))" 
                      strokeWidth={2}
                      name="Acceleration"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="phase" 
                      stroke="hsl(var(--temporal))" 
                      strokeWidth={1}
                      strokeDasharray="3 3"
                      name="Phase Alignment"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};