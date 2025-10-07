'use client';
import RequireAdmin from '@/components/guards/RequireAdmin';
import Header from '@/components/Header';

export default function AdminPage() {
    return (
        <RequireAdmin>
            <Header />
            <AdminInner />
        </RequireAdmin>
    );
}

function AdminInner() {
    return (
        <main>
            <h1>Admin </h1>
            <p> Only admins can view this page.</p>
        </main>
    );
}