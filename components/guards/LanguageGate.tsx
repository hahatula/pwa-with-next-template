'use client';
import { useLanguage } from '@/contexts/LanguageProvider';
import Loader from '@/components/Loader';

export default function LanguageGate({ children }: { children: React.ReactNode }) {
    const { ready } = useLanguage();
    if (!ready) return <Loader center="screen" />;
    return <>{children}</>;
}