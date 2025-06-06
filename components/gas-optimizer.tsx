"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Zap, TrendingDown, Clock, Settings } from "lucide-react"

interface GasData {
  slow: number
  standard: number
  fast: number
  instant: number
  timestamp: Date
}

export function GasOptimizer() {
  const [gasData, setGasData] = useState<GasData>({
    slow: 12,
    standard: 18,
    fast: 25,
    instant: 35,
    timestamp: new Date(),
  })

  const [autoOptimize, setAutoOptimize] = useState(true)
  const [maxGasPrice, setMaxGasPrice] = useState([50])
  const [priorityFee, setPriorityFee] = useState([2])
  const [savedGas, setSavedGas] = useState(0.45)

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time gas price updates
      setGasData((prev) => ({
        slow: Math.max(8, prev.slow + (Math.random() - 0.5) * 4),
        standard: Math.max(12, prev.standard + (Math.random() - 0.5) * 6),
        fast: Math.max(18, prev.fast + (Math.random() - 0.5) * 8),
        instant: Math.max(25, prev.instant + (Math.random() - 0.5) * 10),
        timestamp: new Date(),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const optimizeTransaction = async () => {
    try {
      const response = await fetch("/api/gas/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          maxGasPrice: maxGasPrice[0],
          priorityFee: priorityFee[0],
        }),
      })

      if (response.ok) {
        console.log("Gas optimization applied")
      }
    } catch (error) {
      console.error("Failed to optimize gas:", error)
    }
  }

  const getGasColor = (price: number) => {
    if (price < 15) return "text-green-400"
    if (price < 25) return "text-yellow-400"
    return "text-red-400"
  }

  return (
    <div className="space-y-6">
      {/* Gas Price Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Slow</CardTitle>
            <Clock className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getGasColor(gasData.slow)}`}>{gasData.slow.toFixed(0)} gwei</div>
            <p className="text-xs text-slate-400">~5-10 minutes</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Standard</CardTitle>
            <Zap className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getGasColor(gasData.standard)}`}>
              {gasData.standard.toFixed(0)} gwei
            </div>
            <p className="text-xs text-slate-400">~2-3 minutes</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Fast</CardTitle>
            <TrendingDown className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getGasColor(gasData.fast)}`}>{gasData.fast.toFixed(0)} gwei</div>
            <p className="text-xs text-slate-400">~30 seconds</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Instant</CardTitle>
            <Zap className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getGasColor(gasData.instant)}`}>
              {gasData.instant.toFixed(0)} gwei
            </div>
            <p className="text-xs text-slate-400">~15 seconds</p>
          </CardContent>
        </Card>
      </div>

      {/* Optimization Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Gas Optimization Settings</CardTitle>
            <CardDescription className="text-slate-400">Configure automatic gas price optimization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-slate-200">Auto-Optimize</label>
                <p className="text-xs text-slate-400">Automatically adjust gas prices for optimal cost</p>
              </div>
              <Switch checked={autoOptimize} onCheckedChange={setAutoOptimize} />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-slate-200">Max Gas Price</label>
                <span className="text-sm text-slate-300">{maxGasPrice[0]} gwei</span>
              </div>
              <Slider
                value={maxGasPrice}
                onValueChange={setMaxGasPrice}
                max={100}
                min={10}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-slate-200">Priority Fee</label>
                <span className="text-sm text-slate-300">{priorityFee[0]} gwei</span>
              </div>
              <Slider
                value={priorityFee}
                onValueChange={setPriorityFee}
                max={10}
                min={0.5}
                step={0.1}
                className="w-full"
              />
            </div>

            <Button onClick={optimizeTransaction} className="w-full bg-blue-600 hover:bg-blue-700">
              <Settings className="w-4 h-4 mr-2" />
              Apply Optimization
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Gas Savings Analytics</CardTitle>
            <CardDescription className="text-slate-400">Track your gas optimization performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">{savedGas.toFixed(3)} ETH</div>
              <p className="text-slate-400">Total Gas Saved</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                <div className="text-xl font-bold text-white">156</div>
                <p className="text-xs text-slate-400">Optimized Txns</p>
              </div>
              <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                <div className="text-xl font-bold text-yellow-400">23%</div>
                <p className="text-xs text-slate-400">Avg Savings</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">This Week</span>
                <span className="text-green-400">+0.12 ETH</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">This Month</span>
                <span className="text-green-400">+0.45 ETH</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">All Time</span>
                <span className="text-green-400">+1.23 ETH</span>
              </div>
            </div>

            <Badge className="w-full justify-center bg-green-900/50 text-green-400">Optimization Active</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
