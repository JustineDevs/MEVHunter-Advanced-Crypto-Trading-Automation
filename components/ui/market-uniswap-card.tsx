"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

// Example Uniswap V3 USDC/ETH pool address (mainnet)
const DEFAULT_POOL = "0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8";

function formatNumber(num: string | number | undefined): string {
  if (!num) return "N/A";
  const n = Number(num);
  if (isNaN(n)) return String(num);
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function shortAddress(address: string): string {
  if (!address) return "N/A";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function MarketUniswapCard({ pool = DEFAULT_POOL }) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  const fetchPoolData = async () => {
    try {
      const response = await fetch(`/api/market/uniswap?pool=${pool}`);
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching Uniswap pool data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPoolData();
    const interval = setInterval(fetchPoolData, 15000); // Refresh every 15 seconds
    return () => clearInterval(interval);
  }, [pool]);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      toast.success("Address copied to clipboard");
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      toast.error("Failed to copy address");
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Uniswap V3 Pool</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-slate-400">Loading pool data...</div>
        ) : data && !data.error ? (
          <div className="flex flex-col gap-2 text-slate-200">
            <div className="flex items-center justify-between">
              <span>Token0:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono">{shortAddress(data.token0)}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => copyToClipboard(data.token0, 'token0')}
                >
                  {copied === 'token0' ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4 text-slate-400" />
                  )}
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>Token1:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono">{shortAddress(data.token1)}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => copyToClipboard(data.token1, 'token1')}
                >
                  {copied === 'token1' ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4 text-slate-400" />
                  )}
                </Button>
              </div>
            </div>
            <div>
              Liquidity: <span className="text-green-400 font-bold">{formatNumber(data.liquidity)}</span>
            </div>
            <div>
              Tick: <span className="text-yellow-400 font-bold">{data.slot0 && data.slot0.tick !== undefined ? data.slot0.tick.toString() : "N/A"}</span>
            </div>
            <div className="text-xs text-slate-500 mt-2">
              Last updated: {new Date(data.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ) : data && data.error ? (
          <div className="text-red-400">{data.error}</div>
        ) : (
          <div className="text-slate-400">No data available</div>
        )}
      </CardContent>
    </Card>
  );
} 