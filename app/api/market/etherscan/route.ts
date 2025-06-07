import { NextResponse } from "next/server";

const CACHE_TTL = 5; // Cache for 5 seconds

export async function GET() {
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
    const cachedData = await redis?.get('etherscan:gas');
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    const url = `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${process.env.ETHERSCAN_API_KEY}`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Etherscan API error: ${res.status}`);
    }

    const data = await res.json();

    if (data.status !== '1' || !data.result) {
      throw new Error(data.message || 'Failed to fetch gas prices');
    }

    // Add timestamp to the response
    const response = {
      ...data,
      timestamp: new Date().toISOString()
    };

    // Cache the data
    await redis?.set('etherscan:gas', response, { ex: CACHE_TTL });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching gas prices:', error);
    return NextResponse.json(
      { 
        status: '0',
        message: error instanceof Error ? error.message : 'Failed to fetch gas prices',
        result: null
      },
      { status: 500 }
    );
  }
} 