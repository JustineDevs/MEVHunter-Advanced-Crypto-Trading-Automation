"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketUniswapCard } from "@/components/ui/market-uniswap-card";
import { MarketAaveCard } from "@/components/ui/market-aave-card";
import { MarketGasCard } from "@/components/ui/market-gas-card";
import { BotStatus } from "@/components/bot-status";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Activity, Wallet, Bot, Brain, AlertTriangle, Settings, Shield } from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const { walletAddress, walletType } = useWallet();

  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="overview">
            <Activity className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="monitoring">
            <Bell className="w-4 h-4 mr-2" />
            Monitoring
          </TabsTrigger>
          <TabsTrigger value="trading">
            <Bot className="w-4 h-4 mr-2" />
            Trading
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <Brain className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="alerts">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Alerts
          </TabsTrigger>
          <TabsTrigger value="wallet">
            <Wallet className="w-4 h-4 mr-2" />
            Wallet
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Real-time DeFi Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <MarketGasCard />
                  <MarketUniswapCard />
                  <MarketAaveCard walletAddress={walletAddress} walletType={walletType} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Arbitrage Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-slate-400">
                  Monitoring cross-DEX price differences...
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Liquidation Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-slate-400">
                  No active liquidation opportunities...
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">DeFi Protocol Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Protocol Health</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Uniswap V3</span>
                      <span className="text-green-400">Healthy</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Aave V3</span>
                      <span className="text-green-400">Healthy</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Network Status</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Ethereum</span>
                      <span className="text-green-400">Online</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Arbitrum</span>
                      <span className="text-green-400">Online</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trading" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Trading Bots Status</CardTitle>
            </CardHeader>
            <CardContent>
              <BotStatus type="arbitrage" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">AI Market Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-slate-400">
                Analyzing market trends and patterns...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Alert Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-slate-400">
                Configure your price and gas alerts...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wallet" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Wallet Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-slate-400">
                Connect your wallet to enable full functionality...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Security Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-slate-400">
                Manage your security preferences and permissions...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-slate-400">
                Configure your preferences and notifications...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 