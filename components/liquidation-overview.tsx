"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"
import { Bell, AlertTriangle, TrendingUp, Shield, Zap } from "lucide-react"

interface LiquidationOverviewProps {
  walletAddress: string
  walletType: "metamask" | "phantom" | null
}

// Demo data generators
const generateTimeSeriesData = (count: number, baseValue: number, variance: number) => {
  return Array.from({ length: count }, (_, i) => {
    const time = new Date(Date.now() - (count - i) * 60000)
    const value = baseValue + (Math.random() - 0.5) * variance
    return { time: time.toISOString(), value }
  })
}

const generateDemoData = () => {
  const now = Date.now()
  const oneHourAgo = now - 60 * 60 * 1000
  const timePoints = 60

  // Collateral ratio data
  const collateralData = Array.from({ length: timePoints }, (_, i) => {
    const time = new Date(oneHourAgo + (i * 60000))
    return {
      time: time.toISOString(),
      aave: 2.5 + Math.random() * 0.5,
      compound: 2.3 + Math.random() * 0.4,
      maker: 2.4 + Math.random() * 0.3,
    }
  })

  // Liquidation price data
  const liquidationPriceData = Array.from({ length: timePoints }, (_, i) => {
    const time = new Date(oneHourAgo + (i * 60000))
    return {
      time: time.toISOString(),
      currentPrice: 1800 + Math.random() * 100,
      liquidationPrice: 1600 + Math.random() * 50,
    }
  })

  // Protocol health data
  const protocolHealthData = [
    { protocol: "Aave", health: 95 + Math.random() * 5 },
    { protocol: "Compound", health: 92 + Math.random() * 5 },
    { protocol: "Maker", health: 94 + Math.random() * 5 },
    { protocol: "Liquity", health: 91 + Math.random() * 5 },
  ]

  return { collateralData, liquidationPriceData, protocolHealthData }
}

export function LiquidationOverview({ walletAddress, walletType }: LiquidationOverviewProps) {
  const [isMonitoring, setIsMonitoring] = useState(true)
  const [collateralData, setCollateralData] = useState<any[]>([])
  const [liquidationPriceData, setLiquidationPriceData] = useState<any[]>([])
  const [protocolHealthData, setProtocolHealthData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [threshold, setThreshold] = useState("1.5")

  // Initialize demo data
  useEffect(() => {
    const demoData = generateDemoData()
    setCollateralData(demoData.collateralData)
    setLiquidationPriceData(demoData.liquidationPriceData)
    setProtocolHealthData(demoData.protocolHealthData)
    setIsLoading(false)
  }, [])

  // Update demo data periodically
  useEffect(() => {
    if (!isMonitoring) return

    const interval = setInterval(() => {
      const demoData = generateDemoData()
      setCollateralData(demoData.collateralData)
      setLiquidationPriceData(demoData.liquidationPriceData)
      setProtocolHealthData(demoData.protocolHealthData)
    }, 5000)

    return () => clearInterval(interval)
  }, [isMonitoring])

  // Wallet event listeners
  useEffect(() => {
    if (!walletAddress) return

    const handleAccountChange = (accounts: string[]) => {
      if (accounts.length === 0) {
        toast.error("Wallet disconnected")
      } else {
        toast.success("Account changed")
      }
    }

    const handleNetworkChange = (chainId: string) => {
      toast.info(`Network changed to ${chainId}`)
    }

    if (walletType === "metamask" && window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountChange)
      window.ethereum.on("chainChanged", handleNetworkChange)
    }

    return () => {
      if (walletType === "metamask" && window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountChange)
        window.ethereum.removeListener("chainChanged", handleNetworkChange)
      }
    }
  }, [walletAddress, walletType])

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring)
    toast.info(isMonitoring ? "Monitoring paused" : "Monitoring resumed")
  }

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*\.?\d*$/.test(value)) {
      setThreshold(value)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Collateral Ratio Chart */}
      <Card className="bg-slate-700/30 p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white">Collateral Ratio</h3>
          <p className="text-sm text-slate-400">Protocol-wise collateralization</p>
        </div>
        <div className="h-[200px]">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-slate-400">Loading chart data...</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={collateralData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="time"
                  tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                  stroke="#94a3b8"
                  fontSize={12}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickFormatter={(value) => `${value}x`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-800 p-2 rounded border border-slate-700">
                          <p className="text-sm text-slate-300">
                            {new Date(payload[0].payload.time).toLocaleTimeString()}
                          </p>
                          {payload.map((entry: any, index: number) => (
                            <p key={index} className="text-sm" style={{ color: entry.color }}>
                              {entry.name}: {entry.value.toFixed(2)}x
                            </p>
                          ))}
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="aave"
                  stroke="#22c55e"
                  name="Aave"
                />
                <Line
                  type="monotone"
                  dataKey="compound"
                  stroke="#3b82f6"
                  name="Compound"
                />
                <Line
                  type="monotone"
                  dataKey="maker"
                  stroke="#8b5cf6"
                  name="Maker"
                />
                <ReferenceLine y={1.5} stroke="#ef4444" strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      {/* Liquidation Price Tracker */}
      <Card className="bg-slate-700/30 p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white">Liquidation Price</h3>
          <p className="text-sm text-slate-400">ETH/USD price tracking</p>
        </div>
        <div className="h-[200px]">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-slate-400">Loading chart data...</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={liquidationPriceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="time"
                  tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                  stroke="#94a3b8"
                  fontSize={12}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-800 p-2 rounded border border-slate-700">
                          <p className="text-sm text-slate-300">
                            {new Date(payload[0].payload.time).toLocaleTimeString()}
                          </p>
                          <p className="text-sm text-green-400">
                            Current: ${payload[0].value.toFixed(2)}
                          </p>
                          <p className="text-sm text-red-400">
                            Liquidation: ${payload[1].value.toFixed(2)}
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="currentPrice"
                  stroke="#22c55e"
                  name="Current Price"
                />
                <Line
                  type="monotone"
                  dataKey="liquidationPrice"
                  stroke="#ef4444"
                  name="Liquidation Price"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      {/* Protocol Monitor */}
      <Card className="bg-slate-700/30 p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white">Protocol Health</h3>
          <p className="text-sm text-slate-400">DeFi protocol status</p>
        </div>
        <div className="h-[200px]">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-slate-400">Loading chart data...</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={protocolHealthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="protocol"
                  stroke="#94a3b8"
                  fontSize={12}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-800 p-2 rounded border border-slate-700">
                          <p className="text-sm text-slate-300">
                            {payload[0].payload.protocol}
                          </p>
                          <p className="text-sm text-green-400">
                            Health: {payload[0].value.toFixed(1)}%
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar
                  dataKey="health"
                  fill="#22c55e"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      {/* Alert Configuration */}
      <Card className="bg-slate-700/30 p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white">Alert Configuration</h3>
          <p className="text-sm text-slate-400">Set liquidation thresholds</p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-slate-300">Enable Monitoring</span>
            </div>
            <Switch
              checked={isMonitoring}
              onCheckedChange={toggleMonitoring}
              className="data-[state=checked]:bg-green-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="threshold" className="text-sm text-slate-300">
              Liquidation Threshold
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                id="threshold"
                type="text"
                value={threshold}
                onChange={handleThresholdChange}
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="1.5"
              />
              <span className="text-sm text-slate-400">x</span>
            </div>
          </div>
          <div className="pt-2">
            <Button
              className="w-full bg-green-500 hover:bg-green-600 text-white"
              disabled={!walletAddress || !isMonitoring}
            >
              Save Configuration
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
} 