import { NextResponse } from 'next/server';
import { startAllBots } from '@/utils/automation';

export async function POST() {
  try {
    const result = await startAllBots();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in start-bots API:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 