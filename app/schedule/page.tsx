'use client';
import RequireAuth from '@/components/guards/RequireAuth';
import Header from '@/components/Header';

export default function SchedulePage() {
    return (
        <RequireAuth>
            <Header />
            <ScheduleInner />
        </RequireAuth>
    );
}

function ScheduleInner() {
    return (
        <main>
            <h1>Schedule</h1>
            <p>Here is the schedule. Choose your class and sign up.</p>
        </main>
    );
}