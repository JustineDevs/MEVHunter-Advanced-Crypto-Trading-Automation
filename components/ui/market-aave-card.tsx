"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Example user address (replace with connected wallet address in production)
const DEFAULT_USER = "0x0000000000000000000000000000000000000000";

function formatAaveNumber(num: string | number | undefined): string {
  if (!num) return "N/A";
  const n = Number(num);
  if (isNaN(n)) return String(num);
  if (n > 1e6 || n < 1e-2) return n.toExponential(2);
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export function MarketAaveCard({ user = DEFAULT_USER }) {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    fetch(`/api/market/aave?user=${user}`)
      .then((res) => res.json())
      .then((d) => setData(d));
  }, [user]);

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Aave Account Data</CardTitle>
      </CardHeader>
      <CardContent>
        {data && !data.error ? (
          <div className="flex flex-col gap-2 text-slate-200">
            <div>Total Collateral: <span className="text-green-400 font-bold">{Number(data.totalCollateralETH) / 1e18} ETH</span></div>
            <div>Total Debt: <span className="text-red-400 font-bold">{Number(data.totalDebtETH) / 1e18} ETH</span></div>
            <div>Available Borrows: <span className="text-yellow-400 font-bold">{Number(data.availableBorrowsETH) / 1e18} ETH</span></div>
            <div>Health Factor: <span className="text-green-400 font-bold">{formatAaveNumber(data.healthFactor)}</span></div>
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