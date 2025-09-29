import { NextResponse } from 'next/server';

// 静态导出环境下，不提供运行时 IP 查询，直接返回 404，避免 SSG 采集时报错。
export const dynamic = 'force-static';

export async function GET() {
  return NextResponse.json({ ip: null }, { status: 404 });
}


