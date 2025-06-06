import { NextResponse } from "next/server";
import { ethers } from "ethers";

const UNISWAP_V3_POOL_ABI = [
  "function slot0() view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)",
  "function liquidity() view returns (uint128)",
  "function token0() view returns (address)",
  "function token1() view returns (address)"
];

export async function GET(request: Request) {
  const pool = new URL(request.url).searchParams.get("pool");
  if (!pool) return NextResponse.json({ error: "Missing pool address" }, { status: 400 });

  const provider = new ethers.JsonRpcProvider(process.env.ETH_RPC_URL);
  const contract = new ethers.Contract(pool, UNISWAP_V3_POOL_ABI, provider);

  try {
    const [slot0, liquidity, token0, token1] = await Promise.all([
      contract.slot0(),
      contract.liquidity(),
      contract.token0(),
      contract.token1()
    ]);
    // Convert all BigInt values in slot0 to strings
    const slot0Obj = Object.fromEntries(
      Object.entries(slot0).map(([k, v]) => [k, typeof v === 'bigint' ? v.toString() : v])
    );
    return NextResponse.json({
      slot0: slot0Obj,
      liquidity: liquidity.toString(),
      token0,
      token1
    });
  } catch (e) {
    console.error("Uniswap API error:", e);
    return NextResponse.json({ error: "Failed to fetch Uniswap pool data" }, { status: 500 });
  }
} 