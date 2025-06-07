"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Shield, AlertTriangle, FileSearch, Activity, Settings } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

interface SecurityScannerWidgetProps {
  walletAddress?: string
  walletType?: "metamask" | "phantom"
}

// Form validation schema
const securitySettingsSchema = z.object({
  scanInterval: z.number().min(30).max(300),
  threatThreshold: z.number().min(1).max(10),
  autoBlock: z.boolean(),
  notifyOnThreat: z.boolean(),
})

type SecuritySettings = z.infer<typeof securitySettingsSchema>

// Demo data generators
const generateThreatData = () => {
  const threats = [
    { type: "Phishing", severity: "High", source: "Unknown Contract", timestamp: new Date().toISOString() },
    { type: "Malicious Contract", severity: "Medium", source: "0x1234...", timestamp: new Date().toISOString() },
    { type: "Suspicious Activity", severity: "Low", source: "0x5678...", timestamp: new Date().toISOString() },
  ]
  return threats
}

const generateRiskScore = () => {
  return Math.floor(Math.random() * 100)
}

const generateContractAuditData = () => {
  return [
    { name: "Reentrancy", value: Math.floor(Math.random() * 100) },
    { name: "Overflow", value: Math.floor(Math.random() * 100) },
    { name: "Access Control", value: Math.floor(Math.random() * 100) },
    { name: "Logic Errors", value: Math.floor(Math.random() * 100) },
  ]
}

const generateTransactionData = () => {
  const data = []
  const now = new Date()
  for (let i = 0; i < 24; i++) {
    data.push({
      time: new Date(now.getTime() - (23 - i) * 3600000).toLocaleTimeString(),
      suspicious: Math.floor(Math.random() * 10),
      normal: Math.floor(Math.random() * 50),
    })
  }
  return data
}

export function SecurityScannerWidget({ walletAddress, walletType }: SecurityScannerWidgetProps) {
  const { toast } = useToast()
  const [isScanning, setIsScanning] = useState(false)
  const [threats, setThreats] = useState<any[]>([])
  const [riskScore, setRiskScore] = useState(0)
  const [contractAudit, setContractAudit] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const form = useForm<SecuritySettings>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: {
      scanInterval: 60,
      threatThreshold: 5,
      autoBlock: true,
      notifyOnThreat: true,
    },
  })

  // Initialize demo data
  useEffect(() => {
    const loadDemoData = () => {
      setThreats(generateThreatData())
      setRiskScore(generateRiskScore())
      setContractAudit(generateContractAuditData())
      setTransactions(generateTransactionData())
      setIsLoading(false)
    }

    loadDemoData()
  }, [])

  // Update data periodically when scanning is active
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isScanning) {
      interval = setInterval(() => {
        setThreats(generateThreatData())
        setRiskScore(generateRiskScore())
        setContractAudit(generateContractAuditData())
        setTransactions(generateTransactionData())
      }, 5000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isScanning])

  const toggleScanning = () => {
    setIsScanning(!isScanning)
    toast({
      title: isScanning ? "Security Scanner Paused" : "Security Scanner Active",
      description: isScanning
        ? "Real-time threat detection has been paused"
        : "Monitoring for security threats in real-time",
    })
  }

  const onSubmit = (data: SecuritySettings) => {
    toast({
      title: "Security Settings Updated",
      description: "Your security preferences have been saved",
    })
  }

  const getRiskColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 50) return "text-yellow-500"
    return "text-red-500"
  }

  const getThreatColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-blue-500"
      default:
        return "text-gray-500"
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Threat Alert Widget */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">Threat Alerts</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleScanning}
            className="border-yellow-400/20 text-yellow-400 hover:bg-yellow-400/10"
          >
            {isScanning ? "Pause Scanning" : "Start Scanning"}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {threats.map((threat, index) => (
              <Alert key={index} className="bg-slate-800/50 border-slate-700">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="text-white">{threat.type}</AlertTitle>
                <AlertDescription className="text-slate-400">
                  Severity: <span className={getThreatColor(threat.severity)}>{threat.severity}</span>
                  <br />
                  Source: {threat.source}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Wallet Risk Score Widget */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-white">Wallet Risk Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="relative">
              <div className="text-4xl font-bold text-white">{riskScore}</div>
              <div className={`text-sm ${getRiskColor(riskScore)}`}>Risk Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Smart Contract Audit Widget */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-white">Contract Vulnerability Scan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contractAudit}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(30, 41, 59, 0.8)",
                    border: "1px solid #475569",
                    borderRadius: "0.5rem",
                  }}
                />
                <Bar dataKey="value" fill="#FCD34D">
                  {contractAudit.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.value > 50 ? "#EF4444" : "#FCD34D"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Monitor Widget */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-white">Transaction Monitor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={transactions}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(30, 41, 59, 0.8)",
                    border: "1px solid #475569",
                    borderRadius: "0.5rem",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="suspicious"
                  stroke="#EF4444"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="normal"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings Widget */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-white">Security Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="scanInterval" className="text-slate-400">
                Scan Interval (seconds)
              </Label>
              <Input
                id="scanInterval"
                type="number"
                {...form.register("scanInterval", { valueAsNumber: true })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="threatThreshold" className="text-slate-400">
                Threat Threshold
              </Label>
              <Input
                id="threatThreshold"
                type="number"
                {...form.register("threatThreshold", { valueAsNumber: true })}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="autoBlock"
                {...form.register("autoBlock")}
                className="data-[state=checked]:bg-yellow-400"
              />
              <Label htmlFor="autoBlock" className="text-slate-400">
                Auto-block Threats
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="notifyOnThreat"
                {...form.register("notifyOnThreat")}
                className="data-[state=checked]:bg-yellow-400"
              />
              <Label htmlFor="notifyOnThreat" className="text-slate-400">
                Notify on Threats
              </Label>
            </div>
            <Button
              type="submit"
              className="w-full bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20"
            >
              Save Settings
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 