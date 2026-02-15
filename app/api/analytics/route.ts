import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  console.info('[analytics-api]', body);
  return NextResponse.json({ ok: true });
}
