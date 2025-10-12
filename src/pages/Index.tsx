import { MarketHeader } from '@/components/dashboard/MarketHeader';
import { AdvancedTradingChart } from '@/components/advanced/AdvancedTradingChart';
import { MarketIntelligenceHub } from '@/components/advanced/MarketIntelligenceHub';
import { AdvancedPortfolioAnalytics } from '@/components/advanced/AdvancedPortfolioAnalytics';
import { NewsAndAlerts } from '@/components/advanced/NewsAndAlerts';
import { QuantumSimulator } from '@/components/dashboard/QuantumSimulator';
import { MarketHeatmap } from '@/components/dashboard/MarketHeatmap';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity, Target, Zap, DollarSign } from 'lucide-react';

const CompactMetricCard = ({ title, value, change, changePercent, positive, icon: Icon, color }: any) => (
  <Card className="p-2 bg-slate-900/50 border-slate-800 hover:bg-slate-900/70 transition-all relative overflow-hidden group">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    
    <div className="flex items-start justify-between mb-1">
      <span className="text-[9px] text-slate-500 uppercase tracking-wider">{title}</span>
      <Icon className={`w-3 h-3 ${color}`} />
    </div>
    
    <div className="text-sm font-bold text-white mb-0.5">{value}</div>
    
    <div className="flex items-center gap-1 text-[9px]">
      {positive ? (
        <TrendingUp className="w-2.5 h-2.5 text-green-400" />
      ) : (
        <TrendingDown className="w-2.5 h-2.5 text-red-400" />
      )}
      <span className={positive ? 'text-green-400' : 'text-red-400'}>
        {change} ({changePercent})
      </span>
    </div>
  </Card>
);

const Index = () => {
  const metrics = [
    { title: "Portfolio", value: "$124.5K", change: "+2.4K", changePercent: "+2.1%", positive: true, icon: DollarSign, color: "text-cyan-400" },
    { title: "S&P 500", value: "4,567", change: "+12", changePercent: "+0.3%", positive: true, icon: TrendingUp, color: "text-green-400" },
    { title: "NASDAQ", value: "14,234", change: "-45", changePercent: "-0.3%", positive: false, icon: Activity, color: "text-red-400" },
    { title: "VIX", value: "18.42", change: "+1.2", changePercent: "+7.2%", positive: false, icon: Target, color: "text-orange-400" },
    { title: "BTC/USD", value: "$42.3K", change: "+1.2K", changePercent: "+2.9%", positive: true, icon: Zap, color: "text-purple-400" },
    { title: "Gold", value: "$1,987", change: "+12", changePercent: "+0.6%", positive: true, icon: TrendingUp, color: "text-yellow-400" },
  ];

  return (
    <div className="min-h-screen bg-background p-2 space-y-2 overflow-auto">
      {/* Compact Metrics Row */}
      <div className="grid grid-cols-6 gap-2">
        {metrics.map((metric, i) => (
          <CompactMetricCard key={i} {...metric} />
        ))}
      </div>

      {/* Main Grid Layout - Ultra Compact */}
      <div className="grid grid-cols-12 gap-2 h-[calc(100vh-100px)]">
        {/* Left Column - Charts */}
        <div className="col-span-8 space-y-2">
          <div className="h-[55%]">
            <AdvancedTradingChart />
          </div>
          <div className="h-[45%]">
            <MarketIntelligenceHub />
          </div>
        </div>

        {/* Right Column - Analytics & News */}
        <div className="col-span-4 space-y-2">
          <div className="h-[33%]">
            <NewsAndAlerts />
          </div>
          <div className="h-[33%]">
            <QuantumSimulator />
          </div>
          <div className="h-[34%]">
            <MarketHeatmap />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
