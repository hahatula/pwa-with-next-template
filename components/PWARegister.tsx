'use client';
import { useEffect } from 'react';

export default function PWARegister() {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            const register = async () => {
                try {
                    await navigator.serviceWorker.register('/sw.js');
                } catch (e) {
                    console.error('SW registration failed', e);
                }
            };
            register();
        }
    }, []);
    return null;
}