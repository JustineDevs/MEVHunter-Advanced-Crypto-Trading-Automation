"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, CheckCircle } from "lucide-react"
import { Connection, PublicKey } from "@solana/web3.js"

interface WalletConnectionProps {
  onConnectionChange: (connected: boolean) => void
  isConnected: boolean
}

declare global {
  interface Window {
    ethereum?: any;
    solana?: any;
    solanaWeb3?: any;
  }
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

        // Get SOL balance using @solana/web3.js
        const connection = new Connection("https://api.mainnet-beta.solana.com")
        const balance = await connection.getBalance(new PublicKey(response.publicKey))
        setBalance(balance / 1e9)
      } else {
        alert("Phantom wallet not detected. Please install Phantom.")
      }
    } catch (error) {
      console.error("Error connecting to Phantom:", error)
    }
  }

  const disconnect = async () => {
    setWalletAddress("")
    setWalletType(null)
    setBalance(0)
    onConnectionChange(false)

    // For MetaMask: clear state, but cannot force disconnect in MetaMask UI
    if (window.ethereum && window.ethereum.selectedAddress) {
      // No programmatic disconnect available
    }

    // For Phantom: call disconnect if available
    if (window.solana && window.solana.isPhantom) {
      try {
        await window.solana.disconnect()
      } catch (e) {
        // Ignore errors if already disconnected
      }
    }

    // Optionally: clear any session tokens/cookies here
    document.cookie = "session-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardContent className="p-4">
        {!isConnected ? (
          <div className="flex gap-2">
            <Button onClick={connectMetaMask} className="bg-black/40 backdrop-blur-md hover:bg-black/60 border border-orange-500/30 transition-all duration-200">
              <img
                src="/metamask.svg"
                alt="MetaMask Logo"
                className="w-8 h-8 mr-2 rounded-full"
              />
            </Button>
            <Button onClick={connectPhantom} className="bg-black/40 backdrop-blur-md hover:bg-black/60 border border-purple-500/30 transition-all duration-200">
              <img
                src="/phantom.svg"
                alt="Phantom Logo"
                className="w-8 h-8 mr-2 rounded-full"
              />
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
