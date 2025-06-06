"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Example Uniswap V3 USDC/ETH pool address (mainnet)
const DEFAULT_POOL = "0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8";

function formatNumber(num: string | number | undefined): string {
  if (!num) return "N/A";
  const n = Number(num);
  if (isNaN(n)) return String(num);
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function shortAddress(addr: string | undefined): string {
  if (!addr) return "N/A";
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

export function MarketUniswapCard({ pool = DEFAULT_POOL }) {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    fetch(`/api/market/uniswap?pool=${pool}`)
      .then((res) => res.json())
      .then((d) => setData(d));
  }, [pool]);

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Uniswap V3 Pool</CardTitle>
      </CardHeader>
      <CardContent>
        {data && !data.error ? (
          <div className="flex flex-col gap-2 text-slate-200">
            <div>Token0: <span className="font-mono">{shortAddress(data.token0)}</span></div>
            <div>Token1: <span className="font-mono">{shortAddress(data.token1)}</span></div>
            <div>
              Liquidity: <span className="text-green-400 font-bold">{formatNumber(data.liquidity)}</span>
            </div>
            <div>
              Tick: <span className="text-yellow-400 font-bold">{data.slot0 && data.slot0.tick !== undefined ? data.slot0.tick.toString() : "N/A"}</span>
            </div>
          </div>
        ) : data && data.error ? (
          <div className="text-red-400">{data.error}</div>
        ) : (
          <div className="text-slate-400">Loading...</div>
        )}
      </CardContent>
    </Card>
  );
} 