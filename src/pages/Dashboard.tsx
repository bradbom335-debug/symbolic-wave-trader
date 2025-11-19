import { AdvancedTradingChart } from '@/components/advanced/AdvancedTradingChart';
import { MarketIntelligenceHub } from '@/components/advanced/MarketIntelligenceHub';
import { AdvancedPortfolioAnalytics } from '@/components/advanced/AdvancedPortfolioAnalytics';
import { NewsAndAlerts } from '@/components/advanced/NewsAndAlerts';
import { QuantumSimulator } from '@/components/dashboard/QuantumSimulator';
import { MarketHeatmap } from '@/components/dashboard/MarketHeatmap';
import { AIMemoryDashboard } from '@/components/ai-memory/AIMemoryDashboard';
import { MultiStockGraph3D } from '@/components/advanced/MultiStockGraph3D';

const Dashboard = () => {
  return (
    <div className="h-screen overflow-hidden flex flex-col gap-0.5 p-0.5 bg-[hsl(var(--terminal-bg))]">
      <div className="flex-1 grid grid-cols-12 gap-0.5 overflow-hidden min-h-0">
        {/* Left Column - Charts & Analysis */}
        <div className="col-span-7 flex flex-col gap-0.5 overflow-hidden">
          <div className="flex-[0_0_40%] overflow-hidden">
            <AdvancedTradingChart />
          </div>
          <div className="flex-[0_0_32%] overflow-hidden">
            <MarketIntelligenceHub />
          </div>
          <div className="flex-[0_0_28%] overflow-hidden">
            <MultiStockGraph3D />
          </div>
        </div>

        {/* Right Column - Portfolio & News */}
        <div className="col-span-5 flex flex-col gap-0.5 overflow-hidden">
          <div className="flex-[0_0_25%] overflow-hidden">
            <AdvancedPortfolioAnalytics />
          </div>
          <div className="flex-[0_0_50%] overflow-hidden">
            <NewsAndAlerts />
          </div>
          <div className="flex-[0_0_25%] flex gap-0.5">
            <div className="flex-1 overflow-hidden">
              <AIMemoryDashboard />
            </div>
            <div className="flex-1 overflow-hidden">
              <QuantumSimulator />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;