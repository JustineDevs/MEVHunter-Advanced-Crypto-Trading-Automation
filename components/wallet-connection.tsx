"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, CheckCircle } from "lucide-react"
import { Connection, PublicKey } from "@solana/web3.js"

interface WalletConnectionProps {
  onConnectionChange: (connected: boolean, address?: string, type?: "metamask" | "phantom") => void
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
  const [network, setNetwork] = useState<string>("")
  const [error, setError] = useState<string>("")

  // Setup MetaMask event listeners
  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          disconnect()
        } else if (accounts[0] !== walletAddress) {
          // Account changed
          setWalletAddress(accounts[0])
          updateMetaMaskBalance(accounts[0])
        }
      }

      const handleChainChanged = (chainId: string) => {
        // Reload the page when chain changes
        window.location.reload()
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)

      // Get initial network
      window.ethereum.request({ method: "eth_chainId" }).then((chainId: string) => {
        setNetwork(getNetworkName(chainId))
      })

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [walletAddress])

  // Setup Phantom event listeners
  useEffect(() => {
    if (typeof window.solana !== "undefined") {
      const handlePhantomDisconnect = () => {
        disconnect()
      }

      window.solana.on("disconnect", handlePhantomDisconnect)

      return () => {
        window.solana.removeListener("disconnect", handlePhantomDisconnect)
      }
    }
  }, [])

  const getNetworkName = (chainId: string): string => {
    const networks: { [key: string]: string } = {
      "0x1": "Ethereum Mainnet",
      "0x89": "Polygon Mainnet",
      "0xa": "Optimism",
      "0xa4b1": "Arbitrum One",
      "0xaa36a7": "Sepolia Testnet",
    }
    return networks[chainId] || `Chain ID: ${chainId}`
  }

  const updateMetaMaskBalance = async (address: string) => {
    try {
      const balance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [address, "latest"],
      })
      setBalance(Number.parseInt(balance, 16) / 1e18)
    } catch (error) {
      console.error("Error updating MetaMask balance:", error)
      setError("Failed to update balance")
    }
  }

  const updatePhantomBalance = async (publicKey: string) => {
    try {
      const connection = new Connection("https://api.mainnet-beta.solana.com")
      const balance = await connection.getBalance(new PublicKey(publicKey))
      setBalance(balance / 1e9)
    } catch (error) {
      console.error("Error updating Phantom balance:", error)
      setError("Failed to update balance")
    }
  }

  const connectMetaMask = async () => {
    try {
      setError("")
      if (typeof window.ethereum !== "undefined") {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        })

        if (accounts.length > 0) {
          setWalletAddress(accounts[0])
          setWalletType("metamask")
          onConnectionChange(true, accounts[0], "metamask")
          await updateMetaMaskBalance(accounts[0])
        }
      } else {
        setError("MetaMask not detected. Please install MetaMask.")
      }
    } catch (error: any) {
      console.error("Error connecting to MetaMask:", error)
      setError(error.message || "Failed to connect to MetaMask")
    }
  }

  const connectPhantom = async () => {
    try {
      setError("")
      if (typeof window.solana !== "undefined") {
        const response = await window.solana.connect()
        const publicKey = response.publicKey.toString()
        setWalletAddress(publicKey)
        setWalletType("phantom")
        onConnectionChange(true, publicKey, "phantom")
        await updatePhantomBalance(publicKey)
      } else {
        setError("Phantom wallet not detected. Please install Phantom.")
      }
    } catch (error: any) {
      console.error("Error connecting to Phantom:", error)
      setError(error.message || "Failed to connect to Phantom")
    }
  }

  const disconnect = async () => {
    try {
      setError("")
    setWalletAddress("")
    setWalletType(null)
    setBalance(0)
      setNetwork("")
    onConnectionChange(false)

    if (window.solana && window.solana.isPhantom) {
      try {
        await window.solana.disconnect()
      } catch (e) {
        // Ignore errors if already disconnected
      }
    }

      // Clear any session tokens/cookies
    document.cookie = "session-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    } catch (error: any) {
      console.error("Error disconnecting wallet:", error)
      setError(error.message || "Failed to disconnect wallet")
    }
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardContent className="p-4">
        {error && (
          <div className="mb-2 text-sm text-red-400 bg-red-900/20 p-2 rounded">
            {error}
          </div>
        )}
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
                {network && walletType === "metamask" && (
                  <div className="text-xs text-slate-500 mt-1">
                    {network}
                  </div>
                )}
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
