import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface RiskMetrics {
  gasPrice: string;
  timestamp: string;
}

export function RiskMonitor() {
  const [metrics, setMetrics] = useState<RiskMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/risk-monitor');
        const data = await response.json();
        setMetrics(prev => [...prev, data].slice(-20)); // Keep last 20 readings
      } catch (error) {
        console.error('Error fetching risk metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const formatTimestamp = (timestamp: string) => {
    return format(new Date(timestamp), 'MM/dd HH:mm');
  };

  const getGasPriceAlert = (price: string) => {
    const numPrice = parseFloat(price);
    if (numPrice > 100) {
      return {
        level: 'high',
        message: 'Gas price is very high',
        icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
      };
    } else if (numPrice > 50) {
      return {
        level: 'medium',
        message: 'Gas price is elevated',
        icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
      };
    }
    return null;
  };

  if (isLoading) {
    return <div>Loading risk metrics...</div>;
  }

  const latestMetrics = metrics[metrics.length - 1];
  const gasPriceAlert = latestMetrics ? getGasPriceAlert(latestMetrics.gasPrice) : null;

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
      {/* Current Risk Metrics */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl text-white">Current Risk Metrics</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4">
            {latestMetrics && (
              <div className="text-sm sm:text-base text-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span>Gas Price:</span>
                  <span className="font-bold">{latestMetrics.gasPrice} Gwei</span>
                </div>
                <div className="text-slate-400 text-xs sm:text-sm">
                  Last Updated: {formatTimestamp(latestMetrics.timestamp)}
                </div>
              </div>
            )}
            {gasPriceAlert && (
              <div className="flex items-center gap-2 p-3 rounded bg-slate-700/50">
                {gasPriceAlert.icon}
                <span className="text-sm sm:text-base text-slate-200">{gasPriceAlert.message}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Gas Price Chart */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl text-white">Gas Price Trend</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="h-[250px] sm:h-[300px] lg:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={formatTimestamp}
                  stroke="#9CA3AF"
                  tick={{ fontSize: 12 }}
                />
                <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    color: '#F3F4F6',
                    fontSize: '14px',
                  }}
                  labelFormatter={formatTimestamp}
                />
                <Line
                  type="monotone"
                  dataKey="gasPrice"
                  stroke="#60A5FA"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 