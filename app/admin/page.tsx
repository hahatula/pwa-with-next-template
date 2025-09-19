'use client';
import RequireAdmin from '@/components/RequireAdmin';

export default function AdminPage() {
    return (
        <RequireAdmin>
        <main>
        <h1>Admin </h1>
        <p> Only admins can view this page.</p>
            </main>
            </RequireAdmin>
    );
}