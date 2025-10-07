import { useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageProvider';
import type { Namespace } from './config';
import header from './header';
import home from './home';
import common from './common';
import auth from './auth';

type SideBySide = Record<string, { en: string; he?: string }>;

const MODULES: Record<Namespace, SideBySide> = {
    common,
    header,
    home,
    auth,
    schedule: {},
    notifications: {},
};

export function useI18n(namespace: Namespace = 'common') {
    const { lang } = useLanguage();
    const activeLang = lang === 'he' ? 'he' : 'en';
    const dict: SideBySide | undefined = MODULES[namespace];
    const t = useMemo(() => {
        return (key: string): string => {
            const entry = dict?.[key] as { en: string; he?: string } | undefined;
            return entry ? entry[activeLang] ?? entry.en ?? '' : key;
        };
    }, [dict, activeLang]);
    return { t, lang };
}


