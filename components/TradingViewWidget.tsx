"use client";
import { useEffect, useRef } from "react";

export function TradingViewWidget({ symbol = "BINANCE:BTCUSDT", interval = "1" }) {
  const containerId = "tradingview-widget-container";
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Remove any previous widget
    const oldWidget = document.getElementById(containerId);
    if (oldWidget) oldWidget.innerHTML = "";

    // Load TradingView script
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      if (window.TradingView) {
        // @ts-ignore
        new window.TradingView.widget({
          autosize: true,
          symbol,
          interval,
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "#222",
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: containerId,
        });
      }
    };
    document.body.appendChild(script);

    // Cleanup on unmount
    return () => {
      initialized.current = false;
      const widget = document.getElementById(containerId);
      if (widget) widget.innerHTML = "";
    };
  }, [symbol, interval]);

  return <div id={containerId} style={{ height: 500, width: "100%" }} />;
} 