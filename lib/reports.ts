import { adminDb } from '@/lib/firebase/admin';

type ClassSnapshot = {
    title: { en: string; he: string };
    coach: { en: string; he: string };
    startTime: string;
    endTime: string;
    level?: string;
    type?: string;
};

type RegistrationDoc = {
    classId: string;
    date: string;
    uid: string;
    name?: string;
    confirmedAttendance?: boolean;
    classSnapshot?: ClassSnapshot;
};

export async function computeDailyReport(date: string) {
    // 1) Find all classes that occur on this date (to include zero-registration classes)
    const ymd = date;
    const weekday = new Date(date).getDay();
    const uniqueSnap = await adminDb.collection('classes').where('repeated', '==', false).where('date', '==', ymd).get();
    const repeatedSnap = await adminDb.collection('classes').where('repeated', '==', true).where('weekday', '==', weekday).get();
    const occurringClassIds = new Set<string>();
    uniqueSnap.docs.forEach((d) => occurringClassIds.add(d.id));
    repeatedSnap.docs.forEach((d) => {
        const data = d.data() as any;
        if (!data.startDate || data.startDate <= ymd) occurringClassIds.add(d.id);
    });

    // 1.5) Load existing daily report to reuse snapshots on recompute
    const existingDailySnap = await adminDb.collection('reportsDaily').doc(date).get();
    const existingItems: Array<{ classId: string; classSnapshot: ClassSnapshot }> = existingDailySnap.exists
        ? (((existingDailySnap.data() as any)?.items as Array<any>) || []).map((it) => ({ classId: it.classId, classSnapshot: it.classSnapshot }))
        : [];
    const existingSnapshotsByClassId: Record<string, ClassSnapshot> = {};
    existingItems.forEach((it) => { existingSnapshotsByClassId[it.classId] = it.classSnapshot; });

    // 2) Read registrations for the date
    const regsSnap = await adminDb
        .collection('classRegistrations')
        .where('date', '==', date)
        .get();

    const byClass: Record<string, RegistrationDoc[]> = {};
    regsSnap.docs.forEach((d) => {
        const r = d.data() as RegistrationDoc;
        if (!byClass[r.classId]) byClass[r.classId] = [];
        byClass[r.classId].push(r);
        occurringClassIds.add(r.classId);
    });

    const classIds = Array.from(occurringClassIds);
    const classDocs = await Promise.all(
        classIds.map(async (id) => {
            const snap = await adminDb.collection('classes').doc(id).get();
            return { id, data: snap.exists ? (snap.data() as any) : null };
        })
    );

    const items = classIds.map((id) => {
        const regs = byClass[id] || [];
        // Prefer snapshot stored on any registration for immutability
        const snapshotFromReg = (regs.find((r: any) => r.classSnapshot)?.classSnapshot as ClassSnapshot | undefined);
        const cls = classDocs.find((c) => c.id === id)?.data || {};
        const fallbackSnapshot: ClassSnapshot = {
            title: cls.title || { en: '', he: '' },
            coach: cls.coach || { en: '', he: '' },
            startTime: cls.startTime || '',
            endTime: cls.endTime || '',
            level: cls.level,
            type: cls.type,
        };
        const snapshot = snapshotFromReg || existingSnapshotsByClassId[id] || fallbackSnapshot;
        const count = regs.length;
        const registrations = regs.map((r) => ({ uid: r.uid, name: r.name, confirmedAttendance: !!r.confirmedAttendance }));
        return { classId: id, classSnapshot: snapshot, count, registrations };
    });

    const totalCount = items.reduce((acc, it) => acc + it.count, 0);
    return { date, items, generatedAt: new Date(), totalCount };
}

export async function writeDailyReport(report: Awaited<ReturnType<typeof computeDailyReport>>) {
    const ref = adminDb.collection('reportsDaily').doc(report.date);
    await ref.set(report);
}

function monthFromDate(date: string): string {
    // YYYY-MM-DD -> YYYY-MM
    return date.slice(0, 7);
}

export async function computeMonthlyReport(month: string) {
    // Aggregate from daily reports to preserve snapshots
    const start = `${month}-01`;
    const end = `${month}-99`;
    const dailySnap = await adminDb.collection('reportsDaily').where('date', '>=', start).where('date', '<=', end).get();

    let totalClasses = 0;
    let totalRegistrations = 0;
    let totalConfirmedAttendance = 0;
    const days: Array<{ date: string; classes: Array<{ classId: string; classSnapshot: ClassSnapshot; registrationsCount: number; confirmedAttendanceCount: number }> }> = [];

    dailySnap.docs
        .map((d) => d.data() as any)
        .sort((a, b) => String(a.date).localeCompare(String(b.date)))
        .forEach((day) => {
            const classes = (day.items || []) as Array<{ classId: string; classSnapshot: ClassSnapshot; count: number; registrations: Array<{ confirmedAttendance?: boolean }> }>;
            const classItems = classes.map((c) => {
                const registrationsCount = c.count || (c.registrations?.length ?? 0);
                const confirmedAttendanceCount = (c.registrations || []).filter((r) => !!r.confirmedAttendance).length;
                totalRegistrations += registrationsCount;
                totalConfirmedAttendance += confirmedAttendanceCount;
                return { classId: c.classId, classSnapshot: c.classSnapshot, registrationsCount, confirmedAttendanceCount };
            });
            totalClasses += classItems.length;
            days.push({ date: day.date, classes: classItems });
        });

    return { monthYear: month, totalClasses, totalRegistrations, totalConfirmedAttendance, days, generatedAt: new Date() };
}

export async function writeMonthlyReport(report: Awaited<ReturnType<typeof computeMonthlyReport>>) {
    const ref = adminDb.collection('reportsMonthly').doc(report.monthYear);
    await ref.set(report);
}


