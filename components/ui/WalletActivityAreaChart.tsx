"use client";
import React, { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { ethers } from "ethers";
import { Connection, PublicKey } from "@solana/web3.js";
import { Button } from "@/components/ui/button"
// import { Redis } from "@upstash/redis"; // Uncomment if you want to use Upstash Redis client-side (not recommended for secrets)

interface ChartDataPoint {
  time: string;
  txVolume: number;
  tokenBalance: number;
  defiValue: number;
}

interface WalletActivityAreaChartProps {
  ethAddress?: string;
  solAddress?: string;
}

export const WalletActivityAreaChart: React.FC<WalletActivityAreaChartProps> = ({ ethAddress, solAddress }) => {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState<'5m' | '1h' | '1d' | '7d' | '30d'>('7d');

  // Demo data generator
  const generateDemoData = (frame: typeof timeFrame) => {
    let points = 0;
    let label = '';
    switch (frame) {
      case '5m': points = 10; label = 'min ago'; break;
      case '1h': points = 12; label = 'min ago'; break;
      case '1d': points = 24; label = 'h ago'; break;
      case '7d': points = 7; label = 'd ago'; break;
      case '30d': points = 30; label = 'd ago'; break;
    }
    return Array.from({ length: points }, (_, i) => ({
      time: `${points - i}${label}`,
      txVolume: Math.random() * 10 + (frame === '5m' ? 10 : 0),
      tokenBalance: Math.random() * 5 + (frame === '5m' ? 2 : 0),
      defiValue: Math.random() * 20 + (frame === '5m' ? 5 : 0),
    }));
  };

  useEffect(() => {
      setLoading(true);
    setTimeout(() => {
      setData(generateDemoData(timeFrame));
      setLoading(false);
    }, 400);
  }, [timeFrame, ethAddress, solAddress]);

  return (
    <div className="w-full h-[350px] md:h-[400px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg p-2">
      <div className="flex items-center gap-2 mb-2">
        {['5m', '1h', '1d', '7d', '30d'].map((frame) => (
          <Button
            key={frame}
            size="sm"
            variant={timeFrame === frame ? 'default' : 'outline'}
            className={`text-xs px-3 py-1 rounded-full ${timeFrame === frame ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-cyan-200 border-cyan-700'}`}
            onClick={() => setTimeFrame(frame as typeof timeFrame)}
          >
            {frame}
          </Button>
        ))}
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-full text-slate-400">Loading chart...</div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTx" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a21caf" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#a21caf" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorToken" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorDefi" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="time" stroke="#a5b4fc" />
            <YAxis stroke="#a5b4fc" />
            <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #a21caf", color: "#fff" }} />
            <Legend />
            <Area type="monotone" dataKey="txVolume" stroke="#a21caf" fillOpacity={1} fill="url(#colorTx)" name="Tx Volume" />
            <Area type="monotone" dataKey="tokenBalance" stroke="#818cf8" fillOpacity={1} fill="url(#colorToken)" name="Token Balance" />
            <Area type="monotone" dataKey="defiValue" stroke="#06b6d4" fillOpacity={1} fill="url(#colorDefi)" name="DeFi Value" />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}; 