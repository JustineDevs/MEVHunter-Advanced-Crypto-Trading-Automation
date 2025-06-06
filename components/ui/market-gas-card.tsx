"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MarketGasCard() {
  const [gas, setGas] = useState<any>(null);
  useEffect(() => {
    fetch("/api/market/etherscan")
      .then((res) => res.json())
      .then((data) => setGas(data.result));
  }, []);

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Ethereum Gas Prices</CardTitle>
      </CardHeader>
      <CardContent>
        {gas ? (
          <div className="flex flex-col gap-2 text-slate-200">
            <div>Safe: <span className="text-green-400 font-bold">{gas.SafeGasPrice ? `${Number(gas.SafeGasPrice)} Gwei` : "N/A"}</span></div>
            <div>Propose: <span className="text-yellow-400 font-bold">{gas.ProposeGasPrice ? `${Number(gas.ProposeGasPrice)} Gwei` : "N/A"}</span></div>
            <div>Fast: <span className="text-red-400 font-bold">{gas.FastGasPrice ? `${Number(gas.FastGasPrice)} Gwei` : "N/A"}</span></div>
          </div>
        ) : (
          <div className="text-slate-400">Loading...</div>
        )}
      </CardContent>
    </Card>
  );
} 