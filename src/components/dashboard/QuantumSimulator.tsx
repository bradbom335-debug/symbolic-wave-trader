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
    <Card className="h-full flex flex-col bg-[hsl(var(--terminal-bg-panel))] border-[hsl(var(--terminal-bg-elevated))]">
      <div className="p-1.5 border-b border-[hsl(var(--terminal-bg-elevated))] flex items-center justify-between flex-shrink-0">
        <h3 className="text-[10px] font-mono uppercase tracking-wider text-[hsl(var(--terminal-text-dim))]">Quantum Sim</h3>
        <div className="flex items-center gap-1">
          <Atom className="h-3 w-3 text-[hsl(var(--terminal-blue))]" />
          <span className="text-[9px] font-mono text-[hsl(var(--terminal-blue))]">{isRunning ? 'RUN' : 'IDLE'}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-1.5 min-h-0">
        <div className="flex items-center gap-1 mb-2">
          <Button
            onClick={handleToggleSimulation}
            size="sm"
            variant={isRunning ? "secondary" : "default"}
            className="h-5 text-[8px] px-2"
          >
            {isRunning ? <Pause className="h-2.5 w-2.5 mr-1" /> : <Play className="h-2.5 w-2.5 mr-1" />}
            {isRunning ? 'Pause' : 'Run'}
          </Button>
          
          <Button
            onClick={handleReset}
            size="sm"
            variant="outline"
            className="h-5 text-[8px] px-2"
          >
            <RotateCcw className="h-2.5 w-2.5 mr-1" />
            Reset
          </Button>

          <div className="ml-auto text-[9px] font-mono text-[hsl(var(--terminal-text-dim))]">
            Iter: <span className="text-[hsl(var(--terminal-blue))]">{iteration}</span>
          </div>
        </div>

        <div className="space-y-1">
          {mockQuantumStates.map((state, index) => {
            const dynamicProbability = isRunning 
              ? Math.max(0, Math.min(1, state.probability + (Math.sin(iteration * 0.3 + index) * 0.2)))
              : state.probability;

            return (
              <div key={index} className="bg-[hsl(var(--terminal-bg-elevated))]/50 p-1 rounded">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-mono font-bold text-foreground">{state.symbol}</span>
                  <span className={`text-[8px] font-mono ${
                    dynamicProbability > 0.7 ? 'text-[hsl(var(--terminal-green))]' : 
                    dynamicProbability > 0.4 ? 'text-[hsl(var(--terminal-yellow))]' : 
                    'text-[hsl(var(--terminal-red))]'
                  }`}>
                    P: {(dynamicProbability * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="h-1 bg-[hsl(var(--terminal-bg))] rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      dynamicProbability > 0.7 ? 'bg-[hsl(var(--terminal-green))]' : 
                      dynamicProbability > 0.4 ? 'bg-[hsl(var(--terminal-yellow))]' : 
                      'bg-[hsl(var(--terminal-red))]'
                    }`}
                    style={{ width: `${dynamicProbability * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};