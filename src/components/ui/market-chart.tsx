import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface MarketData {
  timestamp: string;
  price: number;
  volume: number;
}

interface TokenPair {
  id: string;
  name: string;
  network: string;
}

const POPULAR_PAIRS = [
  { id: 'eth_usdt', name: 'ETH/USDT', network: 'ethereum' },
  { id: 'btc_usdt', name: 'BTC/USDT', network: 'ethereum' },
  { id: 'sol_usdt', name: 'SOL/USDT', network: 'solana' },
  { id: 'matic_usdt', name: 'MATIC/USDT', network: 'polygon' },
];

export function MarketChart() {
  const [selectedPair, setSelectedPair] = useState<TokenPair>(POPULAR_PAIRS[0]);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('1h');

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://api.geckoterminal.com/api/v2/networks/${selectedPair.network}/pools/${selectedPair.id}/ohlcv/${timeframe}`
        );
        const data = await response.json();
        
        if (data.data) {
          const formattedData = data.data.map((item: any) => ({
            timestamp: new Date(item.attributes.timestamp).toISOString(),
            price: parseFloat(item.attributes.close_price),
            volume: parseFloat(item.attributes.volume_usd),
          }));
          setMarketData(formattedData);
        }
      } catch (error) {
        console.error('Error fetching market data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [selectedPair, timeframe]);

  const formatTimestamp = (timestamp: string) => {
    return format(new Date(timestamp), 'MM/dd HH:mm');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(price);
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-lg sm:text-xl text-white">Market Chart</CardTitle>
          <div className="flex gap-3">
            <Select
              value={selectedPair.id}
              onValueChange={(value) => {
                const pair = POPULAR_PAIRS.find(p => p.id === value);
                if (pair) setSelectedPair(pair);
              }}
            >
              <SelectTrigger className="w-[140px] bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Select pair" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                {POPULAR_PAIRS.map((pair) => (
                  <SelectItem
                    key={pair.id}
                    value={pair.id}
                    className="text-white hover:bg-slate-600"
                  >
                    {pair.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={timeframe}
              onValueChange={setTimeframe}
            >
              <SelectTrigger className="w-[100px] bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="1h" className="text-white hover:bg-slate-600">1H</SelectItem>
                <SelectItem value="4h" className="text-white hover:bg-slate-600">4H</SelectItem>
                <SelectItem value="1d" className="text-white hover:bg-slate-600">1D</SelectItem>
                <SelectItem value="1w" className="text-white hover:bg-slate-600">1W</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center text-slate-400">
            Loading chart data...
          </div>
        ) : (
          <div className="h-[300px] sm:h-[400px] lg:h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={marketData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={formatTimestamp}
                  stroke="#9CA3AF"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  stroke="#60A5FA"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => formatPrice(value)}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#34D399"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    color: '#F3F4F6',
                    fontSize: '14px',
                  }}
                  labelFormatter={formatTimestamp}
                  formatter={(value: number, name: string) => {
                    if (name === 'price') return formatPrice(value);
                    return `$${(value / 1000000).toFixed(1)}M`;
                  }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="price"
                  stroke="#60A5FA"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="volume"
                  stroke="#34D399"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        <div className="mt-4 flex gap-4 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Price</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span>Volume</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 