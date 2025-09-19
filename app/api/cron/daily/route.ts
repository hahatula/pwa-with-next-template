// app/api/cron/daily/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const key = req.headers.get('x-cron-key');
  if (process.env.CRON_SECRET && key !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // TODO: run daily job (e.g., aggregate reports)
  return NextResponse.json({ ok: true, ran: 'daily', at: new Date().toISOString() });
}

export const runtime = 'nodejs';