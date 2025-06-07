import { NextResponse } from 'next/server';
import { BotConfig } from '../../../utils/automation';

export async function POST(request: Request) {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL || "";
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || "";
  const isValidRedis = redisUrl.startsWith("https://") && !!redisToken;
  let redis = null;
  if (isValidRedis) {
    const { Redis } = await import("@upstash/redis");
    redis = new Redis({ url: redisUrl, token: redisToken });
  }

  try {
    const { type, settings } = await request.json();
    
    // Get current configs
    const configs = await redis.get<Record<string, BotConfig>>('bots:config') || {};
    
    // Update the specific bot's settings
    configs[type] = {
      ...configs[type],
      settings,
      lastUpdated: new Date().toISOString(),
    };
    
    // Save back to Redis
    await redis.set('bots:config', configs);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in configure API:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 