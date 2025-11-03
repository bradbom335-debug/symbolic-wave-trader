import { AdvancedTradingChart } from '@/components/advanced/AdvancedTradingChart';
import { MarketIntelligenceHub } from '@/components/advanced/MarketIntelligenceHub';
import { AdvancedPortfolioAnalytics } from '@/components/advanced/AdvancedPortfolioAnalytics';
import { NewsAndAlerts } from '@/components/advanced/NewsAndAlerts';
import { QuantumSimulator } from '@/components/dashboard/QuantumSimulator';
import { MarketHeatmap } from '@/components/dashboard/MarketHeatmap';
import { AIMemoryDashboard } from '@/components/ai-memory/AIMemoryDashboard';

const Dashboard = () => {
  return (
    <div className="space-y-2 p-2">
      {/* Compact Grid - Everything visible at once */}
      <div className="grid grid-cols-12 gap-2">
        {/* Left Column - Trading & Intelligence */}
        <div className="col-span-8 space-y-2">
          <div className="h-[calc(50vh-5rem)]">
            <AdvancedTradingChart />
          </div>
          <div className="h-[calc(50vh-5rem)]">
            <MarketIntelligenceHub />
          </div>
        </div>

        {/* Right Column - Portfolio, News, Tools */}
        <div className="col-span-4 space-y-2">
          <div className="h-[calc(33vh-3.5rem)]">
            <AdvancedPortfolioAnalytics />
          </div>
          <div className="h-[calc(33vh-3.5rem)]">
            <NewsAndAlerts />
          </div>
          <div className="grid grid-cols-2 gap-2 h-[calc(34vh-3.5rem)]">
            <QuantumSimulator />
            <MarketHeatmap />
          </div>
        </div>
      </div>

      {/* AI Memory System - Compact at bottom */}
      <div className="h-48">
        <AIMemoryDashboard />
      </div>
    </div>
  );
};

export default Dashboard;