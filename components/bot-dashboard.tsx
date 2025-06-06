"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Play, Pause, Settings, Activity, TrendingUp, AlertTriangle } from "lucide-react"

interface BotDashboardProps {
  isConnected: boolean
}

interface BotStrategy {
  id: string
  name: string
  status: "active" | "paused" | "error"
  profit: number
  trades: number
  successRate: number
  riskLevel: "low" | "medium" | "high"
}

export function BotDashboard({ isConnected }: BotDashboardProps) {
  const [strategies, setStrategies] = useState<BotStrategy[]>([
    {
      id: "1",
      name: "Uniswap V3 Arbitrage",
      status: "active",
      profit: 245.67,
      trades: 23,
      successRate: 87.5,
      riskLevel: "medium",
    },
    {
      id: "2",
      name: "Aave Liquidation Hunter",
      status: "active",
      profit: 156.23,
      trades: 8,
      successRate: 100,
      riskLevel: "low",
    },
    {
      id: "3",
      name: "Cross-Chain MEV",
      status: "paused",
      profit: -12.45,
      trades: 3,
      successRate: 33.3,
      riskLevel: "high",
    },
    {
      id: "4",
      name: "Flash Loan Arbitrage",
      status: "active",
      profit: 89.12,
      trades: 15,
      successRate: 73.3,
      riskLevel: "medium",
    },
  ])

  const toggleStrategy = (id: string) => {
    setStrategies((prev) =>
      prev.map((strategy) =>
        strategy.id === id ? { ...strategy, status: strategy.status === "active" ? "paused" : "active" } : strategy,
      ),
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-900/50 text-green-400"
      case "paused":
        return "bg-yellow-900/50 text-yellow-400"
      case "error":
        return "bg-red-900/50 text-red-400"
      default:
        return "bg-slate-900/50 text-slate-400"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-400"
      case "medium":
        return "text-yellow-400"
      case "high":
        return "text-red-400"
      default:
        return "text-slate-400"
    }
  }

  return (
    <div className="space-y-6">
      {/* Strategy Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {strategies.map((strategy) => (
          <Card key={strategy.id} className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white text-lg">{strategy.name}</CardTitle>
                  <CardDescription className="text-slate-400">
                    {strategy.trades} trades • {strategy.successRate}% success rate
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(strategy.status)}>{strategy.status}</Badge>
                  <Switch
                    checked={strategy.status === "active"}
                    onCheckedChange={() => toggleStrategy(strategy.id)}
                    disabled={!isConnected}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Profit/Loss</span>
                  <span className={`font-bold ${strategy.profit >= 0 ? "text-green-400" : "text-red-400"}`}>
                    ${strategy.profit.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Risk Level</span>
                  <span className={`font-medium ${getRiskColor(strategy.riskLevel)}`}>
                    {strategy.riskLevel.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Success Rate</span>
                    <span className="text-slate-300">{strategy.successRate}%</span>
                  </div>
                  <Progress value={strategy.successRate} className="h-2 bg-slate-700" />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                    <Settings className="w-4 h-4 mr-1" />
                    Configure
                  </Button>
                  <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                    <Activity className="w-4 h-4 mr-1" />
                    Logs
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
          <CardDescription className="text-slate-400">
            Manage your trading strategies and monitoring systems
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700 h-20 flex-col" disabled={!isConnected}>
              <Play className="w-6 h-6 mb-2" />
              Start All Bots
            </Button>
            <Button
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700 h-20 flex-col"
              disabled={!isConnected}
            >
              <Pause className="w-6 h-6 mb-2" />
              Pause All
            </Button>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 h-20 flex-col">
              <TrendingUp className="w-6 h-6 mb-2" />
              Analytics
            </Button>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 h-20 flex-col">
              <AlertTriangle className="w-6 h-6 mb-2" />
              Risk Monitor
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
