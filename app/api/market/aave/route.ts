import { NextResponse } from "next/server";
import { ethers } from "ethers";

const AAVE_LENDING_POOL_ABI = [
  "function getUserAccountData(address user) view returns (uint256 totalCollateralETH, uint256 totalDebtETH, uint256 availableBorrowsETH, uint256 currentLiquidationThreshold, uint256 ltv, uint256 healthFactor)"
];
const AAVE_LENDING_POOL_ADDRESS = "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9"; // Mainnet v2

const CACHE_TTL = 60; // Cache for 60 seconds

export async function GET(request: Request) {
  const user = new URL(request.url).searchParams.get("user");
  if (!user) return NextResponse.json({ error: "Missing user address" }, { status: 400 });

  try {
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL || "";
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || "";
    const isValidRedis = redisUrl.startsWith("https://") && !!redisToken;
    let redis = null;
    if (isValidRedis) {
      const { Redis } = await import("@upstash/redis");
      redis = new Redis({ url: redisUrl, token: redisToken });
    }

    // Try to get cached data if Redis is available
    if (redis) {
      const cachedData = await redis.get(`