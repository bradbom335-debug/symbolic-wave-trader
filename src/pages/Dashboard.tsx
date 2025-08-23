import { AdvancedTradingChart } from '@/components/advanced/AdvancedTradingChart';
import { MarketIntelligenceHub } from '@/components/advanced/MarketIntelligenceHub';
import { AdvancedPortfolioAnalytics } from '@/components/advanced/AdvancedPortfolioAnalytics';
import { NewsAndAlerts } from '@/components/advanced/NewsAndAlerts';
import { QuantumSimulator } from '@/components/dashboard/QuantumSimulator';
import { MarketHeatmap } from '@/components/dashboard/MarketHeatmap';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Advanced Trading Analysis */}
      <div className="grid grid-cols-1 gap-6">
        <AdvancedTradingChart />
      </div>

      {/* Market Intelligence Dashboard */}
      <div className="grid grid-cols-1 gap-6">
        <MarketIntelligenceHub />
      </div>

      {/* Portfolio & News Analysis */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <AdvancedPortfolioAnalytics />
        </div>
        <div>
          <NewsAndAlerts />
        </div>
      </div>

      {/* Advanced Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuantumSimulator />
        <MarketHeatmap />
      </div>
    </div>
  );
};

export default Dashboard;