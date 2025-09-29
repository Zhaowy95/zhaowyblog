import { NextResponse } from 'next/server';

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

// 注意：项目使用静态导出（output: export），API 路由在构建期会被访问收集数据。
// 由于静态导出不支持在构建时对动态 API 进行采集，这里直接返回 404，避免构建失败。
export const dynamic = 'force-static';

export async function GET() {
  try {
    return NextResponse.json({ ip: null }, { status: 404 });
  }
}


