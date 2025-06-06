import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { AlertCircle, CheckCircle, PauseCircle, PlayCircle } from 'lucide-react';

interface BotLog {
  timestamp: string;
  type: string;
  event: string;
  error: string | null;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<BotLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('/api/analytics');
        const data = await response.json();
        setLogs(data.logs);
      } catch (error) {
        console.error('Error fetching logs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const formatTimestamp = (timestamp: string) => {
    return format(new Date(timestamp), 'MM/dd/yyyy HH:mm:ss');
  };

  const getEventIcon = (event: string) => {
    switch (event) {
      case 'started':
        return <PlayCircle className="h-5 w-5 text-green-500" />;
      case 'paused':
        return <PauseCircle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
    }
  };

  if (isLoading) {
    return <div>Loading logs...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">Bot Activity Logs</h1>
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl text-white">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-2 sm:space-y-3">
            {logs.map((log, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded bg-slate-700/50"
              >
                <div className="flex items-center gap-3 mb-2 sm:mb-0">
                  {getEventIcon(log.event)}
                  <div className="text-sm sm:text-base text-slate-200">
                    <span className="font-bold capitalize">{log.type}</span>
                    <span className="mx-2">-</span>
                    <span>{log.event}</span>
                    {log.error && (
                      <div className="text-red-400 text-xs sm:text-sm mt-1">{log.error}</div>
                    )}
                  </div>
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