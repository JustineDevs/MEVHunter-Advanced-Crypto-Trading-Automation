import { BotControls } from '../components/ui/bot-controls';
import { BotAnalytics } from '../components/ui/bot-analytics';
import { RiskMonitor } from '../components/ui/risk-monitor';

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
          
          {/* Dashboard Overview Card */}
          <div className="rounded-lg border text-card-foreground shadow-sm bg-slate-800/50 border-slate-700">
            <div className="flex flex-col space-y-1.5 p-6">
              <div className="text-2xl font-semibold leading-none tracking-tight text-white">Dashboard Overview</div>
              <div className="text-sm text-slate-400">Key Features</div>
            </div>
            <div className="p-6 pt-0">
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 list-disc pl-5 text-slate-200">
                <li><span className="font-bold text-green-400">Real-time DeFi monitoring</span></li>
                <li><span className="font-bold text-blue-400">Arbitrage opportunity detection</span></li>
                <li><span className="font-bold text-red-400">Liquidation alerts</span></li>
                <li><span className="font-bold text-yellow-400">Wallet integration</span></li>
                <li><span className="font-bold text-purple-400">Service Worker</span></li>
                <li><span className="font-bold text-pink-400">Push notifications for price/gas events</span></li>
                <li><span className="font-bold text-cyan-400">Interactive analytics dashboard</span></li>
                <li><span className="font-bold text-indigo-400">Multi-chain support</span></li>
                <li><span className="font-bold text-orange-400">Automated trading bots & status</span></li>
                <li><span className="font-bold text-fuchsia-400">AI-powered market insights</span></li>
                <li><span className="font-bold text-lime-400">Custom alert configurations</span></li>
                <li><span className="font-bold text-teal-400">Decentralized identity integration</span></li>
              </ul>
            </div>
          </div>

          <RiskMonitor />
        </div>
      </div>
    </div>
  );
} 