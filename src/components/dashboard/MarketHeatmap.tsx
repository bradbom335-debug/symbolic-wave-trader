import { Card } from '@/components/ui/card';
import { Thermometer, TrendingUp, TrendingDown } from 'lucide-react';

interface HeatmapCell {
  symbol: string;
  sector: string;
  change: number;
  volume: number;
  resonance: number;
  marketCap: number;
}

const mockHeatmapData: HeatmapCell[] = [
  { symbol: 'AAPL', sector: 'Technology', change: 2.34, volume: 1.2, resonance: 0.73, marketCap: 3.1 },
  { symbol: 'MSFT', sector: 'Technology', change: 1.87, volume: 0.8, resonance: 0.81, marketCap: 2.8 },
  { symbol: 'NVDA', sector: 'Technology', change: 5.23, volume: 2.1, resonance: 0.89, marketCap: 1.9 },
  { symbol: 'GOOGL', sector: 'Technology', change: 0.45, volume: 0.6, resonance: 0.67, marketCap: 1.6 },
  { symbol: 'TSLA', sector: 'Consumer', change: -3.21, volume: 1.8, resonance: 0.45, marketCap: 0.8 },
  { symbol: 'JPM', sector: 'Financial', change: 1.12, volume: 0.9, resonance: 0.71, marketCap: 0.5 },
  { symbol: 'V', sector: 'Financial', change: 2.67, volume: 0.7, resonance: 0.78, marketCap: 0.5 },
  { symbol: 'JNJ', sector: 'Healthcare', change: -0.89, volume: 0.4, resonance: 0.59, marketCap: 0.4 },
  { symbol: 'PG', sector: 'Consumer', change: 0.78, volume: 0.3, resonance: 0.64, marketCap: 0.4 },
  { symbol: 'XOM', sector: 'Energy', change: 3.45, volume: 1.1, resonance: 0.52, marketCap: 0.4 },
  { symbol: 'WMT', sector: 'Consumer', change: 1.23, volume: 0.5, resonance: 0.68, marketCap: 0.5 },
  { symbol: 'MA', sector: 'Financial', change: 2.11, volume: 0.6, resonance: 0.76, marketCap: 0.4 }
];

const getCellColor = (change: number, resonance: number) => {
  const intensity = Math.min(Math.abs(change) / 5, 1);
  const resonanceBoost = resonance > 0.7 ? 1.2 : 1;
  
  if (change > 0) {
    return {
      backgroundColor: `hsl(160 84% 39% / ${intensity * resonanceBoost * 0.6})`,
      borderColor: resonance > 0.7 ? 'hsl(160 84% 52%)' : 'hsl(var(--border))'
    };
  } else {
    return {
      backgroundColor: `hsl(0 84% 60% / ${intensity * 0.6})`,
      borderColor: Math.abs(change) > 2 ? 'hsl(0 84% 60%)' : 'hsl(var(--border))'
    };
  }
};

const getCellSize = (marketCap: number) => {
  const maxSize = Math.max(...mockHeatmapData.map(d => d.marketCap));
  const ratio = marketCap / maxSize;
  return Math.max(ratio * 120 + 80, 80); // Min 80px, max 200px
};

export const MarketHeatmap = () => {
  const sectors = Array.from(new Set(mockHeatmapData.map(d => d.sector)));
  
  return (
    <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 shadow-neural">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Market Resonance Heatmap</h2>
          <p className="text-sm text-muted-foreground">Sector frequency analysis & thermal mapping</p>
        </div>
        <div className="flex items-center space-x-2">
          <Thermometer className="h-5 w-5 text-entropy" />
          <span className="text-sm font-medium text-entropy">Thermal Scan Active</span>
        </div>
      </div>

      <div className="space-y-6">
        {sectors.map(sector => {
          const sectorData = mockHeatmapData.filter(d => d.sector === sector);
          const avgChange = sectorData.reduce((sum, d) => sum + d.change, 0) / sectorData.length;
          
          return (
            <div key={sector} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">{sector}</h3>
                <div className="flex items-center space-x-2">
                  {avgChange >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-resonance" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-chaos" />
                  )}
                  <span className={`text-sm font-medium ${
                    avgChange >= 0 ? 'text-resonance' : 'text-chaos'
                  }`}>
                    {avgChange >= 0 ? '+' : ''}{avgChange.toFixed(2)}%
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-6 gap-3">
                {sectorData.map(cell => {
                  const cellStyle = getCellColor(cell.change, cell.resonance);
                  const cellSize = getCellSize(cell.marketCap);
                  
                  return (
                    <div
                      key={cell.symbol}
                      className="group relative rounded-lg border transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden"
                      style={{
                        backgroundColor: cellStyle.backgroundColor,
                        borderColor: cellStyle.borderColor,
                        height: `${cellSize}px`,
                        minHeight: '80px'
                      }}
                    >
                      <div className="absolute inset-0 p-3 flex flex-col justify-between">
                        <div>
                          <div className="text-sm font-bold text-foreground">{cell.symbol}</div>
                          <div className={`text-xs font-medium ${
                            cell.change >= 0 ? 'text-resonance' : 'text-chaos'
                          }`}>
                            {cell.change >= 0 ? '+' : ''}{cell.change.toFixed(2)}%
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">
                            Vol: {cell.volume.toFixed(1)}M
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-muted-foreground">
                              R: {cell.resonance.toFixed(2)}
                            </div>
                            <div className={`w-2 h-2 rounded-full ${
                              cell.resonance > 0.8 ? 'bg-resonance animate-pulse' :
                              cell.resonance > 0.6 ? 'bg-temporal' :
                              'bg-entropy'
                            }`} />
                          </div>
                        </div>
                      </div>

                      {/* Resonance Ripple Effect */}
                      {cell.resonance > 0.8 && (
                        <div className="absolute inset-0 bg-resonance/20 animate-ping" />
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-cognition opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Tooltip on Hover */}
                      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-popover border border-border rounded px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 whitespace-nowrap">
                        Cap: ${cell.marketCap.toFixed(1)}T | Resonance: {cell.resonance.toFixed(3)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-border/30">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-resonance rounded" />
              <span className="text-muted-foreground">Bullish Resonance</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-chaos rounded" />
              <span className="text-muted-foreground">Bearish Entropy</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-temporal rounded" />
              <span className="text-muted-foreground">Neutral Phase</span>
            </div>
          </div>
          <div className="text-muted-foreground">
            Cell size = Market Cap | Intensity = Price Change + Resonance
          </div>
        </div>
      </div>
    </Card>
  );
};