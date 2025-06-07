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
import { TrendingUp, Shield, Zap, Bot, Play, Pause, BarChart2, AlertTriangle, Wallet, Bell, Github, Linkedin, Twitter, Mail, Send, Globe } from "lucide-react"
import { WalletActivityAreaChart } from "@/components/ui/WalletActivityAreaChart"
import { ArbitrageWidgets } from "@/components/arbitrage-widgets"
import { LiquidationOverview } from "@/components/liquidation-overview"
import { NFTMonitorWidget } from "@/components/nft-monitor-widget"
import { MarketChartWidget } from "@/components/market-chart-widget"
import { SecurityScannerWidget } from "@/components/security-scanner-widget"
import { useSpring, animated } from '@react-spring/web'
import { ExplorerWidgets } from "@/components/explorer-widgets"

interface WalletState {
  isConnected: boolean
  address: string
  type: "metamask" | "phantom" | null
}

export default function CryptoBotDashboard() {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: "",
    type: null
  })
  const [activeStrategies, setActiveStrategies] = useState(0)
  const [totalProfit, setTotalProfit] = useState(0)
  const [riskLevel, setRiskLevel] = useState("Medium")
  const [gasSaved, setGasSaved] = useState(0.45)

  // Animated values
  const activeStrategiesSpring = useSpring({ number: activeStrategies, from: { number: 0 }, config: { tension: 120, friction: 14 } })
  const totalProfitSpring = useSpring({ number: totalProfit, from: { number: 0 }, config: { tension: 120, friction: 14 } })
  const gasSavedSpring = useSpring({ number: gasSaved, from: { number: 0 }, config: { tension: 120, friction: 14 } })

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

    const interval = setInterval(() => {
      setActiveStrategies(Math.floor(Math.random() * 10))
      setTotalProfit(Number((Math.random() * 1000).toFixed(2)))
      setRiskLevel(["Low", "Medium", "High"][Math.floor(Math.random() * 3)])
      setGasSaved(Number((Math.random() * 2).toFixed(2)))
    }, 4000)

    return () => {
      ws.close()
      clearInterval(interval)
    }
  }, [])

  const handleWalletConnection = (connected: boolean, address?: string, type?: "metamask" | "phantom") => {
    setWalletState({
      isConnected: connected,
      address: address || "",
      type: type || null
    })
  }

  const renderWalletDependentContent = () => {
    if (!walletState.isConnected) {
  return (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <Wallet className="w-16 h-16 text-slate-400 mb-4" />
          <h2 className="text-2xl font-semibold text-white mb-2">Connect Your Wallet</h2>
          <p className="text-slate-400 mb-6">Connect your MetaMask or Phantom wallet to access the full dashboard</p>
          </div>
      )
                }

    return (
      <>
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="holographic-card cyan-card text-card-foreground bg-white/10 backdrop-blur-md border border-cyan-400/30 shadow-xl rounded-2xl transition-transform">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-cyan-200">Active Strategies</CardTitle>
              <Bot className="h-5 w-5 text-cyan-400 drop-shadow-glow" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                <animated.span>{activeStrategiesSpring.number.to((n: number) => Math.floor(n))}</animated.span>
              </div>
              <p className="text-xs text-cyan-300/80">+2 from last hour</p>
            </CardContent>
          </Card>

          <Card className="holographic-card green-card text-card-foreground bg-white/10 backdrop-blur-md border border-green-400/30 shadow-xl rounded-2xl transition-transform">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-green-200">Total P&L</CardTitle>
              <TrendingUp className="h-5 w-5 text-green-400 drop-shadow-glow" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-300">
                $<animated.span>{totalProfitSpring.number.to((n: number) => n.toFixed(2))}</animated.span>
              </div>
              <p className="text-xs text-green-200/80">+12.5% this week</p>
            </CardContent>
          </Card>

          <Card className="holographic-card yellow-card text-card-foreground bg-white/10 backdrop-blur-md border border-yellow-400/30 shadow-xl rounded-2xl transition-transform">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-yellow-200">Risk Level</CardTitle>
              <Shield className="h-5 w-5 text-yellow-300 drop-shadow-glow" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-200">{riskLevel}</div>
              <p className="text-xs text-yellow-100/80">Optimized for safety</p>
            </CardContent>
          </Card>

          <Card className="holographic-card purple-card text-card-foreground bg-white/10 backdrop-blur-md border border-purple-400/30 shadow-xl rounded-2xl transition-transform">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-purple-200">Gas Saved</CardTitle>
              <Zap className="h-5 w-5 text-purple-400 drop-shadow-glow" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-200">
                <animated.span>{gasSavedSpring.number.to((n: number) => n.toFixed(2))}</animated.span> ETH
              </div>
              <p className="text-xs text-purple-100/80">Through optimization</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList
            role="tablist"
            aria-orientation="horizontal"
            className="h-10 items-center justify-center bg-muted text-muted-foreground tabs-list grid w-full grid-cols-8 bg-gradient-to-r from-cyan-900/60 via-blue-900/60 to-black/60 rounded-xl p-1 shadow-lg"
            tabIndex={0}
            data-orientation="horizontal"
            style={{ outline: 'none' }}
          >
            <TabsTrigger value="dashboard" className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-transparent data-[state=active]:text-yellow-400 data-[state=active]:shadow-none modern-tab group">
              <img src="https://img.icons8.com/?size=100&id=pzxd8RBU7JvI&format=png&color=000000" alt="Dashboard" className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="arbitrage" className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-transparent data-[state=active]:text-yellow-400 data-[state=active]:shadow-none modern-tab group">
              <img src="https://img.icons8.com/?size=100&id=Pv5LQKRzge0Q&format=png&color=000000" alt="Arbitrage" className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" />
              <span>Arbitrage</span>
            </TabsTrigger>
            <TabsTrigger value="liquidation" className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-transparent data-[state=active]:text-yellow-400 data-[state=active]:shadow-none modern-tab group">
              <img src="https://img.icons8.com/?size=100&id=LRkvL5UY5Dkv&format=png&color=000000" alt="Liquidation" className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" />
              <span>Liquidation</span>
            </TabsTrigger>
            <TabsTrigger value="gas" className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-transparent data-[state=active]:text-yellow-400 data-[state=active]:shadow-none modern-tab group">
              <img src="https://img.icons8.com/?size=100&id=9048&format=png&color=000000" alt="Gas Optimizer" className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" />
              <span>Gas Optimizer</span>
            </TabsTrigger>
            <TabsTrigger value="nft" className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-transparent data-[state=active]:text-yellow-400 data-[state=active]:shadow-none modern-tab group">
              <img src="https://img.icons8.com/?size=100&id=FjcvBNoB41Ur&format=png&color=000000" alt="NFT Monitor" className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" />
              <span>NFT Monitor</span>
            </TabsTrigger>
            <TabsTrigger value="trading" className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-transparent data-[state=active]:text-yellow-400 data-[state=active]:shadow-none modern-tab group">
              <img src="https://img.icons8.com/?size=100&id=7767&format=png&color=000000" alt="Trading" className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" />
              <span>Trading</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-transparent data-[state=active]:text-yellow-400 data-[state=active]:shadow-none modern-tab group">
              <img src="https://img.icons8.com/?size=100&id=10484&format=png&color=000000" alt="Security" className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" />
              <span>Security</span>
            </TabsTrigger>
            <TabsTrigger value="explorer" className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-transparent data-[state=active]:text-yellow-400 data-[state=active]:shadow-none modern-tab group">
              <img src="https://img.icons8.com/?size=100&id=10484&format=png&color=000000" alt="Explorer" className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" />
              <span>Explorer</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="space-y-6">
              <div className="rounded-lg border text-card-foreground shadow-sm bg-slate-800/50 border-slate-700">
                <div className="flex flex-col space-y-1.5 p-6">
                  <div className="text-2xl font-semibold leading-none tracking-tight text-white">Dashboard Overview</div>
                  <div className="text-sm text-slate-400">Real-time Wallet Overview</div>
                </div>
                <div className="p-6 pt-0">
                  <WalletActivityAreaChart 
                    ethAddress={walletState.type === "metamask" ? walletState.address : undefined}
                    solAddress={walletState.type === "phantom" ? walletState.address : undefined}
                  />
                  
                  {/* Key Features Grid */}
                  <div className="mt-6">
                    <div className="text-lg font-semibold text-white mb-4">Key Features</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <span className="text-slate-200">Real-time DeFi monitoring</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                        </div>
                        <span className="text-slate-200">Arbitrage opportunity detection</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                          <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <span className="text-slate-200">Liquidation alerts</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                          <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <span className="text-slate-200">Wallet integration</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                          <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <span className="text-slate-200">Service Worker</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center">
                          <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                          </svg>
                        </div>
                        <span className="text-slate-200">Push notifications</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                          <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <span className="text-slate-200">Interactive analytics</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                          <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                          </svg>
                        </div>
                        <span className="text-slate-200">Multi-chain support</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                          <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </div>
                        <span className="text-slate-200">AI market insights</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center">
                          <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                          </svg>
                        </div>
                        <span className="text-slate-200">Custom alerts</span>
                      </div>
                    </div>
                  </div>
                  {/* Quick Actions */}
                  <div className="rounded-lg border text-card-foreground shadow-sm bg-slate-800/50 border-slate-700 mt-8">
                    <div className="flex flex-col space-y-1.5 p-6">
                      <div className="text-2xl font-semibold leading-none tracking-tight text-white">Quick Actions</div>
                      <div className="text-sm text-slate-400">Manage your trading strategies and monitoring systems</div>
                    </div>
                    <div className="p-6 pt-0">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground px-4 py-2 bg-blue-600 hover:bg-blue-700 h-20 flex-col modern-animated-btn" disabled={!walletState.isConnected}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play w-6 h-6 mb-2"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>
                          Start All Bots
                        </button>
                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border bg-background hover:text-accent-foreground px-4 py-2 border-slate-600 text-slate-300 hover:bg-slate-700 h-20 flex-col modern-animated-btn" disabled={!walletState.isConnected}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pause w-6 h-6 mb-2"><rect x="14" y="4" width="4" height="16" rx="1"></rect><rect x="6" y="4" width="4" height="16" rx="1"></rect></svg>
                          Pause All
                        </button>
                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border bg-background hover:text-accent-foreground px-4 py-2 border-slate-600 text-slate-300 hover:bg-slate-700 h-20 flex-col modern-animated-btn">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-up w-6 h-6 mb-2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                          Analytics
                        </button>
                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border bg-background hover:text-accent-foreground px-4 py-2 border-slate-600 text-slate-300 hover:bg-slate-700 h-20 flex-col modern-animated-btn">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-triangle-alert w-6 h-6 mb-2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>
                          Risk Monitor
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <BotDashboard walletAddress={walletState.address} walletType={walletState.type} />
            </div>
          </TabsContent>

          <TabsContent value="arbitrage">
            <div className="space-y-6">
              <div className="rounded-lg border text-card-foreground shadow-sm bg-slate-800/50 border-slate-700">
                <div className="flex flex-col space-y-1.5 p-6">
                  <div className="text-2xl font-semibold leading-none tracking-tight text-white">Arbitrage</div>
                  <div className="text-sm text-slate-400">Arbitrage Widgets</div>
                </div>
                <div className="p-6 pt-0">
                  <ArbitrageWidgets walletAddress={walletState.address} walletType={walletState.type} />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="liquidation">
            <div className="space-y-6">
              <div className="rounded-lg border text-card-foreground shadow-sm bg-slate-800/50 border-slate-700">
                <div className="flex flex-col space-y-1.5 p-6">
                  <div className="text-2xl font-semibold leading-none tracking-tight text-white">Liquidation</div>
                  <div className="text-sm text-slate-400">Real-time Liquidity Overview</div>
                </div>
                <div className="p-6 pt-0">
                  <LiquidationOverview walletAddress={walletState.address} walletType={walletState.type} />
                </div>
              </div>
              <LiquidationAlerts walletAddress={walletState.address} walletType={walletState.type} />
            </div>
          </TabsContent>

          <TabsContent value="gas">
            <GasOptimizer walletAddress={walletState.address} walletType={walletState.type} />
          </TabsContent>

          <TabsContent value="nft">
            <div className="space-y-6">
              <div className="rounded-lg border text-card-foreground shadow-sm bg-slate-800/50 border-slate-700">
                <div className="flex flex-col space-y-1.5 p-6">
                  <div className="text-2xl font-semibold leading-none tracking-tight text-white">NFT Monitor</div>
                  <div className="text-sm text-slate-400">NFT Overview</div>
                </div>
                <div className="p-6 pt-0">
                  <NFTMonitorWidget walletAddress={walletState.address} walletType={walletState.type} />
                </div>
              </div>
              <NFTMonitor walletAddress={walletState.address} walletType={walletState.type} />
            </div>
          </TabsContent>

          <TabsContent value="trading">
            <div className="space-y-6">
              <div className="rounded-lg border text-card-foreground shadow-sm bg-slate-800/50 border-slate-700">
                <div className="flex flex-col space-y-1.5 p-6">
                  <div className="text-2xl font-semibold leading-none tracking-tight text-white">Live Market Chart</div>
                  <div className="text-sm text-slate-400">Real-time Market Chart Overview</div>
                </div>
                <div className="p-6 pt-0">
                  <MarketChartWidget walletAddress={walletState.address} walletType={walletState.type} />
                </div>
              </div>
              <TradingSignals walletAddress={walletState.address} walletType={walletState.type} />
            </div>
          </TabsContent>

          <TabsContent value="security">
            <div className="space-y-6">
              <div className="rounded-lg border text-card-foreground shadow-sm bg-slate-800/50 border-slate-700">
                <div className="flex flex-col space-y-1.5 p-6">
                  <div className="text-2xl font-semibold leading-none tracking-tight text-white">Security Scanner</div>
                  <div className="text-sm text-slate-400">Real-time Security Monitoring</div>
                </div>
                <div className="p-6 pt-0">
                  <SecurityScannerWidget 
                    walletAddress={walletState.address} 
                    walletType={walletState.type || undefined} 
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="explorer">
            <div className="space-y-6">
              <div className="rounded-lg border text-card-foreground shadow-sm bg-slate-800/50 border-slate-700">
                <div className="flex flex-col space-y-1.5 p-6">
                  <div className="text-2xl font-semibold leading-none tracking-tight text-white">Explorer</div>
                  <div className="text-sm text-slate-400">View all transactions, status, and addresses</div>
                </div>
                <div className="p-6 pt-0">
                  <ExplorerWidgets />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-black">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight drop-shadow-lg">MEVHunter</h1>
            <p className="text-lg text-cyan-200/80 font-medium">Advanced crypto trading automation & monitoring system</p>
      </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 mb-2">
              {/* Notifications Button */}
              <button className="relative rounded-full p-2 bg-slate-800/70 hover:bg-slate-700 border border-slate-700 shadow transition group" title="Notifications">
                <Bell className="w-6 h-6 text-yellow-400 group-hover:scale-110 transition-transform" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-xs text-white rounded-full px-1.5 py-0.5 animate-pulse">3</span>
              </button>
              {/* Social Media Buttons */}
              <a href="https://github.com/JustineDevs" target="_blank" rel="noopener noreferrer" className="rounded-full p-2 bg-slate-800/70 hover:bg-slate-700 border border-slate-700 shadow transition" title="GitHub"><Github className="w-5 h-5 text-white" /></a>
              <a href="https://www.linkedin.com/in/justine-devs-444608295/" target="_blank" rel="noopener noreferrer" className="rounded-full p-2 bg-slate-800/70 hover:bg-slate-700 border border-slate-700 shadow transition" title="LinkedIn"><Linkedin className="w-5 h-5 text-blue-400" /></a>
              <a href="https://x.com/Trader2G" target="_blank" rel="noopener noreferrer" className="rounded-full p-2 bg-slate-800/70 hover:bg-slate-700 border border-slate-700 shadow transition" title="Twitter"><Twitter className="w-5 h-5 text-sky-400" /></a>
              <a href="mailto:TraderGOfficial@gmail.com" className="rounded-full p-2 bg-slate-800/70 hover:bg-slate-700 border border-slate-700 shadow transition" title="Gmail"><Mail className="w-5 h-5 text-red-400" /></a>
              <a href="https://t.me/TraderGOfficial" target="_blank" rel="noopener noreferrer" className="rounded-full p-2 bg-slate-800/70 hover:bg-slate-700 border border-slate-700 shadow transition" title="Telegram"><Send className="w-5 h-5 text-cyan-400" /></a>
              <a href="https://traderg-space.gitbook.io/traderg-airdrop" target="_blank" rel="noopener noreferrer" className="rounded-full p-2 bg-slate-800/70 hover:bg-slate-700 border border-slate-700 shadow transition" title="Website"><Globe className="w-5 h-5 text-green-400" /></a>
            </div>
            <div className="flex items-center gap-2">
              <WalletConnection
                onConnectionChange={handleWalletConnection}
                isConnected={walletState.isConnected}
              />
            </div>
          </div>
        </div>

        {renderWalletDependentContent()}
      </div>
      {/* Footer with credits */}
      <footer className="w-full text-center py-4 mt-8 text-xs text-slate-400">
        Built by <a href="https://github.com/JustineDevs" target="_blank" rel="noopener noreferrer" className="text-yellow-400 font-semibold hover:underline">JustineDevs</a> &nbsp;|&nbsp;
        <a href="https://www.linkedin.com/in/justine-devs-444608295/" target="_blank" rel="noopener noreferrer" className="inline-block bg-yellow-400/10 text-yellow-400 px-2 py-1 rounded ml-2 font-semibold hover:bg-yellow-400/20 transition">Work with me</a>
      </footer>
      {/* Custom Styles for Modern UI */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;500;600;700;800&display=swap');
        @font-face {
          font-family: 'Orbitronio';
          src: url('https://dl.dafont.com/dl/?f=orbitronio') format('truetype');
          font-weight: normal;
          font-style: normal;
        }

        :root {
          --font-orbitronio: 'Orbitronio', sans-serif;
          --font-exo2: 'Exo 2', sans-serif;
        }

        body {
          font-family: var(--font-exo2);
        }

        .jsx-ef7036d223c53d5f {
          font-family: var(--font-orbitronio) !important;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        /* Apply Exo 2 to all other text elements */
        .text-card-foreground,
        .text-slate-200,
        .text-slate-300,
        .text-slate-400,
        .text-white,
        .text-green-400,
        .text-red-400,
        .text-yellow-400,
        .text-blue-400,
        button,
        label,
        p,
        span {
          font-family: var(--font-exo2) !important;
        }

        /* Enhance title with additional effects */
        .jsx-ef7036d223c53d5f {
          background: linear-gradient(to right, #fff, #a5b4fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 30px rgba(165, 180, 252, 0.3);
          position: relative;
        }

        .jsx-ef7036d223c53d5f::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(to right, transparent, #a5b4fc, transparent);
          opacity: 0.5;
        }

        .modern-tab {
          @apply inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-cyan-700/40 bg-black/30 hover:text-cyan-200 hover:bg-cyan-900/40 h-12 rounded-lg px-5 text-base text-cyan-100 shadow-md hover:shadow-cyan-500/20;
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          filter: blur(0);
        }

        /* Blur effect for non-hovered tabs */
        .tabs-list:has(.modern-tab:hover) .modern-tab:not(:hover) {
          filter: blur(4px);
          opacity: 0.5;
          transform: scale(0.95);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .modern-tab::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          transition: 0.5s;
        }

        .modern-tab::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            45deg,
            transparent,
            rgba(0, 255, 255, 0.1),
            transparent
          );
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .modern-tab:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 
            0 0 20px rgba(0, 255, 255, 0.2),
            0 0 40px rgba(0, 255, 255, 0.1),
            0 0 60px rgba(0, 255, 255, 0.05);
          filter: blur(0) !important;
          opacity: 1 !important;
          z-index: 10;
        }

        .modern-tab:hover::before {
          left: 100%;
        }

        .modern-tab:hover::after {
          opacity: 1;
        }

        .modern-tab[data-state="active"] {
          @apply bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-400/50 text-white;
          box-shadow: 0 0 15px rgba(0, 255, 255, 0.2);
          filter: blur(0) !important;
          opacity: 1 !important;
          z-index: 5;
        }

        .modern-tab[data-state="active"]::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #00ffff, transparent);
          animation: glow 2s linear infinite;
        }

        @keyframes glow {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.5; }
        }

        .modern-tab img {
          filter: brightness(0) invert(1);
          opacity: 0.9;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: center;
        }

        .modern-tab:hover img {
          opacity: 1;
          transform: scale(0.9);
          filter: brightness(0) invert(1) drop-shadow(0 0 3px rgba(0, 255, 255, 0.6));
        }

        .modern-tab[data-state="active"] img {
          opacity: 1;
          filter: brightness(0) invert(1) drop-shadow(0 0 5px rgba(0, 255, 255, 0.9));
        }

        .modern-tab span {
          position: relative;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: left;
          opacity: 0.8;
        }

        .modern-tab:hover span {
          transform: scale(1.1);
          opacity: 1;
        }

        .modern-tab[data-state="active"] span {
          opacity: 1;
          transform: scale(1.1);
        }

        /* Add text glow effect */
        .modern-tab:hover span {
          text-shadow: 0 0 8px rgba(0, 255, 255, 0.5);
        }

        .modern-tab[data-state="active"] span {
          text-shadow: 0 0 12px rgba(0, 255, 255, 0.7);
        }

        /* Ensure active tab is always visible */
        .tabs-list:has(.modern-tab:hover) .modern-tab[data-state="active"]:not(:hover) {
          filter: blur(0);
          opacity: 0.9;
        }

        /* Holographic Card Effects */
        .holographic-card {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .holographic-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            120deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          transform: skewX(-25deg);
          transition: 0.5s;
        }

        .holographic-card:hover::before {
          left: 150%;
        }

        .holographic-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            45deg,
            transparent 0%,
            rgba(255, 255, 255, 0.05) 45%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0.05) 55%,
            transparent 100%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .holographic-card:hover::after {
          opacity: 1;
        }

        .holographic-card:hover {
          transform: scale(1.025);
          box-shadow: 
            0 0 20px rgba(255, 255, 255, 0.1),
            0 0 40px rgba(255, 255, 255, 0.05),
            0 0 60px rgba(255, 255, 255, 0.025);
        }

        /* Card-specific holographic effects */
        .holographic-card.cyan-card:hover {
          box-shadow: 
            0 0 20px rgba(0, 255, 255, 0.2),
            0 0 40px rgba(0, 255, 255, 0.1),
            0 0 60px rgba(0, 255, 255, 0.05);
        }

        .holographic-card.green-card:hover {
          box-shadow: 
            0 0 20px rgba(0, 255, 0, 0.2),
            0 0 40px rgba(0, 255, 0, 0.1),
            0 0 60px rgba(0, 255, 0, 0.05);
        }

        .holographic-card.yellow-card:hover {
          box-shadow: 
            0 0 20px rgba(255, 255, 0, 0.2),
            0 0 40px rgba(255, 255, 0, 0.1),
            0 0 60px rgba(255, 255, 0, 0.05);
        }

        .holographic-card.purple-card:hover {
          box-shadow: 
            0 0 20px rgba(255, 0, 255, 0.2),
            0 0 40px rgba(255, 0, 255, 0.1),
            0 0 60px rgba(255, 0, 255, 0.05);
        }

        .modern-animated-btn {
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(148, 163, 184, 0.3);
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(8px);
          color: white !important;
          font-size: 0.95rem;
          padding: 0.75rem 1.25rem;
          height: auto;
          min-height: 2.75rem;
        }

        .modern-animated-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          transition: 0.5s;
        }

        .modern-animated-btn:hover {
          transform: translateY(-2px) scale(1.02);
          border-color: rgba(148, 163, 184, 0.5);
          background: rgba(15, 23, 42, 0.8);
          box-shadow: 0 0 20px rgba(148, 163, 184, 0.2);
          color: white !important;
        }

        .modern-animated-btn:hover::before {
          left: 100%;
        }

        .modern-animated-btn svg {
          transition: transform 0.3s ease;
          width: 1.25rem;
          height: 1.25rem;
          color: white;
        }

        .modern-animated-btn:active {
          transform: translateY(0) scale(0.98);
        }

        /* Add a subtle glow effect on hover */
        .modern-animated-btn::after {
          content: '';
          position: absolute;
          inset: -1px;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6, #3b82f6);
          border-radius: inherit;
          z-index: -1;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .modern-animated-btn:hover::after {
          opacity: 0.3;
        }

        .rounded-lg.border {
          background: rgba(15, 23, 42, 0.3) !important;
          backdrop-filter: blur(12px);
          border: 1px solid rgba(148, 163, 184, 0.2) !important;
          box-shadow: 0 4px 24px -1px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }

        .rounded-lg.border:hover {
          transform: translateY(-2px);
          border-color: rgba(148, 163, 184, 0.4) !important;
          box-shadow: 
            0 8px 32px -1px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(148, 163, 184, 0.1),
            0 0 20px rgba(148, 163, 184, 0.1);
        }

        /* Text enhancements */
        .font-semibold.tracking-tight {
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
          letter-spacing: 0.025em;
        }

        .text-slate-400 {
          color: rgba(148, 163, 184, 0.9) !important;
        }

        .text-slate-300 {
          color: rgba(203, 213, 225, 0.95) !important;
        }

        /* Status badge enhancements */
        .inline-flex.items-center.rounded-full.border {
          backdrop-filter: blur(8px);
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
        }

        /* Progress bar enhancements */
        .relative.w-full.overflow-hidden.rounded-full {
          background: rgba(15, 23, 42, 0.5) !important;
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
        }

        .relative.w-full.overflow-hidden.rounded-full > div {
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }

        /* Profit/Loss text enhancements */
        .font-bold.text-green-400 {
          text-shadow: 0 0 10px rgba(74, 222, 128, 0.3);
        }

        .font-bold.text-red-400 {
          text-shadow: 0 0 10px rgba(248, 113, 113, 0.3);
        }

        /* Risk level text enhancements */
        .font-medium.text-yellow-400 {
          text-shadow: 0 0 10px rgba(250, 204, 21, 0.3);
        }

        .font-medium.text-green-400 {
          text-shadow: 0 0 10px rgba(74, 222, 128, 0.3);
        }

        .font-medium.text-red-400 {
          text-shadow: 0 0 10px rgba(248, 113, 113, 0.3);
        }

        /* Gas Price Cards */
        .grid.grid-cols-1.md\:grid-cols-4 .rounded-lg.border {
          min-height: 160px;
          padding: 1.5rem;
        }

        .grid.grid-cols-1.md\:grid-cols-4 .text-2xl {
          font-size: 1.75rem;
          line-height: 2rem;
          margin-bottom: 0.5rem;
          text-shadow: 0 0 15px rgba(74, 222, 128, 0.3);
        }

        .grid.grid-cols-1.md\:grid-cols-4 .text-red-400 {
          text-shadow: 0 0 15px rgba(248, 113, 113, 0.3);
        }

        .grid.grid-cols-1.md\:grid-cols-4 .text-slate-200 {
          font-size: 1.1rem;
          font-weight: 500;
          color: rgba(226, 232, 240, 0.95);
          text-shadow: 0 0 10px rgba(226, 232, 240, 0.2);
        }

        .grid.grid-cols-1.md\:grid-cols-4 svg {
          width: 1.5rem;
          height: 1.5rem;
          filter: drop-shadow(0 0 8px rgba(148, 163, 184, 0.3));
        }

        /* Analytics Cards */
        .grid.grid-cols-1.lg\:grid-cols-2 .rounded-lg.border {
          min-height: 400px;
        }

        .grid.grid-cols-1.lg\:grid-cols-2 .text-2xl {
          font-size: 2rem;
          line-height: 2.5rem;
          margin-bottom: 0.5rem;
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.15);
        }

        .grid.grid-cols-1.lg\:grid-cols-2 .text-3xl {
          font-size: 2.5rem;
          line-height: 3rem;
          text-shadow: 0 0 25px rgba(74, 222, 128, 0.4);
        }

        .grid.grid-cols-1.lg\:grid-cols-2 .text-xl {
          font-size: 1.5rem;
          line-height: 2rem;
          text-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
        }

        .grid.grid-cols-1.lg\:grid-cols-2 .bg-slate-700\/50 {
          background: rgba(51, 65, 85, 0.4);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(148, 163, 184, 0.1);
          box-shadow: 0 4px 20px -1px rgba(0, 0, 0, 0.2);
        }

        /* Slider enhancements */
        .relative.h-2.w-full.grow.overflow-hidden.rounded-full {
          height: 0.5rem;
          background: rgba(15, 23, 42, 0.5);
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
        }

        .relative.h-2.w-full.grow.overflow-hidden.rounded-full > span {
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
        }

        /* Apply button enhancement */
        .bg-blue-600.hover\:bg-blue-700 {
          font-size: 1rem;
          padding: 0.75rem 1.5rem;
          height: auto;
          min-height: 3rem;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
          box-shadow: 0 0 20px rgba(37, 99, 235, 0.3);
        }

        /* Status badge enhancement */
        .inline-flex.items-center.rounded-full.border.w-full {
          padding: 0.75rem;
          font-size: 0.9rem;
          backdrop-filter: blur(8px);
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  )
}
