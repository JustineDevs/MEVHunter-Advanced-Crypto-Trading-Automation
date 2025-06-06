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
import { TrendingUp, Shield, Zap, Bot, Play, Pause, BarChart2, AlertTriangle } from "lucide-react"

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
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-black">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight drop-shadow-lg">MEVHunter</h1>
            <p className="text-lg text-cyan-200/80 font-medium">Advanced crypto trading automation & monitoring system</p>
          </div>
          <div className="flex space-x-4">
            <WalletConnection onConnectionChange={setIsConnected} isConnected={isConnected} />
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="holographic-card cyan-card text-card-foreground bg-white/10 backdrop-blur-md border border-cyan-400/30 shadow-xl rounded-2xl transition-transform">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-cyan-200">Active Strategies</CardTitle>
              <Bot className="h-5 w-5 text-cyan-400 drop-shadow-glow" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{activeStrategies}</div>
              <p className="text-xs text-cyan-300/80">+2 from last hour</p>
            </CardContent>
          </Card>

          <Card className="holographic-card green-card text-card-foreground bg-white/10 backdrop-blur-md border border-green-400/30 shadow-xl rounded-2xl transition-transform">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-green-200">Total P&L</CardTitle>
              <TrendingUp className="h-5 w-5 text-green-400 drop-shadow-glow" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-300">${totalProfit.toFixed(2)}</div>
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
              <div className="text-2xl font-bold text-purple-200">0.45 ETH</div>
              <p className="text-xs text-purple-100/80">Through optimization</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="tabs-list grid w-full grid-cols-7 bg-gradient-to-r from-cyan-900/60 via-blue-900/60 to-black/60 rounded-xl p-1 shadow-lg">
            <TabsTrigger value="dashboard" className="modern-tab group">
              <img src="https://img.icons8.com/?size=100&id=pzxd8RBU7JvI&format=png&color=000000" alt="Dashboard" className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="arbitrage" className="modern-tab group">
              <img src="https://img.icons8.com/?size=100&id=Pv5LQKRzge0Q&format=png&color=000000" alt="Arbitrage" className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" />
              <span>Arbitrage</span>
            </TabsTrigger>
            <TabsTrigger value="liquidation" className="modern-tab group">
              <img src="https://img.icons8.com/?size=100&id=LRkvL5UY5Dkv&format=png&color=000000" alt="Liquidation" className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" />
              <span>Liquidation</span>
            </TabsTrigger>
            <TabsTrigger value="gas" className="modern-tab group">
              <img src="https://img.icons8.com/?size=100&id=9048&format=png&color=000000" alt="Gas Optimizer" className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" />
              <span>Gas Optimizer</span>
            </TabsTrigger>
            <TabsTrigger value="nft" className="modern-tab group">
              <img src="https://img.icons8.com/?size=100&id=FjcvBNoB41Ur&format=png&color=000000" alt="NFT Monitor" className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" />
              <span>NFT Monitor</span>
            </TabsTrigger>
            <TabsTrigger value="signals" className="modern-tab group">
              <img src="https://img.icons8.com/?size=100&id=7767&format=png&color=000000" alt="Trading" className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" />
              <span>Trading</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="modern-tab group">
              <img src="https://img.icons8.com/?size=100&id=10484&format=png&color=000000" alt="Security" className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" />
              <span>Security</span>
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
