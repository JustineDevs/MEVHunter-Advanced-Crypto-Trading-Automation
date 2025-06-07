"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  AreaChart,
  Area,
} from "recharts"
import { 
  TrendingUp, 
  AlertTriangle, 
  ImageIcon, 
  Wallet, 
  Star, 
  Bell, 
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from "lucide-react"

interface NFTMonitorWidgetProps {
  walletAddress: string
  walletType: "metamask" | "phantom" | null
}

// Demo data generators
const generatePriceData = () => {
  const data = []
  const now = new Date()
  for (let i = 0; i < 24; i++) {
    data.push({
      time: new Date(now.getTime() - (23 - i) * 3600000).toLocaleTimeString(),
      floorPrice: Math.random() * 10 + 5,
      volume: Math.random() * 100 + 50,
    })
  }
  return data
}

const generateMarketActivity = () => {
  const activities = []
  const types = ["Sale", "Listing", "Offer"]
  const collections = ["Bored Ape", "CryptoPunks", "Azuki", "Doodles"]
  for (let i = 0; i < 10; i++) {
    activities.push({
      id: i + 1,
      type: types[Math.floor(Math.random() * types.length)],
      collection: collections[Math.floor(Math.random() * collections.length)],
      price: (Math.random() * 20 + 1).toFixed(2),
      time: new Date(Date.now() - Math.random() * 86400000).toLocaleTimeString(),
    })
  }
  return activities
}

const generateRarityData = () => {
  const traits = ["Background", "Fur", "Eyes", "Mouth", "Clothing"]
  const data = []
  for (let i = 0; i < 5; i++) {
    data.push({
      trait: traits[i],
      rarity: Math.random() * 100,
      value: Math.random() * 10 + 1,
    })
  }
  return data
}

const generateAlerts = () => {
  const alerts = []
  const types = ["price_spike", "price_drop", "volume_spike", "new_listing"]
  const collections = ["Bored Ape", "CryptoPunks", "Azuki", "Doodles"]
  for (let i = 0; i < 5; i++) {
    alerts.push({
      id: i + 1,
      type: types[Math.floor(Math.random() * types.length)],
      collection: collections[Math.floor(Math.random() * collections.length)],
      message: `${Math.random() > 0.5 ? "Price increased" : "Price decreased"} by ${(Math.random() * 20 + 5).toFixed(1)}%`,
      time: new Date(Date.now() - Math.random() * 3600000).toLocaleTimeString(),
    })
  }
  return alerts
}

const generatePortfolio = () => {
  const portfolio = []
  const collections = ["Bored Ape", "CryptoPunks", "Azuki", "Doodles"]
  for (let i = 0; i < 8; i++) {
    portfolio.push({
      id: i + 1,
      name: `${collections[Math.floor(Math.random() * collections.length)]} #${Math.floor(Math.random() * 10000)}`,
      collection: collections[Math.floor(Math.random() * collections.length)],
      value: (Math.random() * 20 + 1).toFixed(2),
      rarity: Math.floor(Math.random() * 100),
      image: `https://picsum.photos/200/200?random=${i}`,
    })
  }
  return portfolio
}

export function NFTMonitorWidget({ walletAddress, walletType }: NFTMonitorWidgetProps) {
  const [priceData, setPriceData] = useState(generatePriceData())
  const [marketActivity, setMarketActivity] = useState(generateMarketActivity())
  const [rarityData, setRarityData] = useState(generateRarityData())
  const [alerts, setAlerts] = useState(generateAlerts())
  const [portfolio, setPortfolio] = useState(generatePortfolio())
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCollection, setSelectedCollection] = useState("all")
  const [sortBy, setSortBy] = useState("value")

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPriceData(generatePriceData())
      setMarketActivity(generateMarketActivity())
      setAlerts(generateAlerts())
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  // Simulate initial data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case "price_spike":
        return "bg-green-900/50 text-green-400"
      case "price_drop":
        return "bg-red-900/50 text-red-400"
      case "volume_spike":
        return "bg-blue-900/50 text-blue-400"
      case "new_listing":
        return "bg-purple-900/50 text-purple-400"
      default:
        return "bg-slate-900/50 text-slate-400"
    }
  }

  const handleAlertClick = (alert: any) => {
    toast.info(`Viewing details for ${alert.collection} ${alert.type}`)
  }

  const handlePortfolioSort = (value: string) => {
    setSortBy(value)
    const sorted = [...portfolio].sort((a, b) => {
      if (value === "value") return parseFloat(b.value) - parseFloat(a.value)
      if (value === "rarity") return b.rarity - a.rarity
      return 0
    })
    setPortfolio(sorted)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Price Tracker */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>Price Tracker</span>
            <RefreshCw className="h-4 w-4 text-slate-400" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={priceData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "0.5rem"
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="floorPrice" 
                  stroke="#8884d8" 
                  fillOpacity={1} 
                  fill="url(#colorPrice)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Market Activity */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Market Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {marketActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge className="bg-blue-900/50 text-blue-400">{activity.type}</Badge>
                  <div>
                    <div className="text-white font-medium">{activity.collection}</div>
                    <div className="text-sm text-slate-400">{activity.price} ETH</div>
                  </div>
                </div>
                <div className="text-xs text-slate-400">{activity.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rarity Score */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Rarity Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rarityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="trait" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "0.5rem"
                  }}
                />
                <Bar dataKey="rarity" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Collection Alerts */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Collection Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg cursor-pointer hover:bg-slate-700/70 transition-colors"
                onClick={() => handleAlertClick(alert)}
              >
                <div className="flex items-center gap-3">
                  <Badge className={getAlertTypeColor(alert.type)}>
                    {alert.type.replace("_", " ").toUpperCase()}
                  </Badge>
                  <div>
                    <div className="text-white font-medium">{alert.collection}</div>
                    <div className="text-sm text-slate-400">{alert.message}</div>
                  </div>
                </div>
                <div className="text-xs text-slate-400">{alert.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Portfolio */}
      <Card className="bg-slate-800/50 border-slate-700 md:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Your NFT Portfolio</CardTitle>
            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={handlePortfolioSort}>
                <SelectTrigger className="w-[180px] bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="value">Value</SelectItem>
                  <SelectItem value="rarity">Rarity</SelectItem>
                </SelectContent>
              </Select>
              <Input 
                placeholder="Search collections..." 
                className="w-[200px] bg-slate-700 border-slate-600"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {portfolio.map((nft) => (
              <div key={nft.id} className="bg-slate-700/50 rounded-lg overflow-hidden">
                <div className="aspect-square relative">
                  <img 
                    src={nft.image} 
                    alt={nft.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-slate-900/80 text-slate-200">
                      {nft.rarity}% Rare
                    </Badge>
                  </div>
                </div>
                <div className="p-3">
                  <div className="text-white font-medium truncate">{nft.name}</div>
                  <div className="text-sm text-slate-400">{nft.value} ETH</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 