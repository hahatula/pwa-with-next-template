export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const isVercelCron = req.headers.get('x-vercel-cron') === '1';
  const key = req.headers.get('x-cron-key') || new URL(req.url).searchParams.get('key');

  if (process.env.CRON_SECRET) {
    if (!(isVercelCron || key === process.env.CRON_SECRET)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  } else if (!isVercelCron) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ ok: true, ran: 'daily', at: new Date().toISOString() });
}