"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, DollarSign, Clock, Target } from "lucide-react"
import { TradingViewWidget } from "@/components/TradingViewWidget"

interface LiquidationAlert {
  id: string
  protocol: string
  user: string
  collateral: string
  debt: string
  healthFactor: number
  liquidationThreshold: number
  potentialProfit: number
  timeToLiquidation: string
  riskLevel: "low" | "medium" | "high"
}

export function LiquidationAlerts() {
  const [alerts, setAlerts] = useState<LiquidationAlert[]>([
    {
      id: "1",
      protocol: "Aave V3",
      user: "0x1234...5678",
      collateral: "15.5 ETH",
      debt: "25,000 USDC",
      healthFactor: 1.05,
      liquidationThreshold: 1.0,
      potentialProfit: 156.78,
      timeToLiquidation: "2h 15m",
      riskLevel: "high",
    },
    {
      id: "2",
      protocol: "Compound",
      user: "0xabcd...efgh",
      collateral: "50 WBTC",
      debt: "800,000 DAI",
      healthFactor: 1.12,
      liquidationThreshold: 1.0,
      potentialProfit: 2340.56,
      timeToLiquidation: "4h 32m",
      riskLevel: "medium",
    },
  ])

  const [totalAlerts, setTotalAlerts] = useState(alerts.length)
  const [highRiskCount, setHighRiskCount] = useState(0)
  const [totalPotentialProfit, setTotalPotentialProfit] = useState(0)

  useEffect(() => {
    const highRisk = alerts.filter((alert) => alert.riskLevel === "high").length
    const totalProfit = alerts.reduce((sum, alert) => sum + alert.potentialProfit, 0)

    setHighRiskCount(highRisk)
    setTotalPotentialProfit(totalProfit)
  }, [alerts])

  const executeLiquidation = async (alert: LiquidationAlert) => {
    try {
      const response = await fetch("/api/liquidation/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alertId: alert.id }),
      })

      if (response.ok) {
        console.log("Liquidation executed successfully")
      }
    } catch (error) {
      console.error("Failed to execute liquidation:", error)
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-900/50 text-green-400"
      case "medium":
        return "bg-yellow-900/50 text-yellow-400"
      case "high":
        return "bg-red-900/50 text-red-400"
      default:
        return "bg-slate-900/50 text-slate-400"
    }
  }

  const getHealthFactorColor = (hf: number) => {
    if (hf < 1.1) return "text-red-400"
    if (hf < 1.3) return "text-yellow-400"
    return "text-green-400"
  }

  return (
    <div className="space-y-6">
      {/* Live Chart Card */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Live Market Chart</CardTitle>
          <CardDescription className="text-slate-400">Real-time TradingView chart for selected symbol</CardDescription>
        </CardHeader>
        <CardContent>
          <TradingViewWidget symbol="BINANCE:BTCUSDT" interval="1" />
        </CardContent>
      </Card>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Total Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalAlerts}</div>
            <p className="text-xs text-slate-400">Active positions at risk</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">High Risk</CardTitle>
            <Target className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{highRiskCount}</div>
            <p className="text-xs text-slate-400">Immediate liquidation risk</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Potential Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">${totalPotentialProfit.toFixed(2)}</div>
            <p className="text-xs text-slate-400">From all liquidations</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Avg Time</CardTitle>
            <Clock className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">3h 24m</div>
            <p className="text-xs text-slate-400">Until liquidation</p>
          </CardContent>
        </Card>
      </div>

      {/* Liquidation Alerts Table */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Liquidation Opportunities</CardTitle>
          <CardDescription className="text-slate-400">Monitor positions at risk across DeFi protocols</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-300">Protocol</TableHead>
                <TableHead className="text-slate-300">User</TableHead>
                <TableHead className="text-slate-300">Position</TableHead>
                <TableHead className="text-slate-300">Health Factor</TableHead>
                <TableHead className="text-slate-300">Time Left</TableHead>
                <TableHead className="text-slate-300">Profit</TableHead>
                <TableHead className="text-slate-300">Risk</TableHead>
                <TableHead className="text-slate-300">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map((alert) => (
                <TableRow key={alert.id} className="border-slate-700">
                  <TableCell className="text-white font-medium">{alert.protocol}</TableCell>
                  <TableCell className="text-slate-300 font-mono text-sm">{alert.user}</TableCell>
                  <TableCell>
                    <div className="text-slate-300">
                      <div className="text-sm">{alert.collateral}</div>
                      <div className="text-xs text-slate-400">Debt: {alert.debt}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`font-bold ${getHealthFactorColor(alert.healthFactor)}`}>
                      {alert.healthFactor.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-300">{alert.timeToLiquidation}</TableCell>
                  <TableCell className="text-green-400 font-medium">${alert.potentialProfit.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={getRiskColor(alert.riskLevel)}>{alert.riskLevel.toUpperCase()}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => executeLiquidation(alert)}
                      className="bg-red-600 hover:bg-red-700"
                      disabled={alert.healthFactor > 1.2}
                    >
                      Liquidate
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
