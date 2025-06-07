"use client";

import { MarketChart } from "@/components/ui/market-chart";

export default function TradingPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="grid gap-4">
        <div className="col-span-full">
          <MarketChart />
        </div>
      </div>
    </div>
  );
} 