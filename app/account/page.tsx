'use client';
import { useAuth } from '@/components/AuthProvider';
import RequireAuth from '@/components/RequireAuth';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import EnablePush from '@/components/EnablePush';

export default function AccountPage() {
    return (
        <RequireAuth>
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
            <button onClick={() => signOut(auth)}>Sign out</button>
            <EnablePush />
        </main>
    );
}