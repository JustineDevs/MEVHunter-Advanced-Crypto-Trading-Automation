"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, AlertTriangle, CheckCircle, XCircle, Scan } from "lucide-react"

interface SecurityIssue {
  id: string
  severity: "critical" | "high" | "medium" | "low"
  category: string
  title: string
  description: string
  contract?: string
  recommendation: string
  status: "open" | "resolved" | "investigating"
}

interface ContractAudit {
  address: string
  name: string
  score: number
  issues: number
  lastAudit: Date
  status: "safe" | "warning" | "danger"
}

interface SecurityAuditProps {
  walletAddress: string
  walletType: "metamask" | "phantom" | null
}

export function SecurityAudit({ walletAddress, walletType }: SecurityAuditProps) {
  const [securityIssues, setSecurityIssues] = useState<SecurityIssue[]>([
    {
      id: "1",
      severity: "high",
      category: "Smart Contract",
      title: "Reentrancy Vulnerability",
      description: "Potential reentrancy attack vector detected in flash loan contract",
      contract: "0x1234...5678",
      recommendation: "Implement reentrancy guard and follow checks-effects-interactions pattern",
      status: "open",
    },
    {
      id: "2",
      severity: "medium",
      category: "Access Control",
      title: "Missing Role Validation",
      description: "Admin functions lack proper role-based access control",
      contract: "0xabcd...efgh",
      recommendation: "Implement OpenZeppelin AccessControl for role management",
      status: "investigating",
    },
  ])

  const [contractAudits, setContractAudits] = useState<ContractAudit[]>([
    {
      address: "0x1234567890abcdef",
      name: "Arbitrage Bot Contract",
      score: 85,
      issues: 2,
      lastAudit: new Date(),
      status: "warning",
    },
    {
      address: "0xfedcba0987654321",
      name: "Liquidation Contract",
      score: 95,
      issues: 0,
      lastAudit: new Date(),
      status: "safe",
    },
  ])

  const [overallScore, setOverallScore] = useState(0)
  const [criticalIssues, setCriticalIssues] = useState(0)
  const [isScanning, setIsScanning] = useState(false)

  useEffect(() => {
    const critical = securityIssues.filter((issue) => issue.severity === "critical").length
    const avgScore = contractAudits.reduce((sum, audit) => sum + audit.score, 0) / contractAudits.length || 0

    setCriticalIssues(critical)
    setOverallScore(avgScore)
  }, [securityIssues, contractAudits])

  const runSecurityScan = async () => {
    setIsScanning(true)

    try {
      const response = await fetch("/api/security/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (response.ok) {
        const results = await response.json()
        setSecurityIssues(results.issues)
        setContractAudits(results.audits)
      }
    } catch (error) {
      console.error("Security scan failed:", error)
    } finally {
      setTimeout(() => setIsScanning(false), 3000)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-900/50 text-red-400 border-red-400"
      case "high":
        return "bg-orange-900/50 text-orange-400 border-orange-400"
      case "medium":
        return "bg-yellow-900/50 text-yellow-400 border-yellow-400"
      case "low":
        return "bg-blue-900/50 text-blue-400 border-blue-400"
      default:
        return "bg-slate-900/50 text-slate-400 border-slate-400"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "safe":
        return "text-green-400"
      case "warning":
        return "text-yellow-400"
      case "danger":
        return "text-red-400"
      default:
        return "text-slate-400"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400"
    if (score >= 70) return "text-yellow-400"
    return "text-red-400"
  }

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Security Score</CardTitle>
            <Shield className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>{overallScore.toFixed(0)}/100</div>
            <p className="text-xs text-slate-400">Overall security rating</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Critical Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{criticalIssues}</div>
            <p className="text-xs text-slate-400">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Contracts Audited</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{contractAudits.length}</div>
            <p className="text-xs text-slate-400">Smart contracts reviewed</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Last Scan</CardTitle>
            <Scan className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">2h ago</div>
            <p className="text-xs text-slate-400">Automated security check</p>
          </CardContent>
        </Card>
      </div>

      {/* Security Scan */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-white">Security Scanner</CardTitle>
              <CardDescription className="text-slate-400">
                Automated vulnerability detection and smart contract analysis
              </CardDescription>
            </div>
            <Button onClick={runSecurityScan} disabled={isScanning} className="bg-blue-600 hover:bg-blue-700">
              {isScanning ? (
                <>
                  <Scan className="w-4 h-4 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Scan className="w-4 h-4 mr-2" />
                  Run Security Scan
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                <div className="text-xl font-bold text-green-400">✓</div>
                <p className="text-sm text-slate-300">Reentrancy Check</p>
              </div>
              <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                <div className="text-xl font-bold text-yellow-400">⚠</div>
                <p className="text-sm text-slate-300">Access Control</p>
              </div>
              <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                <div className="text-xl font-bold text-green-400">✓</div>
                <p className="text-sm text-slate-300">Integer Overflow</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contract Audits */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Contract Security Audits</CardTitle>
          <CardDescription className="text-slate-400">Security assessment of deployed smart contracts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contractAudits.map((audit) => (
              <div key={audit.address} className="p-4 bg-slate-700/50 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-white font-medium">{audit.name}</h3>
                    <p className="text-sm text-slate-400 font-mono">{audit.address}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getScoreColor(audit.score)}`}>{audit.score}/100</div>
                    <Badge
                      className={`${
                        audit.status === "safe"
                          ? "bg-green-900/50 text-green-400"
                          : audit.status === "warning"
                            ? "bg-yellow-900/50 text-yellow-400"
                            : "bg-red-900/50 text-red-400"
                      }`}
                    >
                      {audit.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Security Score</span>
                    <span className="text-slate-300">{audit.score}%</span>
                  </div>
                  <Progress value={audit.score} className="h-2 bg-slate-600" />
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Issues Found: {audit.issues}</span>
                    <span className="text-slate-400">Last Audit: {audit.lastAudit.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Issues */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Security Issues</CardTitle>
          <CardDescription className="text-slate-400">Identified vulnerabilities and recommended fixes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityIssues.map((issue) => (
              <Alert key={issue.id} className="bg-slate-700/50 border-slate-600">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {issue.severity === "critical" && <XCircle className="h-5 w-5 text-red-400" />}
                    {issue.severity === "high" && <AlertTriangle className="h-5 w-5 text-orange-400" />}
                    {issue.severity === "medium" && <AlertTriangle className="h-5 w-5 text-yellow-400" />}
                    {issue.severity === "low" && <AlertTriangle className="h-5 w-5 text-blue-400" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-white font-medium">{issue.title}</h4>
                      <Badge className={getSeverityColor(issue.severity)}>{issue.severity.toUpperCase()}</Badge>
                      <Badge variant="outline" className="border-slate-500 text-slate-300">
                        {issue.category}
                      </Badge>
                    </div>
                    <AlertDescription className="text-slate-300 mb-2">{issue.description}</AlertDescription>
                    {issue.contract && (
                      <p className="text-sm text-slate-400 font-mono mb-2">Contract: {issue.contract}</p>
                    )}
                    <div className="bg-slate-800/50 p-3 rounded border-l-4 border-blue-400">
                      <p className="text-sm text-slate-300">
                        <strong>Recommendation:</strong> {issue.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              </Alert>
            ))}
            {securityIssues.length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <p className="text-slate-300">No security issues detected</p>
                <p className="text-sm text-slate-400">Your contracts appear to be secure</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
