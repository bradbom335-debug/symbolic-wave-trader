import { MarketHeader } from '@/components/dashboard/MarketHeader';
import { SymbolicChart } from '@/components/dashboard/SymbolicChart';
import { AIInsights } from '@/components/dashboard/AIInsights';
import { PortfolioResonance } from '@/components/dashboard/PortfolioResonance';
import { QuantumSimulator } from '@/components/dashboard/QuantumSimulator';
import { MarketHeatmap } from '@/components/dashboard/MarketHeatmap';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <MarketHeader />
      
      <main className="p-6 space-y-6">
        {/* Primary Analysis Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <SymbolicChart />
          </div>
          <div>
            <AIInsights />
          </div>
        </div>

        {/* Secondary Analysis Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PortfolioResonance />
          <QuantumSimulator />
        </div>

        {/* Market Overview */}
        <div className="grid grid-cols-1 gap-6">
          <MarketHeatmap />
        </div>
      </main>
    </div>
  );
};

export default Index;
