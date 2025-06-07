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
      const cachedData = await redis.get(`aave:user:${user}`);
      if (cachedData) {
        return NextResponse.json(cachedData);
      }
    }

    // If Redis is not available, return a mock response
    if (!redis) {
      return NextResponse.json({
        totalCollateralETH: "0",
        totalDebtETH: "0",
        availableBorrowsETH: "0",
        currentLiquidationThreshold: "0",
        ltv: "0",
        healthFactor: "0",
        timestamp: new Date().toISOString()
      });
    }

    const provider = new ethers.JsonRpcProvider(process.env.ETH_RPC_URL);
    const contract = new ethers.Contract(AAVE_LENDING_POOL_ADDRESS, AAVE_LENDING_POOL_ABI, provider);

    const data = await contract.getUserAccountData(user);
    const response = {
      totalCollateralETH: data.totalCollateralETH.toString(),
      totalDebtETH: data.totalDebtETH.toString(),
      availableBorrowsETH: data.availableBorrowsETH.toString(),
      currentLiquidationThreshold: data.currentLiquidationThreshold.toString(),
      ltv: data.ltv.toString(),
      healthFactor: data.healthFactor.toString(),
      timestamp: new Date().toISOString()
    };

    // Cache the data if Redis is available
    if (redis) {
      await redis.set(`aave:user:${user}`, response, { ex: CACHE_TTL });
    }

    return NextResponse.json(response);
  } catch (e) {
    console.error("Aave API error:", e);
    return NextResponse.json({ error: "Failed to fetch Aave account data" }, { status: 500 });
  }
}