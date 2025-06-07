import { NextResponse } from "next/server";
import { Redis } from '@upstash/redis';

const redisUrl = process.env.UPSTASH_REDIS_REST_URL || "";
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || "";
const isValidRedis = redisUrl.startsWith("https://") && !!redisToken;
const redis = isValidRedis ? new Redis({ url: redisUrl, token: redisToken }) : null;

export async function POST(
  request: Request,
  { params }: { params: { type: string } }
) {
  try {
    const { status } = await request.json();
    const botType = params.type;

    // Validate bot type
    const validTypes = ['arbitrage', 'liquidation', 'nft', 'gas'];
    if (!validTypes.includes(botType)) {
      return NextResponse.json(
        { error: 'Invalid bot type' },
        { status: 400 }
      );
    }

    // Update bot status in Redis if available
    if (redis) {
      await redis.set(`bot:${botType}:status`, status);
      await redis.set(`bot:${botType}:lastUpdate`, new Date().toISOString());
      return NextResponse.json({ success: true });
    }

    // If Redis is not available, return a mock response
    return NextResponse.json({
      success: true,
      message: 'Demo mode: bot status updated (no Redis)',
      botType,
      status,
      lastUpdate: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error toggling bot:', error);
    return NextResponse.json(
      { error: 'Failed to toggle bot' },
      { status: 500 }
    );
  }
} 