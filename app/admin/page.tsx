'use client';
import RequireAdmin from '@/components/guards/RequireAdmin';
import Header from '@/components/Header';
import AppButton from '@/components/AppButton';
import { useI18n } from "@/lib/i18n";

export default function AdminPage() {
    return (
        <RequireAdmin>
            <div className='pageLayout'>
                <Header />
                <AdminInner />
            </div>
        </RequireAdmin>
    );
}

function AdminInner() {
    const { t } = useI18n('classes');
    return (
        <main className='innerPageMain'>
            <h1>Admin workspace</h1>
            <AppButton href='/admin/classes'>{t('manageClasses')}</AppButton>
        </main>
    );
}