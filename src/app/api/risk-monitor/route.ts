import { NextResponse } from 'next/server';
import { getRiskMetrics } from '@/utils/automation';

export async function GET() {
  try {
    const metrics = await getRiskMetrics();
    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error in risk-monitor API:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 