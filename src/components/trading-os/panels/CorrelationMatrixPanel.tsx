import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface CorrelationMatrix {
  assets: string[];
  matrix: number[][];
}

export function CorrelationMatrixPanel() {
  const [data, setData] = useState<CorrelationMatrix | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock correlation data
    const assets = ['SPY', 'QQQ', 'AAPL', 'TSLA', 'NVDA', 'MSFT'];
    const matrix = assets.map(() =>
      assets.map(() => Math.random() * 2 - 1) // Random correlation between -1 and 1
    );

    // Make diagonal 1 (perfect self-correlation)
    matrix.forEach((row, i) => {
      row[i] = 1;
      // Make it symmetric
      row.forEach((_, j) => {
        if (j < i) {
          row[j] = matrix[j][i];
        }
      });
    });

    setTimeout(() => {
      setData({ assets, matrix });
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-6 h-6 animate-spin text-terminal-blue" />
      </div>
    );
  }

  if (!data) return null;

  const getCorrelationColor = (value: number) => {
    if (value > 0.7) return 'bg-terminal-green/80';
    if (value > 0.3) return 'bg-terminal-green/40';
    if (value > -0.3) return 'bg-terminal-blue/20';
    if (value > -0.7) return 'bg-terminal-red/40';
    return 'bg-terminal-red/80';
  };

  const getTextColor = (value: number) => {
    if (Math.abs(value) > 0.5) return 'text-text-terminal-primary';
    return 'text-text-terminal-secondary';
  };

  return (
    <Card className="h-full bg-terminal-bg-panel border-terminal-bg-elevated overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="px-3 py-2 border-b border-terminal-bg-elevated bg-terminal-bg-deep">
          <h3 className="text-sm font-semibold text-text-terminal-primary">Correlation Matrix</h3>
          <p className="text-xs text-text-terminal-muted mt-0.5">1-day rolling correlation</p>
        </div>

        {/* Matrix */}
        <div className="flex-1 overflow-auto p-3">
          <div className="inline-block min-w-full">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-1 text-xs font-semibold text-text-terminal-muted"></th>
                  {data.assets.map((asset) => (
                    <th key={asset} className="p-1 text-xs font-semibold text-terminal-blue">
                      {asset}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.assets.map((rowAsset, i) => (
                  <tr key={rowAsset}>
                    <td className="p-1 text-xs font-semibold text-terminal-blue">{rowAsset}</td>
                    {data.matrix[i].map((value, j) => (
                      <td key={j} className="p-1">
                        <div
                          className={`flex items-center justify-center h-8 rounded text-xs font-mono font-semibold ${getCorrelationColor(
                            value
                          )} ${getTextColor(value)}`}
                        >
                          {value.toFixed(2)}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center gap-4 text-xs">
            <span className="text-text-terminal-muted font-semibold">Legend:</span>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 bg-terminal-green/80 rounded" />
              <span className="text-text-terminal-secondary">Strong Positive</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 bg-terminal-blue/20 rounded" />
              <span className="text-text-terminal-secondary">Neutral</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 bg-terminal-red/80 rounded" />
              <span className="text-text-terminal-secondary">Strong Negative</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
