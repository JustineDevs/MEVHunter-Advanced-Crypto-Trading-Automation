"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowRight, TrendingUp, RefreshCw, Zap } from "lucide-react"

interface ArbitrageOpportunity {
  id: string
  tokenPair: string
  exchange1: string
  exchange2: string
  price1: number
  price2: number
  spread: number
  profitEstimate: number
  gasEstimate: number
  confidence: number
  timestamp: Date
}

interface ArbitrageMonitorProps {
  walletAddress: string
  walletType: "metamask" | "phantom" | null
}

export function ArbitrageMonitor({ walletAddress, walletType }: ArbitrageMonitorProps) {
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [totalOpportunities, setTotalOpportunities] = useState(0)
  const [avgProfit, setAvgProfit] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates
      setOpportunities((prev) => {
        const updated = prev.map((opp) => ({
          ...opp,
          price1: opp.price1 + (Math.random() - 0.5) * 10,
          price2: opp.price2 + (Math.random() - 0.5) * 10,
          timestamp: new Date(),
        }))

        // Recalculate spread and profit
        return updated.map((opp) => {
          const spread = ((opp.price2 - opp.price1) / opp.price1) * 100
          const profitEstimate = Math.abs(spread) * 100 - opp.gasEstimate * 2500
          return {
            ...opp,
            spread,
            profitEstimate: Math.max(0, profitEstimate),
          }
        })
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const executeArbitrage = async (opportunity: ArbitrageOpportunity) => {
    try {
      const response = await fetch("/api/arbitrage/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opportunityId: opportunity.id }),
      })

      if (response.ok) {
        console.log("Arbitrage executed successfully")
      }
    } catch (error) {
      console.error("Failed to execute arbitrage:", error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Active Opportunities</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{opportunities.length}</div>
            <p className="text-xs text-slate-400">{isScanning ? "Scanning..." : "Paused"}</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Avg Profit Estimate</CardTitle>
            <Zap className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">
              $
              {(opportunities.reduce((sum, opp) => sum + opp.profitEstimate, 0) / opportunities.length || 0).toFixed(2)}
            </div>
            <p className="text-xs text-slate-400">Per transaction</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Scanner Status</CardTitle>
            <RefreshCw className={`h-4 w-4 ${isScanning ? "animate-spin text-green-400" : "text-slate-400"}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{isScanning ? "Active" : "Paused"}</div>
            <p className="text-xs text-slate-400">Real-time monitoring</p>
          </CardContent>
        </Card>
      </div>

      {/* Opportunities Table */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-white">Arbitrage Opportunities</CardTitle>
              <CardDescription className="text-slate-400">Real-time cross-exchange price differences</CardDescription>
            </div>
            <Button onClick={() => setIsScanning(!isScanning)} variant={isScanning ? "destructive" : "default"}>
              {isScanning ? "Pause Scanner" : "Start Scanner"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-300">Token Pair</TableHead>
                <TableHead className="text-slate-300">Route</TableHead>
                <TableHead className="text-slate-300">Spread</TableHead>
                <TableHead className="text-slate-300">Profit Est.</TableHead>
                <TableHead className="text-slate-300">Gas Est.</TableHead>
                <TableHead className="text-slate-300">Confidence</TableHead>
                <TableHead className="text-slate-300">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {opportunities.map((opp) => (
                <TableRow key={opp.id} className="border-slate-700">
                  <TableCell className="text-white font-medium">{opp.tokenPair}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-slate-300">
                      <span className="text-sm">{opp.exchange1}</span>
                      <ArrowRight className="w-4 h-4" />
                      <span className="text-sm">{opp.exchange2}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={opp.spread > 0 ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"}>
                      {opp.spread.toFixed(2)}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-green-400 font-medium">${opp.profitEstimate.toFixed(2)}</TableCell>
                  <TableCell className="text-slate-300">{opp.gasEstimate.toFixed(4)} ETH</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      <span className="text-slate-300">{opp.confidence}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end items-center gap-2">
                      <button
                        type="button"
                        onClick={() => executeArbitrage(opp)}
                        disabled={opp.profitEstimate < 10}
                        className="modern-animated-btn inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border bg-background hover:text-accent-foreground h-9 rounded-md px-3 border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap w-4 h-4 mr-1 animated-icon">
                          <polygon points="13 2 13 13 22 13 22 2 13 2" />
                        </svg>
                        Execute
                      </button>
                    </div>
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
