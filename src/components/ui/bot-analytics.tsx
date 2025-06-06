import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface BotLog {
  timestamp: string;
  type: string;
  event: string;
  error: string | null;
}

interface BotConfig {
  type: string;
  status: string;
  lastUpdated: string;
  settings: Record<string, any>;
}

export function BotAnalytics() {
  const [logs, setLogs] = useState<BotLog[]>([]);
  const [configs, setConfigs] = useState<Record<string, BotConfig>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/analytics');
        const data = await response.json();
        setLogs(data.logs);
        setConfigs(data.configs);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const formatTimestamp = (timestamp: string) => {
    return format(new Date(timestamp), 'MM/dd HH:mm');
  };

  const getBotStatus = (type: string) => {
    return configs[type]?.status || 'unknown';
  };

  if (isLoading) {
    return <div>Loading analytics...</div>;
  }

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {/* Bot Status Cards */}
      {Object.entries(configs).map(([type, config]) => (
        <Card key={type} className="bg-slate-800/50 border-slate-700">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl text-white capitalize">{type} Bot</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="text-sm sm:text-base text-slate-200 space-y-2">
              <div>Status: <span className={`font-bold ${config.status === 'running' ? 'text-green-400' : 'text-red-400'}`}>{config.status}</span></div>
              <div>Last Updated: {formatTimestamp(config.lastUpdated)}</div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Activity Chart */}
      <Card className="col-span-full bg-slate-800/50 border-slate-700">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl text-white">Bot Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="h-[250px] sm:h-[300px] lg:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={logs}>
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
                  dataKey="event"
                  stroke="#60A5FA"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Logs */}
      <Card className="col-span-full bg-slate-800/50 border-slate-700">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl text-white">Recent Logs</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-2">
            {logs.slice(0, 10).map((log, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded bg-slate-700/50 text-sm sm:text-base"
              >
                <div className="text-slate-200 mb-2 sm:mb-0">
                  <span className="font-bold capitalize">{log.type}</span>
                  <span className="mx-2">-</span>
                  <span>{log.event}</span>
                </div>
                <div className="text-slate-400 text-xs sm:text-sm">
                  {formatTimestamp(log.timestamp)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 