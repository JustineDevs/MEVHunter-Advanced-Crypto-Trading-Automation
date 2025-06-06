import { BotControls } from '../components/ui/bot-controls';
import { BotAnalytics } from '../components/ui/bot-analytics';
import { RiskMonitor } from '../components/ui/risk-monitor';
import { MarketChart } from '../components/ui/market-chart';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">MEVHunter Dashboard</h1>
        
        <div className="grid gap-6 sm:gap-8">
          <div className="grid gap-6 sm:gap-8 grid-cols-1 lg:grid-cols-2">
            <BotControls />
            <BotAnalytics />
          </div>
          
          <MarketChart />
          
          <RiskMonitor />
        </div>
      </div>
    </div>
  );
} 