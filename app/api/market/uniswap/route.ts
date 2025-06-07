import { NextResponse } from "next/server";
import { ethers } from "ethers";

const UNISWAP_V3_POOL_ABI = [
  "function slot0() view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)",
  "function liquidity() view returns (uint128)",
  "function token0() view returns (address)",
  "function token1() view returns (address)"
];

const CACHE_TTL = 60; // Cache for 60 seconds

export async function GET(request: Request) {
  const pool = new URL(request.url).searchParams.get("pool");
  if (!pool) return NextResponse.json({ error: "Missing pool address" }, { status: 400 });

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL || "";
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || "";
  const isValidRedis = redisUrl.startsWith("https://") && !!redisToken;
  let redis = null;
  if (isValidRedis) {
    const { Redis } = await import("@upstash/redis");
    redis = new Redis({ url: redisUrl, token: redisToken });
  }

  try {
    // Try to get cached data
    const cachedData = await redis?.get(`uniswap:pool:${pool}`);
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    const provider = new ethers.JsonRpcProvider(process.env.ETH_RPC_URL);
    const contract = new ethers.Contract(pool, UNISWAP_V3_POOL_ABI, provider);

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

    const data = {
      slot0: slot0Obj,
      liquidity: liquidity.toString(),
      token0,
      token1,
      timestamp: new Date().toISOString()
    };

    // Cache the data
    await redis?.set(`uniswap:pool:${pool}`, data, { ex: CACHE_TTL });

    return NextResponse.json(data);
  } catch (e) {
    console.error("Uniswap API error:", e);
    return NextResponse.json({ error: "Failed to fetch Uniswap pool data" }, { status: 500 });
  }
} 