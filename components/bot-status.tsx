"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Power, PowerOff } from "lucide-react";

type BotType = "arbitrage" | "liquidation" | "nft" | "gas";

interface BotStatusProps {
  type: BotType;
}

const BOT_CONFIGS = {
  arbitrage: {
    title: "Arbitrage Bot",
    description: "Monitors and executes cross-exchange arbitrage opportunities",
  },
  liquidation: {
    title: "Liquidation Bot",
    description: "Monitors and executes liquidation opportunities",
  },
  nft: {
    title: "NFT Bot",
    description: "Monitors NFT marketplaces for opportunities",
  },
  gas: {
    title: "Gas Bot",
    description: "Monitors and optimizes gas prices",
  },
};

export function BotStatus({ type }: BotStatusProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const toggleBot = async () => {
    try {
      const response = await fetch(`/api/bot/${type}/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: !isRunning }),
      });

      if (response.ok) {
        setIsRunning(!isRunning);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error(`Failed to toggle ${type} bot:`, error);
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-white">
          {BOT_CONFIGS[type].title}
        </CardTitle>
        <Badge variant={isRunning ? "default" : "destructive"}>
          {isRunning ? "Running" : "Stopped"}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-slate-400 mb-4">
          {BOT_CONFIGS[type].description}
        </div>
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleBot}
            className="bg-slate-700 hover:bg-slate-600"
          >
            {isRunning ? (
              <>
                <PowerOff className="mr-2 h-4 w-4" />
                Stop
              </>
            ) : (
              <>
                <Power className="mr-2 h-4 w-4" />
                Start
              </>
            )}
          </Button>
          {lastUpdate && (
            <span className="text-xs text-slate-400">
              Last update: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 