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
            <div className='pageLayout'>
                <Header />
                <AccountInner />
            </div>
        </RequireAuth>
    );
}

function AccountInner() {
    const { user } = useAuth();
    const photoURL = user?.photoURL || user?.providerData?.find((p) => p.photoURL)?.photoURL;
    return (
        <main className='innerPageMain'>
            <h1>My account</h1>
            {photoURL && <img src={photoURL} alt="User photo" referrerPolicy="no-referrer" />}
            <p>Email: {user?.email}</p>
            <p>Name: {user?.displayName}</p>
            <AppButton href="/account/my-upcoming-classes">My upcoming classes</AppButton>
            <AppButton onClick={() => signOut(auth)}>Sign out</AppButton>
            <EnablePush />
        </main>
    );
}