import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const symbol = new URL(request.url).searchParams.get("symbol") || "BTCUSD";
  const url = `https://data.alpaca.markets/v1beta1/crypto/${symbol}/bars?timeframe=1Min&limit=1`;

  const res = await fetch(url, {
    headers: {
      "APCA-API-KEY-ID": process.env.ALPACA_API_KEY!,
      "APCA-API-SECRET-KEY": process.env.ALPACA_API_SECRET!,
    },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }

  const data = await res.json();
  return NextResponse.json(data);
} 