"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area, Legend,
  ReferenceLine
} from "recharts";
import { Bell, TrendingUp, Calculator, Wallet, RefreshCw, Play, Pause, AlertCircle, Zap, Shield } from "lucide-react";
import { ethers } from "ethers";
import { Connection, PublicKey } from "@solana/web3.js";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

// Form schema for profit calculator
const profitCalculatorSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  tokenPair: z.string().min(1, "Token pair is required"),
  gasPrice: z.string().optional(),
});

type ProfitCalculatorForm = z.infer<typeof profitCalculatorSchema>;

interface ArbitrageWidgetsProps {
  walletAddress: string;
  walletType: "metamask" | "phantom" | null;
}

// Demo data generators
const generateTimeSeriesData = (count: number, baseValue: number, variance: number) => {
  return Array.from({ length: count }, (_, i) => {
    const time = new Date(Date.now() - (count - i) * 60000); // Last 60 minutes
    const value = baseValue + (Math.random() - 0.5) * variance;
    return { time: time.toISOString(), value };
  });
};

const generateDemoData = () => {
  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1000;
  const timePoints = 60; // 60 data points for 1 hour

  // Price data
  const priceData = Array.from({ length: timePoints }, (_, i) => {
    const time = new Date(oneHourAgo + (i * 60000));
    return {
      time: time.toISOString(),
      uniswap: 1800 + Math.random() * 100,
      sushiswap: 1790 + Math.random() * 100,
      curve: 1780 + Math.random() * 100,
    };
  });

  // Opportunity data
  const opportunities = Array.from({ length: timePoints }, (_, i) => {
    const time = new Date(oneHourAgo + (i * 60000));
    return {
      timestamp: time.toISOString(),
      spread: Math.random() * 2, // 0-2% spread
    };
  });

  // Volume data
  const volumeData = [
    { exchange: "Uniswap", volume: 1500000 + Math.random() * 500000 },
    { exchange: "Sushiswap", volume: 1200000 + Math.random() * 400000 },
    { exchange: "Curve", volume: 900000 + Math.random() * 300000 },
    { exchange: "Orca", volume: 800000 + Math.random() * 200000 },
    { exchange: "Raydium", volume: 700000 + Math.random() * 200000 },
  ];

  // Profit data
  const profitData = Array.from({ length: timePoints }, (_, i) => {
    const time = new Date(oneHourAgo + (i * 60000));
    return {
      time: time.toISOString(),
      profit: Math.random() * 1000, // Random profit between 0-1000
    };
  });

  return { priceData, opportunities, volumeData, profitData };
};

export function ArbitrageWidgets({ walletAddress, walletType }: ArbitrageWidgetsProps) {
  const [priceData, setPriceData] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [volumeData, setVolumeData] = useState<any[]>([]);
  const [profitData, setProfitData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScannerActive, setIsScannerActive] = useState(true);
  const [walletBalance, setWalletBalance] = useState<string>("0");

  const { register, handleSubmit, formState: { errors } } = useForm<ProfitCalculatorForm>({
    resolver: zodResolver(profitCalculatorSchema),
  });

  // Initialize demo data
  useEffect(() => {
    const demoData = generateDemoData();
    setPriceData(demoData.priceData);
    setOpportunities(demoData.opportunities);
    setVolumeData(demoData.volumeData);
    setProfitData(demoData.profitData);
    setIsLoading(false);
  }, []);

  // Update demo data periodically
  useEffect(() => {
    if (!isScannerActive) return;

    const interval = setInterval(() => {
      const demoData = generateDemoData();
      setPriceData(demoData.priceData);
      setOpportunities(demoData.opportunities);
      setVolumeData(demoData.volumeData);
      setProfitData(demoData.profitData);
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [isScannerActive]);

  // Wallet event listeners
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Ethereum wallet events
      if (window.ethereum) {
        window.ethereum.on("accountsChanged", handleAccountsChanged);
        window.ethereum.on("chainChanged", handleChainChanged);
      }

      // Phantom wallet events
      if (window.solana) {
        window.solana.on("accountChanged", handleSolanaAccountChanged);
      }
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
      if (window.solana) {
        window.solana.removeListener("accountChanged", handleSolanaAccountChanged);
      }
    };
  }, []);

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      toast.error("Please connect your wallet");
    } else {
      toast.success("Account changed");
      // Update wallet state
    }
  };

  const handleChainChanged = () => {
    toast.info("Network changed");
    // Update network state
  };

  const handleSolanaAccountChanged = (publicKey: PublicKey) => {
    if (publicKey) {
      toast.success("Account changed");
      // Update wallet state
    } else {
      toast.error("Please connect your wallet");
    }
  };

  // Fetch wallet balance
  useEffect(() => {
    const fetchBalance = async () => {
      if (!walletAddress || !walletType) return;

      try {
        if (walletType === "metamask") {
          const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
          const balance = await provider.getBalance(walletAddress);
          setWalletBalance(ethers.formatEther(balance));
        } else if (walletType === "phantom") {
          const connection = new Connection(process.env.SOLANA_RPC_URL || "");
          const balance = await connection.getBalance(new PublicKey(walletAddress));
          setWalletBalance((balance / 1e9).toString()); // Convert lamports to SOL
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    fetchBalance();
    const interval = setInterval(fetchBalance, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [walletAddress, walletType]);

  // Handle profit calculation
  const onSubmit = async (data: ProfitCalculatorForm) => {
    try {
      const response = await fetch("/api/arbitrage/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      toast.success(`Estimated profit: $${result.profit.toFixed(2)}`);
    } catch (error) {
      console.error("Error calculating profit:", error);
      toast.error("Failed to calculate profit");
    }
  };

  // Execute arbitrage trade
  const executeTrade = async (opportunity: any) => {
    if (!walletAddress || !walletType) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      const response = await fetch("/api/arbitrage/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opportunity, walletAddress, walletType }),
      });
      const result = await response.json();
      toast.success("Trade executed successfully!");
    } catch (error) {
      console.error("Error executing trade:", error);
      toast.error("Failed to execute trade");
    }
  };

  // Toggle scanner status
  const toggleScanner = () => {
    setIsScannerActive(!isScannerActive);
    if (!isScannerActive) {
      // Resume scanning
      toast.success("Scanner resumed");
    } else {
      // Pause scanning
      toast.info("Scanner paused");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Price Comparison Widget */}
      <div className="bg-slate-700/30 rounded-lg p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white">Price Comparison</h3>
          <p className="text-sm text-slate-400">Live price data across exchanges</p>
        </div>
        <div className="h-[300px]">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-slate-400">Loading chart data...</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceData}>
                <defs>
                  <linearGradient id="uniswapGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#60A5FA" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="sushiswapGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34D399" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#34D399" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F472B6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#F472B6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="time" 
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                  tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                  tickFormatter={(value) => `$${value.toFixed(2)}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    color: "#F3F4F6",
                  }}
                  labelFormatter={(value) => new Date(value).toLocaleString()}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="uniswap" 
                  stroke="#60A5FA" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sushiswap" 
                  stroke="#34D399" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="curve" 
                  stroke="#F472B6" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Opportunity Alerts Widget */}
      <div className="bg-slate-700/30 rounded-lg p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Opportunity Alerts</h3>
            <p className="text-sm text-slate-400">Real-time arbitrage opportunities</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-400">
              {isScannerActive ? "Active" : "Paused"}
            </span>
            <Switch
              checked={isScannerActive}
              onCheckedChange={toggleScanner}
              className="data-[state=checked]:bg-green-500"
            />
          </div>
        </div>
        <div className="h-[200px] mb-4">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-slate-400">Loading opportunity data...</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={opportunities}>
                <defs>
                  <linearGradient id="spreadGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                  stroke="#94a3b8"
                  fontSize={12}
                />
                <YAxis
                  tickFormatter={(value) => `${value}%`}
                  stroke="#94a3b8"
                  fontSize={12}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-800 p-2 rounded border border-slate-700">
                          <p className="text-sm text-slate-300">
                            {new Date(payload[0].payload.timestamp).toLocaleTimeString()}
                          </p>
                          <p className="text-sm text-green-400">
                            Spread: {payload[0].value.toFixed(2)}%
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="spread"
                  stroke="#22c55e"
                  fillOpacity={1}
                  fill="url(#spreadGradient)"
                />
                <ReferenceLine y={0.5} stroke="#ef4444" strokeDasharray="3 3" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="h-[300px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-slate-400">Loading opportunities...</div>
            </div>
          ) : opportunities.length > 0 ? (
            opportunities.slice(0, 5).map((opportunity, index) => (
              <div
                key={index}
                className="bg-slate-800/50 rounded-lg p-3 border border-slate-700 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                    <span className="text-sm font-medium text-white">
                      ETH/USDC
                    </span>
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      opportunity.spread > 1
                        ? "text-green-400"
                        : opportunity.spread > 0.5
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    {opportunity.spread.toFixed(2)}% spread
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-slate-400">
                    Route: Uniswap → Sushiswap
                  </div>
                  <div className="text-slate-400">
                    Gas: ~$5.20
                  </div>
                  <div className="text-slate-400">
                    Profit: ~${(opportunity.spread * 100).toFixed(2)}
                  </div>
                  <div className="text-slate-400">
                    Confidence: {opportunity.spread > 1 ? "High" : opportunity.spread > 0.5 ? "Medium" : "Low"}
                  </div>
                </div>
                <div className="mt-2">
                  <Button
                    size="sm"
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                    disabled={!walletAddress || opportunity.spread < 0.5 || !isScannerActive}
                  >
                    Execute Trade
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-slate-400 py-4">
              No opportunities found
            </div>
          )}
        </div>
      </div>

      {/* Exchange Volume Widget */}
      <div className="bg-slate-700/30 rounded-lg p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white">Exchange Volume (24h)</h3>
          <p className="text-sm text-slate-400">Trading volume across exchanges</p>
        </div>
        <div className="h-[300px]">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-slate-400">Loading volume data...</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeData}>
                <defs>
                  <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#60A5FA" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="exchange" 
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    color: "#F3F4F6",
                  }}
                  formatter={(value: number) => [`$${(value / 1000000).toFixed(2)}M`, 'Volume']}
                />
                <Bar 
                  dataKey="volume" 
                  fill="url(#volumeGradient)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Profit Calculator Widget */}
      <div className="bg-slate-700/30 rounded-lg p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white">Profit Calculator</h3>
          <p className="text-sm text-slate-400">Estimated profit over time</p>
        </div>
        <div className="h-[200px] mb-4">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-slate-400">Loading profit data...</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={profitData}>
                <defs>
                  <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="time" 
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                  tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                  tickFormatter={(value) => `$${value.toFixed(2)}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    color: "#F3F4F6",
                  }}
                  labelFormatter={(value) => new Date(value).toLocaleString()}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Profit']}
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="#8B5CF6"
                  fillOpacity={1}
                  fill="url(#profitGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              {...register("amount")}
              placeholder="Enter amount"
              className="bg-slate-600 border-slate-500"
            />
            {errors.amount && (
              <p className="text-red-400 text-sm mt-1">{errors.amount.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="tokenPair">Token Pair</Label>
            <Input
              id="tokenPair"
              {...register("tokenPair")}
              placeholder="e.g., ETH/USDC"
              className="bg-slate-600 border-slate-500"
            />
            {errors.tokenPair && (
              <p className="text-red-400 text-sm mt-1">{errors.tokenPair.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="gasPrice">Gas Price (Optional)</Label>
            <Input
              id="gasPrice"
              {...register("gasPrice")}
              placeholder="Enter gas price in Gwei"
              className="bg-slate-600 border-slate-500"
            />
          </div>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Calculate Profit
          </Button>
        </form>
      </div>

      {/* Transaction Confirmation Widget */}
      <div className="bg-slate-700/30 rounded-lg p-4 md:col-span-2">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white">Transaction Status</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-600/30">
            <div className="flex items-center space-x-3">
              <Wallet className="h-5 w-5 text-blue-400" />
              <div>
                <div className="text-white font-medium">Wallet Status</div>
                <div className="text-sm text-slate-400">
                  {walletAddress ? "Connected" : "Not Connected"}
                </div>
              </div>
            </div>
            <div className="text-sm text-slate-400">
              {walletType ? `Using ${walletType}` : "No wallet selected"}
              {walletBalance && ` (${walletBalance} ${walletType === "metamask" ? "ETH" : "SOL"})`}
            </div>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-600/30">
            <div className="flex items-center space-x-3">
              <RefreshCw className="h-5 w-5 text-green-400" />
              <div>
                <div className="text-white font-medium">Last Update</div>
                <div className="text-sm text-slate-400">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
            <Button
              onClick={() => {
                // Refresh data
                toast.success("Data refreshed");
              }}
              variant="outline"
              className="border-slate-500 text-slate-300 hover:bg-slate-600"
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 