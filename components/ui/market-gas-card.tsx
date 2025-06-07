"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from "lucide-react";

interface GasData {
  SafeGasPrice: string;
  ProposeGasPrice: string;
  FastGasPrice: string;
  timestamp: string;
}

export function MarketGasCard() {
  const [gasData, setGasData] = useState<GasData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGasPrices = async () => {
    try {
      const response = await fetch('/api/market/etherscan');
      if (!response.ok) {
        throw new Error('Failed to fetch gas prices');
      }
      const data = await response.json();
      if (data.status === '1' && data.result) {
        setGasData({
          ...data.result,
          timestamp: new Date().toISOString()
        });
        setError(null);
      } else {
        throw new Error(data.message || 'Failed to fetch gas prices');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch gas prices');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGasPrices();
    const interval = setInterval(fetchGasPrices, 15000); // Refresh every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const getGasPriceColor = (price: string) => {
    const value = parseInt(price);
    if (value <= 20) return "text-green-400";
    if (value <= 40) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-white">
          Gas Prices
        </CardTitle>
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-4 w-4 text-slate-400 animate-spin" />
          <Badge variant="outline" className="text-xs">
            Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-slate-400">Loading gas prices...</div>
        ) : error ? (
          <div className="text-red-400">{error}</div>
        ) : gasData ? (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Slow</span>
              <span className={`font-mono ${getGasPriceColor(gasData.SafeGasPrice)}`}>
                {gasData.SafeGasPrice} Gwei
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Standard</span>
              <span className={`font-mono ${getGasPriceColor(gasData.ProposeGasPrice)}`}>
                {gasData.ProposeGasPrice} Gwei
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Fast</span>
              <span className={`font-mono ${getGasPriceColor(gasData.FastGasPrice)}`}>
                {gasData.FastGasPrice} Gwei
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-2">
              Last updated: {new Date(gasData.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
} 