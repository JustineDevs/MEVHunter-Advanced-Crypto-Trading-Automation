"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, BarChart3, Target } from "lucide-react"

interface TradingSignal {
  id: string
  symbol: string
  signal: "buy" | "sell" | "hold"
  strength: number
  price: number
  target: number
  stopLoss: number
  confidence: number
  source: string
  timestamp: Date
}

interface MarketData {
  symbol: string
  price: number
  change24h: number
  volume: number
  marketCap: number
}

export function TradingSignals() {
  const [signals, setSignals] = useState<TradingSignal[]>([
    {
      id: "1",
      symbol: "ETH/USDT",
      signal: "buy",
      strength: 85,
      price: 2456.78,
      target: 2650.0,
      stopLoss: 2300.0,
      confidence: 87,
      source: "TradingView",
      timestamp: new Date(),
    },
    {
      id: "2",
      symbol: "BTC/USDT",
      signal: "sell",
      strength: 72,
      price: 43250.0,
      target: 41000.0,
      stopLoss: 44500.0,
      confidence: 78,
      source: "Alpaca",
      timestamp: new Date(),
    },
  ])

  const [marketData, setMarketData] = useState<MarketData[]>([
    {
      symbol: "ETH",
      price: 2456.78,
      change24h: 3.45,
      volume: 15234567890,
      marketCap: 295000000000,
    },
    {
      symbol: "BTC",
      price: 43250.0,
      change24h: -1.23,
      volume: 28456789012,
      marketCap: 850000000000,
    },
  ])

  const [selectedTimeframe, setSelectedTimeframe] = useState("1h")
  const [totalSignals, setTotalSignals] = useState(0)
  const [buySignals, setBuySignals] = useState(0)
  const [avgConfidence, setAvgConfidence] = useState(0)

  useEffect(() => {
    const total = signals.length
    const buys = signals.filter((s) => s.signal === "buy").length
    const avgConf = signals.reduce((sum, s) => sum + s.confidence, 0) / total || 0

    setTotalSignals(total)
    setBuySignals(buys)
    setAvgConfidence(avgConf)
  }, [signals])

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case "buy":
        return "bg-green-900/50 text-green-400"
      case "sell":
        return "bg-red-900/50 text-red-400"
      case "hold":
        return "bg-yellow-900/50 text-yellow-400"
      default:
        return "bg-slate-900/50 text-slate-400"
    }
  }

  const getChangeColor = (change: number) => {
    return change >= 0 ? "text-green-400" : "text-red-400"
  }

  const executeSignal = async (signal: TradingSignal) => {
    try {
      const response = await fetch("/api/trading/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signalId: signal.id }),
      })

      if (response.ok) {
        console.log("Signal executed successfully")
      }
    } catch (error) {
      console.error("Failed to execute signal:", error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Total Signals</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalSignals}</div>
            <p className="text-xs text-slate-400">Active trading signals</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Buy Signals</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{buySignals}</div>
            <p className="text-xs text-slate-400">Bullish opportunities</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Avg Confidence</CardTitle>
            <Target className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{avgConfidence.toFixed(0)}%</div>
            <p className="text-xs text-slate-400">Signal reliability</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">73%</div>
            <p className="text-xs text-slate-400">Historical accuracy</p>
          </CardContent>
        </Card>
      </div>

      {/* Market Overview */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-white">Market Overview</CardTitle>
              <CardDescription className="text-slate-400">Real-time market data and price movements</CardDescription>
            </div>
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-32 bg-slate-700 border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="1m">1 Minute</SelectItem>
                <SelectItem value="5m">5 Minutes</SelectItem>
                <SelectItem value="1h">1 Hour</SelectItem>
                <SelectItem value="1d">1 Day</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-300">Symbol</TableHead>
                <TableHead className="text-slate-300">Price</TableHead>
                <TableHead className="text-slate-300">24h Change</TableHead>
                <TableHead className="text-slate-300">Volume</TableHead>
                <TableHead className="text-slate-300">Market Cap</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {marketData.map((data) => (
                <TableRow key={data.symbol} className="border-slate-700">
                  <TableCell className="text-white font-medium">{data.symbol}</TableCell>
                  <TableCell className="text-slate-300">${data.price.toLocaleString()}</TableCell>
                  <TableCell className={getChangeColor(data.change24h)}>
                    {data.change24h > 0 ? "+" : ""}
                    {data.change24h.toFixed(2)}%
                  </TableCell>
                  <TableCell className="text-slate-300">${(data.volume / 1e9).toFixed(2)}B</TableCell>
                  <TableCell className="text-slate-300">${(data.marketCap / 1e9).toFixed(0)}B</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Trading Signals */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Active Trading Signals</CardTitle>
          <CardDescription className="text-slate-400">
            AI-powered trading recommendations from multiple sources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-300">Symbol</TableHead>
                <TableHead className="text-slate-300">Signal</TableHead>
                <TableHead className="text-slate-300">Strength</TableHead>
                <TableHead className="text-slate-300">Entry</TableHead>
                <TableHead className="text-slate-300">Target</TableHead>
                <TableHead className="text-slate-300">Stop Loss</TableHead>
                <TableHead className="text-slate-300">Confidence</TableHead>
                <TableHead className="text-slate-300">Source</TableHead>
                <TableHead className="text-slate-300">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {signals.map((signal) => (
                <TableRow key={signal.id} className="border-slate-700">
                  <TableCell className="text-white font-medium">{signal.symbol}</TableCell>
                  <TableCell>
                    <Badge className={getSignalColor(signal.signal)}>{signal.signal.toUpperCase()}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      <span className="text-slate-300">{signal.strength}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-300">${signal.price.toLocaleString()}</TableCell>
                  <TableCell className="text-green-400">${signal.target.toLocaleString()}</TableCell>
                  <TableCell className="text-red-400">${signal.stopLoss.toLocaleString()}</TableCell>
                  <TableCell className="text-yellow-400">{signal.confidence}%</TableCell>
                  <TableCell className="text-slate-300">{signal.source}</TableCell>
                  <TableCell>
                    <Button size="sm" onClick={() => executeSignal(signal)} className="bg-blue-600 hover:bg-blue-700">
                      Execute
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
