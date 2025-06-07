"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Clock
} from "lucide-react"

interface MarketChartWidgetProps {
  walletAddress: string
  walletType: "metamask" | "phantom" | null
}

// Demo data generator
const generateMarketData = () => {
  const data = []
  const now = new Date()
  let price = 2000 // Starting price
  let volume = 1000 // Starting volume

  for (let i = 0; i < 24; i++) {
    // Generate random price movement
    const priceChange = (Math.random() - 0.5) * 50
    price += priceChange
    volume = Math.max(500, volume + (Math.random() - 0.5) * 200)

    data.push({
      time: new Date(now.getTime() - (23 - i) * 3600000).toLocaleTimeString(),
      price: price,
      volume: volume,
      change: priceChange,
    })
  }
  return data
}

export function MarketChartWidget({ walletAddress, walletType }: MarketChartWidgetProps) {
  const [marketData, setMarketData] = useState(generateMarketData())
  const [timeframe, setTimeframe] = useState("24h")
  const [isLoading, setIsLoading] = useState(true)

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(generateMarketData())
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  // Simulate initial data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleTimeframeChange = (value: string) => {
    setTimeframe(value)
    toast.info(`Timeframe changed to ${value}`)
  }

  const getPriceChangeColor = (change: number) => {
    return change >= 0 ? "text-green-400" : "text-red-400"
  }

  const getPriceChangeIcon = (change: number) => {
    return change >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />
  }

  const currentPrice = marketData[marketData.length - 1].price
  const priceChange = marketData[marketData.length - 1].change
  const volume = marketData[marketData.length - 1].volume

  return (
    <div className="space-y-6">
      {/* Price Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Current Price</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${currentPrice.toFixed(2)}</div>
            <div className={`flex items-center text-sm ${getPriceChangeColor(priceChange)}`}>
              {getPriceChangeIcon(priceChange)}
              <span>{Math.abs(priceChange).toFixed(2)}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">24h Volume</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${volume.toFixed(0)}</div>
            <p className="text-xs text-slate-400">Trading volume</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Timeframe</CardTitle>
            <Clock className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <Select value={timeframe} onValueChange={handleTimeframeChange}>
              <SelectTrigger className="w-[120px] bg-slate-700 border-slate-600">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1 Hour</SelectItem>
                <SelectItem value="24h">24 Hours</SelectItem>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Market Chart */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>Price Chart</span>
            <RefreshCw className="h-4 w-4 text-slate-400" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={marketData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "0.5rem"
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={false}
                  name="Price"
                />
                <ReferenceLine 
                  y={currentPrice} 
                  stroke="#8884d8" 
                  strokeDasharray="3 3" 
                  label={{ 
                    value: "Current", 
                    position: "right",
                    fill: "#9CA3AF"
                  }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 