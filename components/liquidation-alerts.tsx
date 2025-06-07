"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, DollarSign, Clock, Target, Play, Pause, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

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
  status?: "pending" | "executed" | "failed"
}

interface LiquidationAlertsProps {
  walletAddress: string
  walletType: "metamask" | "phantom" | null
}

// Demo data generator
const generateDemoAlerts = (): LiquidationAlert[] => {
  const protocols = ["Aave", "Compound", "Maker", "Liquity"]
  const riskLevels: ("low" | "medium" | "high")[] = ["low", "medium", "high"]
  
  return Array.from({ length: 5 }, (_, i) => ({
    id: `alert-${i + 1}`,
    protocol: protocols[Math.floor(Math.random() * protocols.length)],
    user: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
    collateral: `${(Math.random() * 10).toFixed(2)} ETH`,
    debt: `$${(Math.random() * 15000).toFixed(2)}`,
    healthFactor: 1 + Math.random() * 0.5,
    liquidationThreshold: 1.5,
    potentialProfit: Math.random() * 1000,
    timeToLiquidation: `${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m`,
    riskLevel: riskLevels[Math.floor(Math.random() * riskLevels.length)],
    status: "pending" as const
  }))
}

export function LiquidationAlerts({ walletAddress, walletType }: LiquidationAlertsProps) {
  const [alerts, setAlerts] = useState<LiquidationAlert[]>([])
  const [executedPositions, setExecutedPositions] = useState<LiquidationAlert[]>([])
  const [totalAlerts, setTotalAlerts] = useState(0)
  const [highRiskCount, setHighRiskCount] = useState(0)
  const [totalPotentialProfit, setTotalPotentialProfit] = useState(0)
  const [isScanning, setIsScanning] = useState(true)

  // Initialize demo data
  useEffect(() => {
    const demoAlerts = generateDemoAlerts()
    setAlerts(demoAlerts)
    updateStats(demoAlerts)
  }, [])

  // Update demo data periodically when scanning
  useEffect(() => {
    if (!isScanning) return

    const interval = setInterval(() => {
      const demoAlerts = generateDemoAlerts()
      setAlerts(demoAlerts)
      updateStats(demoAlerts)
    }, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [isScanning])

  const updateStats = (currentAlerts: LiquidationAlert[]) => {
    const highRisk = currentAlerts.filter((alert) => alert.riskLevel === "high").length
    const totalProfit = currentAlerts.reduce((sum, alert) => sum + alert.potentialProfit, 0)

    setHighRiskCount(highRisk)
    setTotalAlerts(currentAlerts.length)
    setTotalPotentialProfit(totalProfit)
  }

  const toggleScanning = () => {
    setIsScanning(!isScanning)
    toast.info(isScanning ? "Liquidation scanning paused" : "Liquidation scanning resumed")
  }

  const executeLiquidation = async (alert: LiquidationAlert) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update alert status
      const updatedAlerts = alerts.map(a => 
        a.id === alert.id ? { ...a, status: "executed" } : a
      )
      setAlerts(updatedAlerts)

      // Move to executed positions
      setExecutedPositions(prev => [...prev, { ...alert, status: "executed" }])
      
      toast.success("Liquidation executed successfully")
    } catch (error) {
      console.error("Failed to execute liquidation:", error)
      toast.error("Failed to execute liquidation")
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
            <CardTitle className="text-sm font-medium text-slate-200">Scanner Status</CardTitle>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-400">
                {isScanning ? "Active" : "Paused"}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={toggleScanning}
                className="h-8 w-8 p-0"
              >
                {isScanning ? (
                  <Pause className="h-4 w-4 text-yellow-400" />
                ) : (
                  <Play className="h-4 w-4 text-green-400" />
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">
              {isScanning ? "Scanning..." : "Paused"}
            </div>
            <p className="text-xs text-slate-400">Real-time monitoring</p>
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
                      disabled={alert.healthFactor > 1.2 || !isScanning || !walletAddress}
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

      {/* Executed Positions */}
      {executedPositions.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Executed Positions</CardTitle>
            <CardDescription className="text-slate-400">Successfully liquidated positions</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">Protocol</TableHead>
                  <TableHead className="text-slate-300">User</TableHead>
                  <TableHead className="text-slate-300">Position</TableHead>
                  <TableHead className="text-slate-300">Profit</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {executedPositions.map((position) => (
                  <TableRow key={position.id} className="border-slate-700">
                    <TableCell className="text-white font-medium">{position.protocol}</TableCell>
                    <TableCell className="text-slate-300 font-mono text-sm">{position.user}</TableCell>
                    <TableCell>
                      <div className="text-slate-300">
                        <div className="text-sm">{position.collateral}</div>
                        <div className="text-xs text-slate-400">Debt: {position.debt}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-green-400 font-medium">${position.potentialProfit.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-900/50 text-green-400">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Executed
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
