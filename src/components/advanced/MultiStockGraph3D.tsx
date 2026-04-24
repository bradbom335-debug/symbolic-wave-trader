import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { Layers, Settings2, RotateCcw, Maximize2 } from 'lucide-react';

interface StockData {
  symbol: string;
  data: { time: number; price: number }[];
  color: string;
  hue: number;
  correlation: number;
  cluster: number;
}

type GraphStyle = 'line' | 'area' | 'bars' | 'ribbon' | 'particles' | 'mesh' | 'candles' | 'glow';
type ColorMode = 'rainbow' | 'performance' | 'cluster' | 'mono';
type SortMode = 'similarity' | 'alphabetical' | 'cluster' | 'performance';

const SYMBOLS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA', 'BRK.B', 'JPM', 'V', 'WMT', 'XOM', 'UNH', 'MA', 'HD', 'PG', 'JNJ', 'BAC', 'ABBV', 'PFE'];

const generateStockData = (symbol: string, basePrice: number, volatility: number, length: number, hue: number): StockData => {
  const data: { time: number; price: number }[] = [];
  let price = basePrice;
  for (let i = 0; i < length; i++) {
    price = Math.max(1, price + (Math.random() - 0.5) * volatility);
    data.push({ time: i, price });
  }
  return {
    symbol,
    data,
    color: `hsl(${hue}, 75%, 55%)`,
    hue,
    correlation: Math.random(),
    cluster: Math.floor(Math.random() * 5),
  };
};

interface HoverInfo {
  stock: StockData;
  screenX: number;
  screenY: number;
  change: number;
}

interface Props {
  onSelectSymbol?: (symbol: string) => void;
}

export const MultiStockGraph3D = ({ onSelectSymbol }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Visual settings
  const [graphStyle, setGraphStyle] = useState<GraphStyle>('line');
  const [colorMode, setColorMode] = useState<ColorMode>('rainbow');
  const [sortBy, setSortBy] = useState<SortMode>('similarity');
  const [numStocks, setNumStocks] = useState(100);
  const [waveLength, setWaveLength] = useState([400]);
  const [spacing, setSpacing] = useState([15]);
  const [lineWidth, setLineWidth] = useState([2]);
  const [opacity, setOpacity] = useState([85]);
  const [glowIntensity, setGlowIntensity] = useState([0]);
  const [showLabels, setShowLabels] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState([100]);

  // Camera
  const [rotationX, setRotationX] = useState(0.3);
  const [rotationY, setRotationY] = useState(0.5);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [zoom, setZoom] = useState(1);

  // Interaction
  const [isDragging, setIsDragging] = useState(false);
  const [dragButton, setDragButton] = useState(0);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState<HoverInfo | null>(null);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  const [tick, setTick] = useState(0);
  const stocksRef = useRef<StockData[]>([]);
  const stockScreenPositionsRef = useRef<Map<string, { x: number; y: number; w: number; h: number }>>(new Map());

  const calculateSimilarity = (a: StockData, b: StockData) => {
    let sum = 0;
    const len = Math.min(a.data.length, b.data.length);
    for (let i = 0; i < len; i++) sum += Math.abs(a.data[i].price - b.data[i].price);
    return -sum;
  };

  const stocks = useMemo(() => {
    const generated: StockData[] = [];
    for (let i = 0; i < numStocks; i++) {
      const baseSymbol = SYMBOLS[i % SYMBOLS.length];
      const symbol = i < SYMBOLS.length ? baseSymbol : `${baseSymbol}${Math.floor(i / SYMBOLS.length)}`;
      const hue = (i / numStocks) * 360;
      generated.push(generateStockData(symbol, 100 + Math.random() * 400, 2 + Math.random() * 8, waveLength[0], hue));
    }

    if (sortBy === 'similarity') {
      const sorted = [generated[0]];
      const remaining = generated.slice(1);
      while (remaining.length > 0) {
        const last = sorted[sorted.length - 1];
        let best = 0;
        let bestSim = -Infinity;
        remaining.forEach((s, i) => {
          const sim = calculateSimilarity(last, s);
          if (sim > bestSim) { bestSim = sim; best = i; }
        });
        sorted.push(remaining[best]);
        remaining.splice(best, 1);
      }
      stocksRef.current = sorted;
      return sorted;
    } else if (sortBy === 'alphabetical') {
      generated.sort((a, b) => a.symbol.localeCompare(b.symbol));
    } else if (sortBy === 'cluster') {
      generated.sort((a, b) => a.cluster - b.cluster);
    } else if (sortBy === 'performance') {
      generated.sort((a, b) => {
        const aChange = a.data[a.data.length - 1].price - a.data[0].price;
        const bChange = b.data[b.data.length - 1].price - b.data[0].price;
        return bChange - aChange;
      });
    }
    stocksRef.current = generated;
    return generated;
  }, [numStocks, sortBy, waveLength]);

  // Live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      stocksRef.current.forEach(stock => {
        const lastPrice = stock.data[stock.data.length - 1].price;
        const lastTime = stock.data[stock.data.length - 1].time;
        const newPrice = Math.max(1, lastPrice + (Math.random() - 0.5) * (2 + Math.random() * 6));
        stock.data.push({ time: lastTime + 1, price: newPrice });
        if (stock.data.length > waveLength[0]) stock.data.shift();
      });
      setTick(t => t + 1);
    }, animationSpeed[0]);
    return () => clearInterval(interval);
  }, [waveLength, animationSpeed]);

  // Resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // Color resolver
  const getStockColor = useCallback((stock: StockData): string => {
    if (colorMode === 'rainbow') return stock.color;
    if (colorMode === 'mono') return 'hsl(190, 80%, 55%)';
    if (colorMode === 'cluster') {
      const clusterHues = [0, 60, 130, 210, 290];
      return `hsl(${clusterHues[stock.cluster]}, 75%, 55%)`;
    }
    if (colorMode === 'performance') {
      const change = stock.data[stock.data.length - 1].price - stock.data[0].price;
      const pct = (change / stock.data[0].price) * 100;
      const clamped = Math.max(-20, Math.min(20, pct));
      const hue = clamped >= 0 ? 140 : 0;
      const lightness = 40 + Math.abs(clamped) * 1.5;
      return `hsl(${hue}, 75%, ${Math.min(70, lightness)}%)`;
    }
    return stock.color;
  }, [colorMode]);

  // Draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    ctx.clearRect(0, 0, width, height);

    if (showGrid) {
      ctx.strokeStyle = 'hsla(0, 0%, 100%, 0.04)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.moveTo((width / 20) * i, 0);
        ctx.lineTo((width / 20) * i, height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, (height / 20) * i);
        ctx.lineTo(width, (height / 20) * i);
        ctx.stroke();
      }
    }

    const perspective = 800 / zoom;
    const centerX = width / 2 + panX;
    const centerY = height / 2 + panY;
    const zSpacing = spacing[0];

    const allPrices = stocks.flatMap(s => s.data.map(d => d.price));
    const minPrice = Math.min(...allPrices);
    const maxPrice = Math.max(...allPrices);
    const priceRange = Math.max(1, maxPrice - minPrice);

    const cosX = Math.cos(rotationX);
    const sinX = Math.sin(rotationX);
    const cosY = Math.cos(rotationY);
    const sinY = Math.sin(rotationY);

    const project = (x: number, y: number, z: number) => {
      const rotY1 = y * cosX - z * sinX;
      const rotZ1 = y * sinX + z * cosX;
      const finalX = x * cosY - rotZ1 * sinY;
      const finalZ = x * sinY + rotZ1 * cosY;
      const projScale = perspective / (perspective + finalZ);
      return {
        x: centerX + finalX * projScale,
        y: centerY + rotY1 * projScale,
        scale: projScale,
        depth: finalZ,
      };
    };

    stockScreenPositionsRef.current.clear();

    // Sort stocks back-to-front for proper depth
    const drawOrder = stocks
      .map((stock, i) => ({ stock, i, z: i * zSpacing - (stocks.length * zSpacing) / 2 }))
      .sort((a, b) => {
        // Compute average projected depth — back to front
        const aProj = project(0, 0, a.z);
        const bProj = project(0, 0, b.z);
        return bProj.depth - aProj.depth;
      });

    drawOrder.forEach(({ stock, i: stockIndex, z }) => {
      const baseAlpha = (opacity[0] / 100);
      const isSelected = selectedSymbol === stock.symbol;
      const isHovered = hover?.stock.symbol === stock.symbol;

      ctx.save();
      ctx.globalAlpha = isSelected || isHovered ? 1 : baseAlpha * 0.85;

      const color = getStockColor(stock);
      const stroke = isSelected ? 'hsl(60, 100%, 60%)' : isHovered ? 'hsl(180, 100%, 70%)' : color;
      const widthMul = isSelected || isHovered ? 1.8 : 1;

      if (glowIntensity[0] > 0 || graphStyle === 'glow') {
        ctx.shadowBlur = (glowIntensity[0] || 8) + (isHovered ? 12 : 0);
        ctx.shadowColor = stroke;
      }

      const points: { x: number; y: number; scale: number; price: number }[] = [];
      const xStep = 400 / Math.max(1, stock.data.length);
      stock.data.forEach((point, idx) => {
        const x = (idx - stock.data.length / 2) * xStep;
        const y = -(((point.price - minPrice) / priceRange) * 200 - 100);
        const p = project(x, y, z);
        points.push({ x: p.x, y: p.y, scale: p.scale, price: point.price });
      });

      // Track screen bounds for hit-testing
      if (points.length) {
        const xs = points.map(p => p.x);
        const ys = points.map(p => p.y);
        const minX = Math.min(...xs), maxX = Math.max(...xs);
        const minY = Math.min(...ys), maxY = Math.max(...ys);
        stockScreenPositionsRef.current.set(stock.symbol, {
          x: minX, y: minY, w: maxX - minX, h: maxY - minY,
        });
      }

      if (graphStyle === 'area') {
        ctx.beginPath();
        const grad = ctx.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, color.replace(')', ', 0.6)').replace('hsl', 'hsla'));
        grad.addColorStop(1, color.replace(')', ', 0.05)').replace('hsl', 'hsla'));
        ctx.fillStyle = grad;
        points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        if (points.length > 0) {
          const baseProj = project((points.length - 1 - points.length / 2) * xStep, 100, z);
          const startProj = project(-points.length / 2 * xStep, 100, z);
          ctx.lineTo(baseProj.x, baseProj.y);
          ctx.lineTo(startProj.x, startProj.y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = stroke;
        ctx.lineWidth = lineWidth[0] * widthMul;
        ctx.beginPath();
        points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.stroke();
      } else if (graphStyle === 'line' || graphStyle === 'glow') {
        ctx.beginPath();
        ctx.strokeStyle = stroke;
        ctx.lineWidth = lineWidth[0] * widthMul;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        if (graphStyle === 'glow') {
          ctx.shadowBlur = 15 + (isHovered ? 10 : 0);
          ctx.shadowColor = stroke;
        }
        points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.stroke();
      } else if (graphStyle === 'bars') {
        ctx.fillStyle = stroke;
        const baseProj = project(0, 100, z);
        points.forEach((p, i) => {
          if (i % 4 !== 0) return;
          const barW = Math.max(1, 3 * p.scale * widthMul);
          ctx.fillRect(p.x - barW / 2, p.y, barW, baseProj.y - p.y);
        });
      } else if (graphStyle === 'ribbon') {
        // Draw filled ribbon with top + slightly offset bottom
        ctx.beginPath();
        const offset = 6 * (isSelected || isHovered ? 1.5 : 1);
        points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        for (let i = points.length - 1; i >= 0; i--) {
          const p = points[i];
          ctx.lineTo(p.x, p.y + offset * p.scale);
        }
        ctx.closePath();
        const ribGrad = ctx.createLinearGradient(0, 0, 0, height);
        ribGrad.addColorStop(0, color);
        ribGrad.addColorStop(1, color.replace('55%)', '25%)'));
        ctx.fillStyle = ribGrad;
        ctx.fill();
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 1;
        ctx.stroke();
      } else if (graphStyle === 'particles') {
        points.forEach((p, i) => {
          if (i % 3 !== 0) return;
          ctx.fillStyle = stroke;
          ctx.globalAlpha = (isSelected || isHovered ? 1 : baseAlpha) * (p.scale * 0.9 + 0.1);
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0.5, 2 * p.scale * widthMul), 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = baseAlpha;
      } else if (graphStyle === 'mesh') {
        // Connect this row to the next row's points
        const nextRow = drawOrder.find(d => d.i === stockIndex + 1);
        if (nextRow) {
          const nextZ = nextRow.z;
          ctx.strokeStyle = stroke.replace(')', ', 0.3)').replace('hsl', 'hsla');
          ctx.lineWidth = 0.5;
          stock.data.forEach((point, idx) => {
            if (idx % 8 !== 0) return;
            const x = (idx - stock.data.length / 2) * xStep;
            const y = -(((point.price - minPrice) / priceRange) * 200 - 100);
            const p1 = project(x, y, z);
            const next = nextRow.stock.data[idx];
            if (!next) return;
            const ny = -(((next.price - minPrice) / priceRange) * 200 - 100);
            const p2 = project(x, ny, nextZ);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          });
        }
        ctx.beginPath();
        ctx.strokeStyle = stroke;
        ctx.lineWidth = lineWidth[0] * widthMul;
        points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.stroke();
      } else if (graphStyle === 'candles') {
        const step = Math.max(1, Math.floor(points.length / 60));
        for (let i = 0; i < points.length - step; i += step) {
          const open = points[i];
          const close = points[i + step];
          const up = close.price >= open.price;
          ctx.strokeStyle = up ? 'hsl(140, 75%, 55%)' : 'hsl(0, 75%, 55%)';
          ctx.fillStyle = ctx.strokeStyle;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(open.x, open.y);
          ctx.lineTo(close.x, close.y);
          ctx.stroke();
          const w = Math.max(1, 2 * open.scale * widthMul);
          ctx.fillRect(open.x - w / 2, Math.min(open.y, close.y), w, Math.abs(close.y - open.y) || 1);
        }
      }

      ctx.shadowBlur = 0;

      if (showLabels && stockIndex % Math.max(1, Math.floor(stocks.length / 20)) === 0 && points.length) {
        const last = points[points.length - 1];
        ctx.fillStyle = stroke;
        ctx.font = `${Math.max(8, 11 * last.scale)}px ui-monospace, monospace`;
        ctx.fillText(stock.symbol, last.x + 4, last.y);
      }

      ctx.restore();
    });
  }, [stocks, spacing, graphStyle, colorMode, rotationX, rotationY, panX, panY, zoom, tick, opacity, lineWidth, glowIntensity, showLabels, showGrid, hover, selectedSymbol, getStockColor]);

  // Hit testing on hover
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      const dx = e.clientX - lastMouse.x;
      const dy = e.clientY - lastMouse.y;
      if (dragButton === 0) {
        setRotationY(p => p + dx * 0.005);
        setRotationX(p => p + dy * 0.005);
      } else if (dragButton === 2) {
        setPanX(p => p + dx);
        setPanY(p => p + dy);
      }
      setLastMouse({ x: e.clientX, y: e.clientY });
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    // Find closest stock by bounding box hit (with vertical tolerance)
    let foundStock: StockData | null = null;
    let bestDist = Infinity;
    stockScreenPositionsRef.current.forEach((pos, sym) => {
      if (mx >= pos.x - 4 && mx <= pos.x + pos.w + 4 && my >= pos.y - 6 && my <= pos.y + pos.h + 6) {
        const cy = pos.y + pos.h / 2;
        const d = Math.abs(my - cy);
        if (d < bestDist) {
          bestDist = d;
          foundStock = stocksRef.current.find(s => s.symbol === sym) || null;
        }
      }
    });

    if (foundStock) {
      const s = foundStock as StockData;
      const change = ((s.data[s.data.length - 1].price - s.data[0].price) / s.data[0].price) * 100;
      setHover({ stock: s, screenX: mx, screenY: my, change });
    } else if (hover) {
      setHover(null);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDragging(true);
    setDragButton(e.button);
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleClick = () => {
    if (hover) {
      setSelectedSymbol(hover.stock.symbol);
      onSelectSymbol?.(hover.stock.symbol);
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.001;
    setZoom(z => Math.max(0.2, Math.min(5, z + delta)));
  };

  const resetCamera = () => {
    setRotationX(0.3);
    setRotationY(0.5);
    setPanX(0);
    setPanY(0);
    setZoom(1);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      const panStep = 20;
      const rotStep = 0.08;
      switch (e.key.toLowerCase()) {
        case 'w': setPanY(p => p + panStep); break;
        case 's': setPanY(p => p - panStep); break;
        case 'a': setPanX(p => p + panStep); break;
        case 'd': setPanX(p => p - panStep); break;
        case 'arrowup': setRotationX(p => p - rotStep); break;
        case 'arrowdown': setRotationX(p => p + rotStep); break;
        case 'arrowleft': setRotationY(p => p - rotStep); break;
        case 'arrowright': setRotationY(p => p + rotStep); break;
        case '+':
        case '=': setZoom(z => Math.min(5, z + 0.1)); break;
        case '-':
        case '_': setZoom(z => Math.max(0.2, z - 0.1)); break;
        case 'r': resetCamera(); break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <Card className="h-full flex flex-col bg-[hsl(var(--terminal-bg-panel))] border-[hsl(var(--terminal-bg-elevated))]">
      <div className="flex items-center justify-between p-1.5 border-b border-[hsl(var(--terminal-bg-elevated))]">
        <div className="flex items-center gap-1.5">
          <Layers className="h-3 w-3 text-[hsl(var(--terminal-accent))]" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-[hsl(var(--terminal-text))]">3D WAVE OCEAN</span>
          <Badge variant="outline" className="text-[8px] h-4 px-1">{numStocks}</Badge>
          {selectedSymbol && (
            <Badge className="text-[8px] h-4 px-1 bg-[hsl(var(--terminal-accent))] text-[hsl(var(--terminal-bg))]">
              {selectedSymbol}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Select value={graphStyle} onValueChange={(v: GraphStyle) => setGraphStyle(v)}>
            <SelectTrigger className="h-5 text-[9px] w-20 border-[hsl(var(--terminal-bg-elevated))]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="line">Line</SelectItem>
              <SelectItem value="area">Area</SelectItem>
              <SelectItem value="bars">Bars</SelectItem>
              <SelectItem value="ribbon">Ribbon</SelectItem>
              <SelectItem value="particles">Particles</SelectItem>
              <SelectItem value="mesh">Mesh</SelectItem>
              <SelectItem value="candles">Candles</SelectItem>
              <SelectItem value="glow">Glow</SelectItem>
            </SelectContent>
          </Select>

          <Select value={colorMode} onValueChange={(v: ColorMode) => setColorMode(v)}>
            <SelectTrigger className="h-5 text-[9px] w-20 border-[hsl(var(--terminal-bg-elevated))]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rainbow">Rainbow</SelectItem>
              <SelectItem value="performance">Perf</SelectItem>
              <SelectItem value="cluster">Cluster</SelectItem>
              <SelectItem value="mono">Mono</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(v: SortMode) => setSortBy(v)}>
            <SelectTrigger className="h-5 text-[9px] w-20 border-[hsl(var(--terminal-bg-elevated))]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="similarity">Similar</SelectItem>
              <SelectItem value="cluster">Cluster</SelectItem>
              <SelectItem value="performance">Perf</SelectItem>
              <SelectItem value="alphabetical">A-Z</SelectItem>
            </SelectContent>
          </Select>

          <Select value={numStocks.toString()} onValueChange={(v) => setNumStocks(parseInt(v))}>
            <SelectTrigger className="h-5 text-[9px] w-14 border-[hsl(var(--terminal-bg-elevated))]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
              <SelectItem value="250">250</SelectItem>
              <SelectItem value="500">500</SelectItem>
              <SelectItem value="1000">1K</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                <Settings2 className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-3 space-y-3 bg-[hsl(var(--terminal-bg-panel))] border-[hsl(var(--terminal-bg-elevated))]" align="end">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[hsl(var(--terminal-accent))]">Visualization Settings</div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[hsl(var(--terminal-text-dim))]">Wave Length</span>
                  <span className="text-[hsl(var(--terminal-accent))] font-mono">{waveLength[0]}</span>
                </div>
                <Slider value={waveLength} onValueChange={setWaveLength} min={100} max={1500} step={50} />

                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[hsl(var(--terminal-text-dim))]">Spacing</span>
                  <span className="text-[hsl(var(--terminal-accent))] font-mono">{spacing[0]}</span>
                </div>
                <Slider value={spacing} onValueChange={setSpacing} min={3} max={50} step={1} />

                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[hsl(var(--terminal-text-dim))]">Line Width</span>
                  <span className="text-[hsl(var(--terminal-accent))] font-mono">{lineWidth[0]}</span>
                </div>
                <Slider value={lineWidth} onValueChange={setLineWidth} min={1} max={6} step={0.5} />

                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[hsl(var(--terminal-text-dim))]">Opacity</span>
                  <span className="text-[hsl(var(--terminal-accent))] font-mono">{opacity[0]}%</span>
                </div>
                <Slider value={opacity} onValueChange={setOpacity} min={10} max={100} step={5} />

                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[hsl(var(--terminal-text-dim))]">Glow</span>
                  <span className="text-[hsl(var(--terminal-accent))] font-mono">{glowIntensity[0]}</span>
                </div>
                <Slider value={glowIntensity} onValueChange={setGlowIntensity} min={0} max={30} step={1} />

                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[hsl(var(--terminal-text-dim))]">Update (ms)</span>
                  <span className="text-[hsl(var(--terminal-accent))] font-mono">{animationSpeed[0]}</span>
                </div>
                <Slider value={animationSpeed} onValueChange={setAnimationSpeed} min={50} max={2000} step={50} />

                <div className="flex items-center justify-between text-[10px] pt-1">
                  <span className="text-[hsl(var(--terminal-text-dim))]">Show Labels</span>
                  <Switch checked={showLabels} onCheckedChange={setShowLabels} />
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[hsl(var(--terminal-text-dim))]">Background Grid</span>
                  <Switch checked={showGrid} onCheckedChange={setShowGrid} />
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={resetCamera} title="Reset camera (R)">
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 px-1.5 py-1 bg-[hsl(var(--terminal-bg))] text-[8px]">
        <span className="text-[hsl(var(--terminal-text-dim))]">DRAG-L: rotate</span>
        <span className="text-[hsl(var(--terminal-text-dim))]">DRAG-R: pan</span>
        <span className="text-[hsl(var(--terminal-text-dim))]">WHEEL: zoom</span>
        <span className="text-[hsl(var(--terminal-text-dim))]">WASD / ←↑→↓ / +-</span>
        <span className="text-[hsl(var(--terminal-text-dim))]">R: reset</span>
        <span className="text-[hsl(var(--terminal-accent))] ml-auto font-mono">zoom {zoom.toFixed(2)}x</span>
      </div>

      <div ref={containerRef} className="flex-1 min-h-0 relative">
        <div className="w-full h-full bg-[hsl(var(--terminal-bg))] rounded border border-[hsl(var(--terminal-bg-elevated))]">
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ cursor: isDragging ? (dragButton === 2 ? 'grabbing' : 'crosshair') : (hover ? 'pointer' : 'grab') }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => { setIsDragging(false); setHover(null); }}
            onContextMenu={(e) => e.preventDefault()}
            onClick={handleClick}
            onWheel={handleWheel}
          />
        </div>

        {hover && (
          <div
            className="absolute pointer-events-none bg-[hsl(var(--terminal-bg-panel))] border border-[hsl(var(--terminal-accent))] rounded px-2 py-1 text-[10px] font-mono shadow-lg"
            style={{
              left: Math.min(hover.screenX + 12, (containerRef.current?.clientWidth ?? 800) - 160),
              top: Math.max(8, hover.screenY - 50),
            }}
          >
            <div className="font-bold text-[hsl(var(--terminal-accent))]">{hover.stock.symbol}</div>
            <div className="text-[hsl(var(--terminal-text))]">
              ${hover.stock.data[hover.stock.data.length - 1].price.toFixed(2)}
            </div>
            <div className={hover.change >= 0 ? 'text-[hsl(140,75%,55%)]' : 'text-[hsl(0,75%,55%)]'}>
              {hover.change >= 0 ? '+' : ''}{hover.change.toFixed(2)}%
            </div>
            <div className="text-[8px] text-[hsl(var(--terminal-text-dim))] mt-0.5">click to select</div>
          </div>
        )}
      </div>
    </Card>
  );
};
