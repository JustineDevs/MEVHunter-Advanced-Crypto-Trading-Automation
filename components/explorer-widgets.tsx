"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { RefreshCw, Search, Loader2 } from "lucide-react"

const statusColors = {
  win: "#22c55e",
  lose: "#ef4444",
  pending: "#facc15"
}

const addressDomainMap: Record<string, string> = {
  "0x1234...abcd": "alice.eth",
  "0x5678...efgh": "bob.eth",
  "0x9abc...ijkl": "carol.sol",
  "0xdef0...mnop": "dave.eth",
  "0x1111...2222": "eve.sol"
}

const statuses = ["win", "lose", "pending"] as const

type Status = typeof statuses[number]

interface DemoTx {
  id: string
  status: Status
  amount: number
  address: string
  domain: string
  date: Date
}

function generateDemoTx(count = 30): DemoTx[] {
  const addrs = Object.keys(addressDomainMap)
  return Array.from({ length: count }, (_, i) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const address = addrs[Math.floor(Math.random() * addrs.length)]
    return {
      id: `tx-${i + 1}`,
      status,
      amount: Number((Math.random() * 2).toFixed(3)),
      address,
      domain: addressDomainMap[address],
      date: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 7)
    }
  })
}

const lookupSchema = z.object({
  query: z.string().min(2, "Enter at least 2 characters")
})

type LookupForm = z.infer<typeof lookupSchema>

export function ExplorerWidgets() {
  const [txs, setTxs] = useState<DemoTx[]>([])
  const [filter, setFilter] = useState<Status | "all">("all")
  const [sort, setSort] = useState<"date" | "amount">("date")
  const [pending, setPending] = useState<DemoTx[]>([])
  const [loading, setLoading] = useState(false)
  const form = useForm<LookupForm>({ resolver: zodResolver(lookupSchema), defaultValues: { query: "" } })

  // Generate demo data
  useEffect(() => {
    setTxs(generateDemoTx(30))
    setPending(generateDemoTx(5).filter(tx => tx.status === "pending"))
  }, [])

  // Simulate real-time pending updates
  useEffect(() => {
    if (!pending.length) return
    const interval = setInterval(() => {
      setPending(pending =>
        pending.map(tx =>
          Math.random() > 0.7
            ? { ...tx, status: Math.random() > 0.5 ? "win" : "lose" }
            : tx
        )
      )
    }, 3000)
    return () => clearInterval(interval)
  }, [pending.length])

  // Filtered and sorted txs
  const filteredTxs = useMemo(() => {
    let arr = [...txs, ...pending]
    if (filter !== "all") arr = arr.filter(tx => tx.status === filter)
    if (form.watch("query")) {
      const q = form.watch("query").toLowerCase()
      arr = arr.filter(tx => tx.address.toLowerCase().includes(q) || tx.domain.toLowerCase().includes(q))
    }
    arr.sort((a, b) => sort === "date" ? b.date.getTime() - a.date.getTime() : b.amount - a.amount)
    return arr
  }, [txs, pending, filter, sort, form.watch("query")])

  // Pie chart data
  const statusCounts = useMemo(() => {
    const counts = { win: 0, lose: 0, pending: 0 }
    for (const tx of [...txs, ...pending]) counts[tx.status]++
    return [
      { name: "Win", value: counts.win },
      { name: "Lose", value: counts.lose },
      { name: "Pending", value: counts.pending }
    ]
  }, [txs, pending])

  // Profit/Loss bar chart
  const profitLossData = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => i)
    return days.map(d => {
      const day = new Date(Date.now() - d * 86400000)
      const dayStr = day.toLocaleDateString()
      const wins = txs.filter(tx => tx.status === "win" && tx.date.toLocaleDateString() === dayStr).length
      const losses = txs.filter(tx => tx.status === "lose" && tx.date.toLocaleDateString() === dayStr).length
      return { day: dayStr, Win: wins, Lose: losses }
    }).reverse()
  }, [txs])

  // Address/domain search results
  const lookupResults = useMemo(() => {
    const q = form.watch("query").toLowerCase()
    if (!q) return []
    return Object.entries(addressDomainMap)
      .filter(([addr, domain]) => addr.toLowerCase().includes(q) || domain.toLowerCase().includes(q))
      .map(([addr, domain]) => ({ addr, domain }))
  }, [form.watch("query")])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Transaction Status Chart */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Transaction Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusCounts} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {statusCounts.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={Object.values(statusColors)[i]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Profit/Loss Tracker Widget */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Profit/Loss Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={profitLossData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Legend />
                <Bar dataKey="Win" fill="#22c55e" />
                <Bar dataKey="Lose" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Address/Domain Lookup Widget */}
      <Card className="bg-slate-800/50 border-slate-700 col-span-2">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">Address/Domain Lookup <Search className="w-4 h-4 text-cyan-400" /></CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(() => {})} className="flex gap-2 mb-2">
            <Input {...form.register("query")} placeholder="Search address or domain..." className="bg-slate-900 border-slate-700 text-white" />
            <Button type="submit" variant="outline" className="border-cyan-700 text-cyan-400">Search</Button>
          </form>
          <div className="flex flex-wrap gap-2">
            {lookupResults.map(({ addr, domain }) => (
              <Badge key={addr} className="bg-cyan-900/50 text-cyan-300 px-3 py-1 rounded-full">{domain} <span className="text-xs text-slate-400 ml-2">({addr})</span></Badge>
            ))}
            {!lookupResults.length && form.watch("query") && <span className="text-slate-400">No results found.</span>}
          </div>
        </CardContent>
      </Card>

      {/* Transaction History Widget */}
      <Card className="bg-slate-800/50 border-slate-700 col-span-2">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">Transaction History <RefreshCw className="w-4 h-4 text-slate-400 animate-spin" /></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-2">
            <Tabs defaultValue="all" onValueChange={v => setFilter(v as Status | "all") }>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="win">Win</TabsTrigger>
                <TabsTrigger value="lose">Lose</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button size="sm" variant={sort === "date" ? "default" : "outline"} className="ml-2" onClick={() => setSort(sort === "date" ? "amount" : "date")}>{sort === "date" ? "Sort by Date" : "Sort by Amount"}</Button>
          </div>
          <div className="overflow-x-auto rounded-lg border border-slate-700">
            <table className="min-w-full text-sm text-slate-200">
              <thead className="bg-slate-900">
                <tr>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Address</th>
                  <th className="px-4 py-2">Domain</th>
                  <th className="px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredTxs.map(tx => (
                  <tr key={tx.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition">
                    <td className="px-4 py-2">
                      <Badge className={`px-2 py-1 rounded-full ${tx.status === "win" ? "bg-green-900/50 text-green-400" : tx.status === "lose" ? "bg-red-900/50 text-red-400" : "bg-yellow-900/50 text-yellow-400"}`}>{tx.status.toUpperCase()}</Badge>
                    </td>
                    <td className="px-4 py-2">{tx.amount} ETH</td>
                    <td className="px-4 py-2">{tx.address}</td>
                    <td className="px-4 py-2">{tx.domain}</td>
                    <td className="px-4 py-2">{tx.date.toLocaleString()}</td>
                  </tr>
                ))}
                {!filteredTxs.length && <tr><td colSpan={5} className="text-center text-slate-400 py-8">No transactions found.</td></tr>}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pending Transaction Monitor */}
      <Card className="bg-slate-800/50 border-slate-700 col-span-2">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">Pending Transactions <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" /></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {pending.filter(tx => tx.status === "pending").map(tx => (
              <div key={tx.id} className="flex items-center gap-4 p-3 bg-yellow-900/10 border border-yellow-700/30 rounded-lg">
                <Badge className="bg-yellow-400/20 text-yellow-400 px-2 py-1 rounded-full">Pending</Badge>
                <span className="text-slate-200 font-mono">{tx.address}</span>
                <span className="text-slate-400">{tx.domain}</span>
                <span className="text-slate-400">{tx.amount} ETH</span>
                <span className="text-xs text-slate-500">{tx.date.toLocaleString()}</span>
              </div>
            ))}
            {!pending.filter(tx => tx.status === "pending").length && <div className="text-slate-400 text-center py-8">No pending transactions.</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 