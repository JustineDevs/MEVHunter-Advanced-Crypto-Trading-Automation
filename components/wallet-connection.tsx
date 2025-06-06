"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, CheckCircle } from "lucide-react"

interface WalletConnectionProps {
  onConnectionChange: (connected: boolean) => void
  isConnected: boolean
}

export function WalletConnection({ onConnectionChange, isConnected }: WalletConnectionProps) {
  const [walletAddress, setWalletAddress] = useState<string>("")
  const [walletType, setWalletType] = useState<"metamask" | "phantom" | null>(null)
  const [balance, setBalance] = useState<number>(0)

  const connectMetaMask = async () => {
    try {
      if (typeof window.ethereum !== "undefined") {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        })

        if (accounts.length > 0) {
          setWalletAddress(accounts[0])
          setWalletType("metamask")
          onConnectionChange(true)

          // Get balance
          const balance = await window.ethereum.request({
            method: "eth_getBalance",
            params: [accounts[0], "latest"],
          })
          setBalance(Number.parseInt(balance, 16) / 1e18)
        }
      } else {
        alert("MetaMask not detected. Please install MetaMask.")
      }
    } catch (error) {
      console.error("Error connecting to MetaMask:", error)
    }
  }

  const connectPhantom = async () => {
    try {
      if (typeof window.solana !== "undefined") {
        const response = await window.solana.connect()
        setWalletAddress(response.publicKey.toString())
        setWalletType("phantom")
        onConnectionChange(true)

        // Get SOL balance
        const connection = new window.solanaWeb3.Connection("https://api.mainnet-beta.solana.com")
        const balance = await connection.getBalance(response.publicKey)
        setBalance(balance / 1e9)
      } else {
        alert("Phantom wallet not detected. Please install Phantom.")
      }
    } catch (error) {
      console.error("Error connecting to Phantom:", error)
    }
  }

  const disconnect = () => {
    setWalletAddress("")
    setWalletType(null)
    setBalance(0)
    onConnectionChange(false)
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardContent className="p-4">
        {!isConnected ? (
          <div className="flex gap-2">
            <Button onClick={connectMetaMask} className="bg-orange-600 hover:bg-orange-700">
              <Wallet className="w-4 h-4 mr-2" />
              MetaMask
            </Button>
            <Button onClick={connectPhantom} className="bg-purple-600 hover:bg-purple-700">
              <Wallet className="w-4 h-4 mr-2" />
              Phantom
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <div>
                <div className="text-sm text-white font-medium">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </div>
                <div className="text-xs text-slate-400">
                  {balance.toFixed(4)} {walletType === "metamask" ? "ETH" : "SOL"}
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-900/50 text-green-400">
                {walletType === "metamask" ? "MetaMask" : "Phantom"}
              </Badge>
            </div>
            <Button onClick={disconnect} variant="outline" size="sm" className="border-slate-600 text-slate-300">
              Disconnect
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
