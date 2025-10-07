'use client';
import { useAuth } from '@/contexts/AuthProvider';
import RequireAuth from '@/components/guards/RequireAuth';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import EnablePush from '@/components/EnablePush';
import AppButton from '@/components/AppButton';
import Header from '@/components/Header';

export default function AccountPage() {
    return (
        <RequireAuth>
            <Header />
            <AccountInner />
        </RequireAuth>
    );
}

function AccountInner() {
    const { user } = useAuth();
    return (
        <main>
            <h1>Account</h1>
            <p>Email: {user?.email}</p>
            <AppButton onClick={() => signOut(auth)}>Sign out</AppButton>
            <EnablePush />
        </main>
    );
}