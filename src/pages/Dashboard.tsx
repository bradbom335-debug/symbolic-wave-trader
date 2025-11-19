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
    <div className="h-screen overflow-hidden p-1 flex flex-col gap-1">
      {/* Single viewport - no page scrolling */}
      <div className="flex-1 grid grid-cols-12 gap-1 overflow-hidden">
        {/* Left Column - Trading & Intelligence */}
        <div className="col-span-7 flex flex-col gap-1 overflow-hidden">
          <div className="h-[35%] overflow-hidden">
            <AdvancedTradingChart />
          </div>
          <div className="h-[32%] overflow-hidden">
            <MarketIntelligenceHub />
          </div>
          <div className="h-[33%] overflow-hidden">
            <AIMemoryDashboard />
          </div>
        </div>

        {/* Right Column - Portfolio, News, Tools */}
        <div className="col-span-5 flex flex-col gap-1 overflow-hidden">
          <div className="h-[28%] overflow-hidden">
            <AdvancedPortfolioAnalytics />
          </div>
          <div className="h-[44%] overflow-hidden">
            <NewsAndAlerts />
          </div>
          <div className="h-[28%] grid grid-cols-2 gap-1">
            <QuantumSimulator />
            <MarketHeatmap />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;