"use client";

import { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';

declare global {
  interface Window {
    TradingView: any;
  }
}

export function MarketChart() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (typeof window.TradingView !== 'undefined' && containerRef.current) {
        new window.TradingView.widget({
          container_id: containerRef.current.id,
          symbol: 'BINANCE:BTCUSDT',
          interval: '1',
          theme: 'dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#1F2937',
          enable_publishing: false,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          save_image: false,
          height: '500',
          width: '100%',
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardContent className="p-0">
        <div id="tradingview_widget" ref={containerRef} className="w-full h-[500px]" />
      </CardContent>
    </Card>
  );
} 