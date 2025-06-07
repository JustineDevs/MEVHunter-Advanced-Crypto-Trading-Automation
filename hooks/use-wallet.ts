import { useState, useEffect } from "react";

interface WalletState {
  walletAddress: string;
  walletType: "metamask" | "phantom" | null;
}

export function useWallet(): WalletState {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [walletType, setWalletType] = useState<"metamask" | "phantom" | null>(null);

  useEffect(() => {
    // Check for MetaMask
    if (typeof window.ethereum !== "undefined") {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          setWalletAddress("");
          setWalletType(null);
        } else {
          setWalletAddress(accounts[0]);
          setWalletType("metamask");
        }
      };

      // Get initial account
      window.ethereum.request({ method: "eth_accounts" }).then(handleAccountsChanged);

      // Listen for account changes
      window.ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      };
    }

    // Check for Phantom
    if (typeof window.solana !== "undefined") {
      const handlePhantomConnect = (publicKey: any) => {
        setWalletAddress(publicKey.toString());
        setWalletType("phantom");
      };

      const handlePhantomDisconnect = () => {
        setWalletAddress("");
        setWalletType(null);
      };

      // Get initial account
      if (window.solana.isConnected) {
        handlePhantomConnect(window.solana.publicKey);
      }

      // Listen for connection changes
      window.solana.on("connect", handlePhantomConnect);
      window.solana.on("disconnect", handlePhantomDisconnect);

      return () => {
        window.solana.removeListener("connect", handlePhantomConnect);
        window.solana.removeListener("disconnect", handlePhantomDisconnect);
      };
    }
  }, []);

  return { walletAddress, walletType };
} 