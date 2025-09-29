import { NextResponse } from 'next/server';

export const runtime = 'edge';

function parseClientIp(headers: Headers): string | null {
  const xff = headers.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0].trim();
    if (first) return first;
  }
  const realIp = headers.get('x-real-ip');
  if (realIp) return realIp;
  const cfConnectingIp = headers.get('cf-connecting-ip');
  if (cfConnectingIp) return cfConnectingIp;
  const flyClientIp = headers.get('fly-client-ip');
  if (flyClientIp) return flyClientIp;
  return null;
}

export async function GET(request: Request) {
  try {
    const ip = parseClientIp(new Headers(request.headers)) || null;
    return NextResponse.json({ ip }, { status: 200, headers: { 'cache-control': 'no-store' } });
  } catch {
    return NextResponse.json({ ip: null }, { status: 200 });
  }
}


