import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Atom, Zap } from 'lucide-react';
import { useState } from 'react';

interface QuantumState {
  symbol: string;
  probability: number;
  amplitude: number;
  phase: number;
  entanglement: number;
}

const mockQuantumStates: QuantumState[] = [
  {
    symbol: 'LONG AAPL',
    probability: 0.73,
    amplitude: 0.85,
    phase: 1.24,
    entanglement: 0.67
  },
  {
    symbol: 'SHORT TSLA',
    probability: 0.28,
    amplitude: 0.53,
    phase: -0.89,
    entanglement: 0.42
  },
  {
    symbol: 'NVDA CALL',
    probability: 0.91,
    amplitude: 0.95,
    phase: 2.11,
    entanglement: 0.88
  }
];

export const QuantumSimulator = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [iteration, setIteration] = useState(0);

  const handleToggleSimulation = () => {
    setIsRunning(!isRunning);
    if (!isRunning) {
      const interval = setInterval(() => {
        setIteration(prev => prev + 1);
      }, 1000);
      
      setTimeout(() => {
        clearInterval(interval);
        setIsRunning(false);
      }, 10000);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setIteration(0);
  };

  return (
    <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 shadow-neural">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Quantum Trading Simulator</h2>
          <p className="text-sm text-muted-foreground">Probabilistic eigenstate collapse modeling</p>
        </div>
        <div className="flex items-center space-x-2">
          <Atom className="h-5 w-5 text-primary animate-neural-pulse" />
          <span className="text-sm font-medium text-primary">Superposition Active</span>
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <Button
          onClick={handleToggleSimulation}
          variant={isRunning ? "secondary" : "default"}
          className="flex items-center space-x-2"
        >
          {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          <span>{isRunning ? 'Pause' : 'Run'} Simulation</span>
        </Button>
        
        <Button
          onClick={handleReset}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reset</span>
        </Button>

        <div className="flex items-center space-x-4 ml-auto">
          <div className="text-sm">
            <span className="text-muted-foreground">Iteration: </span>
            <span className="font-mono text-primary">{iteration}</span>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Quantum Time: </span>
            <span className="font-mono text-temporal">{(iteration * 0.1).toFixed(1)}τ</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {mockQuantumStates.map((state, index) => {
          const dynamicProbability = isRunning 
            ? Math.max(0, Math.min(1, state.probability + (Math.sin(iteration * 0.3 + index) * 0.2)))
            : state.probability;

          return (
            <div 
              key={index}
              className="group relative p-4 bg-secondary/30 rounded-lg border border-border/30 hover:border-primary/50 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="text-lg font-bold text-foreground">{state.symbol}</div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    dynamicProbability > 0.7 ? 'bg-resonance/20 text-resonance' :
                    dynamicProbability > 0.4 ? 'bg-temporal/20 text-temporal' :
                    'bg-chaos/20 text-chaos'
                  }`}>
                    {dynamicProbability > 0.7 ? 'High Confidence' :
                     dynamicProbability > 0.4 ? 'Uncertain' : 'Low Confidence'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-mono font-bold text-foreground">
                    {(dynamicProbability * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Collapse Probability</div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">Amplitude |ψ|</div>
                  <div className="text-lg font-mono font-bold text-primary">
                    {state.amplitude.toFixed(2)}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">Phase φ</div>
                  <div className="text-lg font-mono font-bold text-temporal">
                    {state.phase.toFixed(2)}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">Entanglement</div>
                  <div className="text-lg font-mono font-bold text-resonance">
                    {state.entanglement.toFixed(2)}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">Coherence</div>
                  <div className="flex items-center justify-center">
                    <Zap className={`h-5 w-5 ${
                      isRunning ? 'text-temporal animate-pulse' : 'text-muted-foreground'
                    }`} />
                  </div>
                </div>
              </div>

              {/* Probability Wave Visualization */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Probability Wave Function</span>
                  <span>ψ²(x,t)</span>
                </div>
                <div className="relative h-8 bg-secondary rounded-lg overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      dynamicProbability > 0.7 ? 'bg-gradient-to-r from-resonance to-resonance-glow' :
                      dynamicProbability > 0.4 ? 'bg-gradient-to-r from-temporal to-temporal-glow' :
                      'bg-gradient-to-r from-chaos to-entropy'
                    }`}
                    style={{ width: `${dynamicProbability * 100}%` }}
                  />
                  {isRunning && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-wave-flow" />
                  )}
                </div>
              </div>

              {/* Quantum Equation */}
              <div className="mt-4 pt-4 border-t border-border/30">
                <div className="text-xs text-muted-foreground mb-1">Quantum State Equation:</div>
                <div className="font-mono text-sm text-primary bg-secondary/50 px-3 py-2 rounded border border-border/30">
                  |ψ⟩ = {state.amplitude.toFixed(2)}e^(i{state.phase.toFixed(2)})|{state.symbol.replace(' ', '_')}⟩
                </div>
              </div>

              {/* Neural Glow Effect */}
              <div className="absolute inset-0 bg-gradient-cognition opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg pointer-events-none" />
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-border/30">
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <div className="text-muted-foreground">Quantum Fidelity</div>
            <div className="font-mono text-resonance font-bold">0.94</div>
          </div>
          <div>
            <div className="text-muted-foreground">Decoherence Time</div>
            <div className="font-mono text-temporal font-bold">2.3τ</div>
          </div>
          <div>
            <div className="text-muted-foreground">Measurement Error</div>
            <div className="font-mono text-entropy font-bold">±0.03</div>
          </div>
        </div>
      </div>
    </Card>
  );
};