import { NextResponse } from "next/server";

export async function GET() {
  const url = `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${process.env.ETHERSCAN_API_KEY}`;

  const res = await fetch(url);

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }

  const data = await res.json();
  return NextResponse.json(data);
} 