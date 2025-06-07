"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface AaveData {
  totalCollateralETH: string;
  totalDebtETH: string;
  availableBorrowsETH: string;
  currentLiquidationThreshold: string;
  ltv: string;
  healthFactor: string;
  timestamp: number;
  error?: string;
}

interface MarketAaveCardProps {
  walletAddress: string
  walletType: "metamask" | "phantom" | null
}

export function MarketAaveCard({ walletAddress, walletType }: MarketAaveCardProps) {
  const [data, setData] = useState<AaveData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastHealthFactor, setLastHealthFactor] = useState<string | null>(null);

  const fetchAaveData = async () => {
    if (!walletAddress || walletType !== "metamask") {
      setData(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/market/aave?user=${walletAddress}`);
      const data = await response.json();
      setData(data);
      
      // Check health factor changes
      if (lastHealthFactor && data.healthFactor) {
        const currentHealth = parseFloat(data.healthFactor);
        const previousHealth = parseFloat(lastHealthFactor);
        
        if (currentHealth < previousHealth) {
          toast.warning("Health factor decreased!", {
            description: `From ${previousHealth.toFixed(2)} to ${currentHealth.toFixed(2)}`,
          });
        } else if (currentHealth > previousHealth) {
          toast.success("Health factor improved!", {
            description: `From ${previousHealth.toFixed(2)} to ${currentHealth.toFixed(2)}`,
          });
        }
      }
      
      setLastHealthFactor(data.healthFactor);
    } catch (error) {
      console.error("Error fetching Aave data:", error);
      toast.error("Failed to fetch Aave data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAaveData();
    const interval = setInterval(fetchAaveData, 15000); // Refresh every 15 seconds
    return () => clearInterval(interval);
  }, [walletAddress, walletType]);

  const getHealthFactorStatus = (healthFactor: string) => {
    const health = parseFloat(healthFactor);
    if (health <= 1.0) {
      return {
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
        text: "Critical",
        color: "text-red-500",
      };
    } else if (health <= 1.5) {
      return {
        icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
        text: "Warning",
        color: "text-yellow-500",
      };
    } else {
      return {
        icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
        text: "Healthy",
        color: "text-green-500",
      };
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Aave Account Data</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-slate-400">Loading account data...</div>
        ) : data && !data.error ? (
          <div className="flex flex-col gap-2 text-slate-200">
            <div className="flex items-center justify-between">
              <span>Health Factor:</span>
              <div className="flex items-center gap-2">
                {data.healthFactor && getHealthFactorStatus(data.healthFactor).icon}
                <span className={getHealthFactorStatus(data.healthFactor).color}>
                  {parseFloat(data.healthFactor).toFixed(2)}
                </span>
                <span className="text-xs text-slate-400">
                  ({getHealthFactorStatus(data.healthFactor).text})
                </span>
              </div>
            </div>
            <div>
              Total Collateral: <span className="text-green-400 font-bold">{parseFloat(data.totalCollateralETH).toFixed(4)} ETH</span>
            </div>
            <div>
              Total Debt: <span className="text-red-400 font-bold">{parseFloat(data.totalDebtETH).toFixed(4)} ETH</span>
            </div>
            <div>
              Available to Borrow: <span className="text-blue-400 font-bold">{parseFloat(data.availableBorrowsETH).toFixed(4)} ETH</span>
            </div>
            <div>
              Liquidation Threshold: <span className="text-yellow-400 font-bold">{parseFloat(data.currentLiquidationThreshold).toFixed(2)}%</span>
            </div>
            <div>
              LTV: <span className="text-purple-400 font-bold">{parseFloat(data.ltv).toFixed(2)}%</span>
            </div>
            <div className="text-xs text-slate-500 mt-2">
              Last updated: {new Date(data.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ) : data && data.error ? (
          <div className="text-red-400">{data.error}</div>
        ) : (
          <div className="text-slate-400">No data available</div>
        )}
      </CardContent>
    </Card>
  );
} 