"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Eye, Bell, TrendingUp, ImageIcon } from "lucide-react"

interface NFTCollection {
  id: string
  name: string
  floorPrice: number
  volume24h: number
  change24h: number
  totalSupply: number
  owners: number
  isWatching: boolean
  mintPrice?: number
  mintDate?: Date
}

interface NFTAlert {
  id: string
  collection: string
  type: "floor_drop" | "volume_spike" | "new_mint"
  message: string
  timestamp: Date
}

export function NFTMonitor() {
  const [collections, setCollections] = useState<NFTCollection[]>([
    {
      id: "1",
      name: "Bored Ape Yacht Club",
      floorPrice: 45.2,
      volume24h: 234.5,
      change24h: -2.3,
      totalSupply: 10000,
      owners: 6234,
      isWatching: true,
    },
    {
      id: "2",
      name: "CryptoPunks",
      floorPrice: 67.8,
      volume24h: 156.7,
      change24h: 5.7,
      totalSupply: 10000,
      owners: 3456,
      isWatching: true,
    },
    {
      id: "3",
      name: "Azuki",
      floorPrice: 12.4,
      volume24h: 89.3,
      change24h: -8.2,
      totalSupply: 10000,
      owners: 5678,
      isWatching: false,
    },
  ])

  const [alerts, setAlerts] = useState<NFTAlert[]>([
    {
      id: "1",
      collection: "Bored Ape Yacht Club",
      type: "floor_drop",
      message: "Floor price dropped 5% in last hour",
      timestamp: new Date(),
    },
  ])

  const [newCollectionAddress, setNewCollectionAddress] = useState("")
  const [totalWatching, setTotalWatching] = useState(0)
  const [totalAlerts, setTotalAlerts] = useState(0)

  useEffect(() => {
    const watching = collections.filter((c) => c.isWatching).length
    setTotalWatching(watching)
    setTotalAlerts(alerts.length)
  }, [collections, alerts])

  const toggleWatch = (id: string) => {
    setCollections((prev) =>
      prev.map((collection) =>
        collection.id === id ? { ...collection, isWatching: !collection.isWatching } : collection,
      ),
    )
  }

  const addCollection = async () => {
    if (!newCollectionAddress) return

    try {
      const response = await fetch("/api/nft/add-collection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: newCollectionAddress }),
      })

      if (response.ok) {
        const newCollection = await response.json()
        setCollections((prev) => [...prev, newCollection])
        setNewCollectionAddress("")
      }
    } catch (error) {
      console.error("Failed to add collection:", error)
    }
  }

  const getChangeColor = (change: number) => {
    return change >= 0 ? "text-green-400" : "text-red-400"
  }

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case "floor_drop":
        return "bg-red-900/50 text-red-400"
      case "volume_spike":
        return "bg-green-900/50 text-green-400"
      case "new_mint":
        return "bg-blue-900/50 text-blue-400"
      default:
        return "bg-slate-900/50 text-slate-400"
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Watching</CardTitle>
            <Eye className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalWatching}</div>
            <p className="text-xs text-slate-400">Collections monitored</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Active Alerts</CardTitle>
            <Bell className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{totalAlerts}</div>
            <p className="text-xs text-slate-400">Notifications pending</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Avg Floor</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {(collections.reduce((sum, c) => sum + c.floorPrice, 0) / collections.length).toFixed(1)} ETH
            </div>
            <p className="text-xs text-slate-400">Across watched collections</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Total Volume</CardTitle>
            <ImageIcon className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">
              {collections.reduce((sum, c) => sum + c.volume24h, 0).toFixed(0)} ETH
            </div>
            <p className="text-xs text-slate-400">24h volume</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Collection */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Add Collection to Monitor</CardTitle>
          <CardDescription className="text-slate-400">Enter contract address to start monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="0x... (Contract Address)"
              value={newCollectionAddress}
              onChange={(e) => setNewCollectionAddress(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
            <Button onClick={addCollection} className="bg-blue-600 hover:bg-blue-700">
              Add Collection
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Collections Table */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">NFT Collections</CardTitle>
          <CardDescription className="text-slate-400">
            Monitor floor prices, volume, and market activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-300">Collection</TableHead>
                <TableHead className="text-slate-300">Floor Price</TableHead>
                <TableHead className="text-slate-300">24h Volume</TableHead>
                <TableHead className="text-slate-300">24h Change</TableHead>
                <TableHead className="text-slate-300">Supply</TableHead>
                <TableHead className="text-slate-300">Owners</TableHead>
                <TableHead className="text-slate-300">Watch</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {collections.map((collection) => (
                <TableRow key={collection.id} className="border-slate-700">
                  <TableCell className="text-white font-medium">{collection.name}</TableCell>
                  <TableCell className="text-slate-300">{collection.floorPrice.toFixed(2)} ETH</TableCell>
                  <TableCell className="text-slate-300">{collection.volume24h.toFixed(1)} ETH</TableCell>
                  <TableCell className={getChangeColor(collection.change24h)}>
                    {collection.change24h > 0 ? "+" : ""}
                    {collection.change24h.toFixed(1)}%
                  </TableCell>
                  <TableCell className="text-slate-300">{collection.totalSupply.toLocaleString()}</TableCell>
                  <TableCell className="text-slate-300">{collection.owners.toLocaleString()}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant={collection.isWatching ? "default" : "outline"}
                      onClick={() => toggleWatch(collection.id)}
                      className={
                        collection.isWatching
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "border-slate-600 text-slate-300 hover:bg-slate-700"
                      }
                    >
                      {collection.isWatching ? "Watching" : "Watch"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Alerts</CardTitle>
          <CardDescription className="text-slate-400">Latest notifications from monitored collections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge className={getAlertTypeColor(alert.type)}>{alert.type.replace("_", " ").toUpperCase()}</Badge>
                  <div>
                    <div className="text-white font-medium">{alert.collection}</div>
                    <div className="text-sm text-slate-400">{alert.message}</div>
                  </div>
                </div>
                <div className="text-xs text-slate-400">{alert.timestamp.toLocaleTimeString()}</div>
              </div>
            ))}
            {alerts.length === 0 && <div className="text-center py-8 text-slate-400">No recent alerts</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
