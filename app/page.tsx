"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletConnection } from "@/components/wallet-connection"
import { BotDashboard } from "@/components/bot-dashboard"
import { ArbitrageMonitor } from "@/components/arbitrage-monitor"
import { LiquidationAlerts } from "@/components/liquidation-alerts"
import { GasOptimizer } from "@/components/gas-optimizer"
import { NFTMonitor } from "@/components/nft-monitor"
import { TradingSignals } from "@/components/trading-signals"
import { SecurityAudit } from "@/components/security-audit"
import { TrendingUp, Shield, Zap, Bot } from "lucide-react"

export default function CryptoBotDashboard() {
  const [isConnected, setIsConnected] = useState(false)
  const [activeStrategies, setActiveStrategies] = useState(0)
  const [totalProfit, setTotalProfit] = useState(0)
  const [riskLevel, setRiskLevel] = useState("Medium")

  useEffect(() => {
    // Initialize WebSocket connections for real-time data
    const ws = new WebSocket("ws://localhost:8080/realtime")

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === "profit_update") {
        setTotalProfit(data.value)
      }
      if (data.type === "strategy_count") {
        setActiveStrategies(data.count)
      }
    }

    return () => ws.close()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">DeFi Bot Command Center</h1>
            <p className="text-slate-300">Advanced crypto trading automation & monitoring system</p>
          </div>
          <WalletConnection onConnectionChange={setIsConnected} isConnected={isConnected} />
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Active Strategies</CardTitle>
              <Bot className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{activeStrategies}</div>
              <p className="text-xs text-slate-400">+2 from last hour</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Total P&L</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">${totalProfit.toFixed(2)}</div>
              <p className="text-xs text-slate-400">+12.5% this week</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Risk Level</CardTitle>
              <Shield className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">{riskLevel}</div>
              <p className="text-xs text-slate-400">Optimized for safety</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Gas Saved</CardTitle>
              <Zap className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">0.45 ETH</div>
              <p className="text-xs text-slate-400">Through optimization</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 bg-slate-800/50">
            <TabsTrigger value="dashboard" className="text-slate-200">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="arbitrage" className="text-slate-200">
              Arbitrage
            </TabsTrigger>
            <TabsTrigger value="liquidation" className="text-slate-200">
              Liquidation
            </TabsTrigger>
            <TabsTrigger value="gas" className="text-slate-200">
              Gas Optimizer
            </TabsTrigger>
            <TabsTrigger value="nft" className="text-slate-200">
              NFT Monitor
            </TabsTrigger>
            <TabsTrigger value="signals" className="text-slate-200">
              Trading
            </TabsTrigger>
            <TabsTrigger value="security" className="text-slate-200">
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <BotDashboard isConnected={isConnected} />
          </TabsContent>

          <TabsContent value="arbitrage">
            <ArbitrageMonitor />
          </TabsContent>

          <TabsContent value="liquidation">
            <LiquidationAlerts />
          </TabsContent>

          <TabsContent value="gas">
            <GasOptimizer />
          </TabsContent>

          <TabsContent value="nft">
            <NFTMonitor />
          </TabsContent>

          <TabsContent value="signals">
            <TradingSignals />
          </TabsContent>

          <TabsContent value="security">
            <SecurityAudit />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
