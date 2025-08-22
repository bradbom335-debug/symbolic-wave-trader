import { Card } from '@/components/ui/card';
import { Brain, Lightbulb, AlertTriangle, TrendingUp, Atom } from 'lucide-react';

interface AIInsight {
  type: 'prediction' | 'alert' | 'opportunity' | 'analysis';
  title: string;
  content: string;
  confidence: number;
  timestamp: string;
  symbolicAnnotation: string;
}

const mockInsights: AIInsight[] = [
  {
    type: 'prediction',
    title: 'NVDA Prime Resonance Detected',
    content: 'Neural networks identify strong harmonic convergence in NVIDIA. Wave function suggests 12.3% upward probability within 72h temporal window.',
    confidence: 0.87,
    timestamp: '2 minutes ago',
    symbolicAnnotation: 'Ψ(NVDA) → e^(iπ/3) convergence zone'
  },
  {
    type: 'alert',
    title: 'Market Entropy Spike',
    content: 'Composite pattern detected in S&P 500. Chaotic oscillations suggest increased volatility. Defensive positioning recommended.',
    confidence: 0.92,
    timestamp: '7 minutes ago',
    symbolicAnnotation: 'ΔS > 2.1σ threshold breach'
  },
  {
    type: 'opportunity',
    title: 'Fractal Arbitrage Window',
    content: 'Cross-temporal analysis reveals price discrepancy in AAPL options chain. Window closes in 23 minutes.',
    confidence: 0.74,
    timestamp: '12 minutes ago',
    symbolicAnnotation: 'φ(t+Δt) ≠ φ(t) divergence'
  }
];

const getInsightIcon = (type: string) => {
  switch (type) {
    case 'prediction': return Brain;
    case 'alert': return AlertTriangle;
    case 'opportunity': return TrendingUp;
    case 'analysis': return Atom;
    default: return Lightbulb;
  }
};

const getInsightColor = (type: string) => {
  switch (type) {
    case 'prediction': return 'text-primary';
    case 'alert': return 'text-chaos';
    case 'opportunity': return 'text-resonance';
    case 'analysis': return 'text-temporal';
    default: return 'text-muted-foreground';
  }
};

export const AIInsights = () => {
  return (
    <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 shadow-neural">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Neural Intelligence Feed</h2>
          <p className="text-sm text-muted-foreground">Real-time symbolic market cognition</p>
        </div>
        <div className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-primary animate-neural-pulse" />
          <span className="text-sm font-medium text-primary">Grok Online</span>
        </div>
      </div>

      <div className="space-y-4">
        {mockInsights.map((insight, index) => {
          const IconComponent = getInsightIcon(insight.type);
          const colorClass = getInsightColor(insight.type);
          
          return (
            <div 
              key={index}
              className="group relative p-4 bg-secondary/30 rounded-lg border border-border/30 hover:border-primary/50 transition-all duration-300 animate-data-stream"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 p-2 rounded-lg bg-secondary/50 ${colorClass}`}>
                  <IconComponent className="h-5 w-5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-foreground">{insight.title}</h3>
                    <div className="flex items-center space-x-2">
                      <div className="text-xs text-muted-foreground">{insight.timestamp}</div>
                      <div className={`text-xs font-mono px-2 py-1 rounded ${
                        insight.confidence > 0.8 ? 'bg-resonance/20 text-resonance' :
                        insight.confidence > 0.6 ? 'bg-temporal/20 text-temporal' :
                        'bg-entropy/20 text-entropy'
                      }`}>
                        {(insight.confidence * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {insight.content}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-xs text-primary bg-secondary/50 px-3 py-1 rounded border border-border/30">
                      {insight.symbolicAnnotation}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-secondary rounded-full h-1 overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${
                            insight.confidence > 0.8 ? 'bg-resonance' :
                            insight.confidence > 0.6 ? 'bg-temporal' :
                            'bg-entropy'
                          }`}
                          style={{ width: `${insight.confidence * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Neural Glow Effect */}
              <div className="absolute inset-0 bg-gradient-cognition opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg pointer-events-none" />
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-border/30">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Neural Processing Rate</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-resonance rounded-full animate-pulse" />
            <span className="font-mono text-resonance">2.4 THz</span>
          </div>
        </div>
      </div>
    </Card>
  );
};