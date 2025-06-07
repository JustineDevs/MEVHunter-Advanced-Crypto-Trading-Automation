import { NextResponse } from "next/server";
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

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

    // Update bot status in Redis
    await redis.set(`bot:${botType}:status`, status);
    await redis.set(`bot:${botType}:lastUpdate`, new Date().toISOString());

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error toggling bot:', error);
    return NextResponse.json(
      { error: 'Failed to toggle bot' },
      { status: 500 }
    );
  }
} 