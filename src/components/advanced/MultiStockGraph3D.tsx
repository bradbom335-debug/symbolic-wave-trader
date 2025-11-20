import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useRef, useEffect, useState, useMemo } from 'react';
import { LineChart, TrendingUp, TrendingDown, Layers, GitCompare } from 'lucide-react';

interface StockData {
  symbol: string;
  data: { time: number; price: number }[];
  color: string;
  correlation: number;
  cluster: number;
}

// Generate mock stock data
const generateStockData = (symbol: string, basePrice: number, volatility: number): StockData => {
  const data: { time: number; price: number }[] = [];
  let price = basePrice;
  
  for (let i = 0; i < 200; i++) {
    price = price + (Math.random() - 0.5) * volatility;
    data.push({ time: i, price });
  }
  
  return {
    symbol,
    data,
    color: `hsl(${Math.random() * 360}, 70%, 50%)`,
    correlation: Math.random(),
    cluster: Math.floor(Math.random() * 5)
  };
};

export const MultiStockGraph3D = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [spacing, setSpacing] = useState([15]);
  const [graphStyle, setGraphStyle] = useState<'line' | 'area' | 'bars'>('line');
  const [sortBy, setSortBy] = useState<'similarity' | 'alphabetical' | 'cluster'>('similarity');
  const [numStocks, setNumStocks] = useState(100);
  const [rotationX, setRotationX] = useState(0.3);
  const [rotationY, setRotationY] = useState(0.5);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  const [waveOffset, setWaveOffset] = useState(0);
  const animationRef = useRef<number>();

  // Calculate similarity between two stock patterns
  const calculateSimilarity = (stock1: StockData, stock2: StockData): number => {
    let sum = 0;
    for (let i = 0; i < Math.min(stock1.data.length, stock2.data.length); i++) {
      const diff = Math.abs(stock1.data[i].price - stock2.data[i].price);
      sum += diff;
    }
    return -sum; // Negative so higher similarity = lower difference
  };

  // Generate stocks with similarity-based sorting
  const stocks = useMemo(() => {
    const generated: StockData[] = [];
    const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA', 'BRK.B', 'JPM', 'V'];
    
    for (let i = 0; i < numStocks; i++) {
      const baseSymbol = symbols[i % symbols.length];
      const symbol = i < symbols.length ? baseSymbol : `${baseSymbol}${i}`;
      generated.push(generateStockData(symbol, 100 + Math.random() * 400, 2 + Math.random() * 8));
    }
    
    // Sort based on selected method
    if (sortBy === 'similarity') {
      // Sort by nearest neighbor similarity
      const sorted: StockData[] = [generated[0]];
      const remaining = generated.slice(1);
      
      while (remaining.length > 0) {
        const last = sorted[sorted.length - 1];
        let bestIndex = 0;
        let bestSimilarity = -Infinity;
        
        remaining.forEach((stock, index) => {
          const similarity = calculateSimilarity(last, stock);
          if (similarity > bestSimilarity) {
            bestSimilarity = similarity;
            bestIndex = index;
          }
        });
        
        sorted.push(remaining[bestIndex]);
        remaining.splice(bestIndex, 1);
      }
      
      return sorted;
    } else if (sortBy === 'alphabetical') {
      generated.sort((a, b) => a.symbol.localeCompare(b.symbol));
    } else if (sortBy === 'cluster') {
      generated.sort((a, b) => a.cluster - b.cluster);
    }
    
    return generated;
  }, [numStocks, sortBy]);

  // Wave animation
  useEffect(() => {
    const animate = () => {
      setWaveOffset(prev => (prev + 0.02) % (Math.PI * 2));
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      // 3D projection settings
      const perspective = 800;
      const centerX = width / 2;
      const centerY = height / 2;
      const zSpacing = spacing[0];

      // Calculate price ranges for normalization
      const allPrices = stocks.flatMap(s => s.data.map(d => d.price));
      const minPrice = Math.min(...allPrices);
      const maxPrice = Math.max(...allPrices);
      const priceRange = maxPrice - minPrice;

      // Draw each stock as waves
      stocks.forEach((stock, stockIndex) => {
        const z = stockIndex * zSpacing - (stocks.length * zSpacing) / 2;
        const scale = perspective / (perspective + z);
        
        ctx.save();
        ctx.globalAlpha = Math.max(0.2, scale);

        // 3D rotation matrices
        const cosX = Math.cos(rotationX);
        const sinX = Math.sin(rotationX);
        const cosY = Math.cos(rotationY);
        const sinY = Math.sin(rotationY);

        if (graphStyle === 'area') {
          // Wave area graph with animation
          ctx.beginPath();
          ctx.fillStyle = stock.color.replace('50%', '30%');
          
          stock.data.forEach((point, i) => {
            const x = (point.time - 100) * 2;
            const waveInfluence = Math.sin(waveOffset + i * 0.1 + stockIndex * 0.2) * 5;
            const y = -(((point.price - minPrice) / priceRange) * 200 - 100) + waveInfluence;
            
            // 3D rotation and projection
            let rotX = x;
            let rotY = y * cosX - z * sinX;
            let rotZ = y * sinX + z * cosX;
            
            const finalX = rotX * cosY - rotZ * sinY;
            const finalZ = rotX * sinY + rotZ * cosY;
            
            const projScale = perspective / (perspective + finalZ);
            const projX = centerX + finalX * projScale;
            const projY = centerY + rotY * projScale;
            
            if (i === 0) {
              ctx.moveTo(projX, projY);
            } else {
              ctx.lineTo(projX, projY);
            }
          });
          
          ctx.closePath();
          ctx.fill();
        }

        if (graphStyle === 'line') {
          // Wave line graph with animation
          ctx.beginPath();
          ctx.strokeStyle = stock.color;
          ctx.lineWidth = 2 * scale;
          
          stock.data.forEach((point, i) => {
            const x = (point.time - 100) * 2;
            const waveInfluence = Math.sin(waveOffset + i * 0.1 + stockIndex * 0.2) * 5;
            const y = -(((point.price - minPrice) / priceRange) * 200 - 100) + waveInfluence;
            
            // 3D rotation and projection
            let rotX = x;
            let rotY = y * cosX - z * sinX;
            let rotZ = y * sinX + z * cosX;
            
            const finalX = rotX * cosY - rotZ * sinY;
            const finalZ = rotX * sinY + rotZ * cosY;
            
            const projScale = perspective / (perspective + finalZ);
            const projX = centerX + finalX * projScale;
            const projY = centerY + rotY * projScale;
            
            if (i === 0) {
              ctx.moveTo(projX, projY);
            } else {
              ctx.lineTo(projX, projY);
            }
          });
          
          ctx.stroke();
        }

        if (graphStyle === 'bars') {
          // Wave bar graph with animation
          ctx.fillStyle = stock.color;
          
          stock.data.forEach((point, i) => {
            if (i % 5 !== 0) return;
            
            const x = (point.time - 100) * 2;
            const waveInfluence = Math.sin(waveOffset + i * 0.1 + stockIndex * 0.2) * 5;
            const y = -(((point.price - minPrice) / priceRange) * 200 - 100) + waveInfluence;
            
            // 3D rotation and projection
            let rotX = x;
            let rotY = y * cosX - z * sinX;
            let rotZ = y * sinX + z * cosX;
            
            const finalX = rotX * cosY - rotZ * sinY;
            const finalZ = rotX * sinY + rotZ * cosY;
            
            const projScale = perspective / (perspective + finalZ);
            const projX = centerX + finalX * projScale;
            const projY = centerY + rotY * projScale;
            
            const barWidth = 3 * scale;
            const barHeight = Math.abs(projY - centerY);
            ctx.fillRect(projX - barWidth / 2, centerY - (projY > centerY ? 0 : barHeight), barWidth, barHeight);
          });
        }

        // Draw symbol label at front
        if (stockIndex % 10 === 0) {
          const labelZ = z;
          const labelScale = perspective / (perspective + labelZ);
          ctx.fillStyle = stock.color;
          ctx.font = `${Math.max(8, 12 * labelScale)}px monospace`;
          ctx.fillText(stock.symbol, centerX - 200 * labelScale, centerY - 120 * labelScale);
        }

        ctx.restore();
      });

      // Draw clustering indicators
      if (sortBy === 'cluster') {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.font = '10px monospace';
        let currentCluster = -1;
        stocks.forEach((stock, i) => {
          if (stock.cluster !== currentCluster) {
            currentCluster = stock.cluster;
            ctx.fillText(`Cluster ${currentCluster}`, 10, 30 + i * 15);
          }
        });
      }
    };

    draw();
  }, [stocks, spacing, graphStyle, rotationX, rotationY, waveOffset, sortBy]);

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <Card className="h-full flex flex-col p-2 bg-card/95 backdrop-blur-sm border-border/50">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-bold">3D Multi-Stock Analyzer</h3>
          <Badge variant="outline" className="text-xs">{numStocks} stocks</Badge>
        </div>
        
        <div className="flex items-center gap-1">
          <Select value={graphStyle} onValueChange={(v: any) => setGraphStyle(v)}>
            <SelectTrigger className="h-6 text-xs w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="line">Line</SelectItem>
              <SelectItem value="area">Area</SelectItem>
              <SelectItem value="bars">Bars</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
            <SelectTrigger className="h-6 text-xs w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="correlation">Similar</SelectItem>
              <SelectItem value="cluster">Cluster</SelectItem>
              <SelectItem value="alphabetical">A-Z</SelectItem>
            </SelectContent>
          </Select>

          <Select value={numStocks.toString()} onValueChange={(v) => setNumStocks(parseInt(v))}>
            <SelectTrigger className="h-6 text-xs w-16">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
              <SelectItem value="500">500</SelectItem>
              <SelectItem value="1000">1K</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-muted-foreground">Spacing:</span>
        <Slider 
          value={spacing} 
          onValueChange={setSpacing}
          min={5}
          max={50}
          step={1}
          className="flex-1"
        />
        <span className="text-xs font-mono w-8">{spacing[0]}</span>
      </div>

      <div className="flex-1 relative bg-background/50 rounded border border-border/50 overflow-hidden">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </Card>
  );
};
