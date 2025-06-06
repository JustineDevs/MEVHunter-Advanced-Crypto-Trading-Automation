import { NextResponse } from 'next/server';
import { getBotAnalytics } from '@/utils/automation';

export async function GET() {
  try {
    const analytics = await getBotAnalytics();
    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error in analytics API:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 