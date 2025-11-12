export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { computeMonthlyReport, writeMonthlyReport } from '@/lib/reports';

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

  const url = new URL(req.url);
  let month = url.searchParams.get('month');
  if (!month) {
    const now = new Date();
    const y = now.getFullYear();
    const m = `${now.getMonth() + 1}`.padStart(2, '0');
    month = `${y}-${m}`;
  }
  const report = await computeMonthlyReport(month);
  await writeMonthlyReport(report);
  return NextResponse.json({ ok: true, ran: 'monthly', month, at: new Date().toISOString() });
}