export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { computeDailyReport, writeDailyReport } from '@/lib/reports';

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

  const date = new URL(req.url).searchParams.get('date') || new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const report = await computeDailyReport(date);
  await writeDailyReport(report);
  return NextResponse.json({ ok: true, ran: 'daily', date, at: new Date().toISOString() });
}